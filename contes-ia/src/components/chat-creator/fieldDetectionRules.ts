// Parser NLP-lite francais : extrait les champs StoryFormData depuis du texte libre
// Toutes les regex sont case-insensitive et normalisent les accents

import { SecondaryCharacter } from '../../types/FormTypes';

// ─── Utilitaires ───────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ─── Prenom du protagoniste ────────────────────────────────────

const NAME_PATTERNS = [
  // "le prenom est Luna" / "son prenom est luna" / "le prenom de ma fille est luna"
  /(?:pr[eé]nom|nom)\s+(?:est|sera|c'est|de\s+\w+\s+(?:est|sera))\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "prenom : Luna" / "prenom: luna"
  /(?:pr[eé]nom|nom)\s*[:=]\s*([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "le prenom de ma fille est luna" (pattern long)
  /pr[eé]nom\s+de\s+(?:mon|ma|notre|l')\s*\w+\s+(?:est|sera|c'est)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "pour ma fille Luna" / "pour mon fils Adam"
  /(?:pour|de)\s+(?:mon|ma|notre|mes)\s+(?:fils|fille|enfant|petit|petite|garcon|gar[cç]on|bebe|bébé)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "ma fille Luna" / "mon fils Adam"
  /(?:mon|ma|notre)\s+(?:fils|fille|enfant|petit|petite|garcon|gar[cç]on)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "ma fille est Luna" / "mon fils est Adam" / "ma fille c'est Luna"
  /(?:mon|ma|notre)\s+(?:fils|fille|enfant)\s+(?:est|s'appelle|se nomme|c'est)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "elle s'appelle Luna" / "il s'appelle Adam"
  /(?:s'appelle|se nomme|se pr[eé]nomme|qui s'appelle)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "Luna, 7 ans" (prenom suivi d'age — accepte minuscules aussi)
  /\b([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]{2,})\s*[,\-]\s*\d+\s*ans/i,
  // "l'histoire de Luna"
  /l'histoire\s+(?:de|pour)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
  // "le heros sera Luna" / "la heroine sera Luna"
  /(?:le\s+h[eé]ros|la\s+h[eé]ro[ïi]ne|le\s+personnage)\s+(?:sera|est|s'appelle)\s+([a-zà-ÿA-ZÀ-Ÿ][a-zà-ÿ]+)/i,
];

// Mots courants a ne pas confondre avec des prenoms
const NOT_NAMES = new Set(normalize('une,un,des,les,avec,pour,dans,sur,qui,que,est,son,ses,mon,mes,notre,leur,cette,tout,bien,très,fait,elle,aussi,pas,mais,plus,comme,encore,peut,sans,quel,quelle,petit,petite,grand,grande,beau,belle,bon,bonne,nouveau,nouvelle,autre,même,premier,premiere,histoire,conte,livre,theme,style,age,ans,enfant,fille,fils,garcon,personnage,aventure,magie,amitie,courage,amour,noel,anniversaire,photo,illustration,aquarelle').split(','));

export function extractProtagonistName(text: string): string | null {
  for (const pattern of NAME_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (!NOT_NAMES.has(normalize(name)) && name.length >= 2 && name.length <= 25) {
        return capitalizeFirst(name);
      }
    }
  }
  return null;
}

// ─── Genre du protagoniste ─────────────────────────────────────

const GIRL_KEYWORDS = /\b(?:ma\s+fille|petite\s+fille|fillette|ma\s+petite|notre\s+fille|la\s+h[eé]ro[ïi]ne|une\s+fille|princesse|est\s+une\s+(?:petite\s+)?fille|c'est\s+une\s+fille)\b/i;
const BOY_KEYWORDS = /\b(?:mon\s+fils|petit\s+gar[cç]on|mon\s+petit|notre\s+fils|le\s+h[eé]ros|un\s+gar[cç]on|prince(?!\s*sse)|est\s+un\s+(?:petit\s+)?gar[cç]on|c'est\s+un\s+gar[cç]on)\b/i;

export function extractProtagonistGender(text: string): 'boy' | 'girl' | null {
  const normalizedText = text;
  if (GIRL_KEYWORDS.test(normalizedText)) return 'girl';
  if (BOY_KEYWORDS.test(normalizedText)) return 'boy';
  // Fallback: "elle" en contexte ou "il" en contexte
  if (/\belle\s+(?:aime|adore|veut|reve|est|a)\b/i.test(normalizedText)) return 'girl';
  if (/\bil\s+(?:aime|adore|veut|reve|est|a)\b/i.test(normalizedText)) return 'boy';
  return null;
}

// ─── Age du protagoniste ───────────────────────────────────────

export function extractProtagonistAge(text: string): string | null {
  // "7 ans" / "3 ans" / "a 5 ans"
  const match = text.match(/\b(\d{1,2})\s*ans?\b/i);
  if (match) {
    const age = parseInt(match[1], 10);
    if (age >= 0 && age <= 16) return String(age);
  }
  // "age de 7" / "agé de 5"
  const match2 = text.match(/[aâ]g[eé]e?\s+(?:de\s+)?(\d{1,2})/i);
  if (match2) {
    const age = parseInt(match2[1], 10);
    if (age >= 0 && age <= 16) return String(age);
  }
  return null;
}

export function deriveAgeRange(age: string | null): string | null {
  if (!age) return null;
  const n = parseInt(age, 10);
  if (isNaN(n)) return null;
  if (n <= 2) return '0-2';
  if (n <= 5) return '3-5';
  if (n <= 9) return '6-9';
  return '10+';
}

// ─── Theme general ─────────────────────────────────────────────

const THEME_MAP: Record<string, string[]> = {
  'educational': ['educatif', 'education', 'ecole', 'apprendre', 'apprentissage', 'lecon', 'savoir', 'science', 'decouverte', 'nature'],
  'fairy-tales': ['fee', 'fees', 'feerie', 'magie', 'magique', 'dragon', 'licorne', 'chateau', 'prince', 'princesse', 'enchante', 'sortilege', 'sorcier', 'sorciere', 'merveilleux', 'conte de fee', 'fantastique', 'royaume'],
  'activities': ['activite', 'sport', 'jeu', 'cuisine', 'musique', 'danse', 'peinture', 'dessin', 'bricolage', 'jardinage'],
  'stories': ['histoire', 'aventure', 'voyage', 'exploration', 'quete', 'mission', 'mystere', 'pirate', 'espace', 'ocean', 'jungle', 'foret', 'detective', 'tresor'],
  'celebrations': ['fete', 'celebration', 'ceremonie', 'carnaval', 'festival'],
  'family': ['famille', 'frere', 'soeur', 'papa', 'maman', 'grand-parent', 'grands-parents', 'mamie', 'papi', 'cousin', 'cousine'],
};

export function extractGeneralTheme(text: string): string | null {
  const norm = normalize(text);
  let bestTheme: string | null = null;
  let bestCount = 0;

  for (const [theme, keywords] of Object.entries(THEME_MAP)) {
    let count = 0;
    for (const kw of keywords) {
      if (norm.includes(kw)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestTheme = theme;
    }
  }

  // Detecter "dans l'univers de X" / "univers X" → fairy-tales par defaut
  if (!bestTheme) {
    const universeMatch = norm.match(/(?:dans\s+l'?\s*)?univers?\s+(?:de\s+)?(.+?)(?:\.|,|$|\s+(?:et|avec|pour|elle|il))/);
    if (universeMatch) bestTheme = 'fairy-tales';
  }

  return bestCount > 0 || bestTheme ? bestTheme : null;
}

// Extraire le theme custom (ex: "univers de harry potter")
export function extractCustomTheme(text: string): string | null {
  const norm = normalize(text);
  const match = norm.match(/(?:dans\s+l'?\s*)?univers?\s+(?:de\s+)?(.{3,40}?)(?:\.|,|$|\s+(?:et|avec|pour|elle|il|je|qui))/);
  if (match && match[1]) {
    const custom = match[1].trim();
    if (custom.length >= 3) return custom;
  }
  // "theme de X" / "sur le theme X"
  const match2 = norm.match(/(?:sur\s+le\s+)?th[eè]me\s+(?:de\s+)?(?:la\s+|le\s+|l')?(.{3,40}?)(?:\.|,|$|\s+(?:et|avec|pour|elle|il|je))/);
  if (match2 && match2[1]) {
    const custom = match2[1].trim();
    if (custom.length >= 3) return custom;
  }
  return null;
}

// ─── Occasion / Sujet specifique ───────────────────────────────

const OCCASION_MAP: Record<string, string[]> = {
  'birthday': ['anniversaire', 'birthday', 'fete son', 'soufflera ses bougies'],
  'christmas': ['noel', 'christmas', 'pere noel', 'sapin', 'renne'],
  'new-year': ['nouvel an', 'nouvelle annee', 'new year', 'reveillon'],
  'easter': ['paques', 'easter', 'oeufs de paques', 'lapin de paques'],
  'eid': ['aid', 'eid', 'ramadan', 'aid el fitr', 'aid al adha'],
  'mothers-day': ['fete des meres', 'fete de maman'],
  'fathers-day': ['fete des peres', 'fete de papa'],
};

export function extractSpecificSubject(text: string): string | null {
  const norm = normalize(text);
  for (const [subject, keywords] of Object.entries(OCCASION_MAP)) {
    for (const kw of keywords) {
      if (norm.includes(kw)) return subject;
    }
  }
  return null;
}

// ─── Message central / Morale ──────────────────────────────────

const MESSAGE_MAP: Record<string, string[]> = {
  'friendship': ['amitie', 'ami', 'amis', 'copain', 'copains', 'camarade', 'friendship'],
  'courage': ['courage', 'courageux', 'courageuse', 'brave', 'bravoure', 'peur', 'surmonter'],
  'love': ['amour', 'aimer', 'tendresse', 'affection', 'coeur'],
  'perseverance': ['perseverance', 'perseverer', 'determination', 'ne jamais abandonner', 'effort'],
  'sharing': ['partage', 'partager', 'generosite', 'genereux'],
  'honesty': ['honnetete', 'honnete', 'verite', 'sincerite', 'sincere'],
  'respect': ['respect', 'respecter', 'politesse', 'tolerance', 'tolerant'],
};

export function extractCentralMessage(text: string): string | null {
  const norm = normalize(text);
  for (const [message, keywords] of Object.entries(MESSAGE_MAP)) {
    for (const kw of keywords) {
      if (norm.includes(kw)) return message;
    }
  }
  return null;
}

// ─── Style d'illustration ──────────────────────────────────────

const STYLE_MAP: Record<string, string[]> = {
  'watercolor': ['aquarelle', 'watercolor', 'peinture'],
  '3d-animation': ['3d', 'animation 3d', 'pixar', 'disney', 'dessin anime'],
  'block-world': ['bloc', 'block', 'minecraft', 'lego', 'cube'],
  'paper-cut': ['papier decoupe', 'paper cut', 'collage', 'origami'],
  'clay-animation': ['clay', 'pate a modeler', 'argile', 'claymation', 'stop motion'],
  'kawaii': ['kawaii', 'mignon', 'cute', 'adorable', 'chibi'],
  'geometric': ['geometrique', 'geometric', 'abstrait'],
  'illustrated-book': ['livre illustre', 'classique', 'album jeunesse', 'illustration classique', 'traditionnel'],
  'japanese-manga': ['manga', 'japonais', 'anime', 'shonen'],
};

export function extractIllustrationStyle(text: string): string | null {
  const norm = normalize(text);
  for (const [style, keywords] of Object.entries(STYLE_MAP)) {
    for (const kw of keywords) {
      if (norm.includes(kw)) return style;
    }
  }
  return null;
}

// ─── Personnages secondaires ───────────────────────────────────

const ANIMAL_TYPES = ['chat', 'chien', 'lapin', 'hamster', 'poisson', 'tortue', 'perroquet', 'cheval', 'poney', 'dragon', 'licorne', 'oiseau', 'souris', 'renard', 'loup', 'ours', 'tigre', 'lion', 'elephant', 'dauphin', 'papillon', 'abeille', 'coccinelle'];
const HUMAN_TYPES = ['ami', 'amie', 'copain', 'copine', 'frere', 'soeur', 'cousin', 'cousine', 'voisin', 'voisine', 'camarade', 'meilleur ami', 'meilleure amie'];

const SECONDARY_PATTERNS = [
  // "avec son chat Moustache" / "et sa chienne Bella"
  /(?:avec|et)\s+(?:son|sa|leur|ses|un|une)\s+(\w+)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)/gi,
  // "son chat s'appelle Moustache"
  /(?:son|sa)\s+(\w+)\s+(?:s'appelle|se nomme)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)/gi,
];

export function extractSecondaryCharacters(text: string): SecondaryCharacter[] {
  const characters: SecondaryCharacter[] = [];
  const norm = normalize(text);

  for (const pattern of SECONDARY_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const typeWord = normalize(match[1]);
      const name = match[2];

      if (NOT_NAMES.has(normalize(name))) continue;

      const isAnimal = ANIMAL_TYPES.some(a => typeWord.includes(normalize(a)));
      const isHuman = HUMAN_TYPES.some(h => typeWord.includes(normalize(h)));

      if (isAnimal || isHuman) {
        // Eviter les doublons
        if (!characters.some(c => normalize(c.name) === normalize(name))) {
          characters.push({
            kind: isAnimal ? 'animal' : 'human',
            name: capitalizeFirst(name),
            ageOrType: capitalizeFirst(match[1]),
          });
        }
      }
    }
  }

  // Pattern simple: "et son chat" sans nom
  if (characters.length === 0) {
    for (const animal of ANIMAL_TYPES) {
      const simplePattern = new RegExp(`(?:avec|et)\\s+(?:son|sa|un|une)\\s+(${animal})\\b`, 'i');
      const simpleMatch = norm.match(simplePattern);
      if (simpleMatch) {
        characters.push({
          kind: 'animal',
          name: '',
          ageOrType: capitalizeFirst(animal),
        });
        break; // Un seul sans nom
      }
    }
  }

  return characters.slice(0, 3);
}

// ─── Hobbies / Passions ────────────────────────────────────────

export function extractHobbies(text: string): string | null {
  const patterns = [
    /(?:aime|adore|passion(?:ne)?|fan de|kiffe)\s+(?:le|la|les|l')?\s*(.{3,40}?)(?:\.|,|$|\s+(?:et\s+(?:je|elle|il|un|une)|avec|pour|dans|qui))/i,
    /(?:aime\s+(?:bien\s+)?)?(?:jouer|faire)\s+(?:au|a la|du|de la|aux)\s+(.{3,30}?)(?:\.|,|$|\s+(?:et|avec|pour|elle|il))/i,
    /(?:passions?|hobbies?|loisirs?|activit[eé]s?)\s*(?::|sont?|=)\s*(.{3,60})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const hobby = match[1].trim();
      if (hobby.length >= 3 && hobby.length <= 60) return hobby;
    }
  }
  return null;
}

// ─── Couleurs physiques ────────────────────────────────────────

const EYE_COLOR_MAP: Record<string, string> = {
  'marron': 'brown', 'brun': 'brown', 'brown': 'brown', 'chocolat': 'brown',
  'bleu': 'blue', 'bleus': 'blue', 'blue': 'blue', 'azur': 'blue',
  'vert': 'green', 'verts': 'green', 'green': 'green', 'emeraude': 'green',
  'noisette': 'hazel', 'hazel': 'hazel',
  'gris': 'gray', 'gray': 'gray', 'grey': 'gray',
  'ambre': 'amber', 'amber': 'amber', 'dore': 'amber', 'or': 'amber',
};

const HAIR_COLOR_MAP: Record<string, string> = {
  'chatain': 'brown', 'brun': 'brown', 'bruns': 'brown', 'marron': 'brown', 'brown': 'brown',
  'blond': 'blonde', 'blonde': 'blonde', 'blonds': 'blonde', 'dore': 'blonde',
  'noir': 'black', 'noirs': 'black', 'black': 'black', 'ebene': 'black', 'jais': 'black',
  'roux': 'red', 'rousse': 'red', 'red': 'red',
  'auburn': 'auburn', 'cuivre': 'auburn',
  'gris': 'gray', 'blanc': 'gray', 'argente': 'gray',
};

const SKIN_COLOR_MAP: Record<string, string> = {
  'clair': 'light', 'claire': 'light', 'pale': 'light', 'blanche': 'light', 'light': 'light',
  'moyen': 'medium', 'moyenne': 'medium', 'mate': 'medium', 'medium': 'medium',
  'olive': 'olive', 'mat': 'olive', 'basane': 'olive', 'bronze': 'olive', 'hale': 'olive',
  'fonce': 'dark', 'foncee': 'dark', 'noire': 'dark', 'dark': 'dark', 'ebene': 'dark', 'sombre': 'dark',
};

export function extractEyeColor(text: string): string | null {
  const norm = normalize(text);
  const match = norm.match(/yeux\s+(\w+)/);
  if (match) {
    return EYE_COLOR_MAP[match[1]] || null;
  }
  // "des yeux bleus"
  const match2 = norm.match(/(?:des\s+)?yeux\s+(?:de\s+couleur\s+)?(\w+)/);
  if (match2) return EYE_COLOR_MAP[match2[1]] || null;
  return null;
}

export function extractHairColor(text: string): string | null {
  const norm = normalize(text);
  const patterns = [
    /cheveux\s+(\w+)/,
    /(?:aux\s+)?cheveux\s+(?:de\s+couleur\s+)?(\w+)/,
  ];
  for (const pattern of patterns) {
    const match = norm.match(pattern);
    if (match) return HAIR_COLOR_MAP[match[1]] || null;
  }
  return null;
}

export function extractSkinColor(text: string): string | null {
  const norm = normalize(text);
  const match = norm.match(/(?:peau|teint)\s+(\w+)/);
  if (match) return SKIN_COLOR_MAP[match[1]] || null;
  return null;
}

// ─── Langue ────────────────────────────────────────────────────

const LANGUAGE_MAP: Record<string, string> = {
  'francais': 'french', 'français': 'french', 'french': 'french',
  'anglais': 'english', 'english': 'english',
  'espagnol': 'spanish', 'spanish': 'spanish',
  'arabe': 'arabic', 'arabic': 'arabic',
  'allemand': 'german', 'german': 'german',
  'japonais': 'japanese', 'japanese': 'japanese',
  'italien': 'italian', 'italian': 'italian',
  'flamand': 'flemish', 'flemish': 'flemish',
  'portugais': 'portuguese', 'portuguese': 'portuguese',
  'polonais': 'polish', 'polish': 'polish',
};

export function extractLanguage(text: string): string | null {
  const norm = normalize(text);
  const match = norm.match(/(?:en|langue)\s+(\w+)/);
  if (match) {
    return LANGUAGE_MAP[match[1]] || null;
  }
  // Check direct keyword
  for (const [keyword, lang] of Object.entries(LANGUAGE_MAP)) {
    if (norm.includes(keyword) && keyword !== 'francais' && keyword !== 'french') {
      return lang;
    }
  }
  return null;
}

// ─── Religion ──────────────────────────────────────────────────

const RELIGION_MAP: Record<string, string> = {
  'chretien': 'christian', 'chretienne': 'christian', 'christian': 'christian', 'catholique': 'christian', 'protestant': 'christian',
  'juif': 'jewish', 'juive': 'jewish', 'jewish': 'jewish', 'judaisme': 'jewish',
  'musulman': 'muslim', 'musulmane': 'muslim', 'muslim': 'muslim', 'islam': 'muslim',
  'bouddhiste': 'buddhist', 'buddhist': 'buddhist', 'bouddhisme': 'buddhist',
};

export function extractReligion(text: string): string | null {
  const norm = normalize(text);
  for (const [keyword, religion] of Object.entries(RELIGION_MAP)) {
    if (norm.includes(keyword)) return religion;
  }
  return null;
}

// ─── Extracteur global ─────────────────────────────────────────

export interface DetectedField {
  field: string;
  value: string;
  displayLabel: string;
  displayValue: string;
}

export function extractAllFields(text: string): {
  data: Record<string, any>;
  detectedFields: DetectedField[];
} {
  const data: Record<string, any> = {};
  const detectedFields: DetectedField[] = [];

  const add = (field: string, value: any, displayLabel: string, displayValue: string) => {
    if (value !== null && value !== undefined && value !== '') {
      data[field] = value;
      detectedFields.push({ field, value: String(value), displayLabel, displayValue });
    }
  };

  // Extraction dans l'ordre de priorite
  const name = extractProtagonistName(text);
  add('protagonistName', name, 'Prenom', name || '');

  const gender = extractProtagonistGender(text);
  add('protagonistGender', gender, 'Genre', gender === 'girl' ? 'Fille' : gender === 'boy' ? 'Garcon' : '');

  const age = extractProtagonistAge(text);
  add('protagonistAge', age, 'Age', age ? `${age} ans` : '');

  const ageRange = deriveAgeRange(age);
  if (ageRange) data.ageRange = ageRange; // Pas de chip visible, derive de l'age

  const theme = extractGeneralTheme(text);
  const themeLabels: Record<string, string> = {
    'educational': 'Educatif', 'fairy-tales': 'Contes de fees', 'activities': 'Activites',
    'stories': 'Histoires', 'celebrations': 'Fetes', 'family': 'Famille'
  };
  add('generalTheme', theme, 'Theme', theme ? themeLabels[theme] || theme : '');

  const customTheme = extractCustomTheme(text);
  if (customTheme) {
    data.customTheme = customTheme;
    // Si pas de theme detecte, le custom suffit
    if (!theme) {
      data.generalTheme = 'fairy-tales';
      detectedFields.push({ field: 'generalTheme', value: 'fairy-tales', displayLabel: 'Theme', displayValue: capitalizeFirst(customTheme) });
    }
  }

  const occasion = extractSpecificSubject(text);
  const occasionLabels: Record<string, string> = {
    'birthday': 'Anniversaire', 'christmas': 'Noel', 'new-year': 'Nouvel An',
    'easter': 'Paques', 'eid': 'Aid', 'mothers-day': 'Fete des meres', 'fathers-day': 'Fete des peres'
  };
  add('specificSubject', occasion, 'Occasion', occasion ? occasionLabels[occasion] || occasion : '');

  const message = extractCentralMessage(text);
  const messageLabels: Record<string, string> = {
    'friendship': 'Amitie', 'courage': 'Courage', 'love': 'Amour',
    'perseverance': 'Perseverance', 'sharing': 'Partage', 'honesty': 'Honnetete', 'respect': 'Respect'
  };
  add('centralMessage', message, 'Message', message ? messageLabels[message] || message : '');

  const style = extractIllustrationStyle(text);
  const styleLabels: Record<string, string> = {
    'watercolor': 'Aquarelle', '3d-animation': 'Animation 3D', 'block-world': 'Monde des blocs',
    'paper-cut': 'Papier decoupe', 'clay-animation': 'Clay-animation', 'kawaii': 'Kawaii',
    'geometric': 'Geometrique', 'illustrated-book': 'Livre illustre', 'japanese-manga': 'Manga'
  };
  add('illustrationStyle', style, 'Style', style ? styleLabels[style] || style : '');

  const characters = extractSecondaryCharacters(text);
  if (characters.length > 0) {
    data.secondaryCharacters = characters;
    const charDisplay = characters.map(c => c.name ? `${c.ageOrType} ${c.name}` : c.ageOrType).join(', ');
    detectedFields.push({ field: 'secondaryCharacters', value: JSON.stringify(characters), displayLabel: 'Personnages', displayValue: charDisplay });
  }

  const hobbies = extractHobbies(text);
  add('hobbies', hobbies, 'Passions', hobbies || '');

  const eyeColor = extractEyeColor(text);
  const eyeLabels: Record<string, string> = { 'brown': 'Marron', 'blue': 'Bleu', 'green': 'Vert', 'hazel': 'Noisette', 'gray': 'Gris', 'amber': 'Ambre' };
  add('eyeColor', eyeColor, 'Yeux', eyeColor ? eyeLabels[eyeColor] || eyeColor : '');

  const hairColor = extractHairColor(text);
  const hairLabels: Record<string, string> = { 'brown': 'Chatain', 'blonde': 'Blond', 'black': 'Noir', 'red': 'Roux', 'auburn': 'Auburn', 'gray': 'Gris' };
  add('hairColor', hairColor, 'Cheveux', hairColor ? hairLabels[hairColor] || hairColor : '');

  const skinColor = extractSkinColor(text);
  const skinLabels: Record<string, string> = { 'light': 'Clair', 'medium': 'Moyen', 'olive': 'Mat', 'dark': 'Fonce' };
  add('skinColor', skinColor, 'Peau', skinColor ? skinLabels[skinColor] || skinColor : '');

  const language = extractLanguage(text);
  if (language && language !== 'french') {
    const langLabels: Record<string, string> = {
      'english': 'Anglais', 'spanish': 'Espagnol', 'arabic': 'Arabe', 'german': 'Allemand',
      'japanese': 'Japonais', 'italian': 'Italien', 'flemish': 'Flamand', 'portuguese': 'Portugais', 'polish': 'Polonais'
    };
    add('language', language, 'Langue', langLabels[language] || language);
  }

  const religion = extractReligion(text);
  add('religion', religion, 'Religion', religion ? capitalizeFirst(religion) : '');

  return { data, detectedFields };
}
