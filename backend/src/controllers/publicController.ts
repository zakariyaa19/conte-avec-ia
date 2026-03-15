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
          storyTextJson: true,
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

      // Parse full story text (all paragraphs)
      let storyParagraphs: string[] = [];
      if (order.storyTextJson) {
        try {
          const parsed = JSON.parse(order.storyTextJson);
          storyParagraphs = Array.isArray(parsed) ? parsed : [];
        } catch {}
      }
      // Fallback to preview text if full story not available
      if (storyParagraphs.length === 0 && order.storyPreviewTextJson) {
        try {
          const parsed = JSON.parse(order.storyPreviewTextJson);
          storyParagraphs = Array.isArray(parsed) ? parsed : [];
        } catch {}
      }

      res.json({
        success: true,
        data: {
          protagonistName: order.protagonistName,
          coverTitle: order.coverTitle,
          coverImageUrl: order.coverImageUrl,
          firstIllustrationUrl: order.firstIllustrationUrl,
          storyParagraphs,
          firstParagraph: storyParagraphs[0] || null,
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
