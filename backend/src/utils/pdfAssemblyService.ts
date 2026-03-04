import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { IMAGE_PARAGRAPH_INDICES } from './storyImageGenerator';

// --- Types ---

type PdfColor = ReturnType<typeof rgb>;

interface AccentColors {
  bg: PdfColor;
  dark: PdfColor;
}

export interface PdfAssemblyParams {
  title: string;
  creatorName: string;
  paragraphs: string[]; // 12 paragraphs
  coverImage: Buffer;   // Cover image (portrait, from order's coverImageData)
  images: Buffer[];     // 6 interior images (mapped to IMAGE_PARAGRAPH_INDICES)
}

interface PdfFonts {
  regular: PDFFont;
  bold: PDFFont;
  storyFont: PDFFont;
  storyBold: PDFFont;
  pageNumFont: PDFFont;
}

// --- Constants ---

const PAGE_WIDTH = 900;
const PAGE_HEIGHT = 600;
const HALF_WIDTH = 450;
const CREAM_BG = rgb(250 / 255, 243 / 255, 224 / 255);
const TEXT_COLOR = rgb(55 / 255, 55 / 255, 55 / 255);
const HEADER_COLOR = rgb(120 / 255, 110 / 255, 100 / 255);
const WHITE = rgb(1, 1, 1);

const PAGE_ACCENT_CYCLE: AccentColors[] = [
  { bg: rgb(255 / 255, 218 / 255, 185 / 255), dark: rgb(242 / 255, 178 / 255, 135 / 255) }, // Peach
  { bg: rgb(183 / 255, 228 / 255, 209 / 255), dark: rgb(143 / 255, 202 / 255, 175 / 255) }, // Mint
  { bg: rgb(205 / 255, 193 / 255, 229 / 255), dark: rgb(175 / 255, 158 / 255, 210 / 255) }, // Lavande
  { bg: rgb(186 / 255, 218 / 255, 241 / 255), dark: rgb(146 / 255, 188 / 255, 216 / 255) }, // Bleu ciel
  { bg: rgb(253 / 255, 236 / 255, 179 / 255), dark: rgb(240 / 255, 210 / 255, 130 / 255) }, // Jaune doux
  { bg: rgb(248 / 255, 196 / 255, 182 / 255), dark: rgb(230 / 255, 160 / 255, 142 / 255) }, // Corail
];

// --- Font loading ---

async function loadFonts(pdfDoc: PDFDocument): Promise<PdfFonts> {
  pdfDoc.registerFontkit(fontkit);
  const fontsDir = path.join(__dirname, '../../assets/fonts');

  async function tryEmbed(...filenames: string[]): Promise<PDFFont | null> {
    for (const name of filenames) {
      try {
        const bytes = fs.readFileSync(path.join(fontsDir, name));
        return await pdfDoc.embedFont(bytes);
      } catch { /* try next */ }
    }
    return null;
  }

  // Regular & Bold (headers, metadata)
  const regular = await tryEmbed('Nunito-Regular.ttf') ?? await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await tryEmbed('Nunito-Bold.ttf') ?? await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Story font: Baloo2 -> ComicNeue -> Nunito -> Helvetica
  const storyFont = await tryEmbed('Baloo2-Regular.ttf', 'ComicNeue-Regular.ttf', 'Nunito-Regular.ttf')
    ?? await pdfDoc.embedFont(StandardFonts.Helvetica);
  const storyBold = await tryEmbed('Baloo2-Bold.ttf', 'ComicNeue-Bold.ttf', 'Nunito-Bold.ttf')
    ?? await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page number font: ComicNeue-Bold -> Baloo2-Bold -> storyBold
  const pageNumFont = await tryEmbed('ComicNeue-Bold.ttf', 'Baloo2-Bold.ttf') ?? storyBold;

  console.log('[PdfAssembly] Fonts loaded (Baloo2 + ComicNeue)');
  return { regular, bold, storyFont, storyBold, pageNumFont };
}

// --- Utility ---

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function isSvgPlaceholder(buf: Buffer): boolean {
  const head = buf.toString('utf-8', 0, Math.min(buf.length, 50));
  return head.includes('<svg') || head.includes('<?xml');
}

