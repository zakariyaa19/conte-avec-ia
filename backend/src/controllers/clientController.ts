import { Response } from 'express';
import { prisma } from '../utils/database';
import { ClientAuthRequest } from '../middleware/clientAuth';
import { ClubService } from '../utils/clubService';
import { isCloudinaryUrl } from '../utils/cloudinaryService';
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
        status: { in: ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'] }
      };
      if (status) where.storyStatus = status;
      if (favorite === 'true') where.isFavorite = true;

      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        omit: { pdfData: true, coverImageData: true },
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
        omit: { pdfData: true, coverImageData: true },
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

      // 1) Requete legere : verifier existence + statut + recuperer pdfUrl (sans charger les blobs)
      const order = await prisma.order.findFirst({
        where: { id, userId },
        select: { id: true, status: true, protagonistName: true, pdfUrl: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Conte non trouve'
        });
      }

      // Allow download if PDF exists, regardless of order status
      if (!order.pdfUrl) {
        console.log('[PDF] Pas de PDF — orderId:', order.id, 'status:', order.status);
        return res.status(403).json({
          success: false,
          message: 'Le conte n\'est pas encore disponible au telechargement'
        });
      }

      // 2) Cloudinary URL → redirect (no memory usage)
      if (order.pdfUrl && isCloudinaryUrl(order.pdfUrl)) {
        return res.redirect(order.pdfUrl);
      }

      const filename = `conte-${order.protagonistName}-${order.id.slice(-8)}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // 3) Legacy: essayer depuis le fichier disque
      if (order.pdfUrl) {
        const pdfPath = path.join(__dirname, '../../', order.pdfUrl);
        if (fs.existsSync(pdfPath)) {
          return res.sendFile(pdfPath);
        }
      }

      // 4) Fallback : charger pdfData depuis la BDD (retrocompat)
      const orderWithPdf = await prisma.order.findFirst({
        where: { id, userId },
        select: { pdfData: true }
      });

      if (orderWithPdf?.pdfData) {
        return res.send(Buffer.from(orderWithPdf.pdfData));
      }

      return res.status(404).json({
        success: false,
        message: 'PDF non disponible'
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
        where: { id, userId },
        select: { id: true, isFavorite: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Conte non trouve'
        });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: { isFavorite: !order.isFavorite },
        omit: { coverImageData: true, pdfData: true }
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
            omit: { coverImageData: true, pdfData: true },
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

  // Parrainage
  static async getReferralInfo(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      let user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouve' });

      // Generate referral code if not exists
      if (!user.referralCode) {
        const code = userId.slice(-6).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();
        user = await prisma.user.update({
          where: { id: userId },
          data: { referralCode: code }
        });
      }

      res.json({
        success: true,
        data: {
          referralCode: user.referralCode,
          referralCredits: user.referralCredits || 0,
          referralCount: user.referralCount || 0,
          maxCredits: 3,
          referralLink: `${process.env.FRONTEND_URL || 'https://contedia.fr'}/create-story?ref=${user.referralCode}`
        }
      });
    } catch (error) {
      console.error('Erreur referral:', error);
      res.status(500).json({ success: false, message: 'Erreur parrainage' });
    }
  }

  // Tracker une lecture (quand l'utilisateur ouvre son livre)
  static async trackRead(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { id } = req.params;

      const order = await prisma.order.findFirst({
        where: { id, userId }
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Conte non trouve' });
      }

      await prisma.order.update({
        where: { id },
        data: {
          readCount: { increment: 1 },
          lastReadAt: new Date()
        }
      });

      res.json({ success: true, readCount: (order.readCount || 0) + 1 });
    } catch (error) {
      console.error('Erreur track read:', error);
      res.status(500).json({ success: false, message: 'Erreur' });
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
