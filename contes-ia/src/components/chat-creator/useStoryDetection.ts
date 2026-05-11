import { useMemo } from 'react';

export interface DetectedEntities {
  name: string | null;
  age: string | null;
  gender: 'boy' | 'girl' | null;
  theme: string | null;
  moral: string | null;
  secondary: { kind: 'animal' | 'human'; label: string } | null;
  style: string | null;
  hobby: string | null;
  hasPhoto: boolean;
  occasion: string | null;
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Mots francais frequents qui ne sont JAMAIS des prenoms. La detection regex
// matchait sur le 1er mot capitalise (ex: "Un enfant de 6 ans..." -> "Un").
// Cette liste filtre les faux positifs evidents.
const STOP_WORDS_NAME = new Set([
  // Articles
  'un', 'une', 'le', 'la', 'les', 'des', 'du', 'de', 'au', 'aux', 'l',
  // Pronoms sujets et toniques
  'il', 'elle', 'ils', 'elles', 'on', 'je', 'tu', 'nous', 'vous', 'moi', 'toi', 'lui', 'eux',
  // Possessifs
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
  'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
  // Demonstratifs
  'ce', 'cet', 'cette', 'ces', 'ca', 'celui', 'celle', 'ceux', 'celles',
  // Prepositions / conjonctions
  'avec', 'sans', 'pour', 'dans', 'sur', 'sous', 'chez', 'vers', 'entre', 'par',
  'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or',
  // Adverbes / interrogatifs frequents
  'voici', 'voila', 'oui', 'non', 'aussi', 'comme', 'tres', 'tout', 'tous', 'toute', 'toutes',
  'quand', 'qui', 'que', 'quoi', 'dont', 'ou',
  // Verbes auxiliaires conjugaisons frequentes au debut de phrase
  'est', 'sont', 'etait', 'etaient', 'aura', 'aurait',
  // Mots qui commencent souvent une description d'enfant
  'mon', 'ma', 'notre', 'enfant', 'fille', 'fils', 'bebe', 'fillette', 'garcon',
  'petit', 'petite', 'grand', 'grande',
  // Nombres ecrits
  'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
]);

/**
 * Verifie qu'un candidat-prenom est plausible :
 * - Au moins 2 caracteres
 * - Pas un stop-word francais
 * - Pas une suite de chiffres
 * - Lettres ASCII/accentuees uniquement
 */
export function isPlausibleName(candidate: string | null | undefined): candidate is string {
  if (!candidate) return false;
  const trimmed = candidate.trim();
  if (trimmed.length < 2) return false;
  if (/^\d+$/.test(trimmed)) return false; // "313" rejete
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]*$/.test(trimmed)) return false;
  const lower = trimmed.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (STOP_WORDS_NAME.has(lower)) return false;
  return true;
}

/**
 * Parser intelligent — extrait les entites du texte libre tape par l'utilisateur.
 * Retourne null pour chaque champ NON detecte (sans defaults). C'est cette detection
 * qui pilote le scoring et le SmartHint, pour que le % parte de 0 et monte avec ce que
 * l'utilisateur ecrit reellement.
 */
