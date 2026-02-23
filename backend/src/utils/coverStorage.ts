import fs from 'fs';
import path from 'path';

const coversDir = path.join(__dirname, '../../uploads/covers');

export function saveCoverImage(base64Data: string): string {
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `cover-${uniqueSuffix}.png`;
  const filePath = path.join(coversDir, filename);

  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  console.log(`[COVER] Image saved: ${filePath} (${buffer.length} bytes)`);

  return `/uploads/covers/${filename}`;
}
