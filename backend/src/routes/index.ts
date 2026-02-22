import { Router } from 'express';
import ordersRouter from './orders';
import adminRouter from './admin';
import authRouter from './auth';
import clientRouter from './client';
import pdfRouter from './pdf';
import tiktokRouter from './tiktok';
import previewRouter from './preview';

const router = Router();

// Routes principales
router.use('/orders', ordersRouter);
router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/client', clientRouter);
router.use('/pdfs', pdfRouter);
router.use('/tiktok', tiktokRouter);
router.use('/preview', previewRouter);

// Route de santé
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Contes d\'IA fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

export default router;
