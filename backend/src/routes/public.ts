import { Router } from 'express';
import { PublicController } from '../controllers/publicController';
import { prisma } from '../utils/database';

const router = Router();

// Public story preview (no auth required)
router.get('/stories/:shareToken', PublicController.getPublicStory);

// Exemples de livres pour la vitrine (IDs hardcodés — pas de données sensibles)
// Livres complets 20 pages/20 illustrations uniquement (vérifié en base le 22/07 —
// seuls 3 sur 117 commandes livrées correspondent à ce format, les autres datent
// des anciennes ères du produit : 3, 5, 6 ou 12 pages).
const EXAMPLE_ORDER_IDS = [
  'cmpe4w4se0015qp2dszemqhlv', // Malone — Les Nocturnes de Malone dans la Jungle
  'cmpelcwrt003cqp2d9xl44w9k', // Horr — Horr et le Chabat des rêves magiques
  'cmqqb8ygc0091ji2chd4kykde', // Éva — Éva et le trésor enchanté de la forêt
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

// Funnel tracking (anonyme, pas besoin d'auth)
router.post('/funnel', async (req, res) => {
  try {
    const { sessionId, step, source, device } = req.body;
    if (!sessionId || !step) {
      return res.status(400).json({ success: false });
    }
    // Fire-and-forget — ne jamais bloquer le frontend
    await prisma.funnelEvent.create({
      data: {
        sessionId: String(sessionId).slice(0, 64),
        step: String(step).slice(0, 50),
        source: source ? String(source).slice(0, 20) : null,
        device: device ? String(device).slice(0, 20) : null,
      }
    });
    res.json({ success: true });
  } catch (error) {
    // Silent — le tracking ne doit jamais retourner d'erreur au client
    res.json({ success: true });
  }
});

export default router;
