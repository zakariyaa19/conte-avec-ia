import nodemailer from 'nodemailer';
import type { Order, User } from '../generated/prisma';

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export class EmailService {
  private static transporter = createTransporter();

  // Email de notification de commande vers l'administrateur
  static async sendOrderNotificationToAdmin(order: any, formData: any, photoPath?: string): Promise<void> {
    const productTypeLabels: { [key: string]: string } = {
      ebook: 'eBook',
      printed: 'Livre relié premium',
      pack: 'Pack famille'
    };

    const themeLabels: { [key: string]: string } = {
      educational: 'Éducatif',
      'fairy-tales': 'Contes de fées',
      activities: 'Activités',
      stories: 'Histoires',
      celebrations: 'Célébrations',
      family: 'Famille'
    };

    const eyeColorLabels: { [key: string]: string } = {
      brown: 'Marron',
      blue: 'Bleu',
      green: 'Vert',
      hazel: 'Noisette',
      gray: 'Gris',
      amber: 'Ambre'
    };

    const hairColorLabels: { [key: string]: string } = {
      brown: 'Châtain',
      blonde: 'Blond',
      black: 'Noir',
      red: 'Roux',
      auburn: 'Auburn',
      gray: 'Gris'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'zakariyou.tahiri@gmail.com',
      subject: `🆕 Nouvelle commande #${order.id} - ${productTypeLabels[formData.productType]}`,
      attachments: photoPath ? [{
        filename: `photo-${formData.protagonistName}-${order.id.slice(-8)}.jpg`,
        path: photoPath,
        contentType: 'image/jpeg'
      }] : [],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #FF9999, #87CEEB); padding: 20px; border-radius: 15px; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🆕 Nouvelle Commande</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Commande #${order.id}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #FF9999; padding-bottom: 10px;">📋 Informations Client</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <p><strong>Email :</strong> ${formData.userEmail}</p>
              <p><strong>Produit :</strong> ${productTypeLabels[formData.productType]}</p>
              <p><strong>Prénom :</strong> ${formData.shippingAddress?.firstName || 'Non renseigné'}</p>
              <p><strong>Nom :</strong> ${formData.shippingAddress?.lastName || 'Non renseigné'}</p>
              <p><strong>Adresse :</strong> ${formData.shippingAddress?.address || 'Non renseigné'}</p>
              <p><strong>Ville :</strong> ${formData.shippingAddress?.city || 'Non renseigné'}</p>
              <p><strong>Code postal :</strong> ${formData.shippingAddress?.postalCode || 'Non renseigné'}</p>
              <p><strong>Prix :</strong> ${order.price}€</p>
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">🎨 Détails du Conte</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <p><strong>Tranche d'âge :</strong> ${formData.ageRange}</p>
              <p><strong>Thème général :</strong> ${themeLabels[formData.generalTheme] || formData.generalTheme}</p>
              <p><strong>Sujet spécifique :</strong> ${formData.specificSubject}</p>
              <p><strong>Message central :</strong> ${formData.centralMessage}</p>
              <p><strong>Style d'illustration :</strong> ${formData.illustrationStyle}</p>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #FFFACD; padding-bottom: 10px;">👤 Protagoniste</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <p><strong>Nom :</strong> ${formData.protagonistName}</p>
              <p><strong>Âge :</strong> ${formData.protagonistAge} ans</p>
              <p><strong>Couleur des yeux :</strong> ${eyeColorLabels[formData.eyeColor] || formData.eyeColor}</p>
              <p><strong>Couleur des cheveux :</strong> ${hairColorLabels[formData.hairColor] || formData.hairColor}</p>
              ${formData.secondaryCharacterName ? `<p><strong>Personnage secondaire :</strong> ${formData.secondaryCharacterName}</p>` : ''}
              ${formData.secondaryCharacterAge ? `<p><strong>Âge du personnage secondaire :</strong> ${formData.secondaryCharacterAge} ans</p>` : ''}
            </div>
            ${photoPath ? '<p style="color: #856404;"><strong>📷 Photo uploadée :</strong> Oui (voir pièce jointe)</p>' : '<p style="color: #856404;"><strong>📷 Photo :</strong> Aucune photo uploadée</p>'}
          </div>
          
          <div style="background: #d1ecf1; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">📦 Informations Commande</h2>
            <p><strong>Numéro de commande :</strong> ${order.id}</p>
            <p><strong>Date de commande :</strong> ${new Date(order.createdAt).toLocaleString('fr-FR')}</p>
            <p><strong>Statut :</strong> ${order.status}</p>
            <p><strong>Statut de paiement :</strong> ${order.paymentStatus}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #FFB6C1, #98FB98); border-radius: 15px;">
            <h3 style="color: #333; margin-bottom: 15px;">🎯 Action Requise</h3>
            <p style="color: #333; font-size: 16px; margin: 0;">
              Créer le conte personnalisé selon les spécifications ci-dessus<br>
              et l'envoyer à <strong>${formData.userEmail}</strong>
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Email de confirmation de commande
  static async sendOrderConfirmation(order: Order & { user?: User | null }) {
    try {
      const mailOptions = {
        from: 'zakariyou.tahiri@gmail.com',
        to: order.user?.email || 'client@example.com',
        subject: `✨ Confirmation de votre commande - Conte personnalisé pour ${order.protagonistName}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 20px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF9999, #87CEEB); padding: 40px 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">✨ Votre Commande est Confirmée !</h1>
              <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Conte personnalisé pour ${order.protagonistName}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; border-bottom: 3px solid #FF9999; padding-bottom: 10px; display: inline-block;">🎉 Merci pour votre confiance !</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                  Nous avons bien reçu votre paiement et votre commande est maintenant <strong style="color: #FF9999;">en cours de préparation</strong>. 
                  Notre équipe créative travaille déjà sur l'histoire unique de <strong>${order.protagonistName}</strong> !
                </p>
              </div>
            
              <!-- Détails du conte -->
              <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #87CEEB; padding-bottom: 8px; display: inline-block;">📖 Détails de votre conte</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; color: #555;">
                  <div><strong style="color: #FF9999;">Héros/Héroïne :</strong> ${order.protagonistName}</div>
                  <div><strong style="color: #FF9999;">Âge :</strong> ${order.protagonistAge || 'Non spécifié'}</div>
                  <div><strong style="color: #FF9999;">Thème :</strong> ${order.generalTheme}</div>
                  <div><strong style="color: #FF9999;">Message :</strong> ${order.centralMessage}</div>
                  <div style="grid-column: span 2;"><strong style="color: #FF9999;">Style d'illustration :</strong> ${order.illustrationStyle}</div>
                </div>
              </div>
              
              <!-- Informations de commande -->
              <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #90EE90; padding-bottom: 8px; display: inline-block;">💰 Récapitulatif de commande</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; color: #555;">
                  <div><strong style="color: #FF9999;">N° de commande :</strong> #${order.id.slice(-8)}</div>
                  <div><strong style="color: #FF9999;">Produit :</strong> ${order.productType === 'EBOOK' ? 'eBook numérique' : order.productType === 'PRINTED' ? 'Livre relié premium' : 'Pack famille'}</div>
                  <div><strong style="color: #FF9999;">Prix :</strong> ${order.price}€</div>
                  <div><strong style="color: #FF9999;">Statut :</strong> <span style="color: #28a745; font-weight: bold;">Payé ✅</span></div>
                </div>
              </div>
            
              ${order.productType !== 'EBOOK' && order.shippingAddress ? `
                <!-- Adresse de livraison -->
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
                  <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #FFD700; padding-bottom: 8px; display: inline-block;">📦 Adresse de livraison</h3>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; color: #555; line-height: 1.8;">
                    <strong>${order.shippingFirstName} ${order.shippingLastName}</strong><br>
                    ${order.shippingAddress}<br>
                    ${order.shippingPostalCode} ${order.shippingCity}<br>
                    ${order.shippingCountry || 'France'}
                  </div>
                </div>
              ` : ''}
            
              <!-- Prochaines étapes -->
              <div style="background: linear-gradient(135deg, #e3f2fd, #f3e5f5); padding: 30px; border-radius: 15px; margin-bottom: 25px; border-left: 5px solid #FF9999;">
                <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">⏰ Prochaines étapes</h3>
                <div style="background: white; padding: 20px; border-radius: 10px; color: #555; line-height: 1.6;">
                  ${order.productType === 'EBOOK' ? 
                    '<p style="margin: 0;"><strong style="color: #FF9999;">📱 Version numérique :</strong><br>Votre eBook personnalisé sera créé dans les <strong>24-48 heures</strong> et vous recevrez un email avec le lien de téléchargement sécurisé.</p>' :
                    '<p style="margin: 0;"><strong style="color: #FF9999;">📚 Livre physique :</strong><br>Votre conte sera imprimé sur papier premium et expédié sous <strong>5-7 jours ouvrés</strong>. Vous recevrez un email de suivi avec le numéro de tracking.</p>'
                  }
                </div>
              </div>
            
              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #FF9999, #87CEEB); border-radius: 15px; color: white;">
                <h3 style="margin: 0 0 15px 0; font-size: 24px;">🙏 Merci de votre confiance !</h3>
                <p style="margin: 0 0 15px 0; font-size: 16px; opacity: 0.95;">L'équipe Contes d'IA met tout son cœur dans la création de l'histoire de ${order.protagonistName}</p>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-top: 20px;">
                  <p style="margin: 0; font-size: 14px;">💬 <strong>Une question ?</strong> Répondez simplement à cet email<br>
                  📧 Ou contactez-nous à : <strong>zakariyou.tahiri@gmail.com</strong></p>
                </div>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de confirmation envoyé:', result.messageId);
      return result;

    } catch (error) {
      console.error('❌ Erreur envoi email confirmation:', error);
      throw error;
    }
  }

  // Email de livraison du conte (eBook prêt)
  static async sendStoryDelivery(order: Order & { user?: User | null }, ebookUrl: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Contes d\'IA <noreply@contes-ia.com>',
        to: order.user?.email || 'client@example.com',
        subject: `🎉 Votre conte "${order.protagonistName}" est prêt !`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF9999; text-align: center;">🎉 Votre conte est prêt !</h1>
            
            <p>Bonjour,</p>
            
            <p>Excellente nouvelle ! Le conte personnalisé pour <strong>${order.protagonistName}</strong> vient d'être généré et est maintenant disponible au téléchargement.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${ebookUrl}" 
                 style="background-color: #FF9999; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                📚 Télécharger votre conte
              </a>
            </div>
            
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>💡 Conseils de lecture</h3>
              <ul>
                <li>Le fichier est au format PDF haute qualité</li>
                <li>Vous pouvez l'imprimer ou le lire sur tablette/ordinateur</li>
                <li>Le lien de téléchargement est valable 30 jours</li>
                <li>Sauvegardez le fichier sur vos appareils</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <strong>Nous espérons que ${order.protagonistName} adorera son histoire ! ✨</strong><br>
              <small>N'hésitez pas à partager vos retours avec nous.</small>
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              Commande #${order.id} | Contes d'IA<br>
              Pour toute question, répondez à cet email.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de livraison envoyé:', result.messageId);
      return result;

    } catch (error) {
      console.error('❌ Erreur envoi email livraison:', error);
      throw error;
    }
  }

  // Email de notification d'expédition
  static async sendShippingNotification(order: Order & { user?: User | null }, trackingNumber?: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Contes d\'IA <noreply@contes-ia.com>',
        to: order.user?.email || 'client@example.com',
        subject: `📦 Votre livre "${order.protagonistName}" a été expédié !`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF9999; text-align: center;">📦 Votre livre est en route !</h1>
            
            <p>Bonjour,</p>
            
            <p>Bonne nouvelle ! Votre livre personnalisé pour <strong>${order.protagonistName}</strong> a été imprimé et expédié.</p>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>📋 Informations d'expédition</h3>
              <ul>
                <li><strong>Adresse de livraison :</strong><br>
                    ${order.shippingFirstName} ${order.shippingLastName}<br>
                    ${order.shippingAddress}<br>
                    ${order.shippingPostalCode} ${order.shippingCity}
                </li>
                <li><strong>Délai de livraison :</strong> 2-3 jours ouvrés</li>
                ${trackingNumber ? `<li><strong>Numéro de suivi :</strong> ${trackingNumber}</li>` : ''}
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <strong>Le conte de ${order.protagonistName} arrive bientôt ! 🎁</strong><br>
              <small>Merci de votre patience et de votre confiance.</small>
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email d\'expédition envoyé:', result.messageId);
      return result;

    } catch (error) {
      console.error('❌ Erreur envoi email expédition:', error);
      throw error;
    }
  }

  // Email d'erreur de paiement
  static async sendPaymentError(order: Order & { user?: User | null }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Contes d\'IA <noreply@contes-ia.com>',
        to: order.user?.email || 'client@example.com',
        subject: `⚠️ Problème de paiement - Commande ${order.protagonistName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc3545; text-align: center;">⚠️ Problème de paiement</h1>
            
            <p>Bonjour,</p>
            
            <p>Nous avons rencontré un problème lors du traitement de votre paiement pour le conte de <strong>${order.protagonistName}</strong>.</p>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>🔄 Que faire maintenant ?</h3>
              <ul>
                <li>Vérifiez les informations de votre carte bancaire</li>
                <li>Assurez-vous d'avoir suffisamment de fonds</li>
                <li>Contactez votre banque si nécessaire</li>
                <li>Tentez un nouveau paiement</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/order/${order.id}" 
                 style="background-color: #FF9999; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🔄 Réessayer le paiement
              </a>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <strong>Nous gardons votre commande en attente ! 💝</strong><br>
              <small>Contactez-nous si vous avez besoin d'aide.</small>
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email d\'erreur paiement envoyé:', result.messageId);
      return result;

    } catch (error) {
      console.error('❌ Erreur envoi email erreur paiement:', error);
      throw error;
    }
  }
}
