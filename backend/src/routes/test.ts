import { Router, Request, Response } from 'express';
import { MailjetService } from '../utils/mailjetService';
import { TelegramService } from '../utils/telegramService';
import { prisma } from '../utils/database';

const router = Router();

// Endpoint de test pour Mailjet
router.post('/mailjet', async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, orderNumber, orderDetails } = req.body;

    // Validation des données requises
    if (!customerName || !customerEmail || !orderNumber || !orderDetails) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: customerName, customerEmail, orderNumber, orderDetails requis'
      });
    }

    // Test d'envoi d'email de confirmation
    await MailjetService.sendOrderConfirmation({
      customerName,
      customerEmail,
      orderNumber,
      orderDetails
    });

    // Test d'envoi d'email admin
    await MailjetService.sendAdminNotification({
      customerName,
      customerEmail,
      orderNumber,
      orderDetails
    });

    res.json({
      success: true,
      message: 'Emails de test envoyés avec succès via Mailjet'
    });

  } catch (error) {
    console.error('❌ Erreur test Mailjet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi des emails de test',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Endpoint de test pour Telegram Bot
router.post('/telegram', async (req: Request, res: Response) => {
  try {
    await TelegramService.sendTestMessage();

    res.json({
      success: true,
      message: 'Message de test envoyé avec succès via Telegram'
    });

  } catch (error) {
    console.error('❌ Erreur test Telegram:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message de test Telegram',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Endpoint de test pour notification de commande Telegram
router.post('/telegram-order', async (req: Request, res: Response) => {
  try {
    // Données de test complètes pour simuler une vraie commande
    const testOrderData = {
      orderNumber: 'TEST123',
      productType: 'EBOOK',
      amount: 14.99,
      customerName: 'Jean Dupont',
      customerEmail: 'jean.dupont@example.com',
      orderDate: new Date(),
      orderDetails: {
        ageRange: '6-8',
        generalTheme: 'adventure',
        customTheme: null,
        specificSubject: 'fairy-tales',
        customSubject: null,
        centralMessage: 'courage',
        customMessage: null,
        illustrationStyle: 'cartoon',
        language: 'Français',
        protagonistName: 'Lucas',
        protagonistAge: '7 ans',
        protagonistGender: 'boy',
        eyeColor: 'bleus',
        hairColor: 'châtains',
        hobbies: 'football, dessin',
        favoriteDish: 'pizza',
        specialEvents: 'anniversaire en septembre',
        religion: 'Aucune',
        customReligion: null,
        secondaryCharacterName: 'Max',
        secondaryCharacterAge: 'chien golden retriever',
        creatorName: 'Papa',
        productType: 'EBOOK',
        shippingFirstName: 'Jean',
        shippingLastName: 'Dupont',
        shippingAddress: null // Pas d'adresse pour un eBook
      }
    };

    await TelegramService.sendOrderNotification(testOrderData);

    res.json({
      success: true,
      message: 'Notification de commande complète envoyée avec succès via Telegram'
    });

  } catch (error) {
    console.error('❌ Erreur test notification Telegram:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la notification Telegram',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Endpoint de test pour notification avec photo d'une vraie commande
router.post('/telegram-photo', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Test notification Telegram avec photo...');

    // Trouver une commande avec photo
    const orderWithPhoto = await prisma.order.findFirst({
      where: {
        photoUrl: {
          not: null
        }
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!orderWithPhoto) {
      return res.status(404).json({
        success: false,
        message: 'Aucune commande avec photo trouvée pour le test'
      });
    }

    console.log('📸 Commande trouvée:', {
      id: orderWithPhoto.id.slice(-8),
      photoUrl: orderWithPhoto.photoUrl,
      protagonistName: orderWithPhoto.protagonistName
    });

    // Préparer les données de notification
    const orderData = {
      customerName: `${orderWithPhoto.shippingFirstName} ${orderWithPhoto.shippingLastName}`,
      customerEmail: orderWithPhoto.user?.email || 'test@example.com',
      orderNumber: orderWithPhoto.id.slice(-8),
      amount: parseFloat(orderWithPhoto.price.toString()),
      orderDate: new Date(orderWithPhoto.createdAt),
      productType: orderWithPhoto.productType,
      orderDetails: orderWithPhoto
    };

    // Envoyer la notification avec photo
    await TelegramService.sendOrderNotification(orderData);

    res.json({
      success: true,
      message: 'Notification avec photo envoyée avec succès',
      data: {
        orderId: orderWithPhoto.id.slice(-8),
        photoUrl: orderWithPhoto.photoUrl,
        protagonistName: orderWithPhoto.protagonistName,
        customerName: orderData.customerName
      }
    });

  } catch (error) {
    console.error('❌ Erreur test notification photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test de notification avec photo',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

export default router;