// --- Compress image to JPEG for smaller PDF ---

async function compressForPdf(imageBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch (err) {
    console.warn('[PdfAssembly] Compression failed, using original:', err);
    return imageBuffer;
  }
}

// --- Embed image (compress then embed as JPEG) ---

async function embedImage(pdfDoc: PDFDocument, imageBuffer: Buffer): Promise<ReturnType<PDFDocument['embedPng']>> {
  const compressed = await compressForPdf(imageBuffer);
  try {
    return await pdfDoc.embedJpg(compressed);
  } catch {
    try {
      return await pdfDoc.embedPng(imageBuffer);
    } catch (err) {
      throw new Error(`Image format non supporte: ${err}`);
    }
  }
}

// --- Decoration functions (all vectorial, 0 external images) ---

function drawStar(page: PDFPage, cx: number, cy: number, radius: number, color: PdfColor, opacity: number) {
  const inner = radius * 0.4;
  const parts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : inner;
    const angle = Math.PI / 2 + (i * Math.PI / 5);
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    parts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  page.drawSvgPath(parts.join(' ') + ' Z', { x: cx, y: cy, color, opacity });
}

function drawHeart(page: PDFPage, cx: number, cy: number, size: number, color: PdfColor, opacity: number) {
  const s = size;
  const d = `M 0 ${-s} ` +
    `C ${s * 0.6} ${-s} ${s * 0.7} ${s * 0.6} 0 ${s * 0.3} ` +
    `C ${-s * 0.7} ${s * 0.6} ${-s * 0.6} ${-s} 0 ${-s} Z`;
  page.drawSvgPath(d, { x: cx, y: cy, color, opacity });
}

function drawCornerDecoration(
  page: PDFPage,
  corner: 'tl' | 'tr' | 'bl' | 'br',
  area: { x: number; y: number; w: number; h: number },
  colors: AccentColors
) {
  const margin = 25;
  let cx: number, cy: number, dx: number, dy: number;
  switch (corner) {
    case 'tl': cx = area.x + margin; cy = area.y + area.h - margin; dx = 1; dy = -1; break;
    case 'tr': cx = area.x + area.w - margin; cy = area.y + area.h - margin; dx = -1; dy = -1; break;
    case 'bl': cx = area.x + margin; cy = area.y + margin; dx = 1; dy = 1; break;
    case 'br': cx = area.x + area.w - margin; cy = area.y + margin; dx = -1; dy = 1; break;
  }

  // Small star
  drawStar(page, cx, cy, 6, colors.dark, 0.5);

  // Cluster of dots around the star
  const dotOffsets = [
    { x: 10, y: 5 }, { x: 5, y: 12 }, { x: 14, y: 14 },
    { x: -3, y: 10 }, { x: 12, y: -2 }, { x: 8, y: 18 },
  ];
  for (const dp of dotOffsets) {
    page.drawCircle({
      x: cx + dp.x * dx,
      y: cy + dp.y * dy,
      size: 1.5 + (dp.x % 3) * 0.5,
      color: colors.bg,
      opacity: 0.5,
    });
  }
}

function drawSoftBorder(
  page: PDFPage,
  x: number, y: number, w: number, h: number,
  color: PdfColor,
  inset: number
) {
  const ix = x + inset;
  const iy = y + inset;
  const iw = w - inset * 2;
  const ih = h - inset * 2;
  const r = 4;

  // 4 lines
  page.drawLine({ start: { x: ix + r, y: iy + ih }, end: { x: ix + iw - r, y: iy + ih }, thickness: 1, color, opacity: 0.4 });
  page.drawLine({ start: { x: ix + r, y: iy }, end: { x: ix + iw - r, y: iy }, thickness: 1, color, opacity: 0.4 });
  page.drawLine({ start: { x: ix, y: iy + r }, end: { x: ix, y: iy + ih - r }, thickness: 1, color, opacity: 0.4 });
  page.drawLine({ start: { x: ix + iw, y: iy + r }, end: { x: ix + iw, y: iy + ih - r }, thickness: 1, color, opacity: 0.4 });

  // 4 corner circles
  page.drawCircle({ x: ix + r, y: iy + r, size: r, color, opacity: 0.3 });
  page.drawCircle({ x: ix + iw - r, y: iy + r, size: r, color, opacity: 0.3 });
  page.drawCircle({ x: ix + r, y: iy + ih - r, size: r, color, opacity: 0.3 });
  page.drawCircle({ x: ix + iw - r, y: iy + ih - r, size: r, color, opacity: 0.3 });
}

