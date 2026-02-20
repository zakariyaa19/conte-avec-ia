import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { upload } from '../middleware/upload';
import { optionalAuthenticateClient } from '../middleware/clientAuth';

const router = Router();

// Seule route publique : creation de commande (avec auth optionnelle)
router.post('/', upload.single('photo'), optionalAuthenticateClient, OrderController.createOrder);

// Marquer une commande comme abandonnee (appele depuis la page cancel)
router.post('/:id/abandon', OrderController.abandonOrder);

export default router;
