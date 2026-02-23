import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { calculatePrice, PRODUCT_PRICES } from '../utils/pricing';
import { StoryFormData, ApiResponse } from '../types';
import { prisma } from '../utils/database';
import { stringifySecondaryCharacters } from '../utils/formatters';
import { generateClientToken } from './authController';
import { ClientAuthRequest } from '../middleware/clientAuth';
import { ClubService } from '../utils/clubService';
import { MailjetService } from '../utils/mailjetService';
import { buildOrderDetailsString } from '../utils/orderFormatter';
import { saveCoverImage } from '../utils/coverStorage';

export class OrderController {
  // Créer une nouvelle commande
  static async createOrder(req: ClientAuthRequest, res: Response) {
    try {
      console.log('📝 Création de commande reçue');

      // Récupérer les données depuis le body
      let formData, userEmail;

      if (req.body.formData) {
        formData = typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData;
        userEmail = req.body.userEmail || formData.userEmail;
      } else {
        formData = req.body.formData || req.body;
        userEmail = req.body.userEmail || formData.userEmail;
      }

      // Validation des données requises
      if (!formData.ageRange || !formData.generalTheme || !formData.protagonistName ||
          !formData.productType) {
        return res.status(400).json({
          success: false,
          message: 'Données obligatoires manquantes dans le formulaire'
        });
      }

      // Calcul du prix
      let price = calculatePrice(formData.productType?.toUpperCase() as keyof typeof PRODUCT_PRICES) || 4.99;

      let user = null;
      let photoUrl = null;
      let coverImageUrl: string | null = null;
      const coverTitle = formData.coverTitle || null;

      // Gestion de la couverture generee par GPT
      if (formData.coverImageBase64) {
        try {
          coverImageUrl = saveCoverImage(formData.coverImageBase64);
          console.log('🖼️ Couverture sauvegardee:', coverImageUrl);
        } catch (coverErr) {
          console.error('Erreur sauvegarde couverture:', coverErr);
        }
        delete formData.coverImageBase64;
      }

      // Gestion de l'upload de photo
      if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
      }

      const password = req.body.password || formData.password;
      let purchaseType = (formData.purchaseType || 'SINGLE').toUpperCase();

      // --- Resolution du user ---
      if (req.clientUser) {
        // Utilisateur connecte : on utilise directement son compte
        user = await prisma.user.findUnique({ where: { id: req.clientUser.id } });
        userEmail = req.clientUser.email;
        console.log('👤 Utilisateur connecte:', userEmail);
      } else if (userEmail) {
        // Invité : chercher ou creer le user par email
        const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
        if (existingUser) {
          if (password && !existingUser.password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.update({
              where: { email: userEmail },
              data: { password: hashedPassword }
            });
          } else {
            user = existingUser;
          }
        } else {
          const createData: any = { email: userEmail };
          if (password) {
            createData.password = await bcrypt.hash(password, 10);
          }
          user = await prisma.user.create({ data: createData });
        }
      }

      // --- Logique Club : conte gratuit hebdomadaire ---
      // Ne verifier le credit QUE si l'utilisateur est deja membre Club actif.
      // Si l'utilisateur n'est pas encore Club (nouvel abonnement), on laisse
      // purchaseType = 'CLUB' pour que le frontend redirige vers le checkout subscription.
      let isClubFreeOrder = false;
      let clubCreditExhausted = false;

      const isExistingClubMember = user && user.role === 'CLUB' && user.subscriptionStatus === 'active';

      if (isExistingClubMember && purchaseType === 'CLUB') {
        const clubCheck = await ClubService.canSubmitFreeStory(user!.id);
        if (clubCheck.canSubmit) {
          price = 0;
          isClubFreeOrder = true;
        } else {
          // Credit epuise cette semaine : fallback en achat unique
          purchaseType = 'SINGLE';
          clubCreditExhausted = true;
        }
      }

      // Créer la commande
      const order = await prisma.order.create({
        data: {
          userId: user?.id,
          ageRange: formData.ageRange,
          generalTheme: formData.generalTheme,
          customTheme: formData.customTheme,
          specificSubject: formData.specificSubject,
          customSubject: formData.customSubject,
          centralMessage: formData.centralMessage,
          customMessage: formData.customMessage,
          illustrationStyle: formData.illustrationStyle,
          protagonistName: formData.protagonistName,
          protagonistAge: formData.protagonistAge,
          protagonistGender: formData.protagonistGender,
          eyeColor: formData.eyeColor,
          hairColor: formData.hairColor,
          skinColor: formData.skinColor,
          photoUrl: photoUrl,
          coverImageUrl: coverImageUrl,
          coverTitle: coverTitle,
          language: formData.language,
          hobbies: formData.hobbies,
          favoriteDish: formData.favoriteDish,
          specialEvents: formData.specialEvents,
          religion: formData.religion,
          customReligion: formData.customReligion,
          secondaryCharactersJson: stringifySecondaryCharacters(formData.secondaryCharacters),
          secondaryCharacterName: formData.secondaryCharacterName,
          secondaryCharacterAge: formData.secondaryCharacterAge,
          creatorName: formData.creatorName,
          productType: 'EBOOK',
          purchaseType: purchaseType as 'SINGLE' | 'CLUB',
          price: price
        }
      });

      // --- Si commande Club gratuite : finaliser immediatement ---
      if (isClubFreeOrder && user) {
        await ClubService.recordSubmission(user.id);

        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID', paidAt: new Date() },
          include: { user: true }
        });