function drawScatteredDots(
  page: PDFPage,
  area: { x: number; y: number; w: number; h: number },
  color: PdfColor,
  seed: number,
  count: number = 8
) {
  const rng = seededRandom(seed);
  const n = count + Math.floor(rng() * 3); // count to count+2
  const edgeFrac = 0.15; // dots within 15% of edges

  for (let i = 0; i < n; i++) {
    const edge = Math.floor(rng() * 4);
    let px: number, py: number;
    switch (edge) {
      case 0: px = area.x + rng() * area.w; py = area.y + area.h - rng() * area.h * edgeFrac; break;
      case 1: px = area.x + rng() * area.w; py = area.y + rng() * area.h * edgeFrac; break;
      case 2: px = area.x + rng() * area.w * edgeFrac; py = area.y + rng() * area.h; break;
      default: px = area.x + area.w - rng() * area.w * edgeFrac; py = area.y + rng() * area.h; break;
    }
    page.drawCircle({
      x: px, y: py,
      size: 1 + rng() * 2,
      color,
      opacity: 0.15 + rng() * 0.2,
    });
  }
}

function drawTextDivider(page: PDFPage, cx: number, y: number, colors: AccentColors) {
  const lineLen = 40;
  const gap = 8;

  // dot — line — star — line — dot
  page.drawCircle({ x: cx - lineLen - gap, y, size: 2.5, color: colors.bg, opacity: 0.6 });
  page.drawLine({ start: { x: cx - lineLen, y }, end: { x: cx - gap, y }, thickness: 1, color: colors.dark, opacity: 0.3 });
  drawStar(page, cx, y, 5, colors.dark, 0.5);
  page.drawLine({ start: { x: cx + gap, y }, end: { x: cx + lineLen, y }, thickness: 1, color: colors.dark, opacity: 0.3 });
  page.drawCircle({ x: cx + lineLen + gap, y, size: 2.5, color: colors.bg, opacity: 0.6 });
}

function drawPlayfulPageNumber(
  page: PDFPage,
  num: number,
  font: PDFFont,
  cx: number,
  colors: AccentColors
) {
  const y = 30;
  const mainR = 16;

  // Filled circle
  page.drawCircle({ x: cx, y, size: mainR, color: colors.bg, opacity: 0.7 });
  // Inner ring (outline only)
  page.drawCircle({ x: cx, y, size: mainR - 3, borderColor: colors.dark, borderWidth: 1, borderOpacity: 0.3 });

  // Page number text
  const numStr = String(num);
  const numWidth = font.widthOfTextAtSize(numStr, 13);
  page.drawText(numStr, {
    x: cx - numWidth / 2,
    y: y - 5,
    size: 13,
    font,
    color: TEXT_COLOR,
  });

  // Orbital dots
  const orbitR = mainR + 6;
  for (const angle of [Math.PI / 4, Math.PI * 3 / 4, Math.PI * 5 / 4]) {
    page.drawCircle({
      x: cx + orbitR * Math.cos(angle),
      y: y + orbitR * Math.sin(angle),
      size: 1.5,
      color: colors.dark,
      opacity: 0.4,
    });
  }
}

// --- Draw placeholder rectangle (for dry run SVGs) ---

