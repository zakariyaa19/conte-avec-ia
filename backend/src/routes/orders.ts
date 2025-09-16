import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { upload } from '../middleware/upload';

const router = Router();

// Routes pour les commandes
router.post('/', upload.single('photo'), OrderController.createOrder);
router.get('/:id', OrderController.getOrder);
router.put('/:id', OrderController.updateOrder);
router.get('/', OrderController.getOrders);

export default router;
