import { Router, Request, Response } from 'express';
import { saveCoverImage } from '../utils/coverStorage';

const router = Router();

// Rate limiting simple en mémoire — max 10 uploads par IP par minute
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
function rateLimitCheck(ip: string): boolean {
  const now = Date.now();
  const entry = uploadCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// Upload cover image base64 → Cloudinary, retourne l'URL
// Appelé AVANT la soumission du formulaire pour éviter d'envoyer 20MB de base64 dans le JSON
router.post('/cover', async (req: Request, res: Response) => {
  try {
    // Rate limiting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!rateLimitCheck(ip)) {
      return res.status(429).json({ success: false, message: 'Trop de requêtes. Réessayez dans 1 minute.' });
    }

    const { coverImageBase64 } = req.body;

    if (!coverImageBase64 || typeof coverImageBase64 !== 'string') {
      return res.status(400).json({ success: false, message: 'coverImageBase64 requis' });
    }

    // Vérifier que c'est bien du base64 image (pas un fichier arbitraire)
    const stripped = coverImageBase64.includes(',') ? coverImageBase64.split(',')[1] : coverImageBase64;
    if (stripped.length < 1000 || stripped.length > 30_000_000) {
      return res.status(400).json({ success: false, message: 'Taille image invalide' });
    }

    console.log(`[Upload] Cover base64 reçu: ${(stripped.length / 1024 / 1024).toFixed(1)}MB depuis ${ip}`);

    const result = await saveCoverImage(coverImageBase64);

    console.log(`[Upload] Cover uploadée: ${result.url}`);
    res.json({ success: true, url: result.url });
  } catch (error: any) {
    console.error('[Upload] Erreur upload cover:', error?.message || error);
    res.status(500).json({ success: false, message: error?.message || 'Erreur upload cover' });
  }
});

export default router;
