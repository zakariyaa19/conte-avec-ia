import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../utils/database';
import { MailjetService } from '../utils/mailjetService';
import { ClientAuthRequest } from '../middleware/clientAuth';
import { buildOrderDetailsString } from '../utils/orderFormatter';
import { ClubService } from '../utils/clubService';
import { generateClientToken } from './authController';

// Ordre de progression des statuts — un statut ne peut JAMAIS reculer
const STATUS_ORDER = ['PENDING', 'PAID', 'GENERATING', 'GENERATED', 'DELIVERED'] as const;

function isStatusRegression(currentStatus: string, newStatus: string): boolean {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus as any);
  const newIndex = STATUS_ORDER.indexOf(newStatus as any);
  // Si le statut actuel est inconnu, on autorise (sécurité)
  if (currentIndex === -1) return false;
  // Régression = le nouveau statut est inférieur ou égal au statut actuel
  return newIndex <= currentIndex;
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});

// Extraire current_period_end d'une subscription Stripe
// Dans les versions recentes de l'API Stripe, ce champ est au niveau des items
function getSubscriptionPeriodEnd(sub: any): Date {
  const periodEnd = sub.current_period_end
    || sub.items?.data?.[0]?.current_period_end;
  if (periodEnd) {
    return new Date(periodEnd * 1000);
  }
  // Fallback: 30 jours a partir de maintenant
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

// Creer une session de paiement Stripe (achat unique)
export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      omit: { coverImageData: true, pdfData: true },
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvee' });
    }

    const unitAmount = Math.round(Number(order.price) * 100);
    console.log('[Stripe] createPaymentSession — orderId:', orderId, 'price:', order.price, 'unitAmount:', unitAmount, 'email:', order.user?.email);

    if (!unitAmount || unitAmount <= 0) {
      return res.status(400).json({ error: 'Prix invalide pour cette commande' });
    }

    // Valider l'email avant de l'envoyer a Stripe (sinon Stripe rejette la session)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customerEmail = order.user?.email && emailRegex.test(order.user.email)
      ? order.user.email
      : undefined;

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Conte personnalise - eBook Numerique',
              description: `Conte pour ${order.protagonistName}`,
            },
            unit_amount: unitAmount,
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

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PENDING' }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur creation session Stripe:', error);
    res.status(500).json({
      error: 'Erreur lors de la creation de la session de paiement'
    });
  }
};

