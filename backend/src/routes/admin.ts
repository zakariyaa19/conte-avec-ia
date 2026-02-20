import { Router } from 'express';
import express from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateAdmin, requireAdmin } from '../middleware/auth';
import { uploadPdf } from '../middleware/upload';

const router = Router();

// Middleware pour parser le JSON
router.use(express.json());

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

// Nettoyage (admin protege)
router.post('/cleanup', authenticateAdmin, requireAdmin, AdminController.cleanupOrders);

// Clients
router.get('/clients', authenticateAdmin, requireAdmin, AdminController.getClients);
router.get('/clients/:id', authenticateAdmin, requireAdmin, AdminController.getClientDetail);
router.delete('/clients/:id', authenticateAdmin, requireAdmin, AdminController.deleteClient);
router.patch('/clients/:id/password', authenticateAdmin, requireAdmin, AdminController.updateClientPassword);

export default router;
