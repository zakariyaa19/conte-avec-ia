import { Router } from 'express';
import ordersRouter from './orders';
import paymentsRouter from './payments';
import adminRouter from './admin';
import testRouter from './test';
import pdfRouter from './pdf';

const router = Router();

// Routes principales
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
router.use('/admin', adminRouter);
router.use('/test', testRouter);
router.use('/pdfs', pdfRouter);

// Route de santé
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Contes d\'IA fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

export default router;
