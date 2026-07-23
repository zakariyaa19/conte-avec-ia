import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { StoryGenerationController } from '../controllers/storyGenerationController';
import { authenticateAdmin, requireAdmin } from '../middleware/auth';
import { upload, uploadPdf } from '../middleware/upload';
import { prisma } from '../utils/database';
import { PRODUCT_PRICES } from '../utils/pricing';

const router = Router();

// Authentification admin
router.post('/login', AdminController.login);

// Route temporaire de bootstrap admin
router.post('/bootstrap', AdminController.createAdminTemp);

// Routes protegees avec authentification
router.get('/dashboard/stats', authenticateAdmin, requireAdmin, AdminController.getDashboardStatsExtended);
router.get('/orders', authenticateAdmin, requireAdmin, AdminController.getOrders);
router.get('/orders/:id', authenticateAdmin, requireAdmin, AdminController.getOrderDetails);
router.get('/orders/:id/story-content', authenticateAdmin, requireAdmin, AdminController.getStoryContent);
router.patch('/orders/:id', authenticateAdmin, requireAdmin, AdminController.updateOrder);
router.delete('/orders/:id', authenticateAdmin, requireAdmin, AdminController.deleteOrder);

// Upload PDF et livraison
router.post('/orders/:id/upload-pdf', authenticateAdmin, requireAdmin, uploadPdf.single('pdf'), AdminController.uploadStoryPdf);
router.post('/orders/:id/deliver', authenticateAdmin, requireAdmin, AdminController.deliverStory);

// Workflow: Send to generation (PAID → GENERATING)
router.post('/orders/:id/send-to-generation', authenticateAdmin, requireAdmin, AdminController.sendToGeneration);

// Nettoyage (admin protege)
router.post('/cleanup', authenticateAdmin, requireAdmin, AdminController.cleanupOrders);

// Clients
router.get('/clients', authenticateAdmin, requireAdmin, AdminController.getClients);
router.get('/clients/:id', authenticateAdmin, requireAdmin, AdminController.getClientDetail);
router.delete('/clients/:id', authenticateAdmin, requireAdmin, AdminController.deleteClient);
router.patch('/clients/:id/password', authenticateAdmin, requireAdmin, AdminController.updateClientPassword);
router.patch('/clients/:id/credits', authenticateAdmin, requireAdmin, AdminController.updateClientCredits);
router.patch('/clients/:id/role', authenticateAdmin, requireAdmin, AdminController.updateClientRole);

// Generation de contes
router.get('/generation/orders', authenticateAdmin, requireAdmin, StoryGenerationController.getGenerationQueue);
router.post('/generation/orders/:id/generate', authenticateAdmin, requireAdmin, StoryGenerationController.startGeneration);
router.get('/generation/orders/:id/status', authenticateAdmin, requireAdmin, StoryGenerationController.getGenerationStatus);
router.post('/generation/orders/:id/retry', authenticateAdmin, requireAdmin, StoryGenerationController.retryGeneration);
router.get('/generation/orders/:id/pdf', StoryGenerationController.previewPdf);
router.post('/generation/test-order', authenticateAdmin, requireAdmin, upload.single('photo'), StoryGenerationController.createTestOrder);

// New generation workflow routes
router.post('/generation/orders/:id/regenerate', authenticateAdmin, requireAdmin, StoryGenerationController.regenerate);
router.post('/generation/orders/:id/validate', authenticateAdmin, requireAdmin, StoryGenerationController.validateGeneration);
router.post('/generation/orders/:id/delete-generation', authenticateAdmin, requireAdmin, StoryGenerationController.deleteGeneration);
router.post('/generation/orders/:id/replace-pdf', authenticateAdmin, requireAdmin, uploadPdf.single('pdf'), StoryGenerationController.replacePdf);
router.get('/generation/orders/:id/logs', authenticateAdmin, requireAdmin, StoryGenerationController.getGenerationLogs);

