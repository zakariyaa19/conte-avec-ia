import express from 'express';
import { createPaymentSession, checkPaymentStatus } from '../controllers/stripeController';

const router = express.Router();

// Middleware pour parser le JSON sur les routes Stripe (sauf webhook)
router.use(express.json());

// Route pour créer une session de paiement
router.post('/create-payment-session', createPaymentSession);

// Route pour vérifier le statut d'un paiement (alternative au webhook)
router.get('/check-payment-status', checkPaymentStatus);

// Webhook Stripe (commenté temporairement - sera réactivé avec le webhook secret)
// router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