function drawPlaceholder(page: PDFPage, x: number, y: number, width: number, height: number, index: number) {
  const colors = [
    rgb(1, 0.42, 0.42),    // red
    rgb(0.31, 0.8, 0.77),  // teal
    rgb(0.27, 0.72, 0.82), // blue
    rgb(0.59, 0.81, 0.71), // green
    rgb(1, 0.92, 0.65),    // yellow
    rgb(0.87, 0.63, 0.87), // purple
    rgb(0.6, 0.88, 0.78),  // mint
    rgb(0.97, 0.86, 0.44), // gold
    rgb(0.73, 0.56, 0.81), // violet
    rgb(0.52, 0.76, 0.91), // sky
    rgb(0.94, 0.7, 0.48),  // orange
    rgb(0.51, 0.88, 0.67), // lime
    rgb(0.97, 0.77, 0.44), // amber
  ];

  page.drawRectangle({
    x, y, width, height,
    color: colors[index % colors.length],
  });
}

// --- Draw text on a half-page (with light decorations) ---

function drawTextBlock(
  page: PDFPage,
  paragraph: string,
  creatorName: string,
  fonts: PdfFonts,
  xOffset: number,
  pageIndex: number,
  imageOnRight: boolean
) {
  const padding = 40;
  const textAreaWidth = HALF_WIDTH - padding * 2;
  const centerX = xOffset + HALF_WIDTH / 2;
  const colors = PAGE_ACCENT_CYCLE[(pageIndex - 2) % PAGE_ACCENT_CYCLE.length];
  const area = { x: xOffset, y: 0, w: HALF_WIDTH, h: PAGE_HEIGHT };

  // Cream background
  page.drawRectangle({
    x: xOffset, y: 0,
    width: HALF_WIDTH, height: PAGE_HEIGHT,
    color: CREAM_BG,
  });

  // --- Light decorations ---
  drawSoftBorder(page, xOffset, 0, HALF_WIDTH, PAGE_HEIGHT, colors.dark, 18);

  // 2 corner decorations on the side opposite the image
  if (imageOnRight) {
    drawCornerDecoration(page, 'tl', area, colors);
    drawCornerDecoration(page, 'bl', area, colors);
  } else {
    drawCornerDecoration(page, 'tr', area, colors);
    drawCornerDecoration(page, 'br', area, colors);
  }

  // ~6 scattered dots
  drawScatteredDots(page, area, colors.bg, pageIndex * 7, 6);

  // Header: creatorName in small caps at top-left
  if (creatorName) {
    const headerText = creatorName.toUpperCase();
    page.drawText(headerText, {
      x: xOffset + padding,
      y: PAGE_HEIGHT - 40,
      size: 9,
      font: fonts.bold,
      color: HEADER_COLOR,
    });
  }

  // Body: paragraph text in Baloo2, centered horizontally
  const fontSize = 14;
  const lineHeight = fontSize * 2.0;
  const lines = wrapText(paragraph, fonts.storyFont, fontSize, textAreaWidth);

  // Center text block vertically
  const totalTextHeight = lines.length * lineHeight;
  let startY = PAGE_HEIGHT / 2 + totalTextHeight / 2;
  if (startY > PAGE_HEIGHT - 60) startY = PAGE_HEIGHT - 60;

  for (let i = 0; i < lines.length; i++) {
    const y = startY - i * lineHeight;
    if (y < 60) break; // Stop before footer area
    // Center each line horizontally
    const lineWidth = fonts.storyFont.widthOfTextAtSize(lines[i], fontSize);
    page.drawText(lines[i], {
      x: centerX - lineWidth / 2,
      y,
      size: fontSize,
      font: fonts.storyFont,
      color: TEXT_COLOR,
    });
  }

  // Text divider below paragraph
  const lastLineY = startY - (lines.length - 1) * lineHeight;
  if (lastLineY - 25 > 55) {
    drawTextDivider(page, centerX, lastLineY - 25, colors);
  }

  // Playful page number
  drawPlayfulPageNumber(page, pageIndex - 1, fonts.pageNumFont, centerX, colors);
}

// --- Draw text on a full page (rich decorations) ---

