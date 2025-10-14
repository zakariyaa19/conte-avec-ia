import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Servir les PDFs d'exemple
router.get('/examples/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    // Sécurité : vérifier que le nom de fichier est valide
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Nom de fichier invalide' });
    }
    
    // Construire le chemin vers le PDF
    const pdfPath = path.join(__dirname, '../../pdfs/examples', filename);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF non trouvé' });
    }
    
    // Définir les headers pour PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Envoyer le fichier
    res.sendFile(pdfPath);
    
  } catch (error) {
    console.error('Erreur lors de la lecture du PDF:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la lecture du PDF' });
  }
});

// Lister les PDFs d'exemple disponibles
router.get('/examples', (req, res) => {
  try {
    const examplesDir = path.join(__dirname, '../../pdfs/examples');
    
    // Vérifier que le dossier existe
    if (!fs.existsSync(examplesDir)) {
      return res.json({ pdfs: [] });
    }
    
    // Lire le contenu du dossier
    const files = fs.readdirSync(examplesDir)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        filename: file,
        name: file.replace('.pdf', '').replace(/-/g, ' '),
        url: `/api/pdfs/examples/${file}`
      }));
    
    res.json({ pdfs: files });
    
  } catch (error) {
    console.error('Erreur lors de la lecture du dossier PDFs:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la lecture des PDFs' });
  }
});

export default router;
