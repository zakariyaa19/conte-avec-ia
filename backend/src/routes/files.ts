import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../utils/database';

const router = Router();

// Middleware pour autoriser le chargement cross-origin des fichiers
// Nécessaire car helmet pose Cross-Origin-Resource-Policy: same-origin par défaut
const allowCrossOrigin = (req: Request, res: Response, next: Function) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

// Route pour servir les images uploadées avec gestion d'erreur
router.get('/image/:filename', allowCrossOrigin, (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    // Vérifier que le nom de fichier est sécurisé
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier invalide'
      });
    }

    // Chemins possibles pour les images
    const uploadPath = path.join(__dirname, '../../uploads', filename);
    const imagePath = path.join(__dirname, '../../images', filename);

    // Vérifier d'abord dans uploads
    if (fs.existsSync(uploadPath)) {
      return res.sendFile(uploadPath);
    }

    // Puis dans images
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }

    // Image non trouvée
    res.status(404).json({
      success: false,
      message: 'Image non trouvée'
    });

  } catch (error) {
    console.error('❌ Erreur serveur image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'image'
    });
  }
});

// Route pour servir les couvertures de contes
// Priorite : fichier disque > base de donnees (fallback apres redeploy Render)
router.get('/cover/:filename', allowCrossOrigin, async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier invalide'
      });
    }

    // 1) Essayer depuis le disque
    const coverPath = path.join(__dirname, '../../uploads/covers', filename);
    if (fs.existsSync(coverPath)) {
      return res.sendFile(coverPath);
    }

    // 2) Fallback : chercher dans la base de donnees (survit aux redeploys)
    const order = await prisma.order.findFirst({
      where: { coverImageUrl: `/uploads/covers/${filename}` },
      select: { coverImageData: true }
    });

    if (order?.coverImageData) {
      // Re-ecrire le fichier sur disque pour les prochaines requetes
      const coversDir = path.join(__dirname, '../../uploads/covers');
      if (!fs.existsSync(coversDir)) {
        fs.mkdirSync(coversDir, { recursive: true });
      }
      fs.writeFileSync(coverPath, Buffer.from(order.coverImageData));
      console.log(`[COVER] Fichier restaure depuis DB: ${coverPath}`);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.send(Buffer.from(order.coverImageData));
    }

    res.status(404).json({
      success: false,
      message: 'Couverture non trouvée'
    });

  } catch (error) {
    console.error('❌ Erreur serveur couverture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la couverture'
    });
  }
});

export default router;