function drawFullPageText(
  page: PDFPage,
  paragraph: string,
  creatorName: string,
  fonts: PdfFonts,
  pageIndex: number
) {
  const padding = 80;
  const textAreaWidth = PAGE_WIDTH - padding * 2;
  const centerX = PAGE_WIDTH / 2;
  const colors = PAGE_ACCENT_CYCLE[(pageIndex - 2) % PAGE_ACCENT_CYCLE.length];
  const area = { x: 0, y: 0, w: PAGE_WIDTH, h: PAGE_HEIGHT };

  // Cream background
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: CREAM_BG,
  });

  // --- Rich decorations ---
  // Double border (outer + inner)
  drawSoftBorder(page, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, colors.dark, 16);
  drawSoftBorder(page, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, colors.bg, 28);

  // 4 corner decorations
  drawCornerDecoration(page, 'tl', area, colors);
  drawCornerDecoration(page, 'tr', area, colors);
  drawCornerDecoration(page, 'bl', area, colors);
  drawCornerDecoration(page, 'br', area, colors);

  // 2 small hearts in opposite corners
  drawHeart(page, 55, PAGE_HEIGHT - 55, 7, colors.dark, 0.3);
  drawHeart(page, PAGE_WIDTH - 55, 55, 7, colors.dark, 0.3);

  // ~10 scattered dots
  drawScatteredDots(page, area, colors.bg, pageIndex * 13, 10);

  // Header: creatorName in small caps
  if (creatorName) {
    const headerText = creatorName.toUpperCase();
    page.drawText(headerText, {
      x: padding,
      y: PAGE_HEIGHT - 40,
      size: 9,
      font: fonts.bold,
      color: HEADER_COLOR,
    });
  }

  // Body: paragraph text in Baloo2, centered
  const fontSize = 16;
  const lineHeight = fontSize * 2.2;
  const lines = wrapText(paragraph, fonts.storyFont, fontSize, textAreaWidth);

  // Center text block vertically
  const totalTextHeight = lines.length * lineHeight;
  let startY = PAGE_HEIGHT / 2 + totalTextHeight / 2;
  if (startY > PAGE_HEIGHT - 60) startY = PAGE_HEIGHT - 60;

  // Divider above text
  drawTextDivider(page, centerX, startY + 20, colors);

  for (let i = 0; i < lines.length; i++) {
    const y = startY - i * lineHeight;
    if (y < 60) break;
    const lineWidth = fonts.storyFont.widthOfTextAtSize(lines[i], fontSize);
    page.drawText(lines[i], {
      x: centerX - lineWidth / 2,
      y,
      size: fontSize,
      font: fonts.storyFont,
      color: TEXT_COLOR,
    });
  }

  // Divider below text
  const lastLineY = startY - (lines.length - 1) * lineHeight;
  if (lastLineY - 25 > 55) {
    drawTextDivider(page, centerX, lastLineY - 25, colors);
  }

  // Playful page number
  drawPlayfulPageNumber(page, pageIndex - 1, fonts.pageNumFont, centerX, colors);
}

// --- Draw image on a half-page (unchanged) ---

async function drawImageHalf(
  page: PDFPage,
  pdfDoc: PDFDocument,
  imageBuffer: Buffer,
  xOffset: number,
  imageIndex: number
) {
  // SVG placeholder (dry run) — draw colored rectangle directly
  if (isSvgPlaceholder(imageBuffer)) {
    drawPlaceholder(page, xOffset, 0, HALF_WIDTH, PAGE_HEIGHT, imageIndex);
    return;
  }

  try {
    const img = await embedImage(pdfDoc, imageBuffer);
    const imgWidth = img.width;
    const imgHeight = img.height;
    const targetWidth = HALF_WIDTH;
    const targetHeight = PAGE_HEIGHT;

    const scaleX = targetWidth / imgWidth;
    const scaleY = targetHeight / imgHeight;
    const scale = Math.max(scaleX, scaleY);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const drawX = xOffset + (targetWidth - drawWidth) / 2;
    const drawY = (targetHeight - drawHeight) / 2;

    page.drawImage(img, {
      x: drawX, y: drawY,
      width: drawWidth, height: drawHeight,
    });
  } catch (error: any) {
    console.error(`[PdfAssembly] Error embedding image ${imageIndex}:`, error.message);
    drawPlaceholder(page, xOffset, 0, HALF_WIDTH, PAGE_HEIGHT, imageIndex);
  }
}

