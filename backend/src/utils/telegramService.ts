import axios from 'axios';

export class TelegramService {
  private static readonly BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  private static readonly CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  private static readonly API_URL = `https://api.telegram.org/bot${TelegramService.BOT_TOKEN}`;

  /**
   * Envoyer un message de notification de commande via Telegram
   */
  static async sendOrderNotification(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    amount: number;
    orderDate: Date;
    productType: string;
    orderDetails?: any; // Toutes les données de la commande
  }): Promise<void> {
    try {
      if (!this.BOT_TOKEN || !this.CHAT_ID) {
        throw new Error('Configuration Telegram manquante (BOT_TOKEN ou CHAT_ID)');
      }

      const message = this.formatOrderMessage(orderData);

      const response = await axios.post(`${this.API_URL}/sendMessage`, {
        chat_id: this.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        console.log('✅ Message Telegram envoyé avec succès');
      } else {
        throw new Error(`Erreur API Telegram: ${response.data.description}`);
      }

    } catch (error) {
      console.error('❌ Erreur envoi message Telegram:', error);
      throw new Error('Échec de l\'envoi du message Telegram');
    }
  }

  /**
   * Formater le message de commande avec emojis et mise en forme
   */
  private static formatOrderMessage(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    amount: number;
    orderDate: Date;
    productType: string;
    orderDetails?: any;
  }): string {
    const formattedDate = orderData.orderDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const productEmoji = orderData.productType === 'EBOOK' ? '📱' : '📚';

    // Première partie : Informations essentielles
    let message = `🛍️ <b>Nouvelle commande reçue !</b>

📋 <b>Commande #${orderData.orderNumber}</b>
👤 <b>Client:</b> ${orderData.customerName}
📧 <b>Email:</b> ${orderData.customerEmail}
${productEmoji} <b>Produit:</b> ${orderData.productType === 'EBOOK' ? 'eBook' : 'Livre relié'}
💳 <b>Montant:</b> ${orderData.amount}€
📅 <b>Date:</b> ${formattedDate}`;

    // Deuxième partie : Détails du formulaire
    if (orderData.orderDetails) {
      const order = orderData.orderDetails;
      
      message += `

━━━━━━━━━━━━━━━━━━━━━━
📝 <b>DÉTAILS DE LA COMMANDE</b>

🎯 <b>Conte personnalisé</b>
📚 Tranche d'âge: ${order.ageRange || 'Non spécifié'}
🌟 Thème général: ${this.formatTheme(order.generalTheme)}${order.customTheme ? ` (${order.customTheme})` : ''}
📖 Sujet: ${this.formatSubject(order.specificSubject)}${order.customSubject ? ` (${order.customSubject})` : ''}
💭 Message central: ${this.formatMessage(order.centralMessage)}${order.customMessage ? ` (${order.customMessage})` : ''}
🎨 Style: ${this.formatIllustrationStyle(order.illustrationStyle)}
${order.language ? `🌍 Langue: ${order.language}` : ''}

👦👧 <b>Protagoniste</b>
🏷️ Nom: ${order.protagonistName || 'Non spécifié'}
🎂 Âge: ${order.protagonistAge || 'Non spécifié'}
${order.protagonistGender ? `⚧️ Sexe: ${order.protagonistGender === 'boy' ? 'Garçon' : 'Fille'}` : ''}
👁️ Yeux: ${order.eyeColor || 'Non spécifié'}
💇 Cheveux: ${order.hairColor || 'Non spécifié'}
${order.hobbies ? `🎮 Loisirs: ${order.hobbies}` : ''}
${order.favoriteDish ? `🍽️ Plat préféré: ${order.favoriteDish}` : ''}
${order.specialEvents ? `🎉 Événements: ${order.specialEvents}` : ''}
${order.religion ? `🙏 Religion: ${order.religion}${order.customReligion ? ` (${order.customReligion})` : ''}` : ''}`;

      // Personnage secondaire
      if (order.secondaryCharacterName) {
        message += `

👥 <b>Personnage secondaire</b>
🏷️ Nom: ${order.secondaryCharacterName}
${order.secondaryCharacterAge ? `📝 Type/Âge: ${order.secondaryCharacterAge}` : ''}`;
      }

      // Informations personnelles
      if (order.creatorName) {
        message += `

✍️ <b>Créateur</b>
👤 Nom: ${order.creatorName}`;
      }

      // Adresse de livraison pour les livres reliés
      if (order.productType === 'PRINTED' && order.shippingAddress) {
        message += `

📦 <b>Livraison</b>
📍 ${order.shippingFirstName} ${order.shippingLastName}
🏠 ${order.shippingAddress}
📮 ${order.shippingPostalCode} ${order.shippingCity}`;
      }
    }

    message += `

🎉 <i>Contes d'IA - Nouvelle commande à traiter</i>`;

    return message;
  }

  /**
   * Formater les thèmes pour l'affichage
   */
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
    return themes[theme] || theme;
  }

  /**
   * Formater les sujets pour l'affichage
   */
  private static formatSubject(subject: string): string {
    const subjects: { [key: string]: string } = {
      'fairy-tales': 'Contes de fées',
      'real-life': 'Vie quotidienne',
      'historical': 'Historique',
      'futuristic': 'Futuriste',
      'educational': 'Éducatif'
    };
    return subjects[subject] || subject;
  }

  /**
   * Formater les messages centraux pour l'affichage
   */
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
    return messages[message] || message;
  }

  /**
   * Formater les styles d'illustration pour l'affichage
   */
  private static formatIllustrationStyle(style: string): string {
    const styles: { [key: string]: string } = {
      'realistic': 'Réaliste',
      'cartoon': 'Cartoon',
      'kawaii': 'Kawaii',
      'watercolor': 'Aquarelle',
      'minimalist': 'Minimaliste'
    };
    return styles[style] || style;
  }

  /**
   * Envoyer un message de test
   */
  static async sendTestMessage(): Promise<void> {
    try {
      if (!this.BOT_TOKEN || !this.CHAT_ID) {
        throw new Error('Configuration Telegram manquante (BOT_TOKEN ou CHAT_ID)');
      }

      const testMessage = `🤖 <b>Test de connexion Telegram Bot</b>

✅ Configuration OK
📱 Bot Token: Configuré
💬 Chat ID: ${this.CHAT_ID}
⏰ Date: ${new Date().toLocaleString('fr-FR')}

<i>Contes d'IA - Système de notification</i>`;

      const response = await axios.post(`${this.API_URL}/sendMessage`, {
        chat_id: this.CHAT_ID,
        text: testMessage,
        parse_mode: 'HTML'
      });

      if (response.data.ok) {
        console.log('✅ Message de test Telegram envoyé avec succès');
      } else {
        throw new Error(`Erreur API Telegram: ${response.data.description}`);
      }

    } catch (error) {
      console.error('❌ Erreur test Telegram:', error);
      throw new Error('Échec du test Telegram');
    }
  }
}