// Creer une session d'abonnement Club
export const createSubscriptionSession = async (req: ClientAuthRequest, res: Response) => {
  try {
    const userId = req.clientUser?.id;
    const { orderId, plan } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    // Creer ou recuperer le Stripe Customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId }
      });
    }

    // Selectionner le bon Price ID selon le plan (monthly/annual)
    let priceId: string | undefined;
    if (plan === 'annual') {
      priceId = process.env.STRIPE_CLUB_ANNUAL_PRICE_ID;
    } else {
      priceId = process.env.STRIPE_CLUB_MONTHLY_PRICE_ID || process.env.STRIPE_CLUB_PRICE_ID;
    }
    if (!priceId) {
      return res.status(500).json({ error: 'Stripe Price ID non configure pour ce plan' });
    }

    // Appliquer le coupon "1er mois à 1,99€" pour les nouveaux abonnés mensuels
    const firstMonthCouponId = process.env.STRIPE_FIRST_MONTH_COUPON_ID;
    const isNewSubscriber = !user.subscriptionId && !user.subscriptionStatus;
    const applyFirstMonthDiscount = plan !== 'annual' && isNewSubscriber && firstMonthCouponId;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      ...(applyFirstMonthDiscount && {
        discounts: [{ coupon: firstMonthCouponId }],
      }),
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?type=subscription`,
      metadata: {
        userId: user.id,
        plan: plan || 'monthly',
        ...(orderId && { orderId })
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur creation session abonnement:', error instanceof Error ? error.message : error);
    res.status(500).json({
      error: 'Erreur lors de la creation de la session d\'abonnement'
    });
  }
};

// Appliquer la reduction de retention (-70% sur la prochaine facture)
export const applyRetentionDiscount = async (req: ClientAuthRequest, res: Response) => {
  try {
    const userId = req.clientUser?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const couponId = process.env.STRIPE_RETENTION_COUPON_ID;
    if (!couponId) {
      return res.status(500).json({ success: false, message: 'Coupon de retention non configure' });
    }

    // Trouver la subscription active — soit par subscriptionId en BDD, soit via le customer Stripe
    let subscriptionId = user.subscriptionId;

    if (!subscriptionId && user.stripeCustomerId) {
      // Chercher la subscription active du customer
      const subs = await stripe.subscriptions.list({ customer: user.stripeCustomerId, status: 'active', limit: 1 });
      if (subs.data.length > 0) {
        subscriptionId = subs.data[0].id;
        await prisma.user.update({ where: { id: userId }, data: { subscriptionId } });
        console.log(`[Retention] subscriptionId retrouvé: ${subscriptionId}`);
      }
    }

    // Si toujours pas de subscription, chercher le customer par email
    if (!subscriptionId && user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        const custId = customers.data[0].id;
        if (custId !== user.stripeCustomerId) {
          await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: custId } });
        }
        const subs = await stripe.subscriptions.list({ customer: custId, status: 'active', limit: 1 });
        if (subs.data.length > 0) {
          subscriptionId = subs.data[0].id;
          await prisma.user.update({ where: { id: userId }, data: { subscriptionId } });
          console.log(`[Retention] subscriptionId retrouvé via email: ${subscriptionId}`);
        }
      }
    }

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Aucun abonnement actif trouvé' });
    }

    // Check if coupon already applied (prevent double application)
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.discounts && subscription.discounts.length > 0) {
      return res.json({ success: true, message: 'Une reduction est deja active sur votre abonnement !' });
    }

    // Apply the coupon to the subscription (next invoice only)
    await stripe.subscriptions.update(subscriptionId, {
      discounts: [{ coupon: couponId }],
    });

    console.log(`[Stripe] Retention discount applied for user ${user.email} on subscription ${subscriptionId}`);

    res.json({ success: true, message: 'Reduction de 70% appliquee sur votre prochaine facture !' });
  } catch (error: any) {
    const msg = error?.raw?.message || error?.message || 'Erreur inconnue';
    console.error('Erreur application reduction retention:', msg);
    res.status(500).json({ success: false, message: `Erreur: ${msg}` });
  }
};

// Finalise les commandes CLUB en attente pour un utilisateur qui vient d'etre active
async function finalizePendingClubOrders(userId: string) {
  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        userId,
        purchaseType: 'CLUB',
        status: 'PENDING',
      },
      omit: { coverImageData: true, pdfData: true },
      include: { user: true }
    });

    for (const order of pendingOrders) {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paidAt: new Date(), price: 0 },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });
      console.log('[POLLING] Commande CLUB finalisee:', order.id, 'prix=0');

      await ClubService.recordSubmission(userId);

      try {
        const orderDetails = buildOrderDetailsString(updatedOrder);
        const customerEmail = order.user?.email;
        const customerName = order.user?.firstName || order.creatorName || 'Client';

        if (customerEmail) {
          await MailjetService.sendOrderConfirmation({
            customerName,
            customerEmail,
            orderNumber: order.id.slice(-8),
            orderDetails
          });
        }
        await MailjetService.sendAdminNotification({
          customerName,
          customerEmail: customerEmail || 'Email non fourni',
          orderNumber: order.id.slice(-8),
          orderDetails
        });
        const { TelegramService } = await import('../utils/telegramService');
        await TelegramService.sendOrderNotification({
          customerName,
          customerEmail: customerEmail || 'Email non fourni',
          orderNumber: order.id.slice(-8),
          amount: 0,
          orderDate: new Date(),
          productType: order.productType,
          purchaseType: 'CLUB',
          orderDetails: updatedOrder
        });
      } catch (notifError) {
        console.error('[POLLING] Erreur envoi notifications:', notifError);
      }

      // Auto-generate story (fire-and-forget)
      try {
        const { autoGenerateAndDeliver } = await import('./storyGenerationController');
        autoGenerateAndDeliver(order.id).catch(err =>
          console.error('[POLLING] autoGenerateAndDeliver error (non-blocking):', err)
        );
      } catch (genErr) {
        console.error('[POLLING] Failed to import autoGenerateAndDeliver:', genErr);
      }
    }
  } catch (error) {
    console.error('[POLLING] Erreur finalisation commandes CLUB:', error);
  }
}

// Verifier le statut d'une session de subscription (polling apres checkout)
export const checkSubscriptionStatus = async (req: ClientAuthRequest, res: Response) => {
  try {
    const userId = req.clientUser?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    console.log('[POLLING] checkSubscriptionStatus pour user:', user.id, 'role:', user.role, 'subStatus:', user.subscriptionStatus);

    // Si le webhook a deja mis a jour le role, on retourne directement
    if (user.role === 'CLUB' && user.subscriptionStatus === 'active') {
      // Finaliser les commandes CLUB en attente (le webhook a peut-etre deja fait, mais on securise)
      await finalizePendingClubOrders(userId);

      return res.json({
        success: true,
        status: 'active',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPeriodEnd: user.subscriptionPeriodEnd,
          weeklySubmissionCount: user.weeklySubmissionCount,
          weeklySubmissionReset: user.weeklySubmissionReset
        }
      });
    }

    // Sinon, verifier directement chez Stripe via le customer ID
    if (!user.stripeCustomerId) {
      console.log('[POLLING] Pas de stripeCustomerId pour user:', user.id);
      return res.json({ success: false, status: 'no_customer' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];
      console.log('[POLLING] Subscription Stripe trouvee:', sub.id, 'status:', sub.status, '- Activation CLUB pour user:', user.id);

      // Mettre a jour la BDD (le webhook n'est pas encore arrive)
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'CLUB',
          subscriptionId: sub.id,
          subscriptionStatus: sub.status,
          subscriptionPeriodEnd: getSubscriptionPeriodEnd(sub),
          stripeCustomerId: user.stripeCustomerId,
          // Initialiser le compteur de credits si pas encore fait
          ...(user.weeklySubmissionReset ? {} : { weeklySubmissionReset: new Date(), weeklySubmissionCount: 0 })
        }
      });

      // Finaliser les commandes CLUB en attente
      await finalizePendingClubOrders(userId);

      return res.json({
        success: true,
        status: 'active',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscriptionPeriodEnd: updatedUser.subscriptionPeriodEnd,
          weeklySubmissionCount: updatedUser.weeklySubmissionCount,
          weeklySubmissionReset: updatedUser.weeklySubmissionReset
        }
      });
    }

    console.log('[POLLING] Pas de subscription active trouvee chez Stripe pour customer:', user.stripeCustomerId);
    return res.json({ success: false, status: 'pending' });
  } catch (error) {
    console.error('Erreur verification subscription:', error);
    res.status(500).json({ error: 'Erreur lors de la verification de l\'abonnement' });
  }
};

// Portail client Stripe
export const createCustomerPortal = async (req: ClientAuthRequest, res: Response) => {
  try {
    const userId = req.clientUser?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentification requise' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouve' });
    }

    let customerId = user.stripeCustomerId;
    console.log(`[Portal] User ${user.email}, stripeCustomerId en BDD: ${customerId || 'AUCUN'}`);

    // Si pas de stripeCustomerId en base, chercher par email dans Stripe
    if (!customerId && user.email) {
      console.log(`[Portal] Recherche client Stripe par email: ${user.email}`);
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      console.log(`[Portal] Résultats recherche: ${customers.data.length} client(s) trouvé(s)`);
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Sauvegarder pour les prochaines fois
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId }
        });
        console.log(`[Portal] stripeCustomerId retrouve et sauvegarde: ${customerId}`);
      }
    }

    if (!customerId) {
      console.log(`[Portal] AUCUN client Stripe trouvé pour ${user.email}`);
      return res.status(400).json({ success: false, message: 'Aucun compte de paiement trouvé pour cet email.' });
    }

    console.log(`[Portal] Création session portail pour customer ${customerId}`);

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.FRONTEND_URL}/dashboard/account`
      });
      return res.json({ url: session.url });
    } catch (portalErr: any) {
      // Customer introuvable dans Stripe → chercher le bon par email
      if (portalErr?.code === 'resource_missing' && user.email) {
        console.log(`[Portal] Customer ${customerId} introuvable dans Stripe, recherche par email...`);
        const found = await stripe.customers.list({ email: user.email, limit: 1 });
        if (found.data.length > 0) {
          const realId = found.data[0].id;
          await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: realId } });
          console.log(`[Portal] Customer corrigé: ${customerId} → ${realId}`);
          const session = await stripe.billingPortal.sessions.create({
            customer: realId,
            return_url: `${process.env.FRONTEND_URL}/dashboard/account`
          });
          return res.json({ url: session.url });
        }
      }
      throw portalErr;
    }
  } catch (error: any) {
    const stripeMsg = error?.raw?.message || error?.message || 'Erreur inconnue';
    console.error('Erreur portail client:', stripeMsg, error?.statusCode, error?.type);
    res.status(500).json({ success: false, message: `Erreur portail: ${stripeMsg}` });
  }
};

