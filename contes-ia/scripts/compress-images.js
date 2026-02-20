const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Config par dossier
const CONFIG = {
  'images/blog':              { maxWidth: 800,  jpegQuality: 75, pngQuality: 75 },
  'images/covers':            { maxWidth: 800,  jpegQuality: 75, pngQuality: 75 },
  'images/examples':          { maxWidth: 800,  jpegQuality: 75, pngQuality: 75 },
  'images/homepage':          { maxWidth: 1200, jpegQuality: 78, pngQuality: 78 },
  'images/illustration-styles': { maxWidth: 400, jpegQuality: 75, pngQuality: 75 },
  'image/messages':           { maxWidth: 400,  jpegQuality: 75, pngQuality: 80 },
  'image/occasions':          { maxWidth: 400,  jpegQuality: 75, pngQuality: 80 },
  'image/themes':             { maxWidth: 400,  jpegQuality: 75, pngQuality: 80 },
  'image/ageenfant':          { maxWidth: 400,  jpegQuality: 75, pngQuality: 80 },
};

// Default
const DEFAULT_CONFIG = { maxWidth: 1200, jpegQuality: 78, pngQuality: 80 };

function getConfig(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  for (const [prefix, cfg] of Object.entries(CONFIG)) {
    if (rel.startsWith(prefix)) return cfg;
  }
  return DEFAULT_CONFIG;
}

async function getAllImages(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await getAllImages(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function compressImage(filePath) {
  const cfg = getConfig(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const originalSize = fs.statSync(filePath).size;

  // Skip tiny files
  if (originalSize < 20000) return null;

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = sharp(filePath);

    // Resize si plus large que maxWidth
    if (metadata.width && metadata.width > cfg.maxWidth) {
      pipeline = pipeline.resize(cfg.maxWidth, null, { withoutEnlargement: true });
    }

    let buffer;
    if (ext === '.png') {
      buffer = await pipeline.png({ quality: cfg.pngQuality, compressionLevel: 9 }).toBuffer();
    } else {
      buffer = await pipeline.jpeg({ quality: cfg.jpegQuality, progressive: true }).toBuffer();
    }

    const newSize = buffer.length;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    // Ecrire seulement si on gagne au moins 5%
    if (newSize < originalSize * 0.95) {
      fs.writeFileSync(filePath, buffer);
      return { file: path.relative(PUBLIC_DIR, filePath), originalSize, newSize, savings: `${savings}%` };
    }

    return null;
  } catch (err) {
    console.error(`Erreur: ${path.relative(PUBLIC_DIR, filePath)}: ${err.message}`);
    return null;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

async function main() {
  console.log('=== Compression des images ===\n');

  const images = await getAllImages(PUBLIC_DIR);
  console.log(`${images.length} images trouvees\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let compressed = 0;

  for (const img of images) {
    const result = await compressImage(img);
    if (result) {
      compressed++;
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      console.log(`  ${result.file}: ${formatSize(result.originalSize)} -> ${formatSize(result.newSize)} (-${result.savings})`);
    }
  }

  console.log(`\n=== Resultat ===`);
  console.log(`${compressed}/${images.length} images compressees`);
  if (compressed > 0) {
    console.log(`Taille avant: ${formatSize(totalOriginal)}`);
    console.log(`Taille apres: ${formatSize(totalNew)}`);
    console.log(`Economie: ${formatSize(totalOriginal - totalNew)} (-${((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1)}%)`);
  }
}

main().catch(console.error);
