import OpenAI from 'openai';
import crypto from 'crypto';

// --- Types ---

export interface CoverGenerationParams {
  protagonistName: string;
  protagonistAge: string;
  protagonistGender: string;
  eyeColor: string;
  hairColor: string;
  illustrationStyle: string;
  generalTheme: string;
  specificSubject: string;
  centralMessage?: string;
  ageRange?: string;
}

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

// --- Cache en memoire ---

interface CacheEntry {
  imageBase64: string;
  timestamp: number;
}

const previewCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 100;

export function getCachedPreview(hash: string): string | null {
  const entry = previewCache.get(hash);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    previewCache.delete(hash);
    return null;
  }
  return entry.imageBase64;
}

export function setCachedPreview(hash: string, imageBase64: string): void {
  if (previewCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = previewCache.keys().next().value;
    if (oldestKey) previewCache.delete(oldestKey);
  }
  previewCache.set(hash, { imageBase64, timestamp: Date.now() });
}

// --- Hash des parametres ---

export function computeParamsHash(params: CoverGenerationParams, hasPhoto: boolean): string {
  const relevantFields = [
    params.illustrationStyle,
    params.generalTheme,
    params.specificSubject,
    params.centralMessage || '',
    params.protagonistName,
    params.protagonistAge,
    params.protagonistGender,
    params.eyeColor,
    params.hairColor,
    hasPhoto ? 'with-photo' : 'no-photo',
  ].join('|');
  return crypto.createHash('sha256').update(relevantFields).digest('hex').substring(0, 16);
}

// --- Analyse photo avec GPT-4o-mini Vision ---

