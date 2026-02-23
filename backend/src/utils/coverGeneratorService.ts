import OpenAI from 'openai';
import crypto from 'crypto';

// --- Types ---

export interface CoverGenerationParams {
  protagonistName: string;
  protagonistAge: string;
  protagonistGender: string;
  eyeColor: string;
  hairColor: string;
  skinColor: string;
  illustrationStyle: string;
  generalTheme: string;
  customTheme?: string;
  specificSubject: string;
  customSubject?: string;
  centralMessage?: string;
  customMessage?: string;
  ageRange?: string;
  hobbies?: string;
  favoriteDish?: string;
  specialEvents?: string;
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
  title: string;
  timestamp: number;
}

const previewCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 100;

export function getCachedPreview(hash: string): { imageBase64: string; title: string } | null {
  const entry = previewCache.get(hash);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    previewCache.delete(hash);
    return null;
  }
  return { imageBase64: entry.imageBase64, title: entry.title };
}

export function setCachedPreview(hash: string, imageBase64: string, title: string): void {
  if (previewCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = previewCache.keys().next().value;
    if (oldestKey) previewCache.delete(oldestKey);
  }
  previewCache.set(hash, { imageBase64, title, timestamp: Date.now() });
}

// --- Hash des parametres ---

export function computeParamsHash(params: CoverGenerationParams, hasPhoto: boolean): string {
  const relevantFields = [
    params.illustrationStyle,
    params.generalTheme,
    params.customTheme || '',
    params.specificSubject,
    params.customSubject || '',
    params.centralMessage || '',
    params.customMessage || '',
    params.protagonistName,
    params.protagonistAge,
    params.protagonistGender,
    params.eyeColor,
    params.hairColor,
    params.skinColor,
    params.hobbies || '',
    params.specialEvents || '',
    hasPhoto ? 'with-photo' : 'no-photo',
  ].join('|');
  return crypto.createHash('sha256').update(relevantFields).digest('hex').substring(0, 16);
}

// --- Generation du titre du livre ---

const OCCASION_TITLES: Record<string, (name: string) => string> = {
  'birthday':    (n) => `${n} et la Fete Enchantee`,
  'christmas':   (n) => `${n} et la Magie de Noel`,
  'new-year':    (n) => `${n} et les Etoiles du Nouvel An`,
  'easter':      (n) => `${n} et la Chasse aux Oeufs Magiques`,
  'eid':         (n) => `${n} et les Lumieres de l'Aid`,
  'mothers-day': (n) => `${n} et le Plus Beau Cadeau de Maman`,
  'fathers-day': (n) => `${n} et l'Aventure avec Papa`,
};

const THEME_TITLES: Record<string, (name: string) => string> = {
  'educational':  (n) => `${n} et le Livre des Merveilles`,
  'fairy-tales':  (n) => `${n} au Royaume des Fees`,
  'activities':   (n) => `${n} et les Mille Decouvertes`,
  'stories':      (n) => `${n} et l'Histoire Extraordinaire`,
  'celebrations': (n) => `${n} et la Grande Celebration`,
  'family':       (n) => `${n} et les Tresors de la Famille`,
};

