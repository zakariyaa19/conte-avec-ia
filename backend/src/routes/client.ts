import { Router } from 'express';
import express from 'express';
import { ClientController } from '../controllers/clientController';
import { authenticateClient } from '../middleware/clientAuth';

const router = Router();

router.use(express.json());

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

// Abonnement
router.get('/subscription', ClientController.getSubscription);

// Credit Club
router.get('/club-credit', ClientController.getClubCredit);

export default router;
