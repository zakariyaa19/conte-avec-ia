import OpenAI, { toFile, APIError } from 'openai';

// Timeout helper — abort after N ms
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout ${label} apres ${ms / 1000}s`)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

// Reuse constants from coverGeneratorService
import {
  STYLE_DIRECTIVES,
  OCCASION_SCENES,
  THEME_SCENES,
  MESSAGE_MOODS,
} from './coverGeneratorServiceExports';

// --- Types ---

export interface ImageGenerationParams {
  protagonistName: string;
  protagonistAge?: string;
  protagonistGender?: string;
  ageRange?: string;
  eyeColor?: string;
  hairColor?: string;
  skinColor?: string;
  illustrationStyle: string;
  generalTheme: string;
  customTheme?: string;
  specificSubject: string;
  customSubject?: string;
  centralMessage?: string;
  customMessage?: string;
  hobbies?: string;
  favoriteDish?: string;
  specialEvents?: string;
  photoUrl?: string;
  secondaryCharactersJson?: string;
}

export interface ImageGenerationResult {
  images: Buffer[]; // 6 interior images (cost-optimized: every other page)
}

// Indices des paragraphes qui recoivent une illustration (0-indexed, 6 sur 12)
export const IMAGE_PARAGRAPH_INDICES = [0, 2, 4, 6, 8, 10];

type ProgressCallback = (imageIndex: number, total: number) => void;

// --- OpenAI Client ---

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configuree');
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// ====================================================================
// BIBLE VISUELLE — Construite une seule fois, injectee dans CHAQUE prompt
// ====================================================================

function buildVisualBible(params: ImageGenerationParams, hasReferenceImage: boolean): string {
  const styleDirective = STYLE_DIRECTIVES[params.illustrationStyle] || STYLE_DIRECTIVES['illustrated-book'];

  const genderWord = params.protagonistGender === 'girl' ? 'girl' : 'boy';
  const { ageLabel, bodyType } = getAgeDescription(params.ageRange, params.protagonistAge);

  // --- Build character description based on mode ---
  let characterBlock: string;

  if (hasReferenceImage) {
    // PHOTO MODE: rely on the reference image, do NOT inject manual colors
    characterBlock = `=== PRIORITY 1 — MAIN CHARACTER (MOST IMPORTANT) ===
The reference image shows the EXACT character to reproduce. This is the #1 priority.
${params.protagonistName} is ${bodyType} — a cheerful ${ageLabel} ${genderWord}.
Reproduce the EXACT same face, hair, skin tone, clothing, and proportions from the reference image.
Do NOT change any physical feature. The illustrated character must be clearly recognizable as the same child from the reference photo.
Face: cute, round, friendly smile. Clothing: same outfit as in the reference image.
The main character MUST look IDENTICAL to the reference image on EVERY page. Same face, same hair color, same skin tone, same eyes, same body proportions, same clothing.`;
  } else {
    // MANUAL MODE: use color selections
    const eyeColorMap: Record<string, string> = {
      brown: 'warm brown', blue: 'bright blue', green: 'vivid green',
      hazel: 'hazel', gray: 'soft gray', amber: 'amber golden', black: 'dark brown'
    };
    const hairColorMap: Record<string, string> = {
      brown: 'chestnut brown', blonde: 'golden blonde', black: 'jet black',
      red: 'fiery red', auburn: 'auburn', gray: 'silver gray', white: 'platinum white'
    };
    const skinColorMap: Record<string, string> = {
      light: 'light fair', medium: 'medium warm', olive: 'olive tan', dark: 'rich dark brown'
    };

    // If no appearance data provided (simplified wizard), use generic description with light skin
    const hasAppearanceData = !!(params.eyeColor || params.hairColor || params.skinColor);
    if (!hasAppearanceData) {
      characterBlock = `=== PRIORITY 1 — MAIN CHARACTER (MOST IMPORTANT) ===
${params.protagonistName} is ${bodyType} — a cheerful ${ageLabel} ${genderWord}.
Skin: light fair. Face: cute, round, friendly smile.
The main character MUST look IDENTICAL on EVERY page. Same face, same skin tone, same body proportions, same clothing.`;
    } else {
      const eyes = eyeColorMap[params.eyeColor || ''] || params.eyeColor || 'bright';
      const hair = hairColorMap[params.hairColor || ''] || params.hairColor || 'brown';
      const skin = skinColorMap[params.skinColor || 'light'] || params.skinColor || 'light fair';

      characterBlock = `=== PRIORITY 1 — MAIN CHARACTER (MOST IMPORTANT) ===
