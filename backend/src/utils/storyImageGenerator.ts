import OpenAI, { toFile } from 'openai';

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
  images: Buffer[]; // 12 interior images (cover comes from order)
}

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

    const eyes = eyeColorMap[params.eyeColor || ''] || params.eyeColor || 'bright';
    const hair = hairColorMap[params.hairColor || ''] || params.hairColor || 'brown';
    const skin = skinColorMap[params.skinColor || ''] || params.skinColor || 'medium';

    characterBlock = `=== PRIORITY 1 — MAIN CHARACTER (MOST IMPORTANT) ===
${params.protagonistName} is ${bodyType} — a cheerful ${ageLabel} ${genderWord}.
Skin: ${skin}. Eyes: ${eyes}, large and expressive. Hair: ${hair}.
Face: cute, round, friendly smile.
The main character MUST look IDENTICAL on EVERY page. Same face, same hair color, same skin tone, same eyes, same body proportions, same clothing.`;
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
      ageLabel: protagonistAge ? `${protagonistAge}-year-old` : '4-year-old',
      bodyType: 'a small young child with round soft face, chubby cheeks, short stature, playful toddler proportions'
    };
  }
  if (ageRange === '10+') {
    return {
      ageLabel: protagonistAge ? `${protagonistAge}-year-old` : '11-year-old',
      bodyType: 'a pre-teen/young adolescent with more mature proportions, taller build, defined facial features'
    };
  }
  return {
    ageLabel: protagonistAge ? `${protagonistAge}-year-old` : '7-year-old',
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

Scene (page ${pageIndex} of 12):
"${paragraph}"

Show ${params.protagonistName} as the central visible character in this scene. Rich details, warm atmosphere.

Square format (1:1), full illustration, no borders.

CRITICAL: Absolutely NO text, NO letters, NO words, NO numbers anywhere. No signs, no books with visible text, no inscriptions on walls or objects. Pure illustration only.`;
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

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="${color}" rx="20"/>
    <text x="512" y="480" font-family="Arial, sans-serif" font-size="72" fill="white" text-anchor="middle" font-weight="bold">${label}</text>
    <text x="512" y="560" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.8">DRY RUN - 1024x1024</text>
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
  referenceImage?: Buffer  // Image de couverture comme reference visuelle
): Promise<ImageGenerationResult> {
  const isDryRun = process.env.STORY_DRY_RUN === 'true';
  const totalImages = 12;
  const images: Buffer[] = [];

  const hasReferenceImage = !!referenceImage;
  const visualBible = buildVisualBible(params, hasReferenceImage);

  console.log(`[StoryImageGenerator] Demarrage generation ${totalImages} images (dry run: ${isDryRun})`);
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

  for (let i = 0; i < totalImages; i++) {
    if (onProgress) onProgress(i, totalImages);

    if (isDryRun) {
      console.log(`[StoryImageGenerator] Dry run: placeholder ${i + 1}/${totalImages}`);
      images.push(generatePlaceholderImage(i + 1, totalImages));
      await new Promise(r => setTimeout(r, 200));
      continue;
    }

    const prompt = buildPageImagePrompt(params, visualBible, paragraphs[i], i + 1, hasReferenceImage);

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

        if (referenceFile) {
          // gpt-image-1 avec image de reference (edit mode)
          const response = await openai.images.edit({
            model: 'gpt-image-1',
            image: referenceFile,
            prompt,
            n: 1,
            size: '1024x1024',
            quality: 'low',
          });
          // gpt-image-1 edit renvoie b64_json par defaut
          imageData = response.data?.[0]?.b64_json;

          // Si pas de b64_json, essayer l'URL
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
          const response = await openai.images.generate({
            model: 'gpt-image-1',
            prompt,
            n: 1,
            size: '1024x1024',
            quality: 'low',
          });
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

  console.log(`[StoryImageGenerator] Les ${totalImages} images generees avec succes`);
  return { images };
}
