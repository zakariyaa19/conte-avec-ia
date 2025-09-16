import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = Router();

// Créer un Payment Intent
router.post('/create-intent', PaymentController.createPaymentIntent);

// Webhook Stripe (raw body nécessaire)
router.post('/webhook', PaymentController.handleWebhook);

// Vérifier le statut d'un paiement
router.get('/status/:orderId', PaymentController.getPaymentStatus);

export default router;
