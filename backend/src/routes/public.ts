import { Router } from 'express';
import { PublicController } from '../controllers/publicController';
import { prisma } from '../utils/database';

const router = Router();

// Public story preview (no auth required)
router.get('/stories/:shareToken', PublicController.getPublicStory);

// Exemples de livres pour la vitrine (IDs hardcodés — pas de données sensibles)
const EXAMPLE_ORDER_IDS = [
  'cmmz0kwlk0001rr2aolxiphqc', // Emmie
  'cmmyug1tj0007pp29eaxoauab', // Rayan
  'cmmysygbf0001pp29k87lb1xs', // Timéo
  'cmmyrepnd0001ne1tz88fo1a9', // Ethan
  'cmmxrucku000boj2c1q5bj9ab', // Enzo
];

// Cache en mémoire (rechargé toutes les heures)
let examplesCache: any[] | null = null;
let examplesCacheTime = 0;

router.get('/examples', async (req, res) => {
  try {
    const now = Date.now();
    if (examplesCache && now - examplesCacheTime < 3600_000) {
      return res.json({ success: true, data: examplesCache });
    }

    const orders = await prisma.order.findMany({
      where: { id: { in: EXAMPLE_ORDER_IDS }, status: 'DELIVERED' },
      select: {
        id: true,
        coverImageUrl: true,
        coverTitle: true,
        protagonistName: true,
        protagonistAge: true,
        protagonistGender: true,
        ageRange: true,
        generalTheme: true,
        specificSubject: true,
        centralMessage: true,
        illustrationStyle: true,
        storyTextJson: true,
        illustrationUrlsJson: true,
        creatorName: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Formater pour le frontend
    const examples = orders.map(o => ({
      id: o.id,
      coverImageUrl: o.coverImageUrl,
      coverTitle: o.coverTitle || o.protagonistName,
      protagonistName: o.protagonistName,
      protagonistAge: o.protagonistAge,
      protagonistGender: o.protagonistGender,
      ageRange: o.ageRange,
      generalTheme: o.generalTheme,
      specificSubject: o.specificSubject,
      centralMessage: o.centralMessage,
      illustrationStyle: o.illustrationStyle,
      creatorName: o.creatorName,
      paragraphs: o.storyTextJson ? (() => { try { return JSON.parse(o.storyTextJson); } catch { return []; } })() : [],
      illustrationUrls: o.illustrationUrlsJson ? (() => { try { return JSON.parse(o.illustrationUrlsJson); } catch { return []; } })() : [],
    }));

    examplesCache = examples;
    examplesCacheTime = now;

    res.json({ success: true, data: examples });
  } catch (error: any) {
    console.error('Erreur exemples:', error.message);
    res.status(500).json({ success: false, message: 'Erreur chargement exemples' });
  }
});

export default router;
