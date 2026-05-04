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

    // ── Prenom : tout debut du texte (avant virgule, " ans", " est", etc.)
    // OU mot capitalise non-stopword. Min 2 chars.
    let name: string | null = null;
    const firstWordMatch = text.match(/^\s*([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]{1,29})/);
    if (firstWordMatch) {
      name = firstWordMatch[1].trim();
    } else {
      const capMatch = text.match(/(?:^|\s)([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]{2,29})/);
      if (capMatch) name = capMatch[1].trim();
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

    // ── Theme
    let theme: string | null = null;
    if (/magie|magique|fee|fees|sorcier|sorciere|dragon|licorne|chateau|enchante|harry\s*potter|narnia|elf/.test(t)) theme = 'fairy-tales';
    else if (/educatif|ecole|apprendre|science|math|lecture/.test(t)) theme = 'educational';
    else if (/aventure|voyage|pirate|espace|tresor|jungle|mystere|detective|exploration|quete/.test(t)) theme = 'stories';
    else if (/famille|frere|soeur|papa|maman|grand-pere|grand-mere/.test(t)) theme = 'family';
    else if (/anniversaire|noel|fete|paques|halloween|aid|eid/.test(t)) theme = 'celebrations';

    // ── Morale
    let moral: string | null = null;
    if (/courage|courageux|brave|peur|surmonter|affront/.test(t)) moral = 'courage';
    else if (/amitie|ami\b|amie\b|copain|copine|camarade/.test(t)) moral = 'friendship';
    else if (/amour|tendresse|affection|coeur/.test(t)) moral = 'love';
    else if (/partage|genereux|generosite|donner/.test(t)) moral = 'sharing';
    else if (/respect|tolerance|politesse|gentil/.test(t)) moral = 'respect';
    else if (/honnetete|verite|sincere|mentir/.test(t)) moral = 'honesty';
    else if (/perseverance|determination|abandonner|reussir|effort/.test(t)) moral = 'perseverance';

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

    // ── Style illustration (uniquement si EXPLICITEMENT mentionne)
    let style: string | null = null;
    if (/aquarelle|watercolor|peinture/.test(t)) style = 'watercolor';
    else if (/manga|anime|japonais|dessin\s*anime/.test(t)) style = 'japanese-manga';
    else if (/3d|pixar|disney|animation\s*3/.test(t)) style = '3d-animation';
    else if (/kawaii|mignon|cute/.test(t)) style = 'kawaii';
    else if (/papier\s*decoupe|collage|origami/.test(t)) style = 'paper-cut';
    else if (/bloc|minecraft|lego|cubique/.test(t)) style = 'block-world';

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
      name: name && name.length >= 2 ? name : null,
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
