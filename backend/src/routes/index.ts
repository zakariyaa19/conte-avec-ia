import { Router } from 'express';
import ordersRouter from './orders';
import paymentsRouter from './payments';
import adminRouter from './admin';
import testRouter from './test';
import pdfRouter from './pdf';
import tiktokRouter from './tiktok';

const router = Router();

// Routes principales
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
router.use('/admin', adminRouter);
router.use('/test', testRouter);
router.use('/pdfs', pdfRouter);
router.use('/tiktok', tiktokRouter);

// Route de santé
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Contes d\'IA fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

export default router;