// --- Draw cover page: portrait image centered on white background (unchanged) ---

async function drawCoverPage(
  page: PDFPage,
  pdfDoc: PDFDocument,
  coverImage: Buffer
) {
  // White background (default)
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: WHITE,
  });

  // SVG placeholder (dry run)
  if (isSvgPlaceholder(coverImage)) {
    const placeholderW = 300;
    drawPlaceholder(
      page,
      (PAGE_WIDTH - placeholderW) / 2,
      0,
      placeholderW,
      PAGE_HEIGHT,
      0
    );
    return;
  }

  try {
    const coverImg = await embedImage(pdfDoc, coverImage);
    const imgWidth = coverImg.width;
    const imgHeight = coverImg.height;

    const scale = PAGE_HEIGHT / imgHeight;
    const drawWidth = imgWidth * scale;
    const drawHeight = PAGE_HEIGHT;

    const drawX = (PAGE_WIDTH - drawWidth) / 2;
    const drawY = 0;

    page.drawImage(coverImg, {
      x: drawX, y: drawY,
      width: drawWidth, height: drawHeight,
    });
  } catch (error: any) {
    console.error('[PdfAssembly] Error embedding cover image:', error.message);
    const placeholderW = 300;
    drawPlaceholder(
      page,
      (PAGE_WIDTH - placeholderW) / 2,
      0,
      placeholderW,
      PAGE_HEIGHT,
      0
    );
  }
}

// --- Main assembly ---

export async function assemblePdf(params: PdfAssemblyParams): Promise<Buffer> {
  const { title, creatorName, paragraphs, coverImage, images } = params;

  const expectedImages = IMAGE_PARAGRAPH_INDICES.length; // 6

  if (paragraphs.length !== 12) {
    throw new Error(`Attendu 12 paragraphes, recu ${paragraphs.length}`);
  }
  if (images.length !== expectedImages) {
    throw new Error(`Attendu ${expectedImages} images, recu ${images.length}`);
  }

  console.log(`[PdfAssembly] Starting PDF assembly: 13 pages (${expectedImages} illustrated, ${12 - expectedImages} text-only)`);

  const pdfDoc = await PDFDocument.create();
  const fonts = await loadFonts(pdfDoc);

  // Build set for quick lookup: which paragraph indices have an image
  const illustratedSet = new Set(IMAGE_PARAGRAPH_INDICES);

  // --- Page 1: Cover (portrait image centered on white background, NO text) ---
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    await drawCoverPage(page, pdfDoc, coverImage);
  }

  // --- Pages 2-13: Mix of text+image and text-only pages ---
  let imageCounter = 0; // tracks which image buffer to use (0..5)

  for (let p = 0; p < 12; p++) {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    if (illustratedSet.has(p)) {
      // Page avec illustration — layout demi-page texte + demi-page image
      const imgIdx = imageCounter;
      const isEvenPage = imageCounter % 2 === 0;
      const imageOnRight = isEvenPage;

      if (isEvenPage) {
        // Image RIGHT, Texte LEFT
        await drawImageHalf(page, pdfDoc, images[imgIdx], HALF_WIDTH, imgIdx);
        drawTextBlock(page, paragraphs[p], creatorName, fonts, 0, p + 2, imageOnRight);
      } else {
        // Image LEFT, Texte RIGHT
        await drawImageHalf(page, pdfDoc, images[imgIdx], 0, imgIdx);
        drawTextBlock(page, paragraphs[p], creatorName, fonts, HALF_WIDTH, p + 2, imageOnRight);
      }

      // Release image buffer after embedding
      (images as any)[imgIdx] = null;
      imageCounter++;
    } else {
      // Page texte seul — pleine page avec decorations riches
      drawFullPageText(page, paragraphs[p], creatorName, fonts, p + 2);
    }
  }

  // Serialize and return directly as Buffer (avoid keeping both pdfBytes and Buffer)
  const pdfBytes = await pdfDoc.save();
  console.log(`[PdfAssembly] PDF assembled: ${pdfBytes.length} bytes, 13 pages`);

  return Buffer.from(pdfBytes as Uint8Array);
}
