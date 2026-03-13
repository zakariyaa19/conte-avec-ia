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
                Name: 'Contes d\'IA'
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
                      <p style="margin: 0 0 15px 0; font-size: 16px; opacity: 0.95;">L'équipe Contes d'IA met tout son cœur dans la création de votre histoire personnalisée</p>
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

  // Envoyer un email de livraison au client
  static async sendStoryDeliveryEmail(data: {
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
                Name: 'Contes d\'IA'
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
                        Connectez-vous a votre compte pour le consulter et le telecharger.
                      </p>
                      <div style="text-align: center; margin-top: 25px;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #FF9999, #FF7F7F); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block;">
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
                Name: 'Contes d\'IA'
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
                Name: 'Contes d\'IA - Système'
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