async function analyzePhotoWithVision(photoBase64: string): Promise<string | null> {
  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this photo of a child and provide a concise physical description for use in an illustration prompt. Focus ONLY on:
- Approximate age appearance
- Skin tone (light, medium, tan, dark, etc.)
- Hair: color, length, texture (straight, curly, wavy), style
- Face shape (round, oval, etc.)
- Any distinctive features (freckles, dimples, glasses, etc.)

Keep the description to 2-3 sentences maximum. If the photo does not clearly show a child's face, respond with exactly "UNIDENTIFIABLE".

Respond in English only.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${photoBase64}`,
                detail: 'low'
              }
            }
          ]
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    const description = response.choices[0]?.message?.content?.trim();
    if (!description || description === 'UNIDENTIFIABLE') {
      return null;
    }
    return description;
  } catch (error) {
    console.error('Erreur analyse photo Vision:', error);
    return null;
  }
}

// --- Construction de la description du personnage ---

function buildCharacterDescription(params: CoverGenerationParams, photoAnalysis: string | null): string {
  const genderWord = params.protagonistGender === 'girl' ? 'girl' : 'boy';
  const age = params.protagonistAge;
  const name = params.protagonistName;

  if (photoAnalysis) {
    return `a ${age}-year-old ${genderWord} named ${name}. Based on a real child: ${photoAnalysis}. The character should have ${params.eyeColor} eyes and ${params.hairColor} hair.`;
  }

  const eyeColorMap: Record<string, string> = {
    brown: 'warm brown', blue: 'bright blue', green: 'vivid green',
    hazel: 'hazel', gray: 'soft gray', amber: 'amber golden',
    black: 'dark brown'
  };
  const hairColorMap: Record<string, string> = {
    brown: 'chestnut brown', blonde: 'golden blonde', black: 'dark black',
    red: 'fiery red', auburn: 'auburn', gray: 'silver gray',
    white: 'platinum white'
  };

  const eyes = eyeColorMap[params.eyeColor] || params.eyeColor;
  const hair = hairColorMap[params.hairColor] || params.hairColor;

  return `a cheerful ${age}-year-old ${genderWord} named ${name} with ${eyes} eyes and ${hair} hair, cute and expressive face, friendly smile`;
}

// --- Mappings styles → directives DALL-E ---

const STYLE_DIRECTIVES: Record<string, string> = {
  'watercolor': 'delicate watercolor painting with soft washes, translucent layers, visible paper texture, gentle color bleeding at edges, dreamy and ethereal atmosphere, pastel tones',
  '3d-animation': 'Pixar/Disney-quality 3D rendered animation, soft global illumination, subsurface scattering on skin, rounded friendly character design, cinematic depth of field, vibrant colors',
  'kawaii': 'Japanese kawaii style, extremely cute and round character designs, pastel colors, sparkly eyes with large pupils, blushing cheeks, soft rounded shapes, adorable expressions',
  'block-world': 'blocky voxel-art style reminiscent of Minecraft, cubic characters and environment, pixel-like textures on 3D blocks, colorful and playful geometric world',
  'paper-cut': 'layered paper-cut collage art style, visible paper layers with shadows between them, textured craft paper surfaces, hand-cut edges, dimensional depth through layering',
  'clay-animation': 'claymation / stop-motion style, characters made of sculpted clay or plasticine, visible finger texture marks, warm lighting, slightly imperfect handmade charm, Aardman-like quality',
  'geometric': 'modern geometric illustration style, flat design with bold shapes, clean vector-like edges, limited but vibrant color palette, abstract forms composing recognizable figures',
  'illustrated-book': 'classic children\'s book illustration, warm gouache or colored pencil rendering, gentle lines, storybook charm like Beatrix Potter or Oliver Jeffers, inviting and nostalgic',
  'japanese-manga': 'Japanese manga/anime illustration style, expressive large eyes, dynamic composition, cel-shading, detailed hair rendering, vibrant colors, shojo/kodomo manga aesthetic',
};

const OCCASION_SCENES: Record<string, string> = {
  'birthday': 'a magical birthday party scene with balloons, a sparkling cake, colorful confetti, and festive decorations',
  'christmas': 'a cozy Christmas scene with gently falling snow, a beautifully decorated tree, warm golden lights, and wrapped gifts',
  'new-year': 'a magical New Year celebration with bright fireworks lighting up the night sky, stars, and sparkles',
  'easter': 'a springtime Easter scene with colorful painted eggs hidden among blooming flowers, baby bunnies, and butterflies',
  'eid': 'a warm and joyful Eid celebration scene with a crescent moon, glowing lanterns, and beautiful decorations',
  'mothers-day': 'a heartwarming scene with beautiful flowers, a loving embrace, and a sunlit garden full of warmth',
  'fathers-day': 'an adventurous outdoor scene with father and child, warm golden sunlight, and a sense of bonding',
  'halloween': 'a playful and friendly Halloween scene with cute jack-o-lanterns, a moonlit night, bats, and fun costumes',
};

const THEME_SCENES: Record<string, string> = {
  'educational': 'a scene of wonder and discovery with magical books, nature elements, a curious explorer in a vibrant world of knowledge',
  'fairy-tales': 'an enchanted fairy-tale scene with a magical castle in the distance, sparkles, a mystical forest, and fairy lights',
  'activities': 'a lively and colorful scene full of creative activities, art supplies, musical instruments, and playful energy',
  'stories': 'a dreamy storybook scene with open books, floating pages, imagination coming alive with magical elements',
  'celebrations': 'a joyful celebration scene with confetti, music notes, happy dancing, and a festive atmosphere',
  'family': 'a warm and cozy family scene with a welcoming home, togetherness, love, and a gentle sunset glow',
};

const MESSAGE_MOODS: Record<string, string> = {
  'friendship': 'themes of friendship, togetherness, and joy of being with friends',
  'courage': 'themes of bravery, courage, and overcoming fears with determination',
  'nature-care': 'themes of nature appreciation, caring for the planet, green and lush environment',
  'love': 'themes of love, warmth, and tender affection',
  'perseverance': 'themes of perseverance, never giving up, and achieving goals',
  'sharing': 'themes of generosity, sharing with others, and the joy of giving',
  'honesty': 'themes of honesty, truth, and integrity',
  'respect': 'themes of respect, kindness, and growing together with empathy',
};

// --- Construction du prompt DALL-E ---

function buildCoverPrompt(params: CoverGenerationParams, characterDescription: string): string {
  const styleDirective = STYLE_DIRECTIVES[params.illustrationStyle] || STYLE_DIRECTIVES['illustrated-book'];
  const scene = OCCASION_SCENES[params.specificSubject] || THEME_SCENES[params.generalTheme] || 'a magical and enchanting world full of wonder';
  const mood = params.centralMessage ? (MESSAGE_MOODS[params.centralMessage] || '') : '';

  return `A beautiful children's book cover illustration in ${styleDirective} style.

The scene shows ${characterDescription} as the main character, standing or playing in ${scene}.

${mood ? `The atmosphere conveys ${mood}.` : ''}

The composition is a full-page landscape illustration (wider than tall), designed as a children's book first page or cover. The character is the central focus, shown from head to at least waist, with an expressive and inviting pose. The background is rich and detailed but does not overwhelm the character.

IMPORTANT: Do NOT include any text, letters, words, numbers, or typography anywhere in the image. The illustration should be purely visual with no written elements.

The image should feel magical, warm, and inviting — the kind of illustration that makes a child excited to read the story.`;
}

// --- Generation de l'image ---

export async function generateCoverImage(
  params: CoverGenerationParams,
  photoBase64?: string
): Promise<string> {
  const openai = getOpenAI();

  // 1. Analyse photo optionnelle
  let photoAnalysis: string | null = null;
  if (photoBase64) {
    photoAnalysis = await analyzePhotoWithVision(photoBase64);
    console.log('Photo analysis result:', photoAnalysis ? 'Description obtenue' : 'Non identifiable, fallback formulaire');
  }

  // 2. Description du personnage
  const characterDescription = buildCharacterDescription(params, photoAnalysis);

  // 3. Prompt complet
  const prompt = buildCoverPrompt(params, characterDescription);
  console.log('DALL-E prompt length:', prompt.length);

  // 4. Appel DALL-E 3
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1792x1024', // Landscape format
    quality: 'standard',
    response_format: 'b64_json',
  });

  const imageData = response.data?.[0]?.b64_json;
  if (!imageData) {
    throw new Error('Aucune image generee par DALL-E');
  }

  return imageData;
}
