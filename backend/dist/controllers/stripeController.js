"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatus = exports.createPaymentSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../utils/database");
const emailService_1 = require("../utils/emailService");
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
                            name: `Conte personnalisé - ${order.productType === 'EBOOK' ? 'eBook' : order.productType === 'PRINTED' ? 'Livre relié' : 'Pack famille'}`,
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
                    postalCode: order.shippingPostalCode || '',
                    country: order.shippingCountry || 'France'
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
            // Envoyer l'email de notification à l'admin
            await emailService_1.EmailService.sendOrderNotificationToAdmin(updatedOrder, formData);
            // Envoyer l'email de confirmation au client
            await emailService_1.EmailService.sendOrderConfirmation(updatedOrder);
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