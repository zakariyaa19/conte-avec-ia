import { Router, Request, Response } from 'express';
import { processEmailSequence } from '../jobs/emailSequence';

const router = Router();

// Endpoint cron pour la séquence d'emails de relance
// Peut être appelé par un cron externe (ex: cron-job.org) toutes les heures
router.post('/email-sequence', async (req: Request, res: Response) => {
  // Vérification simple par clé secrète
  const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
  if (cronSecret !== (process.env.CRON_SECRET || 'cron-secret-contedia')) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const result = await processEmailSequence();
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Cron] Erreur email sequence:', error);
    res.status(500).json({ success: false, message: 'Erreur traitement séquence email' });
  }
});

export default router;
