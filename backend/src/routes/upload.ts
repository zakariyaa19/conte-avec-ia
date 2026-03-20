import { Router, Request, Response } from 'express';
import { saveCoverImage } from '../utils/coverStorage';

const router = Router();

// Upload cover image base64 → Cloudinary, retourne l'URL
// Appelé AVANT la soumission du formulaire pour éviter d'envoyer 20MB de base64 dans le JSON
router.post('/cover', async (req: Request, res: Response) => {
  try {
    const { coverImageBase64 } = req.body;

    if (!coverImageBase64 || typeof coverImageBase64 !== 'string') {
      return res.status(400).json({ success: false, message: 'coverImageBase64 requis' });
    }

    console.log(`[Upload] Cover base64 reçu: ${(coverImageBase64.length / 1024 / 1024).toFixed(1)}MB`);

    const result = await saveCoverImage(coverImageBase64);

    console.log(`[Upload] Cover uploadée: ${result.url}`);
    res.json({ success: true, url: result.url });
  } catch (error: any) {
    console.error('[Upload] Erreur upload cover:', error?.message || error);
    res.status(500).json({ success: false, message: error?.message || 'Erreur upload cover' });
  }
});

export default router;