// Verifier le statut d'une session de paiement (alternative au webhook)
export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId, orderId } = req.query;

    if (!sessionId || !orderId) {
      return res.status(400).json({ error: 'Session ID et Order ID requis' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId as string);

    // Verifier que l'orderId correspond bien a la session Stripe
    if (session.metadata?.orderId !== orderId) {
      return res.status(403).json({ error: 'Session et commande ne correspondent pas' });
    }

    if (session.payment_status === 'paid') {
      const order = await prisma.order.findUnique({
        where: { id: orderId as string },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });

      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvee' });
      }

      // Generate auth token so user is auto-logged in on success page
      // (token may have been lost during Stripe redirect, especially in WebView)
      let authToken: string | undefined;
      let userData: any = undefined;
      if (order.user) {
        authToken = generateClientToken(order.user);
        userData = {
          id: order.user.id,
          email: order.user.email,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          role: order.user.role
        };
      }

      // Si la commande a deja ete traitee (PAID, GENERATING, GENERATED, DELIVERED),
      // ne JAMAIS ecraser le statut — juste confirmer au frontend
      if (order.paidAt || ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'].includes(order.status)) {
        return res.json({
          success: true,
          status: 'paid',
          message: 'Paiement deja confirme',
          order: {
            id: order.id,
            productType: order.productType,
            purchaseType: order.purchaseType
          },
          token: authToken,
          user: userData
        });
      }

      // Premiere confirmation : mettre a jour le statut en PAID
      await prisma.order.update({
        where: { id: orderId as string },
        data: {
          status: 'PAID',
          paidAt: new Date()
        },
      });

      console.log('[checkPaymentStatus] Commande confirmee:', orderId);

      // Auto-generate story (fire-and-forget)
      try {
        const { autoGenerateAndDeliver } = await import('./storyGenerationController');
        autoGenerateAndDeliver(orderId as string).catch(err =>
          console.error('[checkPaymentStatus] autoGenerateAndDeliver error (non-blocking):', err)
        );
      } catch (genErr) {
        console.error('[checkPaymentStatus] Failed to import autoGenerateAndDeliver:', genErr);
      }

      res.json({
        success: true,
        status: 'paid',
        message: 'Paiement confirme',
        order: {
          id: order.id,
          productType: order.productType,
          purchaseType: order.purchaseType
        },
        token: authToken,
        user: userData
      });
    } else {
      res.json({
        success: false,
        status: session.payment_status,
        message: 'Paiement non confirme'
      });
    }
  } catch (error) {
    console.error('Erreur verification paiement:', error);
    res.status(500).json({ error: 'Erreur lors de la verification du paiement' });
  }
};