export function generateBookTitle(params: CoverGenerationParams): string {
  const name = params.protagonistName || 'Votre Enfant';

  if (params.specificSubject && OCCASION_TITLES[params.specificSubject]) {
    return OCCASION_TITLES[params.specificSubject](name);
  }
  if (params.generalTheme && THEME_TITLES[params.generalTheme]) {
    return THEME_TITLES[params.generalTheme](name);
  }
  return `Les Aventures de ${name}`;
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
              text: `Analyze this photo of a child and provide a very detailed physical description for use as a reference in an illustration. Focus on:
- Exact skin tone (light peach, olive, medium brown, dark brown, etc.)
- Hair: exact color, length (short/medium/long), texture (straight, curly, wavy, coily), style (bangs, ponytail, braids, etc.)
- Face shape and proportions (round cheeks, oval face, etc.)
- Eye shape and expression
- Any distinctive features (freckles, dimples, glasses, gap teeth, etc.)
- Overall vibe/expression of the child (shy smile, big grin, serious, playful)

Be very specific and detailed — this description will be used to recreate the child as a character in an illustrated book cover. The character MUST be recognizable as the same child.

Keep the description to 3-4 sentences. If the photo does not clearly show a child's face, respond with exactly "UNIDENTIFIABLE".

Respond in English only.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${photoBase64}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.2
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

function getAgeDescription(ageRange: string | undefined, protagonistAge: string): { ageLabel: string; bodyType: string } {
  if (ageRange === '0-2') {
    return {
      ageLabel: protagonistAge || 'baby',
      bodyType: 'a tiny baby/toddler with chubby round cheeks, small pudgy body, very short or no hair, big round innocent eyes, baby proportions (large head relative to body)'
    };
  }
  if (ageRange === '3-5') {
    return {
      ageLabel: protagonistAge || '4-year-old',
      bodyType: 'a small young child with round soft face, chubby cheeks, short stature, playful toddler proportions'
    };
  }
  if (ageRange === '10+') {
    return {
      ageLabel: protagonistAge || '11-year-old',
      bodyType: 'a pre-teen/young adolescent with more mature proportions, taller build, defined facial features'
    };
  }
  return {
    ageLabel: protagonistAge || '7-year-old',
    bodyType: 'a young child with friendly round face and kid proportions'
  };
}

function buildCharacterDescription(params: CoverGenerationParams, photoAnalysis: string | null): string {
  const genderWord = params.protagonistGender === 'girl' ? 'girl' : 'boy';
  const { ageLabel, bodyType } = getAgeDescription(params.ageRange, params.protagonistAge);

  if (photoAnalysis) {
    return `${bodyType} (${ageLabel} ${genderWord}). IMPORTANT — this character must closely match this real child's appearance: ${photoAnalysis}. Ensure the illustrated character is clearly recognizable as this specific child, with matching skin tone, hair, facial features, and AGE-APPROPRIATE body proportions.`;
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
  const skinColorMap: Record<string, string> = {
    light: 'light fair', medium: 'medium warm', olive: 'olive tan', dark: 'dark brown'
  };

  const eyes = eyeColorMap[params.eyeColor] || params.eyeColor;
  const hair = hairColorMap[params.hairColor] || params.hairColor;
  const skin = skinColorMap[params.skinColor] || params.skinColor;

  return `${bodyType} — a cheerful ${ageLabel} ${genderWord} with ${skin} skin, ${eyes} eyes and ${hair} hair, cute and expressive face, friendly smile`;
}

// --- Style directives + titre rendering ---

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

const STYLE_TITLE_RENDERING: Record<string, string> = {
  'watercolor': 'elegant hand-lettered calligraphy with watercolor texture, flowing script with paint splatters',
  '3d-animation': 'bold 3D extruded letters with soft shadows and colorful gradients, Pixar movie title style',
  'kawaii': 'round bubbly kawaii letters with pastel colors, cute decorative elements like stars and hearts around the letters',
  'block-world': 'blocky pixelated 3D letters made of voxel cubes, Minecraft-style typography',
  'paper-cut': 'letters that look cut from textured craft paper with visible paper layers and subtle shadows',
  'clay-animation': 'letters sculpted from colorful clay/plasticine with visible finger marks and 3D depth',
  'geometric': 'clean modern geometric sans-serif typography with bold shapes and flat design aesthetic',
  'illustrated-book': 'classic storybook serif typography with warm golden or brown tones, elegant and timeless',
  'japanese-manga': 'dynamic manga-style lettering with bold strokes, slight slant, colorful with outline effects',
};

const OCCASION_SCENES: Record<string, string> = {
  'birthday': 'a magical birthday party scene with balloons, a sparkling cake, colorful confetti, and festive decorations',
  'christmas': 'a cozy Christmas scene with gently falling snow, a beautifully decorated tree, warm golden lights, and wrapped gifts',
  'new-year': 'a magical New Year celebration with bright fireworks lighting up the night sky, stars, and sparkles',
  'easter': 'a springtime Easter scene with colorful painted eggs hidden among blooming flowers, baby bunnies, and butterflies',
  'eid': 'a warm and joyful Eid celebration scene with a crescent moon, glowing lanterns, and beautiful decorations',
  'mothers-day': 'a heartwarming scene with beautiful flowers, a loving embrace, and a sunlit garden full of warmth',
  'fathers-day': 'an adventurous outdoor scene with father and child, warm golden sunlight, and a sense of bonding',
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
  'love': 'themes of love, warmth, and tender affection',
  'perseverance': 'themes of perseverance, never giving up, and achieving goals',
  'sharing': 'themes of generosity, sharing with others, and the joy of giving',
  'honesty': 'themes of honesty, truth, and integrity',
  'respect': 'themes of respect, kindness, and growing together with empathy',
};