// Funnel analytics
router.get('/funnel', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const { days = '7' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    // Compter les événements par étape
    const steps = await prisma.funnelEvent.groupBy({
      by: ['step'],
      where: { createdAt: { gte: since } },
      _count: { id: true },
    });

    // Sessions uniques par étape
    const sessionsPerStep = await prisma.$queryRawUnsafe<{ step: string; sessions: bigint }[]>(
      `SELECT step, COUNT(DISTINCT "sessionId") as sessions FROM funnel_events WHERE "createdAt" >= $1 GROUP BY step ORDER BY sessions DESC`,
      since
    );

    // Total sessions uniques
    const totalSessions = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(DISTINCT "sessionId") as count FROM funnel_events WHERE "createdAt" >= $1`,
      since
    );

    // Par source
    const bySource = await prisma.funnelEvent.groupBy({
      by: ['source'],
      where: { createdAt: { gte: since }, step: 'page_view' },
      _count: { id: true },
    });

    // Par device
    const byDevice = await prisma.funnelEvent.groupBy({
      by: ['device'],
      where: { createdAt: { gte: since }, step: 'page_view' },
      _count: { id: true },
    });

    // Funnel sequentiel du flow chat (ChatStoryCreator) — granularite ajoutee
    // pour voir EXACTEMENT ou les visiteurs decrochent entre l'arrivee et la
    // soumission (avant : rien entre chat_to_preview et email_entered).
    const funnelOrder = [
      'page_view',
      'chat_started_typing',
      'chat_name_detected',
      'chat_score_ready',
      'chat_to_preview',
      'chat_cover_ready',
      'email_entered',
      'form_submitted',
    ];

    // Signaux de blocage — pas une sequence, des moments precis ou quelque
    // chose a coince. A regarder en % du total pour prioriser les correctifs.
    const blockerSteps = [
      'chat_text_no_name_20chars',
      'chat_photo_added',
      'chat_photo_read_failed',
      'chat_cover_photo_conversion_failed',
      'chat_cover_error',
      'chat_google_auth_error',
      'form_submit_error',
      'story_generation_failed_seen',
      'draft_restored',
    ];

    // Moments de sortie — captures via sendBeacon au moment reel ou la page
    // se ferme (registerExitTracking, funnelTracker.ts). Contrairement aux
    // steps ci-dessus (etapes franchies), ceci dit OU quelqu'un a lache prise
    // exactement — la donnee qui manquait completement avant.
    const exitSteps = [
      'exit_form_empty',
      'exit_form_short_text',
      'exit_form_text_no_name',
      'exit_form_name_not_ready',
      'exit_form_ready_not_clicked',
      'exit_preview_cover_loading',
      'exit_preview_cover_error',
      'exit_preview_awaiting_auth',
      'exit_preview_ready_not_submitted',
    ];

    const total = Number(totalSessions[0]?.count || 0);

    const toRow = (step: string) => {
      const found = sessionsPerStep.find(s => s.step === step);
      const sessions = Number(found?.sessions || 0);
      return {
        step,
        sessions,
        percentage: total > 0 ? Math.round((sessions / total) * 100) : 0,
      };
    };

    const funnel = funnelOrder.map(toRow);
    const blockers = blockerSteps.map(toRow).filter(b => b.sessions > 0);
    const exits = exitSteps.map(toRow).filter(e => e.sessions > 0);

    // ═══ Conversions payantes — verite terrain (Order/User), pas des
    // evenements client qui peuvent echouer silencieusement (ad-blocker,
    // onglet ferme trop vite). C'est Stripe qui confirme, pas le navigateur. ═══

    // Livres gratuits delivres sur la periode (le haut du funnel payant)
    const freeBooks = await prisma.order.count({
      where: { price: 0, purchaseType: 'SINGLE', storyStatus: 'DISPONIBLE', createdAt: { gte: since } },
    });

    // Completion du chapitre gratuit -> livre complet a 2,99€ (LE conversion
    // demandee explicitement : distincte de l'abonnement Club et des achats
    // directs). paidAt fiable depuis le fix processCompletionPayment.
    const completions = await prisma.order.aggregate({
      where: { price: PRODUCT_PRICES.EBOOK_COMPLETE, purchaseType: 'SINGLE', paidAt: { gte: since } },
      _count: { id: true },
      _sum: { price: true },
    });

    // Achats directs (2eme livre+, hors completion — prix different de 2,99€
    // et de 0). Argent reel mais un autre funnel que la completion.
    const directPurchases = await prisma.order.aggregate({
      where: { purchaseType: 'SINGLE', price: { gt: 0, not: PRODUCT_PRICES.EBOOK_COMPLETE }, paidAt: { gte: since } },
      _count: { id: true },
      _sum: { price: true },
    });

    // Abonnement Club — distinct de la completion, demande explicitement.
    // clubSince = date de la toute premiere conversion (jamais ecrasee sur
    // renouvellement), donc mesurable par periode contrairement a role=CLUB
    // seul qui n'est qu'un instantane.
    const newClubSubscribers = await prisma.user.count({
      where: { clubSince: { gte: since } },
    });
    const activeClubSubscribers = await prisma.user.count({
      where: { role: 'CLUB', subscriptionStatus: 'active' },
    });

    const revenue = {
      freeBooks,
      completion: {
        count: completions._count.id,
        revenue: Number(completions._sum.price || 0),
        conversionPct: freeBooks > 0 ? Math.round((completions._count.id / freeBooks) * 100) : 0,
      },
      directPurchase: {
        count: directPurchases._count.id,
        revenue: Number(directPurchases._sum.price || 0),
      },
      club: {
        newSubscribers: newClubSubscribers,
        activeSubscribers: activeClubSubscribers,
        // Revenu Club non calcule ici : facturation recurrente Stripe avec
        // montants variables (1,99€ 1er mois puis 9,99€/mois ou 79,99€/an) —
        // pas fiable a estimer depuis Order. Voir le dashboard Stripe pour le MRR exact.
      },
    };

    res.json({
      success: true,
      data: {
        period: `${days} derniers jours`,
        totalSessions: total,
        funnel,
        blockers,
        exits,
        revenue,
        bySource: bySource.map(s => ({ source: s.source || 'direct', count: s._count.id })),
        byDevice: byDevice.map(d => ({ device: d.device || 'unknown', count: d._count.id })),
      }
    });
  } catch (error) {
    console.error('Erreur funnel analytics:', error);
    res.status(500).json({ success: false, message: 'Erreur' });
  }
});

export default router;
