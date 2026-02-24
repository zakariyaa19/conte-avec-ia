import fs, { promises as fsp } from 'fs';
import path from 'path';

const coversDir = path.join(__dirname, '../../uploads/covers');

// Cache : ne vérifier/créer le dossier qu'une seule fois
let dirEnsured = false;
async function ensureDir() {
  if (dirEnsured) return;
  try { await fsp.mkdir(coversDir, { recursive: true }); } catch {}
  dirEnsured = true;
}

// Créer le dossier au démarrage (sync, une seule fois)
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}
dirEnsured = true;

export function saveCoverImage(base64Data: string): { url: string; buffer: Buffer } {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `cover-${uniqueSuffix}.png`;
  const url = `/uploads/covers/${filename}`;

  const buffer = Buffer.from(base64Data, 'base64');

  // Écriture disque en arrière-plan (fire-and-forget)
  // Si l'écriture échoue, le fallback DB→disque dans routes/files.ts restaure le fichier
  const filePath = path.join(coversDir, filename);
  ensureDir().then(() =>
    fsp.writeFile(filePath, buffer)
      .then(() => console.log(`[COVER] Image saved: ${filePath} (${buffer.length} bytes)`))
      .catch(err => console.error('[COVER] Write error (DB fallback active):', err))
  );

  return { url, buffer };
}
