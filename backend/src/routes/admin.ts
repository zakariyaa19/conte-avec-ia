import { Router } from 'express';
import express from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateAdmin, requireAdmin } from '../middleware/auth';

const router = Router();

// Middleware pour parser le JSON
router.use(express.json());

// Authentification admin
router.post('/login', AdminController.login);

// Routes protégées avec authentification
router.get('/dashboard/stats', authenticateAdmin, requireAdmin, AdminController.getDashboardStats);
router.get('/orders', authenticateAdmin, requireAdmin, AdminController.getOrders);
router.get('/orders/:id', authenticateAdmin, requireAdmin, AdminController.getOrderDetails);
router.patch('/orders/:id', authenticateAdmin, requireAdmin, AdminController.updateOrder);

export default router;
