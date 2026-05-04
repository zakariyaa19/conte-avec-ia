import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { PreviewController } from '../controllers/previewController';

const router = Router();

// Rate limiter strict : max 15 generations cover/story/illustration / IP / 15min
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

// Rate limiter plus permissif pour le smart-hint (appel a chaque pause de frappe).
// 60 appels / IP / 15min couvre amplement un parcours de creation normal.
const hintLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Trop de requetes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/generate', previewLimiter, PreviewController.generateCoverPreview);
router.post('/story-preview', previewLimiter, PreviewController.generateStoryPreview);
router.post('/first-illustration', previewLimiter, PreviewController.generateFirstIllustration);
router.post('/smart-hint', hintLimiter, PreviewController.generateSmartHint);

export default router;
