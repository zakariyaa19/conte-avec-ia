import { Router } from 'express';
import { PublicController } from '../controllers/publicController';

const router = Router();

// Public story preview (no auth required)
router.get('/stories/:shareToken', PublicController.getPublicStory);

export default router;
