import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Creer les dossiers uploads s'ils n'existent pas
const uploadsDir = path.join(__dirname, '../../uploads');
const pdfsDir = path.join(__dirname, '../../uploads/pdfs');
const coversDir = path.join(__dirname, '../../uploads/covers');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true });
}
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

// Configuration du stockage pour les photos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${extension}`);
  }
});

// Configuration du stockage pour les PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `story-${uniqueSuffix}${extension}`);
  }
});

// Filtrer les types de fichiers images
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont acceptes'));
  }
};

// Filtrer les types de fichiers PDF
const pdfFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptes'));
  }
};

// Upload de photos (15MB fichier pour photos iPhone haute résolution, 50MB champs texte)
export const upload = multer({
  storage: photoStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024,
  }
});

// Upload de PDFs (50MB)
export const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
});
