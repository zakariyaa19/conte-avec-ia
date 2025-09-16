import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';

export class AdminController {
  // Connexion administrateur
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      // Rechercher l'administrateur
      const admin = await prisma.adminUser.findUnique({
        where: { email }
      });

      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          adminId: admin.id, 
          email: admin.email, 
          role: admin.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: admin.id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role
          }
        }
      });

    } catch (error) {
      console.error('Erreur connexion admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }

  // Statistiques du dashboard
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const [
        totalOrders,
        paidOrders,
        pendingOrders,
        totalRevenue
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PAID' } }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.aggregate({
          where: { status: 'PAID' },
          _sum: { price: true }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalOrders,
          paidOrders,
          pendingOrders,
          totalRevenue: totalRevenue._sum.price || 0
        }
      });

    } catch (error) {
      console.error('Erreur stats dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  // Liste des commandes pour l'admin
  static async getOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, productType, search } = req.query;
      
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
      console.error('Erreur liste commandes admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes'
      });
    }
  }

  // Détails d'une commande
  static async getOrderDetails(req: Request, res: Response) {
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
      console.error('Erreur détails commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des détails'
      });
    }
  }

  // Mettre à jour une commande
  static async updateOrder(req: Request, res: Response) {
    try {
      console.log('🔄 Mise à jour commande:', { id: req.params.id, body: req.body });
      
      const { id } = req.params;
      const updates = req.body;

      // Vérifier que le body n'est pas vide ou undefined
      if (!updates || typeof updates !== 'object') {
        console.log('❌ Body de requête invalide:', updates);
        return res.status(400).json({
          success: false,
          message: 'Données de mise à jour manquantes ou invalides'
        });
      }

      // Vérifier que la commande existe
      const existingOrder = await prisma.order.findUnique({
        where: { id }
      });

      if (!existingOrder) {
        console.log('❌ Commande non trouvée:', id);
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      // Champs autorisés à la modification
      const allowedFields = ['status', 'ebookUrl', 'generatedAt'];
      const filteredUpdates: any = {};
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      // Vérifier qu'il y a au moins un champ à mettre à jour
      if (Object.keys(filteredUpdates).length === 0) {
        console.log('❌ Aucun champ valide à mettre à jour');
        return res.status(400).json({
          success: false,
          message: 'Aucun champ valide à mettre à jour'
        });
      }

      console.log('📝 Champs à mettre à jour:', filteredUpdates);

      // Ajouter la date de paiement si le statut passe à PAID
      if (filteredUpdates.status === 'PAID' && existingOrder.status !== 'PAID') {
        filteredUpdates.paidAt = new Date();
      }

      const order = await prisma.order.update({
        where: { id },
        data: filteredUpdates,
        include: { user: true }
      });

      console.log('✅ Commande mise à jour:', order.id, 'nouveau statut:', order.status);

      res.json({
        success: true,
        data: order,
        message: 'Commande mise à jour avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur mise à jour commande:', error);
      
      // Log détaillé de l'erreur
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la commande',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