${params.protagonistName} is ${bodyType} — a cheerful ${ageLabel} ${genderWord}.
Skin: ${skin}. Eyes: ${eyes}, large and expressive. Hair: ${hair}.
Face: cute, round, friendly smile.
The main character MUST look IDENTICAL on EVERY page. Same face, same hair color, same skin tone, same eyes, same body proportions, same clothing.`;
    }
  }

  // --- Personnages secondaires ---
  let secondaryBlock = '';
  if (params.secondaryCharactersJson) {
    try {
      const chars = JSON.parse(params.secondaryCharactersJson);
      if (Array.isArray(chars) && chars.length > 0) {
        const descriptions = chars.map((c: any, i: number) => {
          if (c.kind === 'animal') {
            return `  ${i + 1}. ${c.name} — a ${c.ageOrType || 'pet'}${c.physical ? `, ${c.physical}` : ''}`;
          }
          return `  ${i + 1}. ${c.name} — ${c.ageOrType || 'child'}${c.physical ? `, ${c.physical}` : ''}`;
        });
        secondaryBlock = `\nSECONDARY CHARACTERS (same design on every page they appear):
${descriptions.join('\n')}
Each secondary character must look IDENTICAL every time they appear. Same face, same hair, same clothing.\n`;
      }
    } catch { /* ignore parse errors */ }
  }

  // --- Ambiance (priorité basse) ---
  const occasionScene = OCCASION_SCENES[params.specificSubject] || OCCASION_SCENES[params.customSubject || ''] || '';
  const themeScene = THEME_SCENES[params.generalTheme] || THEME_SCENES[params.customTheme || ''] || '';
  const messageMood = MESSAGE_MOODS[params.centralMessage || ''] || MESSAGE_MOODS[params.customMessage || ''] || '';

  let ambianceParts: string[] = [];
  if (themeScene) ambianceParts.push(themeScene);
  if (occasionScene) ambianceParts.push(occasionScene);
  if (messageMood) ambianceParts.push(messageMood);
  const ambianceBlock = ambianceParts.length > 0
    ? `\nGeneral atmosphere: ${ambianceParts.join('. ')}.`
    : '';

  // === PROMPT ORDONNE PAR PRIORITE ===
  return `${characterBlock}
${secondaryBlock}
=== PRIORITY 2 — ILLUSTRATION STYLE (VERY IMPORTANT) ===
${styleDirective}.
The art style must be IDENTICAL on every single page. Same rendering technique, same color palette, same lighting style, same level of detail. No style drift between pages.

=== PRIORITY 3 — NO TEXT (MANDATORY) ===
ZERO text in the image. No words, no letters, no numbers, no signs, no inscriptions, no logos, no watermarks, no text on clothing, no text on objects, no text on walls. 100% pure illustration.

=== PRIORITY 4 — STORY ATMOSPHERE ===${ambianceBlock}`;
}

function getAgeDescription(ageRange: string | undefined, protagonistAge: string | undefined): { ageLabel: string; bodyType: string } {
  if (ageRange === '0-2') {
    return {
      ageLabel: protagonistAge ? `${protagonistAge}-month-old` : 'baby',
      bodyType: 'a tiny baby/toddler with chubby round cheeks, small pudgy body, very short or no hair, big round innocent eyes, baby proportions'
    };
  }
  if (ageRange === '3-5') {
    return {
      ageLabel: protagonistAge ? `${protagonistAge}-year-old` : 'young child',
      bodyType: 'a small young child with round soft face, chubby cheeks, short stature, playful toddler proportions'
    };
  }
  if (ageRange === '10+') {
    return {
      ageLabel: protagonistAge ? `${protagonistAge}-year-old` : 'pre-teen',
      bodyType: 'a pre-teen/young adolescent with more mature proportions, taller build, defined facial features'
    };
  }
  return {
    ageLabel: protagonistAge ? `${protagonistAge}-year-old` : 'young child',
    bodyType: 'a young child with friendly round face and kid proportions'
  };
}

// ====================================================================
// Prompt pour chaque page interieure
// ====================================================================

function buildPageImagePrompt(
  params: ImageGenerationParams,
  visualBible: string,
  paragraph: string,
  pageIndex: number,
  hasReferenceImage: boolean
): string {
  const refNote = hasReferenceImage
    ? `CREATE A COMPLETELY NEW SCENE (do NOT modify the reference image):`
    : `CREATE A SCENE:`;

  return `${visualBible}

${refNote}

Scene (page ${pageIndex} of 6):
"${paragraph}"

Show ${params.protagonistName} as the central visible character in this scene. Rich details, warm atmosphere.

Portrait format (2:3 vertical), full illustration, no borders.

