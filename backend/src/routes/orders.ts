import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from '../controllers/orderController';
import { upload } from '../middleware/upload';
import { optionalAuthenticateClient } from '../middleware/clientAuth';

const router = Router();

// Multer only when multipart/form-data (skip for JSON — faster)
// Avec gestion d'erreur pour les fichiers trop gros / invalides
const conditionalUpload = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('photo')(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          console.warn('[Upload] Photo trop volumineuse:', err.message);
          return res.status(413).json({
            success: false,
            message: 'Photo trop volumineuse. Taille maximum : 15 Mo. Essayez avec une photo plus petite.'
          });
        }
        if (err.message?.includes('image')) {
          return res.status(400).json({
            success: false,
            message: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.'
          });
        }
        console.error('[Upload] Erreur multer:', err.message);
        // Ne pas bloquer la commande si l'upload échoue — continuer sans photo
        next();
        return;
      }
      next();
    });
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