// Webhook Stripe
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('[WEBHOOK] Erreur signature:', err.message);
    return res.status(400).send('Webhook signature verification failed');
  }

  console.log('[WEBHOOK] Evenement recu:', event.type, 'id:', event.id);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[WEBHOOK] checkout.session.completed — mode:', session.mode);

        if (session.mode === 'subscription') {
          // Abonnement Club cree
          const userId = session.metadata?.userId;
          const orderId = session.metadata?.orderId;
          if (userId) {
            const subResponse = await stripe.subscriptions.retrieve(session.subscription as string);
            const sub = subResponse as unknown as Stripe.Subscription;
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                role: 'CLUB',
                subscriptionId: sub.id,
                subscriptionStatus: sub.status,
                subscriptionPeriodEnd: getSubscriptionPeriodEnd(sub),
                stripeCustomerId: session.customer as string,
                // Initialiser le compteur de credits si pas encore fait
                ...(existingUser?.weeklySubmissionReset ? {} : { weeklySubmissionReset: new Date(), weeklySubmissionCount: 0 })
              }
            });
            console.log('[WEBHOOK] User mis a jour en CLUB:', updatedUser.id, 'role:', updatedUser.role);

            // Finaliser la commande liee a la souscription (eBook inclus dans l'abonnement)
            if (orderId) {
              try {
                const order = await prisma.order.findUnique({ where: { id: orderId }, omit: { coverImageData: true, pdfData: true }, include: { user: true } });
                if (order && !order.paidAt && !isStatusRegression(order.status, 'PAID')) {
                  const updatedOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'PAID', paidAt: new Date(), price: 0, purchaseType: 'CLUB' },
                    omit: { coverImageData: true, pdfData: true },
                    include: { user: true }
                  });
                  console.log('[WEBHOOK] Commande finalisee via subscription:', orderId, 'prix=0');

                  // Enregistrer la soumission Club (decremente le credit hebdomadaire)
                  await ClubService.recordSubmission(userId);

                  // Envoyer notifications
                  try {
                    const orderDetails = buildOrderDetailsString(updatedOrder);
                    const customerEmail = updatedUser.email;
                    const customerName = order.user?.firstName || order.creatorName || 'Client';

                    if (customerEmail) {
                      await MailjetService.sendOrderConfirmation({
                        customerName,
                        customerEmail,
                        orderNumber: order.id.slice(-8),
                        orderDetails
                      });
                    }
                    await MailjetService.sendAdminNotification({
                      customerName,
                      customerEmail: customerEmail || 'Email non fourni',
                      orderNumber: order.id.slice(-8),
                      orderDetails
                    });
                    const { TelegramService } = await import('../utils/telegramService');
                    await TelegramService.sendOrderNotification({
                      customerName,
                      customerEmail: customerEmail || 'Email non fourni',
                      orderNumber: order.id.slice(-8),
                      amount: 0,
                      orderDate: new Date(),
                      productType: order.productType,
                      purchaseType: 'CLUB',
                      orderDetails: updatedOrder
                    });
                  } catch (notifError) {
                    console.error('[WEBHOOK] Erreur envoi notifications commande Club:', notifError);
                  }

                  // Auto-generate story (fire-and-forget)
                  try {
                    const { autoGenerateAndDeliver } = await import('./storyGenerationController');
                    autoGenerateAndDeliver(orderId).catch(err =>
                      console.error('[WEBHOOK] autoGenerateAndDeliver Club error (non-blocking):', err)
                    );
                  } catch (genErr) {
                    console.error('[WEBHOOK] Failed to import autoGenerateAndDeliver:', genErr);
                  }
                }
              } catch (orderError) {
                console.error('[WEBHOOK] Erreur finalisation commande:', orderError);
              }
            }
          }
        } else if (session.mode === 'payment') {
          // Achat unique eBook
          const orderId = session.metadata?.orderId;
          if (orderId) {
            const order = await prisma.order.findUnique({
              where: { id: orderId },
              omit: { coverImageData: true, pdfData: true },
              include: { user: true }
            });

            if (order && !order.paidAt && !isStatusRegression(order.status, 'PAID')) {
              const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: { status: 'PAID', paidAt: new Date() },
                omit: { coverImageData: true, pdfData: true },
                include: { user: true }
              });
              console.log('[WEBHOOK] Commande paiement unique confirmee:', orderId);

              // Envoyer notifications (emails + Telegram)
              try {
                const orderDetails = buildOrderDetailsString(updatedOrder);
                const customerEmail = order.user?.email || session.customer_details?.email || session.customer_email;
                const customerName = order.user?.firstName || order.creatorName || 'Client';

                if (customerEmail) {
                  await MailjetService.sendOrderConfirmation({
                    customerName,
                    customerEmail,
                    orderNumber: order.id.slice(-8),
                    orderDetails
                  });
                }
                await MailjetService.sendAdminNotification({
                  customerName,
                  customerEmail: customerEmail || 'Email non fourni',
                  orderNumber: order.id.slice(-8),
                  orderDetails
                });
                const { TelegramService } = await import('../utils/telegramService');
                await TelegramService.sendOrderNotification({
                  customerName,
                  customerEmail: customerEmail || 'Email non fourni',
                  orderNumber: order.id.slice(-8),
                  amount: Number(order.price),
                  orderDate: new Date(),
                  productType: order.productType,
                  purchaseType: order.purchaseType || 'SINGLE',
                  orderDetails: updatedOrder
                });
                console.log('[WEBHOOK] Notifications envoyees pour commande:', orderId);
              } catch (notifError) {
                console.error('[WEBHOOK] Erreur envoi notifications paiement unique:', notifError);
              }

              // Auto-generate story (fire-and-forget)
              try {
                const { autoGenerateAndDeliver } = await import('./storyGenerationController');
                autoGenerateAndDeliver(orderId).catch(err =>
                  console.error('[WEBHOOK] autoGenerateAndDeliver error (non-blocking):', err)
                );
              } catch (genErr) {
                console.error('[WEBHOOK] Failed to import autoGenerateAndDeliver:', genErr);
              }
            } else if (order) {
              console.log('[WEBHOOK] Commande deja traitee, skip:', orderId);
            }
          }
        }
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        console.log(`[WEBHOOK] ${event.type} — subscriptionId:`, subscriptionId);
        if (subscriptionId) {
          const subRes = await stripe.subscriptions.retrieve(subscriptionId);
          const subObj = subRes as any;
          const user = await prisma.user.findFirst({
            where: { subscriptionId }
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: subObj.status,
                subscriptionPeriodEnd: getSubscriptionPeriodEnd(subObj)
              }
            });
            console.log(`[WEBHOOK] ${event.type} — User updated:`, user.id);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as any;
        const failedSubId = failedInvoice.subscription as string;
        if (failedSubId) {
          const user = await prisma.user.findFirst({
            where: { subscriptionId: failedSubId }
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { subscriptionStatus: 'past_due' }
            });
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const updatedSub = event.data.object as any;
        console.log('[WEBHOOK] customer.subscription.updated — subId:', updatedSub.id, 'status:', updatedSub.status, 'cancel_at_period_end:', updatedSub.cancel_at_period_end);
        const userForUpdate = await prisma.user.findFirst({
          where: { subscriptionId: updatedSub.id }
        });
        if (userForUpdate) {
          const newRole = updatedSub.status === 'active' ? 'CLUB' : 'USER';
          // Si actif mais annulé en fin de période → statut 'canceling'
          let displayStatus = updatedSub.status;
          if (updatedSub.status === 'active' && updatedSub.cancel_at_period_end) {
            displayStatus = 'canceling';
          }
          await prisma.user.update({
            where: { id: userForUpdate.id },
            data: {
              subscriptionStatus: displayStatus,
              subscriptionPeriodEnd: getSubscriptionPeriodEnd(updatedSub),
              role: newRole
            }
          });
          console.log('[WEBHOOK] subscription.updated — User:', userForUpdate.id, 'role:', newRole, 'status:', displayStatus);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as any;
        console.log('[WEBHOOK] customer.subscription.deleted — subId:', deletedSub.id);
        const userForDelete = await prisma.user.findFirst({
          where: { subscriptionId: deletedSub.id }
        });
        if (userForDelete) {
          await prisma.user.update({
            where: { id: userForDelete.id },
            data: {
              role: 'USER',
              subscriptionStatus: 'cancelled',
              subscriptionId: null,
              weeklySubmissionCount: 0,
              weeklySubmissionReset: null
            }
          });
          console.log('[WEBHOOK] subscription.deleted — User:', userForDelete.id, 'role: USER, credits reset');
        }
        break;
      }

      default:
        console.log(`Evenement Stripe non gere: ${event.type}`);
    }
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
  }

  res.json({ received: true });
};
