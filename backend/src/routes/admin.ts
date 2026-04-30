import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { StoryGenerationController } from '../controllers/storyGenerationController';
import { authenticateAdmin, requireAdmin } from '../middleware/auth';
import { upload, uploadPdf } from '../middleware/upload';
import { prisma } from '../utils/database';

const router = Router();

// Authentification admin
router.post('/login', AdminController.login);

// Route temporaire de bootstrap admin
router.post('/bootstrap', AdminController.createAdminTemp);

// Routes protegees avec authentification
router.get('/dashboard/stats', authenticateAdmin, requireAdmin, AdminController.getDashboardStatsExtended);
router.get('/orders', authenticateAdmin, requireAdmin, AdminController.getOrders);
router.get('/orders/:id', authenticateAdmin, requireAdmin, AdminController.getOrderDetails);
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

    // Funnel du nouveau formulaire 2-step (ChatStoryCreator) :
    // visite → histoire decrite (step 1 → preview) → email/auth → livre cree
    const funnelOrder = [
      'page_view',
      'chat_to_preview',
      'email_entered',
      'form_submitted',
    ];

    const total = Number(totalSessions[0]?.count || 0);

    const funnel = funnelOrder.map(step => {
      const found = sessionsPerStep.find(s => s.step === step);
      const sessions = Number(found?.sessions || 0);
      return {
        step,
        sessions,
        percentage: total > 0 ? Math.round((sessions / total) * 100) : 0,
      };
    });

    res.json({
      success: true,
      data: {
        period: `${days} derniers jours`,
        totalSessions: total,
        funnel,
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
