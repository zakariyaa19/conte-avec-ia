// Generateur de titres de couverture dynamiques

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

const MESSAGE_SUBTITLES: Record<string, string> = {
  'friendship':   'Une histoire d\'amitie',
  'courage':      'Une histoire de courage',
  'love':         'Une histoire d\'amour',
  'perseverance': 'Ne jamais abandonner',
  'sharing':      'Le bonheur de partager',
  'honesty':      'La force de la verite',
  'respect':      'Grandir ensemble',
};

export function generateCoverTitle(
  name: string,
  specificSubject?: string,
  generalTheme?: string
): string {
  const displayName = name || 'Votre Enfant';

  if (specificSubject && OCCASION_TITLES[specificSubject]) {
    return OCCASION_TITLES[specificSubject](displayName);
  }
  if (generalTheme && THEME_TITLES[generalTheme]) {
    return THEME_TITLES[generalTheme](displayName);
  }
  return `Les Aventures de ${displayName}`;
}

export function generateCoverSubtitle(centralMessage?: string): string | null {
  if (centralMessage && MESSAGE_SUBTITLES[centralMessage]) {
    return MESSAGE_SUBTITLES[centralMessage];
  }
  return null;
}
