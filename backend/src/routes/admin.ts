import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { StoryGenerationController } from '../controllers/storyGenerationController';
import { authenticateAdmin, requireAdmin } from '../middleware/auth';
import { upload, uploadPdf } from '../middleware/upload';

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

export default router;
