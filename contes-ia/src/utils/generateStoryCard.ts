/**
 * Generates a 1080x1920 (9:16) story-ready image card
 * with the book cover, title, and branding.
 * Used for Instagram/TikTok/WhatsApp story sharing.
 */

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

export async function generateStoryCard(
  coverImageUrl: string,
  bookTitle: string,
  protagonistName: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Load cover image (CORS-safe via fetch + objectURL)
  let img: HTMLImageElement | null = null;
  try {
    img = await loadImageSafe(coverImageUrl);
  } catch {
    // Image loading failed — generate text-only card
    console.warn('[StoryCard] Image load failed, generating text-only card');
  }

  if (img) {
    // === BACKGROUND: blurred cover ===
    ctx.save();
    ctx.filter = 'blur(60px) brightness(0.4) saturate(1.3)';
    ctx.drawImage(img, -100, -100, CARD_WIDTH + 200, CARD_HEIGHT + 200);
    ctx.restore();
  } else {
    // Fallback background gradient
    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
    grad.addColorStop(0, '#1a1428');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  }

  // === Dark overlay ===
  const overlay = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  overlay.addColorStop(0, 'rgba(0,0,0,0.3)');
  overlay.addColorStop(0.4, 'rgba(0,0,0,0.1)');
  overlay.addColorStop(0.7, 'rgba(0,0,0,0.2)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  if (img) {
    // === COVER IMAGE: centered, large, with rounded corners ===
    const coverSize = 680;
    const coverX = (CARD_WIDTH - coverSize) / 2;
    const coverY = 280;
    const radius = 40;

    // Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 20;
    roundRect(ctx, coverX, coverY, coverSize, coverSize, radius);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    // Clipped cover
    ctx.save();
    roundRect(ctx, coverX, coverY, coverSize, coverSize, radius);
    ctx.clip();
    const imgRatio = img.width / img.height;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (imgRatio > 1) { sw = img.height; sx = (img.width - sw) / 2; }
    else { sh = img.width; sy = (img.height - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, coverX, coverY, coverSize, coverSize);
    ctx.restore();

    // Border
    ctx.save();
    roundRect(ctx, coverX, coverY, coverSize, coverSize, radius);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // === TITLE ===
  const titleY = img ? 280 + 680 + 100 : CARD_HEIGHT / 2 - 60;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.font = 'bold 56px sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 20;
  wrapText(ctx, bookTitle, CARD_WIDTH / 2, titleY, CARD_WIDTH - 120, 68);
  ctx.shadowBlur = 0;

  // === SUBTITLE ===
  ctx.font = '36px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(`L'histoire de ${protagonistName}`, CARD_WIDTH / 2, titleY + 120);

  // === CTA ===
  const ctaY = CARD_HEIGHT - 200;
  ctx.font = '600 28px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('Créez le vôtre gratuitement', CARD_WIDTH / 2, ctaY);

  // === BRANDING ===
  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#FF9999';
  ctx.fillText('contedia.fr', CARD_WIDTH / 2, CARD_HEIGHT - 80);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
      'image/png', 1
    );
  });
}

// Load image via fetch to avoid CORS cache issues
async function loadImageSafe(url: string): Promise<HTMLImageElement> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(objectUrl); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Image load failed')); };
      img.src = objectUrl;
    });
  } catch {
    // Fallback: try direct load
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