// --- Construction du prompt portrait avec titre ---

function buildCoverPrompt(params: CoverGenerationParams, characterDescription: string, title: string): string {
  const styleDirective = STYLE_DIRECTIVES[params.illustrationStyle] || STYLE_DIRECTIVES['illustrated-book'];
  const titleStyle = STYLE_TITLE_RENDERING[params.illustrationStyle] || STYLE_TITLE_RENDERING['illustrated-book'];
  // Construire la scene en combinant theme + occasion (au lieu d'un waterfall)
  const themeContext = params.customTheme
    ? `themed around: ${params.customTheme}`
    : (THEME_SCENES[params.generalTheme] || '');
  const occasionContext = params.customSubject
    ? `for the occasion: ${params.customSubject}`
    : (OCCASION_SCENES[params.specificSubject] || '');

  let scene: string;
  if (themeContext && occasionContext) {
    scene = `${occasionContext}, ${themeContext}`;
  } else if (occasionContext) {
    scene = occasionContext;
  } else if (themeContext) {
    scene = themeContext;
  } else {
    scene = 'a magical and enchanting world full of wonder';
  }

  const mood = params.customMessage
    ? `themes of: ${params.customMessage}`
    : (params.centralMessage ? (MESSAGE_MOODS[params.centralMessage] || '') : '');

  console.log('buildCoverPrompt: scene =>', scene);
  console.log('buildCoverPrompt: mood =>', mood || '(aucun)');
  if (params.hobbies) console.log('buildCoverPrompt: hobbies =>', params.hobbies);
  if (params.specialEvents) console.log('buildCoverPrompt: specialEvents =>', params.specialEvents);

  return `Create a beautiful children's book COVER illustration. This is a PORTRAIT format image (taller than wide), designed exactly like a real children's book front cover.

ART STYLE: ${styleDirective}.

TITLE TEXT: The title "${title}" must be prominently displayed at the top of the cover, rendered in ${titleStyle}. The title must be perfectly legible, spelled correctly in French, and be a major visual element of the cover. Below the title, in smaller text, write "contedia.fr" as a subtle watermark near the bottom edge.

MAIN CHARACTER: ${characterDescription}. The character should be the central focus of the illustration, shown from head to at least knees, facing slightly toward the viewer with a warm, inviting expression.

SCENE: The character is in ${scene}. The background should be rich and immersive but not overwhelm the character.

${mood ? `MOOD: The overall atmosphere should convey ${mood}.` : ''}
${params.hobbies ? `PERSONAL TOUCHES: The character loves ${params.hobbies}. Subtly integrate visual hints of these hobbies into the scene or character's accessories/surroundings.` : ''}
${params.specialEvents ? `SPECIAL CONTEXT: ${params.specialEvents}. Reflect this in the scene atmosphere.` : ''}

COMPOSITION: This must look like a professional children's book cover:
- Portrait orientation (taller than wide)
- Title at the top, clearly readable
- Character centered and prominent
- Background fills the entire image with no white borders
- Rich, detailed, and colorful
- The kind of cover that makes a child say "I want THIS book!"

The final image should feel magical, warm, and absolutely captivating.`;
}

// --- Generation de l'image ---

export async function generateCoverImage(
  params: CoverGenerationParams,
  photoBase64?: string
): Promise<{ imageBase64: string; title: string }> {
  const openai = getOpenAI();

  // 1. Generer le titre
  const title = generateBookTitle(params);
  console.log('Generated title:', title);

  // 2. Analyse photo optionnelle
  let photoAnalysis: string | null = null;
  if (photoBase64) {
    photoAnalysis = await analyzePhotoWithVision(photoBase64);
    console.log('Photo analysis result:', photoAnalysis ? 'Description obtenue' : 'Non identifiable, fallback formulaire');
  }

  // 3. Description du personnage
  const characterDescription = buildCharacterDescription(params, photoAnalysis);

  // 4. Prompt complet
  const prompt = buildCoverPrompt(params, characterDescription, title);
  console.log('Cover prompt length:', prompt.length);

  // 5. Appel gpt-image-1 — portrait 1024x1536
  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1536',
    quality: 'medium',
  });

  const imageData = response.data?.[0]?.b64_json;
  if (!imageData) {
    throw new Error('Aucune image generee par gpt-image-1');
  }

  return { imageBase64: imageData, title };
}
