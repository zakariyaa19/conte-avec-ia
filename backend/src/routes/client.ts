import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { PublicController } from '../controllers/publicController';
import { authenticateClient } from '../middleware/clientAuth';

const router = Router();

// Toutes les routes client sont protegees
router.use(authenticateClient);

// Contes
router.get('/stories', ClientController.getStories);
router.get('/stories/:id', ClientController.getStoryDetail);
router.get('/stories/:id/pdf', ClientController.getStoryPdf);
router.patch('/stories/:id/favorite', ClientController.toggleFavorite);

// Profils enfants
router.get('/children', ClientController.getChildren);
router.post('/children', ClientController.createChild);
router.put('/children/:id', ClientController.updateChild);
router.delete('/children/:id', ClientController.deleteChild);

// Partage
router.post('/stories/:id/share', async (req: any, res) => {
  req.body.storyId = req.params.id;
  req.body.userId = req.clientUser.id;
  return PublicController.generateShareToken(req, res);
});

// Abonnement
router.get('/subscription', ClientController.getSubscription);

// Credit Club
router.get('/club-credit', ClientController.getClubCredit);

// Parrainage
router.get('/referral', ClientController.getReferralInfo);

export default router;
