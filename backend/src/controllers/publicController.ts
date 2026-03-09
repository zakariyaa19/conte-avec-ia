import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import crypto from 'crypto';

export class PublicController {
  // Get limited public story data for sharing
  static async getPublicStory(req: Request, res: Response) {
    try {
      const { shareToken } = req.params;

      const order = await prisma.order.findFirst({
        where: { shareToken },
        select: {
          id: true,
          protagonistName: true,
          coverTitle: true,
          coverImageUrl: true,
          firstIllustrationUrl: true,
          storyPreviewTextJson: true,
          illustrationStyle: true,
          generalTheme: true,
          ageRange: true,
          storyStatus: true,
          createdAt: true,
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Histoire non trouvée'
        });
      }

      // Parse first paragraph from story preview
      let firstParagraph: string | null = null;
      if (order.storyPreviewTextJson) {
        try {
          const paragraphs = JSON.parse(order.storyPreviewTextJson);
          firstParagraph = Array.isArray(paragraphs) ? paragraphs[0] : null;
        } catch {}
      }

      res.json({
        success: true,
        data: {
          protagonistName: order.protagonistName,
          coverTitle: order.coverTitle,
          coverImageUrl: order.coverImageUrl,
          firstIllustrationUrl: order.firstIllustrationUrl,
          firstParagraph,
          illustrationStyle: order.illustrationStyle,
          generalTheme: order.generalTheme,
          ageRange: order.ageRange,
          createdAt: order.createdAt,
        }
      });
    } catch (error) {
      console.error('Erreur public story:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération'
      });
    }
  }

  // Generate share token for a story
  static async generateShareToken(req: Request, res: Response) {
    try {
      const { storyId, userId } = req.body;

      // Find order owned by user
      const order = await prisma.order.findFirst({
        where: { id: storyId, userId }
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Conte non trouvé' });
      }

      // If already has token, return it
      if (order.shareToken) {
        return res.json({ success: true, data: { shareToken: order.shareToken } });
      }

      // Generate new token
      const shareToken = crypto.randomBytes(16).toString('hex');
      await prisma.order.update({
        where: { id: storyId },
        data: { shareToken }
      });

      res.json({ success: true, data: { shareToken } });
    } catch (error) {
      console.error('Erreur generation share token:', error);
      res.status(500).json({ success: false, message: 'Erreur' });
    }
  }
}