CRITICAL: Absolutely NO text, NO letters, NO words, NO numbers anywhere. No signs, no books with visible text, no inscriptions on walls or objects. Pure illustration only.`;
}

// ====================================================================
// FIRST ILLUSTRATION (preview) — Single image for preview step
// ====================================================================

export async function generateFirstIllustration(
  params: ImageGenerationParams,
  title: string,
  paragraph0: string,
  coverImageData?: Buffer
): Promise<Buffer> {
  const isDryRun = process.env.STORY_DRY_RUN === 'true';

  if (isDryRun) {
    console.log('[StoryImageGenerator] Dry run: first illustration placeholder');
    return generatePlaceholderImage(1, 1);
  }

  const hasReferenceImage = !!coverImageData;
  const visualBible = buildVisualBible(params, hasReferenceImage);
  const prompt = buildPageImagePrompt(params, visualBible, paragraph0, 1, hasReferenceImage);

  console.log(`[StoryImageGenerator] Generating first illustration (reference: ${hasReferenceImage})`);

  const openai = getOpenAI();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 5000;
        console.log(`[StoryImageGenerator] First illustration retry ${attempt}, waiting ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
      }

      let imageData: string | undefined;

      if (coverImageData) {
        const refFile = await toFile(coverImageData, 'reference.png', { type: 'image/png' });
        const response = await openai.images.edit({
          model: 'gpt-image-1',
          image: refFile,
          prompt,
          n: 1,
          size: '1024x1536' as any,
          quality: 'medium',
        });
        imageData = response.data?.[0]?.b64_json;
        if (!imageData && response.data?.[0]?.url) {
          const resp = await fetch(response.data[0].url);
          return Buffer.from(await resp.arrayBuffer());
        }
      } else {
        const response = await openai.images.generate({
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size: '1024x1536' as any,
          quality: 'medium',
        });
        imageData = response.data?.[0]?.b64_json;
        if (!imageData && response.data?.[0]?.url) {
          const resp = await fetch(response.data[0].url);
          return Buffer.from(await resp.arrayBuffer());
        }
      }

      if (!imageData) throw new Error('No image data returned');

      console.log('[StoryImageGenerator] First illustration generated successfully');
      return Buffer.from(imageData, 'base64');

    } catch (error: any) {
      console.error(`[StoryImageGenerator] First illustration attempt ${attempt + 1}:`, error.message);
      if (error.status === 429) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt + 1) * 10000));
      }
      if (attempt === 2) throw new Error(`Failed to generate first illustration: ${error.message}`);
    }
  }

  throw new Error('Failed to generate first illustration after 3 attempts');
}

// --- Dry run placeholder ---

