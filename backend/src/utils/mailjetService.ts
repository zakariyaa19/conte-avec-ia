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
              Subject: `L'histoire de ${data.protagonistName} est prete !`,
              HTMLPart: (() => {
                const dl = data.userId ? MailjetService.generateMagicDashboardLink(data.userId, data.customerEmail) : (process.env.FRONTEND_URL + '/dashboard');
                const sn = data.customerName.replace(/&/g, '&amp;').replace(/</g, '&lt;');
                const sp = data.protagonistName.replace(/&/g, '&amp;').replace(/</g, '&lt;');

                return `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff;">

                  <!-- HEADER -->
                  <div style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); padding: 32px 24px; text-align: center; color: white;">
                    <p style="font-size: 36px; margin: 0 0 8px;">&#x1F4D6;&#x2728;</p>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; line-height: 1.3;">L'histoire de ${sp} est prete !</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">${sn}, 3 pages illustrees vous attendent.</p>
                  </div>

                  <div style="padding: 32px 24px;">

                    <!-- CTA UNIQUE — Lire l'histoire -->
                    <div style="text-align: center; margin: 0 0 28px;">
                      <a href="${dl}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; text-decoration: none; padding: 18px 44px; border-radius: 14px; font-weight: 800; font-size: 17px; display: inline-block; box-shadow: 0 4px 16px rgba(255,107,107,0.4);">
                        Lire l'histoire de ${sp}
                      </a>
                      <p style="font-size: 11px; color: #999; margin: 10px 0 0;">Connexion automatique &mdash; 1 clic</p>
                    </div>

                    <p style="font-size: 14px; color: #666; text-align: center; margin: 0 0 24px; line-height: 1.6;">
                      Bonne lecture ! &#x1F4D6;
                    </p>

                    <!-- FOOTER -->
                    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #f0f0f0;">
                      <p style="font-size: 11px; color: #bbb; margin: 0;">Une question ? Repondez directement a cet email.</p>
                      <p style="font-size: 10px; color: #ddd; margin: 6px 0 0;">Contedia (PAUSIA) &middot; contedia.fr</p>
                    </div>
                  </div>
                </div>`;
              })()
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

  // Sequence post-achat (4.4 devbook) : relancer apres le paiement 2,99€ pour maximiser retention + LTV
  // Steps : post_day1 (partage), post_day3 (nouvelle histoire), post_day7 (upsell Club si non-membre)
  static async sendPostPurchaseEmail(data: {
    customerName: string;
    customerEmail: string;
    protagonistName: string;
    step: 'post_day1' | 'post_day3' | 'post_day7';
    userId: string;
  }): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'https://contedia.fr';
    const magicLink = this.generateMagicDashboardLink(data.userId, data.customerEmail);
    const createLink = `${frontendUrl}/create-story`;
    const clubLink = `${frontendUrl}/club/checkout`;
    const sn = data.customerName.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const sp = data.protagonistName.replace(/&/g, '&amp;').replace(/</g, '&lt;');

    const wrapper = (content: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1040, #2d1b69); padding: 22px 20px; text-align: center;">
          <img src="${frontendUrl}/logo-conte-ia.png" alt="Contedia" style="height: 30px;" />
        </div>
        <div style="padding: 30px 24px;">${content}</div>
        <div style="padding: 18px 20px; text-align: center; border-top: 1px solid #f0f0f0;">
          <p style="font-size: 10px; color: #bbb; margin: 0;">Contedia (PAUSIA) &middot; contedia.fr</p>
        </div>
      </div>`;

    const templates: Record<string, { subject: string; html: string }> = {
      post_day1: {
        subject: `Le livre de ${data.protagonistName} est pret a etre partage ! \uD83D\uDCD6`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 20px; margin: 0 0 12px; font-weight: 800;">${sn}, ${sp} est maintenant un vrai heros de livre !</h1>
          <p style="font-size: 15px; color: #555; line-height: 1.65; margin: 0 0 22px;">
            Le livre complet de ${sp} est pret. Partagez-le avec la famille, les proches, les grands-parents &mdash; c'est le genre de cadeau qu'on relit encore et encore.
          </p>
          <div style="text-align: center; margin: 0 0 18px;">
            <a href="${magicLink}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; text-decoration: none; padding: 14px 34px; border-radius: 14px; font-weight: 800; font-size: 15px; display: inline-block;">
              Ouvrir le livre de ${sp}
            </a>
          </div>
          <p style="font-size: 13px; color: #777; text-align: center; margin: 0;">Le PDF est telechargeable depuis votre bibliotheque \u2193</p>
        `)
      },
      post_day3: {
        subject: `Quelle sera la prochaine aventure de ${data.protagonistName} ?`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 20px; margin: 0 0 12px; font-weight: 800;">Et si ${sp} vivait une nouvelle aventure ?</h1>
          <p style="font-size: 15px; color: #555; line-height: 1.65; margin: 0 0 18px;">
            Un anniversaire qui arrive ? Une occasion speciale ? Un simple "parce que j'en ai envie" ? Chaque nouvelle histoire demarre par un chapitre gratuit.
          </p>
          <div style="text-align: center; margin: 0 0 14px;">
            <a href="${createLink}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; text-decoration: none; padding: 14px 34px; border-radius: 14px; font-weight: 800; font-size: 15px; display: inline-block;">
              Creer une nouvelle histoire &rarr;
            </a>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">Gratuit &middot; sans carte bancaire</p>
        `)
      },
      post_day7: {
        subject: `${sn}, avec le Club, ${sp} aurait un nouveau livre chaque semaine`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 20px; margin: 0 0 12px; font-weight: 800;">Le Club des Histoires</h1>
          <p style="font-size: 15px; color: #555; line-height: 1.65; margin: 0 0 18px;">
            Vous avez aime offrir une histoire complete a ${sp} ? Avec le Club, vous en creez <strong>4 par mois</strong>, avec des styles, des themes et des occasions differents.
          </p>
          <div style="background: linear-gradient(145deg, #1a1040, #2d1b69); border-radius: 14px; padding: 18px; margin: 0 0 18px; text-align: center; border: 1px solid rgba(167,139,250,0.3);">
            <p style="font-size: 11px; color: #fbbf24; margin: 0 0 6px; font-weight: 800; letter-spacing: 1.2px;">&#x2B50; OFFRE MEMBRE</p>
            <p style="font-size: 12px; color: rgba(255,255,255,0.4); text-decoration: line-through; margin: 0;">9,99&euro;/mois</p>
            <p style="font-size: 28px; font-weight: 800; color: white; margin: 4px 0;">1,99&euro;</p>
            <p style="font-size: 11px; color: rgba(255,255,255,0.6); margin: 0 0 14px;">le 1er mois &middot; puis 9,99&euro;/mois &middot; sans engagement</p>
            <a href="${clubLink}" style="background: linear-gradient(135deg, #a78bfa, #f093fb); color: white; text-decoration: none; padding: 12px 30px; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block;">
              Essayer le Club &rarr;
            </a>
          </div>
          <p style="font-size: 11px; color: #aaa; text-align: center; margin: 0;">Annulable en 1 clic depuis votre compte.</p>
        `)
      },
    };

    const template = templates[data.step];
    if (!template) throw new Error(`Template inconnu: ${data.step}`);
    try {
      const result = await getMailjet().post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: { Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr', Name: 'Contedia' },
          To: [{ Email: data.customerEmail, Name: data.customerName }],
          Subject: template.subject,
          HTMLPart: template.html,
        }]
      });
      console.log(`Email post-achat ${data.step} envoye:`, result.body);
    } catch (error) {
      console.error(`Erreur envoi email post-achat ${data.step}:`, error);
      throw new Error(`Echec envoi email post-achat ${data.step}`);
    }
  }

  // Email de rappel : envoye 3h apres livraison si l'histoire n'a pas ete lue (lastReadAt null)
  // (4.3 devbook) — rattrape les utilisateurs perdus en spam ou qui ont oublie
  static async sendUnreadReminderEmail(data: {
    customerName: string;
    customerEmail: string;
    protagonistName: string;
    userId: string;
  }): Promise<void> {
    try {
      const dl = MailjetService.generateMagicDashboardLink(data.userId, data.customerEmail);
      const sp = data.protagonistName.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const request = getMailjet()
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
                Name: 'Contedia'
              },
              To: [{ Email: data.customerEmail, Name: data.customerName }],
              Subject: `Vous n'avez pas encore lu l'histoire de ${data.protagonistName} ? \uD83D\uDCD6`,
              HTMLPart: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
                  <div style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); padding: 28px 24px; text-align: center; color: white;">
                    <p style="font-size: 32px; margin: 0 0 6px;">&#x1F4D6;</p>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 800; line-height: 1.3;">L'histoire de ${sp} vous attend</h1>
                  </div>
                  <div style="padding: 28px 24px;">
                    <p style="font-size: 15px; color: #444; line-height: 1.65; margin: 0 0 20px;">
                      Petite piqure de rappel : l'histoire de ${sp} est prete depuis quelques heures, mais on ne vous a pas encore vu(e) passer.<br><br>
                      Prenez 5 minutes ce soir, installez-vous confortablement, et laissez ${sp} devenir le heros de son aventure.
                    </p>
                    <div style="text-align: center; margin: 0 0 20px;">
                      <a href="${dl}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; text-decoration: none; padding: 16px 38px; border-radius: 14px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 16px rgba(255,107,107,0.4);">
                        Lire l'histoire de ${sp}
                      </a>
                    </div>
                    <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">Connexion automatique en 1 clic &middot; votre chapitre gratuit reste disponible</p>
                    <div style="text-align: center; padding: 18px 0 0; margin-top: 22px; border-top: 1px solid #f0f0f0;">
                      <p style="font-size: 10px; color: #ccc; margin: 0;">Contedia (PAUSIA) &middot; contedia.fr</p>
                    </div>
                  </div>
                </div>`
            }
          ]
        });
      const result = await request;
      console.log('Email rappel non-lu envoye via Mailjet:', result.body);
    } catch (error) {
      console.error('Erreur envoi email rappel non-lu:', error);
      throw new Error('Echec de l\'envoi de l\'email de rappel');
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
    step: 'day1' | 'day3' | 'day7';
    userId: string;
    cliffhangerSummary?: string | null;
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

    // Badge prix commun avec preuve sociale (remplace fausse urgence)
    const priceBadge = (socialProof: string) => `
      <div style="background: linear-gradient(145deg, #1a1040, #2d1b69); border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center; border: 1px solid rgba(167,139,250,0.3);">
        <p style="font-size: 10px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 8px;">&#x2B50; ${socialProof}</p>
        <p style="font-size: 14px; color: rgba(255,255,255,0.4); text-decoration: line-through; margin: 0;">9,99&euro;/mois</p>
        <p style="font-size: 32px; font-weight: 800; color: white; margin: 4px 0;">1,99&euro;</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 0 0 16px;">le 1er mois &middot; puis 9,99&euro;/mois &middot; sans engagement</p>
        <a href="${clubLink}" style="background: linear-gradient(135deg, #a78bfa, #f093fb); color: white; padding: 14px 36px; border-radius: 30px; text-decoration: none; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(167,139,250,0.5);">
          Essayer le Club pour 1,99&euro; &rarr;
        </a>
        <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin: 10px 0 0;">Sans engagement &middot; Annulable en 1 clic</p>
      </div>
    `;

    const templates: Record<string, { subject: string; html: string }> = {
      // ═══════════════════════════════════════════════════
      // J+1 — 24h apres
      // Angle : EMOTIONNEL + personnel. Pas commercial.
      // Objet qui intrigue, 1 question, Club en secondaire.
      // ═══════════════════════════════════════════════════
      day1: {
        subject: data.cliffhangerSummary
          ? data.cliffhangerSummary.slice(0, 140)
          : `${data.customerName}, ${data.protagonistName} attend la suite de son histoire...`,
        html: wrapper(`
          <p style="font-size: 28px; text-align: center; margin: 0 0 16px;">&#x1F4D6;&#x2728;</p>
          <h1 style="color: #1a1040; font-size: 20px; text-align: center; margin: 0 0 20px; font-weight: 800; line-height: 1.4;">
            L'histoire de ${data.protagonistName}<br>s'est arretee au meilleur moment...
          </h1>

          <p style="color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 20px; text-align: center;">
            Vous avez lu les 5 premieres pages. ${data.protagonistName} etait sur le point de decouvrir quelque chose d'incroyable... Que va-t-il se passer ensuite ? <strong>Decouvrez la suite pour seulement 2,99&euro;</strong> ou rejoignez le Club.
          </p>

          <div style="text-align: center; margin: 0 0 24px;">
            <a href="${magicLink}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 14px 36px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(255,107,107,0.3);">
              Decouvrir la suite — 2,99&euro;
            </a>
          </div>

          <!-- Temoignage — J+1 : angle enfant qui reconnait son prenom -->
          <div style="background: #fff8f5; border-radius: 14px; padding: 18px 20px; margin: 0 0 16px; border: 1px solid #ffe4d6;">
            <p style="font-size: 14px; color: #333; margin: 0; font-style: italic; line-height: 1.65; text-align: center;">
              &laquo; Ma fille a adore voir son prenom dans l'histoire ! Elle me demande maintenant une nouvelle aventure chaque semaine. &raquo;
            </p>
            <p style="font-size: 11px; color: #999; margin: 8px 0 0; text-align: center; font-weight: 600;">
              Sarah, maman de Lea (4 ans) &middot; &#9733;&#9733;&#9733;&#9733;&#9733;
            </p>
          </div>

          <!-- Teaser Club subtil, pas agressif -->
          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 0 0 8px;">
            <p style="font-size: 13px; color: #777; margin: 0; text-align: center; line-height: 1.6;">
              Avec le Club, decouvrez la suite de cette histoire<br>
              <strong>+ 4 livres complets par mois</strong> avec <strong>20 pages</strong> chacun.
            </p>
          </div>

          ${priceBadge('Rejoignez +500 familles dans le Club')}
        `)
      },

      // ═══════════════════════════════════════════════════
      // J+3 — 72h apres
      // Angle : concret + projection. Montrer ce qu'ils RATENT.
      // ═══════════════════════════════════════════════════
      day3: {
        subject: `L'histoire de ${data.protagonistName} n'est toujours pas finie...`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 20px; text-align: center; margin: 0 0 8px; font-weight: 800; line-height: 1.4;">
            Imaginez ${data.protagonistName}...
          </h1>

          <div style="margin: 20px 0 24px;">
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px;">
              <p style="font-size: 14px; color: #333; margin: 0;">&#x1F3A8; ...dans une histoire en <strong>aquarelle</strong>, en <strong>manga</strong>, ou en <strong>3D Pixar</strong></p>
              <p style="font-size: 12px; color: #999; margin: 4px 0 0;">9 styles differents. Chaque livre est unique.</p>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px;">
              <p style="font-size: 14px; color: #333; margin: 0;">&#x1F436; ...avec son <strong>chat</strong>, son <strong>doudou</strong> et sa <strong>grande soeur</strong> dans l'aventure</p>
              <p style="font-size: 12px; color: #999; margin: 4px 0 0;">Jusqu'a 5 personnages par histoire.</p>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px;">
              <p style="font-size: 14px; color: #333; margin: 0;">&#x1F384; ...dans une histoire de <strong>Noel</strong>, d'<strong>anniversaire</strong>, de <strong>Ramadan</strong>...</p>
              <p style="font-size: 12px; color: #999; margin: 4px 0 0;">Chaque occasion merite une histoire.</p>
            </div>
            <div style="background: #f9f7ff; border-radius: 12px; padding: 14px 16px;">
              <p style="font-size: 14px; color: #333; margin: 0;">&#x1F4D6; ...dans un livre de <strong>20 pages</strong> au lieu de 3</p>
              <p style="font-size: 12px; color: #999; margin: 4px 0 0;">2x plus long. 2x plus d'illustrations. 2x plus de magie.</p>
            </div>
          </div>

          <!-- CTA Complétion rapide -->
          <div style="text-align: center; margin: 0 0 16px;">
            <a href="${magicLink}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 14px 36px; border-radius: 30px; text-decoration: none; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(255,107,107,0.4);">
              Finir l'histoire de ${data.protagonistName} &mdash; 2,99&euro;
            </a>
          </div>

          <!-- Temoignage — J+3 : angle cadeau / emotion famille -->
          <div style="background: #f5f8ff; border-radius: 14px; padding: 18px 20px; margin: 0 0 20px; border: 1px solid #dbe7ff;">
            <p style="font-size: 14px; color: #333; margin: 0; font-style: italic; line-height: 1.65; text-align: center;">
              &laquo; On a offert le livre a mamie pour Noel, elle a pleure de joie en decouvrant son petit-fils en heros. &raquo;
            </p>
            <p style="font-size: 11px; color: #999; margin: 8px 0 0; text-align: center; font-weight: 600;">
              Thomas, papa de Jules (6 ans) &middot; &#9733;&#9733;&#9733;&#9733;&#9733;
            </p>
          </div>

          <p style="font-size: 13px; color: #999; text-align: center; margin: 0 0 8px;">ou accedez a tout avec le Club :</p>

          ${priceBadge('Plebiscite par les familles du Club')}
        `)
      },

      // ═══════════════════════════════════════════════════
      // J+7 — Dernier email
      // Angle : honnete + derniere chance + temoignage
      // ZERO relance apres celui-ci.
      // ═══════════════════════════════════════════════════
      day7: {
        subject: `${data.customerName}, on ne vous ecrira plus apres ca`,
        html: wrapper(`
          <h1 style="color: #1a1040; font-size: 20px; text-align: center; margin: 0 0 20px; font-weight: 800; line-height: 1.4;">
            Dernier email. Promis.
          </h1>

          <p style="color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 24px; text-align: center;">
            ${data.customerName}, on ne va pas vous harceler. Si le Club ne vous interesse pas, on comprend et on ne vous enverra plus d'email a ce sujet.<br><br>
            Mais avant, on voulait juste vous montrer ce qu'une maman nous a ecrit :
          </p>

          <div style="background: #f0fdf4; border-radius: 16px; padding: 24px; margin: 0 0 24px; border: 1px solid #bbf7d0;">
            <p style="font-size: 15px; color: #333; margin: 0; font-style: italic; line-height: 1.7; text-align: center;">
              &laquo; Mon fils me reclame "son livre" chaque soir avant de dormir. Depuis qu'on est au Club, il en a un nouveau chaque semaine. C'est devenu notre rituel. &raquo;
            </p>
            <p style="font-size: 12px; color: #888; margin: 12px 0 0; text-align: center; font-weight: 600;">
              Aurelie, maman de Leo (5 ans)
            </p>
          </div>

          <!-- CTA 1 — Complétion -->
          <div style="text-align: center; margin: 0 0 16px;">
            <p style="font-size: 14px; color: #555; margin: 0 0 12px;">L'histoire de ${data.protagonistName} n'est pas finie...</p>
            <a href="${magicLink}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 14px 36px; border-radius: 30px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 16px rgba(255,107,107,0.4);">
              Finir l'histoire &mdash; 2,99&euro;
            </a>
          </div>

          <!-- CTA 2 — Club -->
          <div style="text-align: center; margin: 0 0 24px;">
            <p style="font-size: 12px; color: #999; margin: 0 0 8px;">ou le Club (cette histoire + 4 livres/mois) :</p>
            <a href="${clubLink}" style="background: linear-gradient(135deg, #a78bfa, #f093fb); color: white; padding: 12px 32px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              Club &mdash; 1,99&euro; le 1er mois
            </a>
          </div>

          <p style="color: #ccc; font-size: 11px; text-align: center; margin: 0;">
            Merci d'avoir essaye Contedia. &#x2764;&#xFE0F;<br>
            On espere que ${data.protagonistName} a aime son histoire.
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
