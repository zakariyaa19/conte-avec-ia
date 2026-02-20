import express from 'express';
import { createPaymentSession, checkPaymentStatus, handleStripeWebhook, createSubscriptionSession, createCustomerPortal, checkSubscriptionStatus } from '../controllers/stripeController';
import { authenticateClient } from '../middleware/clientAuth';

const router = express.Router();

// Webhook Stripe (doit etre AVANT express.json())
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware pour parser le JSON sur les autres routes Stripe
router.use(express.json());

// Routes publiques
router.post('/create-payment-session', createPaymentSession);
router.get('/check-payment-status', checkPaymentStatus);

// Routes protegees (necessite authentification client)
router.post('/create-subscription-session', authenticateClient, createSubscriptionSession);
router.post('/create-customer-portal', authenticateClient, createCustomerPortal);
router.get('/check-subscription-status', authenticateClient, checkSubscriptionStatus);

export default router;