function generatePlaceholderImage(index: number, total: number): Buffer {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F0B27A', '#82E0AA', '#F8C471'
  ];
  const color = colors[index % colors.length];
  const label = `PAGE ${index} (${index}/${total})`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536">
    <rect width="1024" height="1536" fill="${color}" rx="20"/>
    <text x="512" y="720" font-family="Arial, sans-serif" font-size="72" fill="white" text-anchor="middle" font-weight="bold">${label}</text>
    <text x="512" y="800" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.8">DRY RUN - 1024x1536</text>
  </svg>`;

  return Buffer.from(svg, 'utf-8');
}

// ====================================================================
// Fonction principale de generation — gpt-image-1 avec image de reference
// ====================================================================

export async function generateStoryImages(
  params: ImageGenerationParams,
  title: string,
  paragraphs: string[],
  onProgress?: ProgressCallback,
  referenceImage?: Buffer,  // Image de couverture comme reference visuelle
  existingFirstImage?: Buffer  // First illustration from preview (skip generation)
): Promise<ImageGenerationResult> {
  const isDryRun = process.env.STORY_DRY_RUN === 'true';
  const hasExistingFirst = !!existingFirstImage;
  const totalImages = hasExistingFirst ? IMAGE_PARAGRAPH_INDICES.length - 1 : IMAGE_PARAGRAPH_INDICES.length;
  const images: Buffer[] = [];

  // If we have the first illustration from preview, prepend it
  if (hasExistingFirst) {
    images.push(existingFirstImage);
    console.log(`[StoryImageGenerator] Reusing preview first illustration (${existingFirstImage.length} bytes)`);
  }

  const hasReferenceImage = !!referenceImage;
  const visualBible = buildVisualBible(params, hasReferenceImage);

  const imagesToGenerate = hasExistingFirst ? IMAGE_PARAGRAPH_INDICES.length - 1 : IMAGE_PARAGRAPH_INDICES.length;
  console.log(`[StoryImageGenerator] Generating ${imagesToGenerate} images (${hasExistingFirst ? '1 reused from preview' : 'all new'}) on ${paragraphs.length} paragraphs (dry run: ${isDryRun})`);
  console.log(`[StoryImageGenerator] Paragraphes illustres: ${IMAGE_PARAGRAPH_INDICES.map(i => i + 1).join(', ')}`);
  console.log(`[StoryImageGenerator] Modele: gpt-image-1 avec reference visuelle: ${hasReferenceImage ? 'OUI' : 'NON'}`);
  console.log(`[StoryImageGenerator] Style: ${params.illustrationStyle}, Personnage: ${params.protagonistName}`);

  // Preparer l'image de reference (cover) pour gpt-image-1
  let referenceFile: any = null;
  if (referenceImage && !isDryRun) {
    try {
      referenceFile = await toFile(referenceImage, 'reference.png', { type: 'image/png' });
      console.log(`[StoryImageGenerator] Image de reference preparee (${referenceImage.length} bytes)`);
    } catch (err: any) {
      console.warn(`[StoryImageGenerator] Impossible de preparer l'image de reference: ${err.message}`);
    }
  }

  // Skip first image index if we already have it from preview
  const startIndex = hasExistingFirst ? 1 : 0;

  for (let i = startIndex; i < IMAGE_PARAGRAPH_INDICES.length; i++) {
    const progressIndex = hasExistingFirst ? i - 1 : i;
    if (onProgress) onProgress(progressIndex, totalImages);

    const paragraphIndex = IMAGE_PARAGRAPH_INDICES[i];

    if (isDryRun) {
      console.log(`[StoryImageGenerator] Dry run: placeholder ${i + 1}/${totalImages} (paragraphe ${paragraphIndex + 1})`);
      images.push(generatePlaceholderImage(i + 1, totalImages));
      await new Promise(r => setTimeout(r, 200));
      continue;
    }

    const prompt = buildPageImagePrompt(params, visualBible, paragraphs[paragraphIndex], i + 1, hasReferenceImage);

    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt) * 5000;
          console.log(`[StoryImageGenerator] Retry ${attempt} pour image ${i + 1}, attente ${delay}ms`);
          await new Promise(r => setTimeout(r, delay));
        }

        const openai = getOpenAI();
        let imageData: string | undefined;

        const IMAGE_TIMEOUT = 120_000; // 2 minutes max par image

        if (referenceFile) {
          // gpt-image-1 avec image de reference (edit mode)
          const response = await withTimeout(
            openai.images.edit({
              model: 'gpt-image-1',
              image: referenceFile,
              prompt,
              n: 1,
              size: '1024x1536' as any,
              quality: 'medium',
            }),
            IMAGE_TIMEOUT,
            `image ${i + 1} (edit)`
          );
          imageData = response.data?.[0]?.b64_json;

          if (!imageData && response.data?.[0]?.url) {
            const resp = await fetch(response.data[0].url);
            const arrBuf = await resp.arrayBuffer();
            images.push(Buffer.from(arrBuf));
            console.log(`[StoryImageGenerator] Image ${i + 1}/${totalImages} generee (via URL)`);
            lastError = null;
            break;
          }
        } else {
          // Fallback sans reference : gpt-image-1 generate
          const response = await withTimeout(
            openai.images.generate({
              model: 'gpt-image-1',
              prompt,
              n: 1,
              size: '1024x1536' as any,
              quality: 'medium',
            }),
            IMAGE_TIMEOUT,
            `image ${i + 1} (generate)`
          );
          imageData = response.data?.[0]?.b64_json;

          if (!imageData && response.data?.[0]?.url) {
            const resp = await fetch(response.data[0].url);
            const arrBuf = await resp.arrayBuffer();
            images.push(Buffer.from(arrBuf));
            console.log(`[StoryImageGenerator] Image ${i + 1}/${totalImages} generee (via URL, sans ref)`);
            lastError = null;
            break;
          }
        }

        if (!imageData) {
          throw new Error(`Pas d'image generee pour l'image ${i + 1}`);
        }

        images.push(Buffer.from(imageData, 'base64'));
        console.log(`[StoryImageGenerator] Image ${i + 1}/${totalImages} generee avec succes`);
        lastError = null;
        break;

      } catch (error: any) {
        lastError = error;
        console.error(`[StoryImageGenerator] Erreur image ${i + 1}, tentative ${attempt + 1}:`, error.message);

        if (error.status === 429 || error.message?.includes('429')) {
          const delay = Math.pow(2, attempt + 1) * 10000;
          console.log(`[StoryImageGenerator] Rate limit, attente ${delay}ms`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }

    if (lastError) {
      throw new Error(`Echec generation image ${i + 1}/${totalImages}: ${lastError.message}`);
    }

    // Delai entre les images pour eviter les rate limits
    if (i < totalImages - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`[StoryImageGenerator] All ${images.length} images ready (${hasExistingFirst ? '1 reused' : 'all generated'})`);
  return { images };
}
