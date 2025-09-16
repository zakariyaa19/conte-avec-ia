"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../utils/database");
const pricing_1 = require("../utils/pricing");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
class PaymentController {
    // Créer un Payment Intent Stripe
    static async createPaymentIntent(req, res) {
        try {
            const { orderId } = req.body;
            // Récupérer la commande
            const order = await database_1.prisma.order.findUnique({
                where: { id: orderId }
            });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Commande non trouvée'
                });
            }
            if (order.status !== 'PENDING') {
                return res.status(400).json({
                    success: false,
                    message: 'Cette commande ne peut plus être payée'
                });
            }
            // Créer le Payment Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: (0, pricing_1.convertToStripeAmount)(Number(order.price)),
                currency: 'eur',
                metadata: {
                    orderId: order.id,
                    productType: order.productType
                },
                automatic_payment_methods: {
                    enabled: true
                }
            });
            // Sauvegarder l'ID du Payment Intent
            await database_1.prisma.order.update({
                where: { id: orderId },
                data: { stripePaymentIntentId: paymentIntent.id }
            });
            res.json({
                success: true,
                data: {
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id
                }
            });
        }
        catch (error) {
            console.error('Erreur création Payment Intent:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du paiement'
            });
        }
    }
    // Webhook Stripe pour confirmer les paiements
    static async handleWebhook(req, res) {
        try {
            const sig = req.headers['stripe-signature'];
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            }
            catch (err) {
                console.error('Erreur signature webhook:', err.message);
                return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
            }
            // Traiter les événements Stripe
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await PaymentController.handlePaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await PaymentController.handlePaymentFailed(event.data.object);
                    break;
                default:
                    console.log(`Événement non géré: ${event.type}`);
            }
            res.json({ received: true });
        }
        catch (error) {
            console.error('Erreur webhook:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du traitement du webhook'
            });
        }
    }
    // Traiter un paiement réussi
    static async handlePaymentSuccess(paymentIntent) {
        try {
            const orderId = paymentIntent.metadata.orderId;
            if (!orderId) {
                console.error('Order ID manquant dans les métadonnées du Payment Intent');
                return;
            }
            // Mettre à jour la commande
            await database_1.prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'PAID',
                    paidAt: new Date()
                }
            });
            console.log(`✅ Paiement confirmé pour la commande ${orderId}`);
            // TODO: Déclencher la génération du conte
            // TODO: Envoyer l'email de confirmation
        }
        catch (error) {
            console.error('Erreur traitement paiement réussi:', error);
        }
    }
    // Traiter un paiement échoué
    static async handlePaymentFailed(paymentIntent) {
        try {
            const orderId = paymentIntent.metadata.orderId;
            if (!orderId) {
                console.error('Order ID manquant dans les métadonnées du Payment Intent');
                return;
            }
            console.log(`❌ Paiement échoué pour la commande ${orderId}`);
            // TODO: Envoyer un email de notification d'échec
        }
        catch (error) {
            console.error('Erreur traitement paiement échoué:', error);
        }
    }
    // Vérifier le statut d'un paiement
    static async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;
            const order = await database_1.prisma.order.findUnique({
                where: { id: orderId },
                select: {
                    id: true,
                    status: true,
                    stripePaymentIntentId: true,
                    paidAt: true,
                    price: true
                }
            });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Commande non trouvée'
                });
            }
            res.json({
                success: true,
                data: {
                    orderId: order.id,
                    status: order.status,
                    isPaid: order.status === 'PAID',
                    paidAt: order.paidAt,
                    amount: order.price
                }
            });
        }
        catch (error) {
            console.error('Erreur vérification statut paiement:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la vérification du statut'
            });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map