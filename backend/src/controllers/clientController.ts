import { Response } from 'express';
import { prisma } from '../utils/database';
import { ClientAuthRequest } from '../middleware/clientAuth';
import { ClubService } from '../utils/clubService';
import path from 'path';
import fs from 'fs';

export class ClientController {
  // Liste des contes du user connecte
  static async getStories(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { status, favorite } = req.query;

      const where: any = {
        userId,
        status: { in: ['PAID', 'DELIVERED'] }
      };
      if (status) where.storyStatus = status;
      if (favorite === 'true') where.isFavorite = true;

      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        omit: { pdfData: true },
        include: { childProfile: true }
      });

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Erreur liste contes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation des contes'
      });
    }
  }

  // Detail d'un conte
  static async getStoryDetail(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { id } = req.params;

      const order = await prisma.order.findFirst({
        where: { id, userId },
        omit: { pdfData: true },
        include: { childProfile: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Conte non trouve'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Erreur detail conte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation du conte'
      });
    }
  }

  // Telechargement securise du PDF
  static async getStoryPdf(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { id } = req.params;

      const order = await prisma.order.findFirst({
        where: { id, userId }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Conte non trouve'
        });
      }

      if (!order.pdfUrl && !order.pdfData) {
        return res.status(404).json({
          success: false,
          message: 'PDF non disponible'
        });
      }

      const filename = `conte-${order.protagonistName}-${order.id.slice(-8)}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // 1) Essayer depuis le fichier disque
      if (order.pdfUrl) {
        const pdfPath = path.join(__dirname, '../../', order.pdfUrl);
        if (fs.existsSync(pdfPath)) {
          return res.sendFile(pdfPath);
        }
      }

      // 2) Fallback : servir depuis la base de donnees
      if (order.pdfData) {
        return res.send(Buffer.from(order.pdfData));
      }

      return res.status(404).json({
        success: false,
        message: 'Fichier PDF non trouve'
      });
    } catch (error) {
      console.error('Erreur telechargement PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du telechargement'
      });
    }
  }

  // Marquer/demarquer favori
  static async toggleFavorite(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { id } = req.params;

      const order = await prisma.order.findFirst({
        where: { id, userId }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Conte non trouve'
        });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: { isFavorite: !order.isFavorite }
      });

      res.json({
        success: true,
        data: { isFavorite: updated.isFavorite }
      });
    } catch (error) {
      console.error('Erreur toggle favori:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise a jour du favori'
      });
    }
  }

  // CRUD Profils enfants
  static async getChildren(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;

      const children = await prisma.childProfile.findMany({
        where: { userId },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });

      res.json({ success: true, data: children });
    } catch (error) {
      console.error('Erreur liste enfants:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation des profils enfants'
      });
    }
  }

  static async createChild(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { name, age, photoUrl } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Le prenom est requis'
        });
      }

      const child = await prisma.childProfile.create({
        data: { userId, name, age: age ? parseInt(age) : null, photoUrl }
      });

      res.status(201).json({ success: true, data: child });
    } catch (error) {
      console.error('Erreur creation enfant:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la creation du profil enfant'
      });
    }
  }

  static async updateChild(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { id } = req.params;
      const { name, age, photoUrl } = req.body;

      const existing = await prisma.childProfile.findFirst({
        where: { id, userId }
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Profil enfant non trouve'
        });
      }

      const child = await prisma.childProfile.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(age !== undefined && { age: age ? parseInt(age) : null }),
          ...(photoUrl !== undefined && { photoUrl })
        }
      });

      res.json({ success: true, data: child });
    } catch (error) {
      console.error('Erreur mise a jour enfant:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise a jour du profil enfant'
      });
    }
  }

  static async deleteChild(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { id } = req.params;

      const existing = await prisma.childProfile.findFirst({
        where: { id, userId }
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Profil enfant non trouve'
        });
      }

      await prisma.childProfile.delete({ where: { id } });

      res.json({ success: true, message: 'Profil enfant supprime' });
    } catch (error) {
      console.error('Erreur suppression enfant:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du profil enfant'
      });
    }
  }

  // Credit Club
  static async getClubCredit(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const result = await ClubService.canSubmitFreeStory(userId);

      res.json({
        success: true,
        data: {
          canSubmit: result.canSubmit,
          remaining: result.remaining,
          nextCreditDate: result.nextCreditDate,
          totalEarned: result.totalEarned
        }
      });
    } catch (error) {
      console.error('Erreur credit club:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la verification du credit club'
      });
    }
  }

  // Statut abonnement
  static async getSubscription(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouve'
        });
      }

      res.json({
        success: true,
        data: {
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPeriodEnd: user.subscriptionPeriodEnd,
          weeklySubmissionCount: user.weeklySubmissionCount,
          weeklySubmissionReset: user.weeklySubmissionReset
        }
      });
    } catch (error) {
      console.error('Erreur statut abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation du statut d\'abonnement'
      });
    }
  }
}
