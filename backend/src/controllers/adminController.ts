import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
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
        process.env.JWT_SECRET!,
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

  // Liste des commandes pour l'admin (avec filtres avances)
  static async getOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, productType, purchaseType, search, dateFrom, dateTo, actionRequired } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      // Construction des filtres
      const where: any = {};
      if (status) where.status = status;
      if (productType) where.productType = productType;
      if (purchaseType) where.purchaseType = purchaseType;
      if (search) {
        where.OR = [
          { protagonistName: { contains: search as string } },
          { user: { email: { contains: search as string } } }
        ];
      }
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
        if (dateTo) {
          const end = new Date(dateTo as string);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      // Filtre "a traiter" : commandes payees non encore livrees
      if (actionRequired === 'true') {
        where.status = 'PAID';
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          omit: { coverImageData: true, pdfData: true },
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
        omit: { coverImageData: true, pdfData: true },
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

      // Champs autorises a la modification
      const allowedFields = ['status', 'ebookUrl', 'pdfUrl', 'storyStatus', 'generatedAt'];
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
        omit: { coverImageData: true, pdfData: true },
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

  // Route de bootstrap admin protegee par secret
  static async createAdminTemp(req: Request, res: Response) {
    try {
      const bootstrapSecret = req.headers['x-bootstrap-secret'];
      if (!bootstrapSecret || bootstrapSecret !== process.env.BOOTSTRAP_SECRET) {
        return res.status(403).json({ success: false, message: 'Acces interdit' });
      }

      const email = 'contact@contedia.fr';
      const password = 'Admin2024!';
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.adminUser.upsert({
        where: { email },
        update: {
          password: hashedPassword,
          isActive: true
        },
        create: {
          email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Contes IA',
          role: 'SUPER_ADMIN',
          isActive: true
        }
      });

      res.json({
        success: true,
        message: 'Admin créé/mis à jour avec succès',
        data: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          temporaryPassword: password
        }
      });

    } catch (error: any) {
      console.error('Erreur creation admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la creation de l\'admin'
      });
    }
  }

  // Upload PDF d'un conte
  static async uploadStoryPdf(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Fichier PDF requis'
        });
      }

      const order = await prisma.order.findUnique({ where: { id }, omit: { coverImageData: true, pdfData: true } });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvee'
        });
      }

      const pdfUrl = `/uploads/pdfs/${req.file.filename}`;

      // Lire le contenu du fichier pour le stocker en base (survit aux redeploiements)
      const pdfData = fs.readFileSync(req.file.path);

      const updated = await prisma.order.update({
        where: { id },
        data: {
          pdfUrl,
          pdfData,
          storyStatus: 'DISPONIBLE'
        },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });

      res.json({
        success: true,
        data: updated,
        message: 'PDF uploade avec succes'
      });
    } catch (error) {
      console.error('Erreur upload PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload du PDF'
      });
    }
  }

  // Livrer un conte au client
  static async deliverStory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvee'
        });
      }

      if (!order.pdfUrl) {
        return res.status(400).json({
          success: false,
          message: 'Aucun PDF n\'a ete uploade pour cette commande'
        });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: 'DELIVERED',
          storyStatus: 'DISPONIBLE',
          deliveredAt: new Date()
        },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });

      // Envoyer email de livraison (pas de Telegram — action admin, pas commande client)
      try {
        const { MailjetService } = await import('../utils/mailjetService');
        if (order.user?.email) {
          await MailjetService.sendStoryDeliveryEmail({
            customerName: order.user.firstName || order.creatorName || 'Client',
            customerEmail: order.user.email,
            orderNumber: order.id.slice(-8),
            protagonistName: order.protagonistName
          });
        }
      } catch (notifError) {
        console.error('Erreur notification livraison:', notifError);
      }

      res.json({
        success: true,
        data: updated,
        message: 'Conte livre au client avec succes'
      });
    } catch (error) {
      console.error('Erreur livraison conte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la livraison'
      });
    }
  }

  // Liste des clients
  static async getClients(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, role, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (role) where.role = role;
      if (search) {
        where.OR = [
          { email: { contains: search as string } },
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            _count: { select: { orders: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.user.count({ where })
      ]);

      const clientsData = users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        subscriptionStatus: u.subscriptionStatus,
        orderCount: (u as any)._count.orders,
        createdAt: u.createdAt
      }));

      res.json({
        success: true,
        data: clientsData,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur liste clients:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation des clients'
      });
    }
  }

  // Detail d'un client
  static async getClientDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
            omit: { coverImageData: true, pdfData: true }
          },
          childProfiles: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Client non trouve'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPeriodEnd: user.subscriptionPeriodEnd,
          subscriptionId: user.subscriptionId,
          stripeCustomerId: user.stripeCustomerId,
          weeklySubmissionCount: user.weeklySubmissionCount,
          weeklySubmissionReset: user.weeklySubmissionReset,
          createdAt: user.createdAt,
          orders: user.orders,
          children: user.childProfiles
        }
      });
    } catch (error) {
      console.error('Erreur detail client:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation du client'
      });
    }
  }

  // Supprimer un client et ses commandes
  static async deleteClient(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id }, include: { _count: { select: { orders: true } } } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Client non trouve' });
      }

      // Supprimer les commandes, profils enfants, puis le user
      await prisma.order.deleteMany({ where: { userId: id } });
      await prisma.childProfile.deleteMany({ where: { userId: id } });
      await prisma.user.delete({ where: { id } });

      res.json({ success: true, message: `Client ${user.email} supprime avec ${user._count.orders} commande(s)` });
    } catch (error) {
      console.error('Erreur suppression client:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du client' });
    }
  }

  // Modifier le mot de passe d'un client
  static async updateClientPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caracteres' });
      }

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Client non trouve' });
      }

      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id }, data: { password: hashedPassword } });

      res.json({ success: true, message: 'Mot de passe modifie' });
    } catch (error) {
      console.error('Erreur modification mot de passe:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la modification du mot de passe' });
    }
  }

  // Stats etendues
  static async getDashboardStatsExtended(req: Request, res: Response) {
    try {
      const [
        ordersToProcess,
        unpaidOrders,
        totalRevenue,
        clubSubscribers,
        clubSubscribersActive,
        totalStories
      ] = await Promise.all([
        // A traiter : commandes payees non encore livrees
        prisma.order.count({ where: { status: 'PAID' } }),
        // Non payees : commandes abandonnees
        prisma.order.count({ where: { status: 'UNPAID' } }),
        // Chiffre d'affaires : somme des commandes payees ou livrees
        prisma.order.aggregate({
          where: { status: { in: ['PAID', 'DELIVERED'] } },
          _sum: { price: true }
        }),
        // Abonnements Club (actifs + en cours d'annulation)
        prisma.user.count({ where: { role: 'CLUB', subscriptionStatus: { in: ['active', 'canceling'] } } }),
        // Abonnements Club qui vont renouveler (actifs uniquement, pas canceling)
        prisma.user.count({ where: { role: 'CLUB', subscriptionStatus: 'active' } }),
        // Total contes generes (tout sauf PENDING et UNPAID)
        prisma.order.count({ where: { status: { in: ['PAID', 'DELIVERED', 'BLOCKED'] } } })
      ]);

      // MRR = nombre d'abonnes qui vont renouveler x 12.99€
      const mrr = Math.round(clubSubscribersActive * 12.99 * 100) / 100;

      res.json({
        success: true,
        data: {
          ordersToProcess,
          unpaidOrders,
          totalRevenue: totalRevenue._sum.price || 0,
          clubSubscribers,
          mrr,
          totalStories
        }
      });
    } catch (error) {
      console.error('Erreur stats dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation des statistiques'
      });
    }
  }

  // Supprimer une commande
  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({ where: { id }, select: { id: true } });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      await prisma.order.delete({ where: { id } });

      res.json({ success: true, message: `Commande #${id.slice(-8)} supprimee` });
    } catch (error) {
      console.error('Erreur suppression commande:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la commande' });
    }
  }

  // Nettoyer toutes les commandes (admin protege)
  static async cleanupOrders(req: Request, res: Response) {
    try {
      const deletedOrders = await prisma.order.deleteMany({});
      const deletedProfiles = await prisma.childProfile.deleteMany({});
      const deletedUsers = await prisma.user.deleteMany({});

      res.json({
        success: true,
        message: `Nettoyage effectue: ${deletedOrders.count} commandes, ${deletedProfiles.count} profils enfants, ${deletedUsers.count} utilisateurs supprimes`
      });
    } catch (error) {
      console.error('Erreur nettoyage:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du nettoyage'
      });
    }
  }
}
