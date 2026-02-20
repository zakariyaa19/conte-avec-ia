import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../utils/database';
import { MailjetService } from '../utils/mailjetService';
import { ClientAuthRequest } from '../middleware/clientAuth';
import { buildOrderDetailsString } from '../utils/orderFormatter';
import { ClubService } from '../utils/clubService';

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
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvee' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Conte personnalise - ${order.productType === 'EBOOK' ? 'eBook Numerique' : 'Livre Relie Premium'}`,
              description: `Conte pour ${order.protagonistName}`,
            },
            unit_amount: Math.round(Number(order.price) * 100),
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
    console.error('Erreur creation session Stripe:', error instanceof Error ? error.message : error);
    res.status(500).json({
      error: 'Erreur lors de la creation de la session de paiement'
    });
  }
};

// Creer une session d'abonnement Club
export const createSubscriptionSession = async (req: ClientAuthRequest, res: Response) => {
  try {
    const userId = req.clientUser?.id;
    const { orderId } = req.body;

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

    const priceId = process.env.STRIPE_CLUB_PRICE_ID;
    if (!priceId) {
      return res.status(500).json({ error: 'STRIPE_CLUB_PRICE_ID non configure' });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL}/create-story?subscription=cancelled`,
      metadata: {
        userId: user.id,
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

// Finalise les commandes CLUB en attente pour un utilisateur qui vient d'etre active
async function finalizePendingClubOrders(userId: string) {
  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        userId,
        purchaseType: 'CLUB',
        status: 'PENDING',
      },
      include: { user: true }
    });

    for (const order of pendingOrders) {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paidAt: new Date(), price: 0 },
        include: { user: true }
      });
      console.log('[POLLING] Commande CLUB finalisee:', order.id, 'prix=0');

      await ClubService.recordSubmission(userId);

      try {
        const orderDetails = buildOrderDetailsString(updatedOrder);
        const customerEmail = order.user?.email;
        const customerName = order.shippingFirstName || 'Client';

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
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'Pas de compte Stripe associe' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur portail client:', error);
    res.status(500).json({ error: 'Erreur lors de la creation du portail' });
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
        include: { user: true }
      });

      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvee' });
      }

      // Eviter les doublons : si deja PAID, renvoyer succes sans re-envoyer les notifs
      if (order.status === 'PAID' && order.paidAt) {
        return res.json({
          success: true,
          status: 'paid',
          message: 'Paiement deja confirme',
          order: {
            id: order.id,
            productType: order.productType,
            purchaseType: order.purchaseType
          }
        });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId as string },
        data: {
          status: 'PAID',
          paidAt: new Date()
        },
        include: { user: true }
      });

      // Preparer les details pour email
      const orderDetails = buildOrderDetailsString(order);

      const customerEmail = order.user?.email || session.customer_details?.email || session.customer_email;

      try {
        if (customerEmail) {
          await MailjetService.sendOrderConfirmation({
            customerName: order.shippingFirstName || 'Client',
            customerEmail: customerEmail,
            orderNumber: order.id.slice(-8),
            orderDetails: orderDetails
          });
        }

        await MailjetService.sendAdminNotification({
          customerName: order.shippingFirstName || 'Client',
          customerEmail: customerEmail || 'Email non fourni',
          orderNumber: order.id.slice(-8),
          orderDetails: orderDetails
        });

        const { TelegramService } = await import('../utils/telegramService');
        await TelegramService.sendOrderNotification({
          customerName: order.shippingFirstName || 'Client',
          customerEmail: customerEmail || 'Email non fourni',
          orderNumber: order.id.slice(-8),
          amount: Number(order.price),
          orderDate: new Date(),
          productType: order.productType,
          purchaseType: order.purchaseType || 'SINGLE',
          orderDetails: updatedOrder
        });
      } catch (emailError) {
        console.error('Erreur envoi emails/Telegram:', emailError);
      }

      res.json({
        success: true,
        status: 'paid',
        message: 'Paiement confirme et emails envoyes',
        order: {
          id: updatedOrder.id,
          productType: updatedOrder.productType,
          purchaseType: updatedOrder.purchaseType
        }
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
                const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
                if (order && order.status !== 'PAID') {
                  const updatedOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'PAID', paidAt: new Date(), price: 0, purchaseType: 'CLUB' },
                    include: { user: true }
                  });
                  console.log('[WEBHOOK] Commande finalisee via subscription:', orderId, 'prix=0');

                  // Enregistrer la soumission Club (decremente le credit hebdomadaire)
                  await ClubService.recordSubmission(userId);

                  // Envoyer notifications
                  try {
                    const orderDetails = buildOrderDetailsString(updatedOrder);
                    const customerEmail = updatedUser.email;
                    const customerName = order.shippingFirstName || 'Client';

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
                }
              } catch (orderError) {
                console.error('[WEBHOOK] Erreur finalisation commande:', orderError);
              }
            }
          }
        } else if (session.mode === 'payment') {
          // Achat unique (eBook ou livre relie)
          const orderId = session.metadata?.orderId;
          if (orderId) {
            const order = await prisma.order.findUnique({
              where: { id: orderId },
              include: { user: true }
            });

            if (order && order.status !== 'PAID') {
              const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: { status: 'PAID', paidAt: new Date() },
                include: { user: true }
              });
              console.log('[WEBHOOK] Commande paiement unique confirmee:', orderId);

              // Envoyer notifications (emails + Telegram)
              try {
                const orderDetails = buildOrderDetailsString(updatedOrder);
                const customerEmail = order.user?.email || session.customer_details?.email || session.customer_email;
                const customerName = order.shippingFirstName || 'Client';

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