        // Envoyer notifications (emails + Telegram)
        try {
          const orderDetails = buildOrderDetailsString(updatedOrder);
          const customerEmail = user.email;
          const customerName = user.firstName || formData.creatorName || 'Client';

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
          console.error('Erreur envoi notifications Club:', notifError);
        }
      }

      // Generer un token JWT si l'utilisateur a un mot de passe
      let token: string | undefined;
      let userData: any = undefined;
      if (user && user.password) {
        token = generateClientToken(user);
        userData = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        };
      }

      res.status(201).json({
        success: true,
        data: order,
        token,
        user: userData,
        isClubFreeOrder,
        clubCreditExhausted,
        message: isClubFreeOrder ? 'Conte Club gratuit cree avec succes' : 'Commande creee avec succes'
      });

    } catch (error) {
      console.error('Erreur création commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la commande'
      });
    }
  }

  // Marquer une commande comme abandonnee (paiement annule)
  static async abandonOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvee'
        });
      }

      // Ne marquer comme abandonnee que si la commande n'est pas deja payee
      if (order.status === 'PAID' || order.paidAt) {
        return res.json({ success: true, message: 'Commande deja payee' });
      }

      await prisma.order.update({
        where: { id },
        data: { status: 'UNPAID' }
      });

      res.json({
        success: true,
        message: 'Commande marquee comme non payee'
      });
    } catch (error) {
      console.error('Erreur abandon commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'abandon de la commande'
      });
    }
  }

  // Récupérer une commande par ID
  static async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      res.json({
        success: true,
        data: order
      });

    } catch (error) {
      console.error('Erreur récupération commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la commande'
      });
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: { status }
      });

      res.json({
        success: true,
        data: order,
        message: 'Statut de la commande mis à jour'
      });

    } catch (error) {
      console.error('Erreur mise à jour commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la commande'
      });
    }
  }

  // Lister toutes les commandes (pour l'admin)
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, productType, search } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      // Construction des filtres
      const where: any = {};
      if (status) where.status = status;
      if (productType) where.productType = productType;
      if (search) {
        where.OR = [
          { protagonistName: { contains: search as string, mode: 'insensitive' } },
          { user: { email: { contains: search as string, mode: 'insensitive' } } }
        ];
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.order.count({ where })
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Erreur liste commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes'
      });
    }
  }

  // Mettre à jour une commande
  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: updateData,
        include: { user: true }
      });

      res.json({
        success: true,
        data: order
      });

    } catch (error) {
      console.error('Erreur mise à jour commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la commande'
      });
    }
  }

  // Lister toutes les commandes avec filtres
  static async getOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, productType } = req.query;
      
      const where: any = {};
      if (status) where.status = status;
      if (productType) where.productType = productType;

      const orders = await prisma.order.findMany({
        where,
        include: { user: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.order.count({ where });

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Erreur liste commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes'
      });
    }
  }
}
