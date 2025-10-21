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
    
    console.log('🔍 Recherche image:', filename);
    console.log('📁 Chemin uploads:', uploadPath);
    console.log('📁 Chemin images:', imagePath);

    // Vérifier d'abord dans uploads
    if (fs.existsSync(uploadPath)) {
      console.log('✅ Image trouvée dans uploads');
      return res.sendFile(uploadPath);
    }
    
    // Puis dans images
    if (fs.existsSync(imagePath)) {
      console.log('✅ Image trouvée dans images');
      return res.sendFile(imagePath);
    }

    // Image non trouvée
    console.log('❌ Image non trouvée:', filename);
    res.status(404).json({
      success: false,
      message: 'Image non trouvée',
      filename: filename,
      searchPaths: [uploadPath, imagePath]
    });

  } catch (error) {
    console.error('❌ Erreur serveur image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'image'
    });
  }
});

// Route pour lister les images disponibles (debug)
router.get('/list', (req: Request, res: Response) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const imagesDir = path.join(__dirname, '../../images');
    
    const uploadFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    const imageFiles = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
    
    res.json({
      success: true,
      data: {
        uploads: uploadFiles,
        images: imageFiles,
        uploadPath: uploadsDir,
        imagePath: imagesDir
      }
    });
  } catch (error) {
    console.error('❌ Erreur liste images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la liste des images'
    });
  }
});

export default router;
