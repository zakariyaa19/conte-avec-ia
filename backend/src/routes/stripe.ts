import express from 'express';
import { createPaymentSession, createCompletionSession, checkPaymentStatus, handleStripeWebhook, createSubscriptionSession, createCustomerPortal, checkSubscriptionStatus, applyRetentionDiscount } from '../controllers/stripeController';
import { authenticateClient } from '../middleware/clientAuth';

const router = express.Router();

// Webhook Stripe (doit etre AVANT express.json())
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware pour parser le JSON sur les autres routes Stripe
router.use(express.json());

// Routes publiques
router.post('/create-payment-session', createPaymentSession);
router.post('/create-completion-session', createCompletionSession);
router.get('/check-payment-status', checkPaymentStatus);

// Routes protegees (necessite authentification client)
router.post('/create-subscription-session', authenticateClient, createSubscriptionSession);
router.post('/create-customer-portal', authenticateClient, createCustomerPortal);
router.post('/apply-retention-discount', authenticateClient, applyRetentionDiscount);
router.get('/check-subscription-status', authenticateClient, checkSubscriptionStatus);

// Diagnostic — retourne les infos Stripe de l'utilisateur (temporaire)
router.get('/debug-user', authenticateClient, async (req: any, res: any) => {
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const { prisma } = await import('../utils/database');
    const user = await prisma.user.findUnique({ where: { id: req.clientUser.id } });
    if (!user) return res.json({ error: 'user not found' });

    const keyPrefix = (process.env.STRIPE_SECRET_KEY || '').substring(0, 8);
    let stripeCustomerCheck = 'not tested';
    let stripeSubCheck = 'not tested';
    let portalCheck = 'not tested';

    // Test 1: retrieve customer
    if (user.stripeCustomerId) {
      try {
        const cust = await stripe.customers.retrieve(user.stripeCustomerId);
        stripeCustomerCheck = `OK - ${(cust as any).email}`;
      } catch (e: any) {
        stripeCustomerCheck = `FAIL - ${e.message}`;
      }
    }

    // Test 2: retrieve subscription
    if (user.subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(user.subscriptionId);
        stripeSubCheck = `OK - status: ${sub.status}`;
      } catch (e: any) {
        stripeSubCheck = `FAIL - ${e.message}`;
      }
    }

    // Test 3: create portal session
    if (user.stripeCustomerId) {
      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: `${process.env.FRONTEND_URL || 'https://contedia.fr'}/dashboard/account`
        });
        portalCheck = `OK - ${session.url?.substring(0, 50)}...`;
      } catch (e: any) {
        portalCheck = `FAIL - ${e.message}`;
      }
    }

    res.json({
      db: {
        email: user.email,
        role: user.role,
        stripeCustomerId: user.stripeCustomerId || 'NULL',
        subscriptionId: user.subscriptionId || 'NULL',
        subscriptionStatus: user.subscriptionStatus || 'NULL',
      },
      stripeKeyPrefix: keyPrefix + '...',
      stripeCustomerCheck,
      stripeSubCheck,
      portalCheck,
      frontendUrl: process.env.FRONTEND_URL || 'NOT SET',
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