export function useStoryDetection(combined: string, hasPhoto: boolean): DetectedEntities {
  return useMemo(() => {
    const text = combined || '';
    const t = norm(text);

    // ── Prenom : on cherche un mot capitalise qui n'est PAS un stop-word francais.
    // Bug historique : "Un enfant de 6 ans..." -> regex matchait "Un" comme prenom.
    // Maintenant on parcourt tous les candidats capitalises et on prend le premier
    // qui passe isPlausibleName (rejette articles, pronoms, chiffres, etc.).
    let name: string | null = null;
    const capCandidates = text.match(/(?:^|\s|[.,;:!?'"])([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]{1,29})/g) || [];
    for (const raw of capCandidates) {
      const candidate = raw.replace(/^[\s.,;:!?'"]+/, '').trim();
      if (isPlausibleName(candidate)) {
        name = candidate;
        break;
      }
    }
    // Tentative complementaire : "appelé(e) X", "prenom X", "il/elle s'appelle X"
    if (!name) {
      const explicit = text.match(/(?:appel[ée]e?|prenom|nomm[ée]e?|c'est|appell?\w*)\s+([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]{1,29})/i);
      if (explicit && isPlausibleName(explicit[1])) {
        name = explicit[1].trim();
      }
    }

    // ── Age : "X ans"
    const ageMatch = text.match(/(\d{1,2})\s*ans?\b/i);
    const age = ageMatch ? ageMatch[1] : null;

    // ── Genre
    let gender: 'boy' | 'girl' | null = null;
    if (/\b(?:fille|fillette|petite\s+fille|princesse)\b/i.test(text) || /\belle\s+(?:est|aime|adore|veut|a\s+\d)\b/i.test(text)) {
      gender = 'girl';
    } else if (/\b(?:gar[cç]on|petit\s+gar[cç]on|fils|prince(?!sse))\b/i.test(text) || /\bil\s+(?:est|aime|adore|veut|a\s+\d)\b/i.test(text)) {
      gender = 'boy';
    }

    // ── Theme : detection PERMISSIVE
    // 1. Categories explicites (mots-cles directs)
    // 2. Pattern "univers de X", "monde de X", "dans le X" → univers detecte (custom)
    // 3. Franchises populaires + lieux/decors → theme detecte
    // Le but : des que l'utilisateur exprime une intention d'univers, on considere
    // que c'est detecte. Le texte complet va de toute facon a GPT qui comprendra.
    let theme: string | null = null;
    // Categories canoniques (priorite haute)
    if (/magie|magique|fee\b|fees\b|sorcier|sorciere|dragon|licorne|chateau|enchante|royaume|princes/.test(t)) theme = 'fairy-tales';
    else if (/educatif|ecole|apprendre|science|math|lecture|classe|maitresse|maitre\s+d'?ecole/.test(t)) theme = 'educational';
    else if (/aventure|voyage|pirate|espace|tresor|jungle|mystere|detective|exploration|quete|enquete|expedition/.test(t)) theme = 'stories';
    else if (/famille|frere|soeur|papa|maman|grand-?pere|grand-?mere|papi|mamie/.test(t)) theme = 'family';
    else if (/anniversaire|noel|christmas|fete|paques|easter|halloween|aid|eid|ramadan/.test(t)) theme = 'celebrations';
    // Pattern generique : "univers/monde/royaume de X" ou "dans le/la X" → custom
    else if (
      /(?:univers?|monde|royaume|planete|galaxie|pays|ville|ile|foret|jungle|ocean|mer|montagne|desert|espace)\s+(?:d[eu]s?\s+|de\s+l[ae']\s*)?[a-zA-Zà-ÿ]/i.test(text)
      || /dans\s+(?:l[ae']\s*|les?\s+|du\s+)?[a-zA-Zà-ÿ]/i.test(text) && /univers|monde|royaume|monde/.test(t)
    ) {
      theme = 'stories';
    }
    // Franchises et licences populaires (couvre "univers de mario", "harry potter", etc.)
    else if (/mario|pokemon|naruto|disney|pixar|harry\s*potter|narnia|star\s*wars|avatar|frozen|reine\s*des\s*neiges|spider-?man|batman|superman|marvel|dc\s+comics|minecraft|fortnite|roblox|paw\s*patrol|pat\s*patrouille|peppa|miraculous/.test(t)) {
      theme = 'fairy-tales';
    }
    // Decors / lieux (suffit a considerer un univers)
    else if (/foret|jungle|ocean|mer\b|plage|montagne|desert|espace|spatial|sous-?marin|chateau|dragon|arc-en-ciel|nuage|etoile|planete|robot|cyborg|extraterrestre|alien|monstre/.test(t)) {
      theme = 'stories';
    }

    // ── Morale : detection PERMISSIVE
    // Mots-cles + pattern "morale du/de X" + "leçon de X" + "message de X"
    let moral: string | null = null;
    if (/courage|courageux|courageuse|brave|peur|surmonter|affront|oser|hero|heroïne|heroine/.test(t)) moral = 'courage';
    else if (/amitie|amitié|\bami(?:e|s|es)?\b|copain|copine|camarade|allie|allié|ensemble/.test(t)) moral = 'friendship';
    else if (/amour|tendresse|affection|c[oe]ur|aime[rz]?\s+(?:son|sa|ses|le|la)/.test(t)) moral = 'love';
    else if (/partage|genereux|generosite|générosité|donner|offrir|cadeau/.test(t)) moral = 'sharing';
    else if (/respect|tolerance|tolérance|politesse|gentil|gentillesse|accepter/.test(t)) moral = 'respect';
    else if (/honnetete|honnêteté|verite|vérité|sincere|sincère|mentir|mensonge|verite|vrai/.test(t)) moral = 'honesty';
    else if (/perseverance|persévérance|determination|détermination|abandonner|reussir|réussir|effort|persister/.test(t)) moral = 'perseverance';
    // Pattern generique : "morale du X" / "lecon X" / "message X" → considere detecte
    else if (/(?:morale|moralité|lecon|leçon|message|valeur)\s+(?:du|de\s+l[ae']?|sur|de)/i.test(text)) moral = 'courage';

    // ── Personnage secondaire
    let secondary: DetectedEntities['secondary'] = null;
    const animalMatch = text.match(/\b(chat|chien|lapin|hamster|oiseau|dragon|licorne|renard|loup|ours|tortue|poisson|cheval|poney|panda|koala|singe)\b/i);
    if (animalMatch) {
      secondary = { kind: 'animal', label: animalMatch[1].toLowerCase() };
    } else {
      const humanMatch = text.match(/\b(meilleur(?:e)?\s+ami(?:e)?|frere|soeur|cousin(?:e)?|voisin(?:e)?|copain|copine|grand-pere|grand-mere|papi|mamie)\b/i);
      if (humanMatch) {
        secondary = { kind: 'human', label: humanMatch[1].toLowerCase() };
      }
    }

    // ── Style illustration : detection PERMISSIVE
    let style: string | null = null;
    if (/aquarelle|watercolor|peinture|peint/.test(t)) style = 'watercolor';
    else if (/manga|anime|japonais|dessin\s*anime|chibi/.test(t)) style = 'japanese-manga';
    else if (/3d|pixar|disney|animation\s*3|cgi/.test(t)) style = '3d-animation';
    else if (/kawaii|mignon|cute|adorable/.test(t)) style = 'kawaii';
    else if (/papier\s*decoupe|papier\s*découpé|collage|origami/.test(t)) style = 'paper-cut';
    else if (/bloc|minecraft|lego|cubique|voxel/.test(t)) style = 'block-world';
    // Pattern generique : "style X", "illustration en X" → considere detecte
    else if (/(?:style|illustration|dessin|graphisme|image|esthetique|esthétique)\s+(?:de\s+|en\s+|d['']|du\s+)?[a-zA-Zà-ÿ]/i.test(text)) style = '3d-animation';

    // ── Hobby
    let hobby: string | null = null;
    const hobbyMatch = t.match(/(?:aime|adore|passion|kiffe|fan\s+de|jouer\s+(?:au|du|a\s+la)?|faire\s+(?:du|de\s+la)?)\s+(?:le\s+|la\s+|les\s+|l'|du\s+|de\s+la\s+|au\s+|aux\s+)?([a-zà-ÿ\s]{3,30}?)(?:[.,!?]|$|\s+(?:et\s+|avec\s+|dans\s+|qui\s+|elle\s+|il\s+|je\s+))/);
    if (hobbyMatch && hobbyMatch[1]) {
      const h = hobbyMatch[1].trim();
      // Filtrer les faux positifs (mots vides ou trop courts)
      if (h.length >= 3 && !/^(le|la|les|un|une|des|et|de|du|en)$/.test(h)) {
        hobby = h;
      }
    }

    // ── Occasion
    let occasion: string | null = null;
    if (/anniversaire/.test(t)) occasion = 'birthday';
    else if (/noel|christmas/.test(t)) occasion = 'christmas';
    else if (/paques|easter/.test(t)) occasion = 'easter';
    else if (/aid|eid|ramadan/.test(t)) occasion = 'eid';
    else if (/fete\s*des\s*meres?/.test(t)) occasion = 'mothers-day';
    else if (/fete\s*des\s*peres?/.test(t)) occasion = 'fathers-day';
    else if (/halloween/.test(t)) occasion = 'halloween';

    return {
      name: isPlausibleName(name) ? name : null,
      age,
      gender,
      theme,
      moral,
      secondary,
      style,
      hobby,
      hasPhoto: !!hasPhoto,
      occasion,
    };
  }, [combined, hasPhoto]);
}

/**
 * Score de completion base sur les entites detectees.
 * Total = 100 points repartis selon l'importance perçue par l'utilisateur.
 */
export function computeDetectionScore(d: DetectedEntities): number {
  let s = 0;
  if (d.name) s += 20;
  if (d.age) s += 15;
  if (d.gender) s += 10;
  if (d.theme) s += 15;
  if (d.moral) s += 10;
  if (d.secondary) s += 10;
  if (d.style) s += 5;
  if (d.hobby) s += 5;
  if (d.hasPhoto) s += 5;
  if (d.occasion) s += 5;
  return s; // 0-100
}
