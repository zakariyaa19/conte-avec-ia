"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatus = exports.createPaymentSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../utils/database");
const mailjetService_1 = require("../utils/mailjetService");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    typescript: true,
});
// Créer une session de paiement Stripe
const createPaymentSession = async (req, res) => {
    try {
        const { orderId } = req.body;
        // Récupérer la commande
        const order = await database_1.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        // Créer la session Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Conte personnalisé - ${order.productType === 'EBOOK' ? 'eBook Numérique' : 'Livre Relié Premium'}`,
                            description: `Conte pour ${order.protagonistName}`,
                        },
                        unit_amount: Math.round(Number(order.price) * 100), // Stripe utilise les centimes
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel?order_id=${order.id}`,
            metadata: {
                orderId: order.id,
            },
        });
        // Mettre à jour la commande avec le statut en attente
        await database_1.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PENDING'
            }
        });
        res.json({ sessionId: session.id, url: session.url });
    }
    catch (error) {
        console.error('Erreur création session Stripe:', error);
        res.status(500).json({
            error: 'Erreur lors de la création de la session de paiement',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};
exports.createPaymentSession = createPaymentSession;
// Vérifier le statut d'une session de paiement (alternative au webhook)
const checkPaymentStatus = async (req, res) => {
    try {
        const { sessionId, orderId } = req.query;
        if (!sessionId || !orderId) {
            return res.status(400).json({ error: 'Session ID et Order ID requis' });
        }
        // Récupérer la session Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            // Récupérer la commande avec toutes les données
            const order = await database_1.prisma.order.findUnique({
                where: { id: orderId },
                include: { user: true }
            });
            if (!order) {
                return res.status(404).json({ error: 'Commande non trouvée' });
            }
            // Vérifier si les emails ont déjà été envoyés pour éviter les doublons
            if (order.status === 'PAID' && order.paidAt) {
                console.log(`⚠️ Commande ${orderId} déjà payée et emails déjà envoyés, pas de nouvel envoi`);
                return res.json({
                    success: true,
                    status: 'paid',
                    message: 'Paiement déjà confirmé'
                });
            }
            // Mettre à jour le statut de la commande
            const updatedOrder = await database_1.prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'PAID',
                    paidAt: new Date()
                },
                include: { user: true }
            });
            // Préparer les données du formulaire pour l'email
            const formData = {
                userEmail: order.user?.email || '',
                productType: order.productType.toLowerCase(),
                shippingAddress: {
                    firstName: order.shippingFirstName || '',
                    lastName: order.shippingLastName || '',
                    address: order.shippingAddress || '',
                    city: order.shippingCity || '',
                    postalCode: order.shippingPostalCode || ''
                },
                ageRange: order.ageRange,
                generalTheme: order.generalTheme,
                specificSubject: order.specificSubject,
                centralMessage: order.centralMessage,
                illustrationStyle: order.illustrationStyle,
                protagonistName: order.protagonistName,
                protagonistAge: order.protagonistAge,
                eyeColor: order.eyeColor,
                hairColor: order.hairColor,
                secondaryCharacterName: order.secondaryCharacterName,
                secondaryCharacterAge: order.secondaryCharacterAge,
                photo: order.photoUrl ? true : false
            };
            // Préparer les détails de la commande pour Mailjet avec tous les nouveaux champs
            const orderDetails = `
=== INFORMATIONS DU CONTE ===
Tranche d'âge: ${order.ageRange}
Thème général: ${order.generalTheme}${order.customTheme ? ` (Personnalisé: ${order.customTheme})` : ''}
Sujet: ${order.specificSubject}${order.customSubject ? ` (Personnalisé: ${order.customSubject})` : ''}
Message central: ${order.centralMessage}${order.customMessage ? ` (Personnalisé: ${order.customMessage})` : ''}
Style d'illustration: ${order.illustrationStyle}
${order.language ? `Langue du conte: ${order.language}` : ''}

=== INFORMATIONS DU PROTAGONISTE ===
Nom: ${order.protagonistName}
Âge: ${order.protagonistAge || 'Non spécifié'}
${order.protagonistGender ? `Sexe: ${order.protagonistGender === 'boy' ? 'Garçon' : 'Fille'}` : ''}
Couleur des yeux: ${order.eyeColor || 'Non spécifié'}
Couleur des cheveux: ${order.hairColor || 'Non spécifié'}
${order.hobbies ? `Loisirs: ${order.hobbies}` : ''}
${order.favoriteDish ? `Plat préféré: ${order.favoriteDish}` : ''}
${order.specialEvents ? `Événements spéciaux: ${order.specialEvents}` : ''}
${order.religion ? `Religion: ${order.religion}${order.customReligion ? ` (${order.customReligion})` : ''}` : ''}

=== PERSONNAGE SECONDAIRE ===
${order.secondaryCharacterName ? `Nom: ${order.secondaryCharacterName}` : 'Aucun'}
${order.secondaryCharacterAge ? `Âge/Type: ${order.secondaryCharacterAge}` : ''}

=== DÉTAILS PERSONNELS ===
${order.creatorName ? `Créateur: ${order.creatorName}` : 'Non spécifié'}

=== COMMANDE ===
Type de produit: ${order.productType}
Prix: ${order.price}€
${order.shippingAddress ? `
Adresse de livraison:
${order.shippingFirstName} ${order.shippingLastName}
${order.shippingAddress}
${order.shippingPostalCode} ${order.shippingCity}
` : ''}`;
            // Envoyer les emails via Mailjet (une seule fois)
            console.log(`📧 Envoi des emails pour la commande ${orderId} (première fois)`);
            try {
                // Email de confirmation au client
                if (order.user?.email) {
                    await mailjetService_1.MailjetService.sendOrderConfirmation({
                        customerName: order.shippingFirstName || 'Client',
                        customerEmail: order.user.email,
                        orderNumber: order.id.slice(-8),
                        orderDetails: orderDetails
                    });
                    console.log(`✅ Email client envoyé à ${order.user.email}`);
                }
                // Email de notification à l'admin
                await mailjetService_1.MailjetService.sendAdminNotification({
                    customerName: order.shippingFirstName || 'Client',
                    customerEmail: order.user?.email || 'Email non fourni',
                    orderNumber: order.id.slice(-8),
                    orderDetails: orderDetails
                });
                console.log(`✅ Email admin envoyé`);
                // Envoyer SMS de notification via Twilio
                const { TwilioService } = await Promise.resolve().then(() => __importStar(require('../utils/twilioService')));
                await TwilioService.sendOrderNotificationSMS({
                    orderNumber: order.id.slice(-8),
                    productType: order.productType,
                    price: Number(order.price),
                    customerName: order.shippingFirstName || 'Client'
                });
                console.log(`✅ SMS de notification envoyé`);
            }
            catch (emailError) {
                console.error('❌ Erreur envoi emails/SMS:', emailError);
                // Ne pas faire échouer le paiement si l'email/SMS échoue
            }
            console.log(`✅ Paiement confirmé et emails envoyés pour la commande ${orderId}`);
            res.json({
                success: true,
                status: 'paid',
                message: 'Paiement confirmé et emails envoyés'
            });
        }
        else {
            res.json({
                success: false,
                status: session.payment_status,
                message: 'Paiement non confirmé'
            });
        }
    }
    catch (error) {
        console.error('Erreur vérification paiement:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification du paiement' });
    }
};
exports.checkPaymentStatus = checkPaymentStatus;
// Webhook Stripe (commenté pour l'instant - sera réactivé plus tard)
/*
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Erreur webhook signature:', err.message);
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  // Traiter l'événement
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handlePaymentSuccess(session);
      break;
    
    case 'checkout.session.expired':
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      await handlePaymentExpired(expiredSession);
      break;

    default:
      console.log(`Événement Stripe non géré: ${event.type}`);
  }

  res.json({ received: true });
};
*/
//# sourceMappingURL=stripeController.js.map