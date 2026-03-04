import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { PreviewController } from '../controllers/previewController';

const router = Router();

// Rate limiter : max 15 requetes par IP toutes les 15 minutes
const previewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Trop de demandes de preview. Reessayez dans quelques minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/generate', previewLimiter, PreviewController.generateCoverPreview);
router.post('/story-preview', previewLimiter, PreviewController.generateStoryPreview);
router.post('/first-illustration', previewLimiter, PreviewController.generateFirstIllustration);

export default router;
