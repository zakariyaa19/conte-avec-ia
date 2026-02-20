import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Route pour servir les images uploadées avec gestion d'erreur
router.get('/image/:filename', (req: Request, res: Response) => {
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

export default router;
