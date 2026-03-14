import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/authController';
import { authenticateClient } from '../middleware/clientAuth';

const router = Router();

// Rate limiting pour les routes d'auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives par IP
  message: { success: false, message: 'Trop de tentatives, reessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

const checkEmailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'Trop de requetes' },
  standardHeaders: true,
  legacyHeaders: false
});

// Routes publiques
router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/unified-login', authLimiter, AuthController.unifiedLogin);
router.post('/google', authLimiter, AuthController.googleAuth);
router.post('/magic-link', authLimiter, AuthController.requestMagicLink);
router.post('/magic-link/verify', authLimiter, AuthController.verifyMagicLink);
router.get('/check-email', checkEmailLimiter, AuthController.checkEmail);

// Routes protegees
router.get('/profile', authenticateClient, AuthController.getProfile);
router.put('/profile', authenticateClient, AuthController.updateProfile);
router.post('/change-password', authenticateClient, AuthController.changePassword);

export default router;
