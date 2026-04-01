import Mailjet from 'node-mailjet';

// Configuration Mailjet — initialisation lazy pour attendre le chargement de dotenv
let _mailjet: ReturnType<typeof Mailjet.apiConnect> | null = null;

function getMailjet() {
  if (!_mailjet) {
    const apiKey = process.env.MAILJET_API_KEY || '';
    const secretKey = process.env.MAILJET_SECRET_KEY || '';
    if (!apiKey || !secretKey) {
      throw new Error('Configuration Mailjet manquante (MAILJET_API_KEY ou MAILJET_SECRET_KEY)');
    }
    _mailjet = Mailjet.apiConnect(apiKey, secretKey);
  }
  return _mailjet;
}

export class MailjetService {
  // Envoyer un email de confirmation de commande au client
  static async sendOrderConfirmation(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDetails: string;
  }): Promise<void> {
    try {
      const request = getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
                Name: 'Contedia'
              },
              To: [
                {
                  Email: orderData.customerEmail,
                  Name: orderData.customerName
                }
              ],
              Subject: `Confirmation de commande #${orderData.orderNumber}`,
              HTMLPart: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 20px; overflow: hidden;">
                  
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #FF9999, #87CEEB); padding: 40px 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">✨ Votre Commande est Confirmée !</h1>
                    <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Commande #${orderData.orderNumber}</p>
                  </div>
                  
                  <!-- Content -->
                  <div style="padding: 40px 30px;">
                    <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                      <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; border-bottom: 3px solid #FF9999; padding-bottom: 10px; display: inline-block;">🎉 Merci ${orderData.customerName} !</h2>
                      <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                        Nous avons bien reçu votre commande et celle-ci est maintenant <strong style="color: #FF9999;">en préparation</strong>. 
                        Notre équipe créative travaille déjà sur votre conte personnalisé !
                      </p>
                    </div>
                  
                    <!-- Détails de la commande -->
                    <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                      <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #87CEEB; padding-bottom: 8px; display: inline-block;">📋 Détails de votre commande</h3>
                      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; color: #555; line-height: 1.8;">
                        <strong>Numéro de commande :</strong> #${orderData.orderNumber}<br>
                        <strong>Détails :</strong><br>
                        ${orderData.orderDetails.replace(/\n/g, '<br>')}
                      </div>
                    </div>
                  
                    <!-- Prochaines étapes -->
                    <div style="background: linear-gradient(135deg, #e3f2fd, #f3e5f5); padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #FF9999;">
                      <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">⏰ Prochaines étapes</h3>
                      <div style="background: white; padding: 20px; border-radius: 10px; color: #555; line-height: 1.6;">
                        <p style="margin: 0;"><strong style="color: #FF9999;">📚 Votre commande est en préparation :</strong><br>
                        Notre équipe va traiter votre demande dans les plus brefs délais. Vous recevrez un email de suivi avec les détails de livraison.</p>
                      </div>
                    </div>
                  
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #FF9999, #87CEEB); border-radius: 15px; color: white;">
                      <h3 style="margin: 0 0 15px 0; font-size: 24px;">🙏 Merci de votre confiance !</h3>
                      <p style="margin: 0 0 15px 0; font-size: 16px; opacity: 0.95;">L'equipe Contedia met tout son cœur dans la création de votre histoire personnalisée</p>
                      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-top: 20px;">
                        <p style="margin: 0; font-size: 14px;">💬 <strong>Une question ?</strong> Répondez simplement à cet email<br>
                        📧 Ou contactez-nous à : <strong>${process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr'}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              `
            }
          ]
        });

      const result = await request;
      console.log('✅ Email de confirmation envoyé via Mailjet:', result.body);
      
    } catch (error) {
      console.error('❌ Erreur envoi email Mailjet:', error);
      throw new Error('Échec de l\'envoi de l\'email de confirmation');
    }
  }

  // Envoyer un email de magic link pour connexion
  static async sendMagicLinkEmail(data: {
    email: string;
    firstName: string;
    magicUrl: string;
  }): Promise<void> {
    try {
      await getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [{
            From: {
              Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
              Name: 'Contedia'
            },
            To: [{ Email: data.email, Name: data.firstName }],
            Subject: 'Votre lien de connexion — Contedia',
            HTMLPart: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #2D3748; font-size: 24px; text-align: center;">Connexion a votre compte</h1>
                <p style="color: #4A5568; font-size: 16px; text-align: center; line-height: 1.6;">
                  Cliquez sur le bouton ci-dessous pour acceder a votre bibliotheque de contes.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${data.magicUrl}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 14px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
                    Acceder a ma bibliotheque
                  </a>
                </div>
                <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
                  Ce lien expire dans 30 minutes. Si vous n'avez pas demande ce lien, ignorez cet email.
                </p>
              </div>
            `
          }]
        });
      console.log('Email magic link envoye a:', data.email);
    } catch (error) {
      console.error('Erreur envoi magic link email:', error);
      throw new Error('Echec envoi email magic link');
    }
  }

  // Générer un magic link pour accéder à la bibliothèque sans mot de passe
  static generateMagicDashboardLink(userId: string, email: string): string {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET;
    const token = jwt.sign(
      { userId, email, type: 'magic_link' },
      secret,
      { expiresIn: '7d' }
    );
    const frontendUrl = process.env.FRONTEND_URL || 'https://contedia.fr';
    return `${frontendUrl}/magic-login?token=${token}`;
  }

  // Envoyer un email de livraison au client
  static async sendStoryDeliveryEmail(data: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    protagonistName: string;
    userId?: string;
  }): Promise<void> {
    try {
      const request = getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
                Name: 'Contedia'
              },
              To: [
                {
                  Email: data.customerEmail,
                  Name: data.customerName
                }
              ],
              Subject: `Votre conte est pret ! #${data.orderNumber}`,
              HTMLPart: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 20px; overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #FF9999, #87CEEB); padding: 40px 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Le conte de ${data.protagonistName} est pret !</h1>
                    <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Commande #${data.orderNumber}</p>
                  </div>
                  <div style="padding: 40px 30px;">
                    <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                      <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Bonjour ${data.customerName} !</h2>
                      <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Votre conte personnalise est maintenant disponible dans votre espace <strong style="color: #FF9999;">Ma Bibliotheque</strong>.
                      </p>
                      <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Cliquez sur le bouton ci-dessous pour le consulter et le telecharger.
                      </p>
                      <div style="text-align: center; margin-top: 25px;">
                        <a href="${data.userId ? this.generateMagicDashboardLink(data.userId, data.customerEmail) : (process.env.FRONTEND_URL + '/dashboard')}" style="background: linear-gradient(135deg, #FF9999, #FF7F7F); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block;">
                          Acceder a ma bibliotheque
                        </a>
                      </div>
                    </div>
                    <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #FF9999, #87CEEB); border-radius: 15px; color: white;">
                      <p style="margin: 0; font-size: 14px;">Une question ? Repondez simplement a cet email<br>
                      ${process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr'}</p>
                    </div>
                  </div>
                </div>
              `
            }
          ]
        });

      const result = await request;
      console.log('Email de livraison envoye via Mailjet:', result.body);
    } catch (error) {
      console.error('Erreur envoi email livraison Mailjet:', error);
      throw new Error('Echec de l\'envoi de l\'email de livraison');
    }
  }

  // Envoyer un email "conte en cours de creation" au client
  static async sendStoryInProgressEmail(data: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    protagonistName: string;
  }): Promise<void> {
    try {
      const request = getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
                Name: 'Contedia'
              },
              To: [
                {
                  Email: data.customerEmail,
                  Name: data.customerName
                }
              ],
              Subject: `Le conte de ${data.protagonistName} est en cours de creation !`,
              HTMLPart: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 20px; overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #FF9999, #87CEEB); padding: 40px 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">La magie est en cours...</h1>
                    <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Commande #${data.orderNumber}</p>
                  </div>
                  <div style="padding: 40px 30px;">
                    <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                      <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Bonjour ${data.customerName} !</h2>
                      <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Notre IA est en train de creer le conte personnalise de <strong style="color: #FF9999;">${data.protagonistName}</strong>.
                      </p>
                      <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        La creation prend generalement entre <strong>5 et 10 minutes</strong>. Vous recevrez un email des que votre conte sera pret a lire !
                      </p>
                    </div>
                    <div style="background: linear-gradient(135deg, #e3f2fd, #f3e5f5); padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #FF9999;">
                      <h3 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Ce qui se passe en ce moment :</h3>
                      <ul style="color: #555; font-size: 15px; line-height: 2; padding-left: 20px;">
                        <li>Redaction de l'histoire personnalisee</li>
                        <li>Creation des illustrations uniques</li>
                        <li>Assemblage de votre livre numerique</li>
                      </ul>
                    </div>
                    <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #FF9999, #87CEEB); border-radius: 15px; color: white;">
                      <p style="margin: 0; font-size: 14px;">Une question ? Repondez simplement a cet email<br>
                      ${process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr'}</p>
                    </div>
                  </div>
                </div>
              `
            }
          ]
        });

      const result = await request;
      console.log('Email "conte en cours" envoye via Mailjet:', result.body);
    } catch (error) {
      console.error('Erreur envoi email "conte en cours" Mailjet:', error);
      // Ne pas throw — on ne veut pas bloquer la generation si l'email echoue
    }
  }

  // Ajouter un contact à la liste Mailjet pour les campagnes marketing
  static async addContactToList(data: {
    email: string;
    name?: string;
    firstName?: string;
    properties?: Record<string, any>;
  }): Promise<void> {
    const MAILJET_LIST_ID = process.env.MAILJET_LIST_ID || '10538315';

    try {
      const mailjet = getMailjet();

      // 1. Créer ou mettre à jour le contact
      try {
        await mailjet
          .post('contact', { version: 'v3' })
          .request({
            IsExcludedFromCampaigns: false,
            Name: data.name || data.firstName || '',
            Email: data.email
          });
      } catch (err: any) {
        // Si le contact existe déjà (code 400 / duplicate), on continue
        if (err?.statusCode !== 400) {
          console.error('Mailjet: erreur création contact:', err?.message);
        }
      }

      // 2. Mettre à jour les propriétés du contact (prénom, type d'achat, etc.)
      if (data.properties) {
        try {
          await mailjet
            .put('contactdata', { version: 'v3' })
            .id(data.email)
            .request({
              Data: Object.entries(data.properties).map(([Name, Value]) => ({ Name, Value }))
            });
        } catch (propErr: any) {
          console.error('Mailjet: erreur mise à jour propriétés:', propErr?.message);
        }
      }

      // 3. Ajouter le contact à la liste
      await mailjet
        .post('listrecipient', { version: 'v3' })
        .request({
          ContactAlt: data.email,
          ListID: Number(MAILJET_LIST_ID),
          IsUnsubscribed: false
        });

      console.log('✅ Contact ajouté à la liste Mailjet:', data.email, '→ liste', MAILJET_LIST_ID);
    } catch (error: any) {
      // Si déjà dans la liste (duplicate), on ignore silencieusement
      if (error?.statusCode === 400) {
        console.log('ℹ️ Contact déjà dans la liste Mailjet:', data.email);
        return;
      }
      console.error('❌ Erreur ajout contact Mailjet:', error?.message || error);
      // Ne pas throw — on ne veut pas bloquer la commande si Mailjet échoue
    }
  }

  // Envoyer un email de relance Club (séquence post-livre gratuit)
  static async sendClubRelanceEmail(data: {
    customerName: string;
    customerEmail: string;
    protagonistName: string;
    step: 'day0' | 'day1' | 'day3' | 'day7';
    userId: string;
  }): Promise<void> {
    const magicLink = this.generateMagicDashboardLink(data.userId, data.customerEmail);
    const frontendUrl = process.env.FRONTEND_URL || 'https://contedia.fr';
    const clubLink = `${frontendUrl}/club/checkout`;

    // Design system commun
    const wrapper = (content: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 550px; margin: 0 auto; background: #ffffff;">
        <!-- Header Contedia -->
        <div style="background: linear-gradient(135deg, #1a1040, #2d1b69); padding: 24px 20px; text-align: center;">
          <img src="${frontendUrl}/logo-conte-ia.png" alt="Contedia" style="height: 32px; margin-bottom: 4px;" />
          <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 0;">Contes personnalises par IA</p>
        </div>
        <!-- Content -->
        <div style="padding: 32px 24px;">
          ${content}
        </div>
        <!-- Footer -->
        <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #f0f0f0;">
          <p style="color: #a0a0a0; font-size: 11px; margin: 0 0 8px;">
            <a href="${magicLink}" style="color: #a78bfa; text-decoration: none;">Ma bibliotheque</a>
            &nbsp;&middot;&nbsp;
            <a href="${frontendUrl}" style="color: #a0a0a0; text-decoration: none;">contedia.fr</a>
          </p>
          <p style="color: #c0c0c0; font-size: 10px; margin: 0;">
            Cet email est envoye par Contedia (PAUSIA). Repondez directement pour nous contacter.
          </p>
        </div>
      </div>
    `;

    // Badge prix commun
    const priceBadge = `
      <div style="background: linear-gradient(145deg, #1a1040, #2d1b69); border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center; border: 1px solid rgba(167,139,250,0.3);">
        <p style="font-size: 11px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Offre de lancement</p>
        <p style="font-size: 14px; color: rgba(255,255,255,0.4); text-decoration: line-through; margin: 0;">9,99&euro;/mois</p>
        <p style="font-size: 32px; font-weight: 800; color: white; margin: 4px 0;">1,99&euro;</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 0 0 16px;">le 1er mois &middot; puis 9,99&euro;/mois &middot; sans engagement</p>
        <a href="${clubLink}" style="background: linear-gradient(135deg, #a78bfa, #f093fb); color: white; padding: 14px 36px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(167,139,250,0.4);">
          Essayer le Club pour 1,99&euro; &rarr;
        </a>
      </div>
    `;

    const templates: Record<string, { subject: string; html: string }> = {
      // ═══════════════════════════════════════════════════
      // J+0 — Email immédiat après livraison du livre gratuit
      // Angle : émotion + découverte du livre + teaser Club
      // ═══════════════════════════════════════════════════
      day0: {
        subject: `Le livre de ${data.protagonistName} est pret ! Decouvrez-le`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 24px; text-align: center; margin: 0 0 8px; font-weight: 800;">
            Le livre de ${data.protagonistName} vous attend
          </h1>
          <p style="color: #888; font-size: 14px; text-align: center; margin: 0 0 28px;">
            ${data.customerName}, votre conte personnalise est pret a etre lu.
          </p>

          <div style="text-align: center; margin: 0 0 28px;">
            <a href="${magicLink}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 16px rgba(255,107,107,0.3);">
              Lire le livre de ${data.protagonistName}
            </a>
          </div>

          <div style="background: #f9f7ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="font-size: 14px; color: #555; margin: 0 0 12px; text-align: center; font-weight: 600;">
              Ce que contient votre livre :
            </p>
            <table style="width: 100%; font-size: 13px; color: #666;">
              <tr><td style="padding: 4px 0;">&#x2728; Histoire unique avec le prenom de ${data.protagonistName}</td></tr>
              <tr><td style="padding: 4px 0;">&#x1F3A8; 7 illustrations generees par IA</td></tr>
              <tr><td style="padding: 4px 0;">&#x1F4D6; 6 pages illustrees</td></tr>
              <tr><td style="padding: 4px 0;">&#x2B07;&#xFE0F; PDF telechargeable</td></tr>
            </table>
          </div>

          <div style="background: #f0f9ff; border-left: 4px solid #a78bfa; padding: 16px; border-radius: 0 12px 12px 0; margin: 24px 0;">
            <p style="font-size: 13px; color: #555; margin: 0;">
              <strong>Le saviez-vous ?</strong> Avec le Club, chaque livre passe a <strong>12 pages</strong>, <strong>12+ illustrations</strong>, et vous pouvez ajouter jusqu'a <strong>5 personnages</strong> (freres, soeurs, animal de compagnie...).
            </p>
          </div>

          ${priceBadge}
        `)
      },

      // ═══════════════════════════════════════════════════
      // J+1 — 24h après
      // Angle : émotion parentale + valeur du Club concrète
      // ═══════════════════════════════════════════════════
      day1: {
        subject: `${data.protagonistName} a adore ? Imaginez avec 2x plus de pages...`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 22px; text-align: center; margin: 0 0 8px; font-weight: 800;">
            Et si ${data.protagonistName} avait une histoire 2x plus longue ?
          </h1>
          <p style="color: #666; font-size: 14px; text-align: center; line-height: 1.7; margin: 0 0 24px;">
            ${data.customerName}, le livre gratuit de ${data.protagonistName} contenait 6 pages et 7 illustrations.<br>
            Avec le <strong style="color: #a78bfa;">Club Contedia</strong>, chaque livre passe a :
          </p>

          <div style="background: #f9f7ff; border-radius: 16px; padding: 20px; margin: 0 0 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px;">
                  <span style="color: #999;">Gratuit</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; text-align: right;">
                  <strong style="color: #a78bfa;">Club</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #888;">6 pages</td>
                <td style="padding: 8px 0; font-size: 13px; text-align: right; font-weight: 700; color: #333;">12 pages</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #888;">7 illustrations</td>
                <td style="padding: 8px 0; font-size: 13px; text-align: right; font-weight: 700; color: #333;">12+ illustrations</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #888;">1 style</td>
                <td style="padding: 8px 0; font-size: 13px; text-align: right; font-weight: 700; color: #333;">9 styles au choix</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #888;">1 personnage</td>
                <td style="padding: 8px 0; font-size: 13px; text-align: right; font-weight: 700; color: #333;">5 personnages</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #888;">1 livre</td>
                <td style="padding: 8px 0; font-size: 13px; text-align: right; font-weight: 700; color: #333;">4 livres/mois</td>
              </tr>
            </table>
          </div>

          ${priceBadge}
        `)
      },

      // ═══════════════════════════════════════════════════
      // J+3 — 72h après
      // Angle : features détaillées + cas d'usage concrets
      // ═══════════════════════════════════════════════════
      day3: {
        subject: `5 personnages, 9 styles, Noel, Ramadan... tout ce que le Club debloque`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 22px; text-align: center; margin: 0 0 8px; font-weight: 800;">
            Tout ce que le Club change
          </h1>
          <p style="color: #666; font-size: 14px; text-align: center; line-height: 1.7; margin: 0 0 24px;">
            ${data.customerName}, voici tout ce que les membres du Club creent :
          </p>

          <div style="margin: 0 0 24px;">
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: flex-start;">
              <span style="font-size: 22px; margin-right: 12px; line-height: 1;">&#x1F3A8;</span>
              <div>
                <strong style="font-size: 14px; color: #333;">9 styles d'illustration</strong>
                <p style="font-size: 12px; color: #888; margin: 2px 0 0;">Aquarelle, 3D Pixar, Papier decoupe, Kawaii, Manga, Argile, Geometrique...</p>
              </div>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: flex-start;">
              <span style="font-size: 22px; margin-right: 12px; line-height: 1;">&#x1F46A;</span>
              <div>
                <strong style="font-size: 14px; color: #333;">5 personnages dans chaque histoire</strong>
                <p style="font-size: 12px; color: #888; margin: 2px 0 0;">Grand frere, petite soeur, meilleur ami, doudou, animal de compagnie</p>
              </div>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: flex-start;">
              <span style="font-size: 22px; margin-right: 12px; line-height: 1;">&#x1F389;</span>
              <div>
                <strong style="font-size: 14px; color: #333;">Toutes les occasions</strong>
                <p style="font-size: 12px; color: #888; margin: 2px 0 0;">Noel, Ramadan, Paques, Anniversaire, Aid, Diwali, fete des meres...</p>
              </div>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: flex-start;">
              <span style="font-size: 22px; margin-right: 12px; line-height: 1;">&#x1F436;</span>
              <div>
                <strong style="font-size: 14px; color: #333;">Animal de compagnie</strong>
                <p style="font-size: 12px; color: #888; margin: 2px 0 0;">Votre chat, chien ou hamster devient un personnage de l'histoire</p>
              </div>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; display: flex; align-items: flex-start;">
              <span style="font-size: 22px; margin-right: 12px; line-height: 1;">&#x1F30D;</span>
              <div>
                <strong style="font-size: 14px; color: #333;">10 langues disponibles</strong>
                <p style="font-size: 12px; color: #888; margin: 2px 0 0;">Francais, anglais, arabe, espagnol, allemand, japonais, italien...</p>
              </div>
            </div>
          </div>

          ${priceBadge}
        `)
      },

      // ═══════════════════════════════════════════════════
      // J+7 — Dernier email
      // Angle : urgence douce + témoignage + dernière chance
      // ═══════════════════════════════════════════════════
      day7: {
        subject: `Dernier jour : le Club a 1,99\u20AC au lieu de 9,99\u20AC`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 22px; text-align: center; margin: 0 0 8px; font-weight: 800;">
            ${data.customerName}, c'est notre derniere relance
          </h1>
          <p style="color: #666; font-size: 14px; text-align: center; line-height: 1.7; margin: 0 0 24px;">
            On ne vous enverra plus d'email a ce sujet apres celui-ci.
            Mais avant, on voulait vous partager ce message :
          </p>

          <div style="background: #f0fdf4; border-radius: 16px; padding: 20px; margin: 0 0 24px; border: 1px solid #bbf7d0;">
            <p style="font-size: 14px; color: #333; margin: 0; font-style: italic; line-height: 1.7; text-align: center;">
              &laquo; Mon fils a lu son premier livre gratuit 6 fois.<br>
              Avec le Club, il en a un nouveau chaque semaine.<br>
              C'est le seul abonnement qu'il me reclame ! &raquo;
            </p>
            <p style="font-size: 12px; color: #888; margin: 10px 0 0; text-align: center; font-weight: 600;">
              Aurelie, maman de Leo (5 ans)
            </p>
          </div>

          <div style="background: #fffbeb; border-radius: 12px; padding: 16px; margin: 0 0 24px; border: 1px solid #fde68a;">
            <p style="font-size: 13px; color: #92400e; margin: 0; text-align: center; font-weight: 600;">
              L'offre de lancement a 1,99&euro; le 1er mois est toujours disponible.<br>
              Sans engagement, annulable en 1 clic.
            </p>
          </div>

          <div style="text-align: center; margin: 0 0 16px;">
            <p style="font-size: 14px; color: #999; text-decoration: line-through; margin: 0;">9,99&euro;/mois</p>
            <p style="font-size: 36px; font-weight: 800; color: #1a1040; margin: 4px 0;">1,99&euro;</p>
            <p style="font-size: 12px; color: #888; margin: 0;">le 1er mois &middot; puis 9,99&euro;/mois</p>
          </div>

          <div style="text-align: center; margin: 0 0 8px;">
            <a href="${clubLink}" style="background: linear-gradient(135deg, #a78bfa, #f093fb); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 16px rgba(167,139,250,0.4);">
              Derniere chance &mdash; Essayer pour 1,99&euro;
            </a>
          </div>

          <p style="color: #ccc; font-size: 11px; text-align: center; margin: 16px 0 0;">
            4 livres/mois &middot; 12 pages &middot; 9 styles &middot; 5 personnages &middot; sans engagement
          </p>
        `)
      }
    };

    const template = templates[data.step];
    if (!template) return;

    try {
      await getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [{
            From: {
              Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
              Name: 'Contedia'
            },
            To: [{ Email: data.customerEmail, Name: data.customerName }],
            Subject: template.subject,
            HTMLPart: template.html
          }]
        });
      console.log(`[EmailSequence] ${data.step} envoye a: ${data.customerEmail}`);
    } catch (error) {
      console.error(`[EmailSequence] Erreur ${data.step}:`, error);
    }
  }

  // Envoyer un code OTP par email
  static async sendOTPEmail(data: { email: string; code: string }): Promise<void> {
    try {
      await getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [{
            From: {
              Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
              Name: 'Contedia'
            },
            To: [{ Email: data.email }],
            Subject: `${data.code} — Votre code de connexion`,
            HTMLPart: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 440px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #2D3748; font-size: 22px; text-align: center; margin-bottom: 8px;">Votre code de connexion</h1>
                <p style="color: #718096; font-size: 14px; text-align: center; margin-bottom: 32px;">
                  Entrez ce code sur le site pour acceder a votre compte.
                </p>
                <div style="background: #F7FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                  <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2D3748;">${data.code}</span>
                </div>
                <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
                  Ce code expire dans 5 minutes. Si vous n'avez pas demande ce code, ignorez cet email.
                </p>
              </div>
            `
          }]
        });
      console.log('OTP email envoye a:', data.email);
    } catch (error) {
      console.error('Erreur envoi OTP email:', error);
      throw error;
    }
  }

  // Envoyer un email de notification a l'admin
  static async sendAdminNotification(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDetails: string;
  }): Promise<void> {
    try {
      const request = getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
                Name: 'Contedia'
              },
              To: [
                {
                  Email: process.env.ADMIN_EMAIL || 'contact@contedia.fr',
                  Name: 'Administrateur'
                }
              ],
              Subject: `🆕 Nouvelle commande #${orderData.orderNumber} - ${orderData.customerName}`,
              HTMLPart: `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #FF9999, #87CEEB); padding: 20px; border-radius: 15px; color: white;">
                    <h1 style="margin: 0; font-size: 28px;">🆕 Nouvelle Commande</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">Commande #${orderData.orderNumber}</p>
                  </div>
                  
                  <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                    <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #FF9999; padding-bottom: 10px;">📋 Informations Client</h2>
                    <p><strong>Nom du client :</strong> ${orderData.customerName}</p>
                    <p><strong>Email :</strong> ${orderData.customerEmail}</p>
                    <p><strong>Numéro de commande :</strong> #${orderData.orderNumber}</p>
                  </div>
                  
                  <div style="background: #e8f5e8; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                    <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">📝 Détails de la Commande</h2>
                    <div style="background: white; padding: 20px; border-radius: 10px; color: #555; line-height: 1.8;">
                      ${orderData.orderDetails.replace(/\n/g, '<br>')}
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #FFB6C1, #98FB98); border-radius: 15px;">
                    <h3 style="color: #333; margin-bottom: 15px;">🎯 Action Requise</h3>
                    <p style="color: #333; font-size: 16px; margin: 0;">
                      Traiter cette nouvelle commande et contacter le client à <strong>${orderData.customerEmail}</strong>
                    </p>
                  </div>
                </div>
              `
            }
          ]
        });

      const result = await request;
      console.log('✅ Email admin envoyé via Mailjet:', result.body);
      
    } catch (error) {
      console.error('❌ Erreur envoi email admin Mailjet:', error);
      throw new Error('Échec de l\'envoi de l\'email à l\'administrateur');
    }
  }
}
