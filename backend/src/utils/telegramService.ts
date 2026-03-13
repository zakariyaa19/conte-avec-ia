import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { formatSecondaryCharacters, parseSecondaryCharacters } from './formatters';

/**
 * Echappe les caracteres speciaux HTML pour Telegram
 * Telegram HTML parse_mode n'accepte que: <b>, <i>, <a>, <code>, <pre>
 * Tous les &, < et > dans les donnees utilisateur doivent etre echappes
 */
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export class TelegramService {
  private static get BOT_TOKEN() { return process.env.TELEGRAM_BOT_TOKEN; }
  private static get CHAT_ID() { return process.env.TELEGRAM_CHAT_ID; }
  private static get API_URL() { return `https://api.telegram.org/bot${this.BOT_TOKEN}`; }

  /**
   * Envoyer un message de notification de commande via Telegram avec photo
   * Ne lance JAMAIS d'exception — les erreurs sont loguees mais n'affectent pas le webhook
   */
  static async sendOrderNotification(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    amount: number;
    orderDate: Date;
    productType: string;
    purchaseType?: string;
    orderDetails?: any;
  }): Promise<void> {
    console.log('[TELEGRAM] === Debut envoi notification ===');
    console.log('[TELEGRAM] Commande:', orderData.orderNumber, '| Client:', orderData.customerEmail);

    try {
      // Verification des variables d'environnement
      if (!this.BOT_TOKEN || !this.CHAT_ID) {
        console.error('[TELEGRAM] ERREUR: Variables d\'environnement manquantes');
        console.error('[TELEGRAM] BOT_TOKEN present:', !!this.BOT_TOKEN, '| CHAT_ID present:', !!this.CHAT_ID);
        return; // Ne pas throw — on log et on sort
      }
      console.log('[TELEGRAM] Env OK (BOT_TOKEN:', this.BOT_TOKEN.length, 'chars, CHAT_ID:', this.CHAT_ID, ')');

      // 1. Envoyer la photo si elle existe
      if (orderData.orderDetails?.photoUrl) {
        await this.sendOrderPhoto({
          customerName: orderData.customerName,
          orderNumber: orderData.orderNumber,
          orderDetails: orderData.orderDetails
        });
      }

      // 1.5 Envoyer la couverture si elle existe
      if (orderData.orderDetails?.coverImageUrl) {
        await this.sendCoverPhoto({
          customerName: orderData.customerName,
          orderNumber: orderData.orderNumber,
          orderDetails: orderData.orderDetails
        });
      }

      // 2. Envoyer le message detaille
      const message = this.formatOrderMessage(orderData);
      console.log('[TELEGRAM] Message formate (' + message.length + ' chars). Envoi en cours...');

      const response = await axios.post(`${this.API_URL}/sendMessage`, {
        chat_id: this.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        console.log('[TELEGRAM] Message envoye avec succes (message_id:', response.data.result?.message_id, ')');
      } else {
        console.error('[TELEGRAM] Reponse API non-ok:', JSON.stringify(response.data));
      }

    } catch (error: any) {
      console.error('[TELEGRAM] ERREUR envoi message:', error.message);

      // Si erreur Telegram API (400 = HTML invalide), tenter en texte brut
      if (error.response?.status === 400) {
        console.log('[TELEGRAM] Erreur 400 (probable HTML invalide). Retry en texte brut...');
        try {
          const plainMessage = this.formatOrderMessage(orderData)
            .replace(/<\/?b>/g, '')
            .replace(/<\/?i>/g, '')
            .replace(/<\/?code>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

          const retryResponse = await axios.post(`${this.API_URL}/sendMessage`, {
            chat_id: this.CHAT_ID,
            text: plainMessage
          });

          if (retryResponse.data.ok) {
            console.log('[TELEGRAM] Retry texte brut: SUCCES');
          } else {
            console.error('[TELEGRAM] Retry texte brut: ECHEC:', JSON.stringify(retryResponse.data));
          }
        } catch (retryError: any) {
          console.error('[TELEGRAM] Retry texte brut: ERREUR:', retryError.message);
          if (retryError.response) {
            console.error('[TELEGRAM] Retry status:', retryError.response.status, 'body:', JSON.stringify(retryError.response.data));
          }
        }
      } else {
        // Log details de l'erreur HTTP
        if (error.response) {
          console.error('[TELEGRAM] Status HTTP:', error.response.status);
          console.error('[TELEGRAM] Response body:', JSON.stringify(error.response.data));
        } else if (error.code) {
          console.error('[TELEGRAM] Code erreur reseau:', error.code);
        }
      }
      // PAS de throw — on ne casse jamais le webhook Stripe
    }
  }

  /**
   * Envoyer la photo de l'utilisateur via Telegram
   */
  private static async sendOrderPhoto(orderData: {
    customerName: string;
    orderNumber: string;
    orderDetails: any;
  }): Promise<void> {
    try {
      const photoUrl = orderData.orderDetails.photoUrl;
      if (!photoUrl) return;

      console.log('[TELEGRAM] Envoi photo:', photoUrl);

      // Construire le chemin du fichier
      let photoPath = '';
      if (photoUrl.startsWith('/uploads/')) {
        photoPath = path.join(__dirname, '../../uploads', photoUrl.replace('/uploads/', ''));
      } else if (photoUrl.startsWith('uploads/')) {
        photoPath = path.join(__dirname, '../../uploads', photoUrl.replace('uploads/', ''));
      } else {
        photoPath = path.join(__dirname, '../../uploads', photoUrl);
      }

      // Verifier si le fichier existe
      if (!fs.existsSync(photoPath)) {
        console.log('[TELEGRAM] Photo non trouvee sur le serveur, skip');
        return;
      }

      const caption = `📸 Photo du protagoniste\n🛍️ Commande #${escapeHtml(orderData.orderNumber)}\n👤 Client: ${escapeHtml(orderData.customerName)}`;

      const FormData = require('form-data');
      const form = new FormData();

      form.append('chat_id', this.CHAT_ID);
      form.append('photo', fs.createReadStream(photoPath));
      form.append('caption', caption);
      form.append('parse_mode', 'HTML');

      const response = await axios.post(`${this.API_URL}/sendPhoto`, form, {
        headers: { ...form.getHeaders() },
      });

      if (response.data.ok) {
        console.log('[TELEGRAM] Photo envoyee avec succes');
      } else {
        console.error('[TELEGRAM] Erreur envoi photo:', response.data.description);
      }

    } catch (error: any) {
      console.error('[TELEGRAM] Erreur envoi photo (non bloquant):', error.message);
    }
  }

  /**
   * Envoyer la couverture du conte via Telegram
   */
  private static async sendCoverPhoto(orderData: {
    customerName: string;
    orderNumber: string;
    orderDetails: any;
  }): Promise<void> {
    try {
      const coverImageUrl = orderData.orderDetails.coverImageUrl;
      if (!coverImageUrl) return;

      console.log('[TELEGRAM] Envoi couverture:', coverImageUrl);

      // Construire le chemin du fichier
      let coverPath = '';
      if (coverImageUrl.startsWith('/uploads/')) {
        coverPath = path.join(__dirname, '../../uploads', coverImageUrl.replace('/uploads/', ''));
      } else if (coverImageUrl.startsWith('uploads/')) {
        coverPath = path.join(__dirname, '../../uploads', coverImageUrl.replace('uploads/', ''));
      } else {
        coverPath = path.join(__dirname, '../../uploads', coverImageUrl);
      }

      // Verifier si le fichier existe
      if (!fs.existsSync(coverPath)) {
        console.log('[TELEGRAM] Couverture non trouvee sur le serveur, skip');
        return;
      }

      const protagonistName = escapeHtml(orderData.orderDetails.protagonistName) || 'inconnu';
      const caption = `🖼 Couverture du conte de ${protagonistName} — Commande #${escapeHtml(orderData.orderNumber)}`;

      const FormData = require('form-data');
      const form = new FormData();

      form.append('chat_id', this.CHAT_ID);
      form.append('photo', fs.createReadStream(coverPath));
      form.append('caption', caption);
      form.append('parse_mode', 'HTML');

      const response = await axios.post(`${this.API_URL}/sendPhoto`, form, {
        headers: { ...form.getHeaders() },
      });

      if (response.data.ok) {
        console.log('[TELEGRAM] Couverture envoyee avec succes');
      } else {
        console.error('[TELEGRAM] Erreur envoi couverture:', response.data.description);
      }

    } catch (error: any) {
      console.error('[TELEGRAM] Erreur envoi couverture (non bloquant):', error.message);
    }
  }

  /**
   * Formater le message de commande avec emojis et mise en forme HTML
   * Toutes les donnees utilisateur sont echappees pour eviter les erreurs HTML
   */
  private static formatOrderMessage(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    amount: number;
    orderDate: Date;
    productType: string;
    purchaseType?: string;
    orderDetails?: any;
  }): string {
    const formattedDate = orderData.orderDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const productEmoji = '📱';

    const purchaseTypeLabel = orderData.purchaseType === 'CLUB' && orderData.amount === 0
      ? 'Club (gratuit)'
      : orderData.purchaseType === 'CLUB'
        ? 'Club'
        : 'Achat unique';

    // Echapper toutes les donnees utilisateur
    const safeName = escapeHtml(orderData.customerName);
    const safeEmail = escapeHtml(orderData.customerEmail);
    const safeOrderNumber = escapeHtml(orderData.orderNumber);

    let message = `🛍️ <b>Nouvelle commande reçue !</b>

📋 <b>Commande #${safeOrderNumber}</b>
👤 <b>Client:</b> ${safeName}
📧 <b>Email:</b> ${safeEmail}
${productEmoji} <b>Produit:</b> eBook Numérique
🎫 <b>Type:</b> ${purchaseTypeLabel}
💳 <b>Montant:</b> ${orderData.amount}€
📅 <b>Date:</b> ${formattedDate}`;

    // Details du formulaire
    if (orderData.orderDetails) {
      const order = orderData.orderDetails;

      const safeProtagName = escapeHtml(order.protagonistName);
      const safeCustomTheme = escapeHtml(order.customTheme);
      const safeCustomSubject = escapeHtml(order.customSubject);
      const safeCustomMessage = escapeHtml(order.customMessage);
      const safeHobbies = escapeHtml(order.hobbies);
      const safeFavoriteDish = escapeHtml(order.favoriteDish);
      const safeSpecialEvents = escapeHtml(order.specialEvents);
      const safeCustomReligion = escapeHtml(order.customReligion);

      message += `

━━━━━━━━━━━━━━━━━━━━━━
📝 <b>DÉTAILS DE LA COMMANDE</b>

🎯 <b>Conte personnalisé</b>
📚 Tranche d'âge: ${escapeHtml(order.ageRange) || 'Non spécifié'}
🌟 Thème général: ${this.formatTheme(order.generalTheme)}${safeCustomTheme ? ` (${safeCustomTheme})` : ''}
📖 Sujet: ${this.formatSubject(order.specificSubject)}${safeCustomSubject ? ` (${safeCustomSubject})` : ''}
💭 Message central: ${this.formatMessage(order.centralMessage)}${safeCustomMessage ? ` (${safeCustomMessage})` : ''}
🎨 Style: ${this.formatIllustrationStyle(order.illustrationStyle)}
${order.coverTitle ? `📕 Titre couverture: ${escapeHtml(order.coverTitle)}` : ''}
${order.language ? `🌍 Langue: ${escapeHtml(order.language)}` : ''}

👦👧 <b>Protagoniste</b>
🏷️ Nom: ${safeProtagName || 'Non spécifié'}
🎂 Âge: ${escapeHtml(order.protagonistAge) || 'Non spécifié'}
${order.protagonistGender ? `⚧️ Sexe: ${order.protagonistGender === 'boy' ? 'Garçon' : 'Fille'}` : ''}
${order.photoUrl ? `📸 Photo fournie: Oui` : `👁️ Yeux: ${escapeHtml(order.eyeColor) || 'Non spécifié'}
💇 Cheveux: ${escapeHtml(order.hairColor) || 'Non spécifié'}
🎨 Peau: ${escapeHtml(order.skinColor) || 'Non spécifié'}`}
${safeHobbies ? `🎮 Loisirs: ${safeHobbies}` : ''}
${safeFavoriteDish ? `🍽️ Plat préféré: ${safeFavoriteDish}` : ''}
${safeSpecialEvents ? `🎉 Événements: ${safeSpecialEvents}` : ''}
${order.religion ? `🙏 Religion: ${escapeHtml(order.religion)}${safeCustomReligion ? ` (${safeCustomReligion})` : ''}` : ''}`;

      // Personnages secondaires
      const secondaryChars = parseSecondaryCharacters(order.secondaryCharactersJson);
      if (secondaryChars.length > 0) {
        message += `

👥 <b>Personnages secondaires (${secondaryChars.length})</b>
${escapeHtml(formatSecondaryCharacters(secondaryChars))}`;
      } else if (order.secondaryCharacterName) {
        message += `

👥 <b>Personnage secondaire</b>
🏷️ Nom: ${escapeHtml(order.secondaryCharacterName)}
${order.secondaryCharacterAge ? `📝 Type/Âge: ${escapeHtml(order.secondaryCharacterAge)}` : ''}`;
      }

      // Createur
      if (order.creatorName) {
        message += `

✍️ <b>Créateur</b>
👤 Nom: ${escapeHtml(order.creatorName)}`;
      }

    }

    message += `

🎉 <i>Contes d'IA - Nouvelle commande à traiter</i>`;

    return message;
  }

  private static formatTheme(theme: string): string {
    const themes: { [key: string]: string } = {
      'adventure': 'Aventure',
      'friendship': 'Amitié',
      'family': 'Famille',
      'animals': 'Animaux',
      'fantasy': 'Fantastique',
      'science': 'Science',
      'nature': 'Nature',
      'school': 'École',
      'sports': 'Sports',
      'music': 'Musique'
    };
    return themes[theme] || escapeHtml(theme);
  }

  private static formatSubject(subject: string): string {
    const subjects: { [key: string]: string } = {
      'fairy-tales': 'Contes de fées',
      'real-life': 'Vie quotidienne',
      'historical': 'Historique',
      'futuristic': 'Futuriste',
      'educational': 'Éducatif'
    };
    return subjects[subject] || escapeHtml(subject);
  }

  private static formatMessage(message: string): string {
    const messages: { [key: string]: string } = {
      'love': 'Amour',
      'courage': 'Courage',
      'friendship': 'Amitié',
      'perseverance': 'Persévérance',
      'kindness': 'Gentillesse',
      'honesty': 'Honnêteté',
      'respect': 'Respect',
      'responsibility': 'Responsabilité'
    };
    return messages[message] || escapeHtml(message);
  }

  private static formatIllustrationStyle(style: string): string {
    const styles: { [key: string]: string } = {
      'realistic': 'Réaliste',
      'cartoon': 'Cartoon',
      'kawaii': 'Kawaii',
      'watercolor': 'Aquarelle',
      'minimalist': 'Minimaliste'
    };
    return styles[style] || escapeHtml(style);
  }

  /**
   * Envoyer une alerte de generation echouee via Telegram
   * Ne lance JAMAIS d'exception
   */
  static async sendGenerationFailedAlert(data: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    protagonistName: string;
    error: string;
  }): Promise<void> {
    try {
      if (!this.BOT_TOKEN || !this.CHAT_ID) {
        console.error('[TELEGRAM] ERREUR: Variables manquantes pour alerte generation');
        return;
      }

      const message = `🚨 <b>ECHEC GENERATION AUTOMATIQUE</b>

📋 <b>Commande #${escapeHtml(data.orderNumber)}</b>
🆔 ID: <code>${escapeHtml(data.orderId)}</code>
👤 <b>Client:</b> ${escapeHtml(data.customerName)}
📧 <b>Email:</b> ${escapeHtml(data.customerEmail)}
👦 <b>Protagoniste:</b> ${escapeHtml(data.protagonistName)}

❌ <b>Erreur:</b>
<code>${escapeHtml(data.error.slice(0, 500))}</code>

⚠️ <b>Action requise:</b> Relancer manuellement depuis le panel admin ou investiguer l'erreur.`;

      const response = await axios.post(`${this.API_URL}/sendMessage`, {
        chat_id: this.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        console.log('[TELEGRAM] Alerte generation echouee envoyee');
      } else {
        console.error('[TELEGRAM] Erreur envoi alerte:', JSON.stringify(response.data));
      }
    } catch (error: any) {
      console.error('[TELEGRAM] Erreur envoi alerte generation (non bloquant):', error.message);
    }
  }

  /**
   * Envoyer un message de test
   */
  static async sendTestMessage(): Promise<void> {
    console.log('[TELEGRAM] === Test de connexion ===');
    try {
      if (!this.BOT_TOKEN || !this.CHAT_ID) {
        console.error('[TELEGRAM] TEST ECHEC: BOT_TOKEN present:', !!this.BOT_TOKEN, '| CHAT_ID present:', !!this.CHAT_ID);
        throw new Error('Configuration Telegram manquante (BOT_TOKEN ou CHAT_ID)');
      }

      console.log('[TELEGRAM] BOT_TOKEN:', this.BOT_TOKEN.length, 'chars | CHAT_ID:', this.CHAT_ID);

      const testMessage = `🤖 <b>Test de connexion Telegram Bot</b>

✅ Configuration OK
📱 Bot Token: Configuré (${this.BOT_TOKEN.length} chars)
💬 Chat ID: ${this.CHAT_ID}
⏰ Date: ${new Date().toLocaleString('fr-FR')}

<i>Contes d'IA - Système de notification</i>`;

      const response = await axios.post(`${this.API_URL}/sendMessage`, {
        chat_id: this.CHAT_ID,
        text: testMessage,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        console.log('[TELEGRAM] Test SUCCES (message_id:', response.data.result?.message_id, ')');
      } else {
        console.error('[TELEGRAM] Test ECHEC:', JSON.stringify(response.data));
        throw new Error(`Erreur API Telegram: ${response.data.description}`);
      }

    } catch (error: any) {
      console.error('[TELEGRAM] Test ERREUR:', error.message);
      if (error.response) {
        console.error('[TELEGRAM] Status:', error.response.status, 'Body:', JSON.stringify(error.response.data));
      }
      throw error;
    }
  }
}
