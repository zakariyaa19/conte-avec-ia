"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuration du transporteur email
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};
class EmailService {
    // Email de notification de commande vers l'administrateur
    static async sendOrderNotificationToAdmin(order, formData) {
        const productTypeLabels = {
            ebook: 'eBook',
            printed: 'Livre relié premium',
            pack: 'Pack famille'
        };
        const themeLabels = {
            educational: 'Éducatif',
            'fairy-tales': 'Contes de fées',
            activities: 'Activités',
            stories: 'Histoires',
            celebrations: 'Célébrations',
            family: 'Famille'
        };
        const eyeColorLabels = {
            brown: 'Marron',
            blue: 'Bleu',
            green: 'Vert',
            hazel: 'Noisette',
            gray: 'Gris',
            amber: 'Ambre'
        };
        const hairColorLabels = {
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
            ${formData.photo ? '<p style="color: #856404;"><strong>📷 Photo uploadée :</strong> Oui (voir pièce jointe si disponible)</p>' : '<p style="color: #856404;"><strong>📷 Photo :</strong> Aucune photo uploadée</p>'}
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
    static async sendOrderConfirmation(order) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'Contes d\'IA <noreply@contes-ia.com>',
                to: order.user?.email || 'client@example.com',
                subject: `Confirmation de votre commande - Conte personnalisé pour ${order.protagonistName}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF9999; text-align: center;">✨ Votre conte est en préparation !</h1>
            
            <p>Bonjour,</p>
            
            <p>Nous avons bien reçu votre commande pour un conte personnalisé. Voici les détails :</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>📖 Détails du conte</h3>
              <ul>
                <li><strong>Héros/Héroïne :</strong> ${order.protagonistName}</li>
                <li><strong>Âge :</strong> ${order.protagonistAge || 'Non spécifié'}</li>
                <li><strong>Thème :</strong> ${order.generalTheme}</li>
                <li><strong>Message :</strong> ${order.centralMessage}</li>
                <li><strong>Style d'illustration :</strong> ${order.illustrationStyle}</li>
              </ul>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>💰 Informations de commande</h3>
              <ul>
                <li><strong>Numéro de commande :</strong> ${order.id}</li>
                <li><strong>Produit :</strong> ${order.productType === 'EBOOK' ? 'eBook numérique' : order.productType === 'PRINTED' ? 'Livre relié' : 'Pack famille'}</li>
                <li><strong>Prix :</strong> ${order.price}€</li>
                <li><strong>Statut :</strong> ${order.status === 'PAID' ? 'Payé ✅' : 'En attente de paiement'}</li>
              </ul>
            </div>
            
            ${order.productType !== 'EBOOK' && order.shippingAddress ? `
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>📦 Adresse de livraison</h3>
                <p>
                  ${order.shippingFirstName} ${order.shippingLastName}<br>
                  ${order.shippingAddress}<br>
                  ${order.shippingPostalCode} ${order.shippingCity}<br>
                  ${order.shippingCountry || 'France'}
                </p>
              </div>
            ` : ''}
            
            <div style="background-color: #d1ecf1; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>⏰ Prochaines étapes</h3>
              ${order.productType === 'EBOOK' ?
                    '<p>Votre eBook sera généré dans les prochaines heures et vous recevrez un email avec le lien de téléchargement.</p>' :
                    '<p>Votre conte sera imprimé et expédié sous 5-7 jours ouvrés. Vous recevrez un email de suivi avec le numéro de tracking.</p>'}
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <strong>Merci de faire confiance à Contes d'IA ! ✨</strong><br>
              <small>Pour toute question, répondez simplement à cet email.</small>
            </p>
          </div>
        `
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de confirmation envoyé:', result.messageId);
            return result;
        }
        catch (error) {
            console.error('❌ Erreur envoi email confirmation:', error);
            throw error;
        }
    }
    // Email de livraison du conte (eBook prêt)
    static async sendStoryDelivery(order, ebookUrl) {
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
        }
        catch (error) {
            console.error('❌ Erreur envoi email livraison:', error);
            throw error;
        }
    }
    // Email de notification d'expédition
    static async sendShippingNotification(order, trackingNumber) {
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
        }
        catch (error) {
            console.error('❌ Erreur envoi email expédition:', error);
            throw error;
        }
    }
    // Email d'erreur de paiement
    static async sendPaymentError(order) {
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
        }
        catch (error) {
            console.error('❌ Erreur envoi email erreur paiement:', error);
            throw error;
        }
    }
}
exports.EmailService = EmailService;
EmailService.transporter = createTransporter();
//# sourceMappingURL=emailService.js.map