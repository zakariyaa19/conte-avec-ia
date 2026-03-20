import express from 'express';
import { createPaymentSession, checkPaymentStatus, handleStripeWebhook, createSubscriptionSession, createCustomerPortal, checkSubscriptionStatus, applyRetentionDiscount } from '../controllers/stripeController';
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
router.post('/apply-retention-discount', authenticateClient, applyRetentionDiscount);
router.get('/check-subscription-status', authenticateClient, checkSubscriptionStatus);

// Diagnostic — retourne les infos Stripe de l'utilisateur (temporaire)
router.get('/debug-user', authenticateClient, async (req: any, res: any) => {
  try {
    const { prisma } = await import('../utils/database');
    const user = await prisma.user.findUnique({ where: { id: req.clientUser.id } });
    if (!user) return res.json({ error: 'user not found' });
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      stripeCustomerId: user.stripeCustomerId || 'NULL',
      subscriptionId: user.subscriptionId || 'NULL',
      subscriptionStatus: user.subscriptionStatus || 'NULL',
      subscriptionPeriodEnd: user.subscriptionPeriodEnd || 'NULL',
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
