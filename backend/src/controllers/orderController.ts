import { Request, Response } from 'express';
import { calculatePrice, PRODUCT_PRICES } from '../utils/pricing';
import { StoryFormData, ApiResponse } from '../types';
import { prisma } from '../utils/database';

export class OrderController {
  // Créer une nouvelle commande
  static async createOrder(req: Request, res: Response) {
    try {
      // Récupérer les données depuis le body (pour FormData, les données JSON sont dans req.body)
      let formData, userEmail;
      
      if (req.body.formData) {
        // Si les données viennent de FormData
        formData = typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData;
        userEmail = req.body.userEmail;
      } else {
        // Si les données viennent directement du JSON
        formData = req.body.formData;
        userEmail = req.body.userEmail;
      }
      
      // Validation des données requises
      if (!formData.ageRange || !formData.generalTheme || !formData.protagonistName || !formData.productType) {
        return res.status(400).json({
          success: false,
          message: 'Données manquantes dans le formulaire'
        });
      }

      // Calcul du prix
      const price = calculatePrice(formData.productType?.toUpperCase() as keyof typeof PRODUCT_PRICES) || 14.99;

      // Créer l'utilisateur s'il n'existe pas
      let user = null;
      if (userEmail) {
        user = await prisma.user.upsert({
          where: { email: userEmail },
          update: {},
          create: { email: userEmail }
        });
      }

      // Gestion de l'upload de photo
      let photoUrl = null;
      let photoPath = null;
      if (req.file) {
        // Construire l'URL de la photo uploadée
        photoUrl = `/uploads/${req.file.filename}`;
        photoPath = req.file.path; // Chemin complet pour l'email
        console.log('📸 Photo uploadée:', photoUrl, 'Chemin:', photoPath);
      }

      // Créer la commande
      const order = await prisma.order.create({
        data: {
          userId: user?.id,
          ageRange: formData.ageRange,
          generalTheme: formData.generalTheme,
          specificSubject: formData.specificSubject,
          centralMessage: formData.centralMessage,
          illustrationStyle: formData.illustrationStyle,
          protagonistName: formData.protagonistName,
          protagonistAge: formData.protagonistAge,
          eyeColor: formData.eyeColor,
          hairColor: formData.hairColor,
          secondaryCharacterName: formData.secondaryCharacterName,
          secondaryCharacterAge: formData.secondaryCharacterAge,
          photoUrl: photoUrl,
          productType: formData.productType?.toUpperCase() as 'EBOOK' | 'PRINTED' | 'PACK',
          price: price,
          shippingFirstName: formData.shippingAddress?.firstName,
          shippingLastName: formData.shippingAddress?.lastName,
          shippingAddress: formData.shippingAddress?.address,
          shippingCity: formData.shippingAddress?.city,
          shippingPostalCode: formData.shippingAddress?.postalCode,
          shippingCountry: formData.shippingAddress?.country || 'France'
        }
      });

      // Envoyer l'email de notification à l'admin
      try {
        const { EmailService } = await import('../utils/emailService');
        await EmailService.sendOrderNotificationToAdmin(order, formData, photoPath || undefined);
        console.log('✅ Email admin envoyé pour commande:', order.id);
      } catch (emailError) {
        console.error('❌ Erreur envoi email admin:', emailError);
        // Ne pas faire échouer la commande si l'email échoue
      }

      res.status(201).json({
        success: true,
        data: order,
        message: 'Commande créée avec succès'
      });

    } catch (error) {
      console.error('Erreur création commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la commande'
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
