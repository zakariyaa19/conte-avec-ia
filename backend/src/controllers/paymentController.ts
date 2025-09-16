import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../utils/database';
import { convertToStripeAmount } from '../utils/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class PaymentController {
  // Créer un Payment Intent Stripe
  static async createPaymentIntent(req: Request, res: Response) {
    try {
      const { orderId } = req.body;

      // Récupérer la commande
      const order = await prisma.order.findUnique({
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
        amount: convertToStripeAmount(Number(order.price)),
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
      await prisma.order.update({
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

    } catch (error) {
      console.error('Erreur création Payment Intent:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du paiement'
      });
    }
  }

  // Webhook Stripe pour confirmer les paiements
  static async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error('Erreur signature webhook:', err.message);
        return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
      }

      // Traiter les événements Stripe
      switch (event.type) {
        case 'payment_intent.succeeded':
          await PaymentController.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await PaymentController.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        
        default:
          console.log(`Événement non géré: ${event.type}`);
      }

      res.json({ received: true });

    } catch (error) {
      console.error('Erreur webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement du webhook'
      });
    }
  }

  // Traiter un paiement réussi
  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    try {
      const orderId = paymentIntent.metadata.orderId;
      
      if (!orderId) {
        console.error('Order ID manquant dans les métadonnées du Payment Intent');
        return;
      }

      // Mettre à jour la commande
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      });

      console.log(`✅ Paiement confirmé pour la commande ${orderId}`);

      // TODO: Déclencher la génération du conte
      // TODO: Envoyer l'email de confirmation

    } catch (error) {
      console.error('Erreur traitement paiement réussi:', error);
    }
  }

  // Traiter un paiement échoué
  private static async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
      const orderId = paymentIntent.metadata.orderId;
      
      if (!orderId) {
        console.error('Order ID manquant dans les métadonnées du Payment Intent');
        return;
      }

      console.log(`❌ Paiement échoué pour la commande ${orderId}`);
      
      // TODO: Envoyer un email de notification d'échec

    } catch (error) {
      console.error('Erreur traitement paiement échoué:', error);
    }
  }

  // Vérifier le statut d'un paiement
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findUnique({
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

    } catch (error) {
      console.error('Erreur vérification statut paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du statut'
      });
    }
  }
}
