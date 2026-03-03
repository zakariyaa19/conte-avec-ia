import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

// --- Constants ---

const PAGE_WIDTH = 900;
const PAGE_HEIGHT = 600;
const HALF_WIDTH = 450;
const CREAM_BG = rgb(250 / 255, 243 / 255, 224 / 255); // Warm cream/beige
const GOLD_BADGE = rgb(218 / 255, 180 / 255, 100 / 255); // Warm gold for page number badge
const TEXT_COLOR = rgb(55 / 255, 55 / 255, 55 / 255);
const HEADER_COLOR = rgb(120 / 255, 110 / 255, 100 / 255); // Muted warm gray for header
const WHITE = rgb(1, 1, 1);

// --- Types ---

export interface PdfAssemblyParams {
  title: string;
  creatorName: string;
  paragraphs: string[]; // 12 paragraphs
  coverImage: Buffer;   // Cover image (portrait, from order's coverImageData)
  images: Buffer[];     // 12 interior images
}

// --- Font loading ---

async function loadFonts(pdfDoc: PDFDocument): Promise<{ regular: PDFFont; bold: PDFFont; storyFont: PDFFont }> {
  pdfDoc.registerFontkit(fontkit);

  const fontsDir = path.join(__dirname, '../../assets/fonts');
  const nunitoRegPath = path.join(fontsDir, 'Nunito-Regular.ttf');
  const nunitoBoldPath = path.join(fontsDir, 'Nunito-Bold.ttf');
  const comicNeuePath = path.join(fontsDir, 'ComicNeue-Regular.ttf');

  let regular: PDFFont;
  let bold: PDFFont;
  let storyFont: PDFFont;

  try {
    const regularBytes = fs.readFileSync(nunitoRegPath);
    const boldBytes = fs.readFileSync(nunitoBoldPath);
    regular = await pdfDoc.embedFont(regularBytes);
    bold = await pdfDoc.embedFont(boldBytes);
  } catch (error) {
    console.warn('[PdfAssembly] Nunito non trouve, fallback Helvetica:', error);
    regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  try {
    const comicNeueBytes = fs.readFileSync(comicNeuePath);
    storyFont = await pdfDoc.embedFont(comicNeueBytes);
    console.log('[PdfAssembly] Comic Neue charge avec succes');
  } catch (error) {
    console.warn('[PdfAssembly] Comic Neue non trouve, fallback Nunito:', error);
    storyFont = regular;
  }

  return { regular, bold, storyFont };
}

// --- Word wrap ---

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

// --- Check if buffer is an SVG placeholder (dry run) ---

function isSvgPlaceholder(buf: Buffer): boolean {
  const head = buf.toString('utf-8', 0, Math.min(buf.length, 50));
  return head.includes('<svg') || head.includes('<?xml');
}

// --- Embed image (PNG/JPEG only — SVG must be filtered out before calling) ---

async function embedImage(pdfDoc: PDFDocument, imageBuffer: Buffer): Promise<ReturnType<PDFDocument['embedPng']>> {
  try {
    return await pdfDoc.embedPng(imageBuffer);
  } catch {
    try {
      return await pdfDoc.embedJpg(imageBuffer);
    } catch (err) {
      throw new Error(`Image format non supporte: ${err}`);
    }
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

// --- Draw page number badge (rounded rectangle, bottom-left) ---

function drawPageNumber(page: PDFPage, pageNum: number, font: PDFFont, xOffset: number) {
  const badgeWidth = 36;
  const badgeHeight = 28;
  const badgeX = xOffset + 25;
  const badgeY = 18;
  const cornerRadius = 8;

  // Draw rounded rectangle badge using overlapping rectangles + circles
  // Main body
  page.drawRectangle({
    x: badgeX + cornerRadius,
    y: badgeY,
    width: badgeWidth - cornerRadius * 2,
    height: badgeHeight,
    color: GOLD_BADGE,
  });
  page.drawRectangle({
    x: badgeX,
    y: badgeY + cornerRadius,
    width: badgeWidth,
    height: badgeHeight - cornerRadius * 2,
    color: GOLD_BADGE,
  });
  // Four corner circles
  page.drawCircle({ x: badgeX + cornerRadius, y: badgeY + cornerRadius, size: cornerRadius, color: GOLD_BADGE });
  page.drawCircle({ x: badgeX + badgeWidth - cornerRadius, y: badgeY + cornerRadius, size: cornerRadius, color: GOLD_BADGE });
  page.drawCircle({ x: badgeX + cornerRadius, y: badgeY + badgeHeight - cornerRadius, size: cornerRadius, color: GOLD_BADGE });
  page.drawCircle({ x: badgeX + badgeWidth - cornerRadius, y: badgeY + badgeHeight - cornerRadius, size: cornerRadius, color: GOLD_BADGE });

  // Page number text
  const numStr = String(pageNum);
  const numWidth = font.widthOfTextAtSize(numStr, 12);
  page.drawText(numStr, {
    x: badgeX + (badgeWidth - numWidth) / 2,
    y: badgeY + (badgeHeight - 12) / 2 + 1,
    size: 12,
    font,
    color: WHITE,
  });
}

// --- Draw text on a half-page (premium layout matching reference) ---

function drawTextBlock(
  page: PDFPage,
  paragraph: string,
  creatorName: string,
  fonts: { regular: PDFFont; bold: PDFFont; storyFont: PDFFont },
  xOffset: number,
  pageIndex: number
) {
  const padding = 40;
  const textAreaWidth = HALF_WIDTH - padding * 2;
  const centerX = xOffset + HALF_WIDTH / 2;

  // Cream background
  page.drawRectangle({
    x: xOffset, y: 0,
    width: HALF_WIDTH, height: PAGE_HEIGHT,
    color: CREAM_BG,
  });

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

  // Body: paragraph text in Comic Neue, centered horizontally
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

  // Page number at bottom-left of text area
  drawPageNumber(page, pageIndex - 1, fonts.bold, xOffset);
}

// --- Draw image on a half-page ---

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

// --- Draw cover page: portrait image centered on white background ---

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
    // Draw a centered placeholder filling full height
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

    // Scale to fill the FULL HEIGHT of the page (no top/bottom margins).
    // Center horizontally — white sides only if the image is narrower than the page.
    const scale = PAGE_HEIGHT / imgHeight;
    const drawWidth = imgWidth * scale;
    const drawHeight = PAGE_HEIGHT; // Fills full vertical space

    // Center horizontally on page
    const drawX = (PAGE_WIDTH - drawWidth) / 2;
    const drawY = 0;

    page.drawImage(coverImg, {
      x: drawX, y: drawY,
      width: drawWidth, height: drawHeight,
    });
  } catch (error: any) {
    console.error('[PdfAssembly] Error embedding cover image:', error.message);
    // Fallback placeholder fills full height too
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

  if (paragraphs.length !== 12) {
    throw new Error(`Attendu 12 paragraphes, recu ${paragraphs.length}`);
  }
  if (images.length !== 12) {
    throw new Error(`Attendu 12 images, recu ${images.length}`);
  }

  console.log('[PdfAssembly] Starting PDF assembly: 13 pages');

  const pdfDoc = await PDFDocument.create();
  const fonts = await loadFonts(pdfDoc);

  // --- Page 1: Cover (portrait image centered on white background, NO text) ---
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    await drawCoverPage(page, pdfDoc, coverImage);
  }

  // --- Pages 2-13: Alternating text/image layout ---
  // IMPORTANT: Toujours dessiner l'image EN PREMIER, puis le texte PAR-DESSUS.
  // Le fond creme du bloc texte couvre naturellement tout debordement de l'image.
  for (let p = 0; p < 12; p++) {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const imageIndex = p; // images[0] to images[11]
    const isEvenPage = p % 2 === 0; // pages 2,4,6,8,10,12 -> text LEFT, image RIGHT

    if (isEvenPage) {
      // Image RIGHT (dessinee en premier), puis Texte LEFT (par-dessus)
      await drawImageHalf(page, pdfDoc, images[imageIndex], HALF_WIDTH, imageIndex);
      drawTextBlock(page, paragraphs[p], creatorName, fonts, 0, p + 2);
    } else {
      // Image LEFT (dessinee en premier), puis Texte RIGHT (par-dessus)
      await drawImageHalf(page, pdfDoc, images[imageIndex], 0, imageIndex);
      drawTextBlock(page, paragraphs[p], creatorName, fonts, HALF_WIDTH, p + 2);
    }

    // Release image buffer after embedding — allow GC to reclaim memory
    (images as any)[imageIndex] = null;
  }

  // Serialize and return directly as Buffer (avoid keeping both pdfBytes and Buffer)
  const pdfBytes = await pdfDoc.save();
  console.log(`[PdfAssembly] PDF assembled: ${pdfBytes.length} bytes, 13 pages`);

  return Buffer.from(pdfBytes as Uint8Array);
}
