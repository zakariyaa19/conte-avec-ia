import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from '../controllers/orderController';
import { upload } from '../middleware/upload';
import { optionalAuthenticateClient } from '../middleware/clientAuth';

const router = Router();

// Multer only when multipart/form-data (skip for JSON — faster)
const conditionalUpload = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('photo')(req, res, next);
  }
  next();
};

// Seule route publique : creation de commande (avec auth optionnelle)
router.post('/', conditionalUpload, optionalAuthenticateClient, OrderController.createOrder);

// Sauvegarder le cover image en background (apres creation de commande)
router.post('/:id/cover', OrderController.saveCover);

// Marquer une commande comme abandonnee (appele depuis la page cancel)
router.post('/:id/abandon', OrderController.abandonOrder);

export default router;
