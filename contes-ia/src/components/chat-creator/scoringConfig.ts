// Configuration du scoring pour le cercle de completion
// Chaque champ a un poids. Le score total = somme des poids des champs remplis.

export const FIELD_WEIGHTS: Record<string, number> = {
  // Champs requis (50 points)
  protagonistName: 15,
  protagonistGender: 10,
  ageRange: 10,
  generalTheme: 15,

  // Champs importants (30 points)
  photo: 8,
  illustrationStyle: 7,
  specificSubject: 5,
  centralMessage: 5,
  protagonistAge: 5,

  // Champs bonus (20 points)
  hobbies: 4,
  secondaryCharacters: 4,
  language: 3,
  eyeColor: 3,
  hairColor: 3,
  skinColor: 3,
};

export const MAX_SCORE = Object.values(FIELD_WEIGHTS).reduce((a, b) => a + b, 0); // 100

// Seuils de couleur pour le ring
export const THRESHOLDS = {
  red: { max: 35, color: '#EF4444', label: 'Decrivez votre histoire...' },
  orange: { max: 70, color: '#F59E0B', label: 'Bon debut ! Ajoutez plus de details' },
  green: { max: 101, color: '#22C55E', label: 'Pret a creer !' },
} as const;

// Score minimum pour activer le bouton de soumission
export const MIN_SUBMIT_SCORE = 50;

// Champs obligatoires (sans eux, pas de soumission meme si score >= MIN_SUBMIT_SCORE)
export const REQUIRED_FIELDS = ['protagonistName', 'protagonistGender', 'ageRange', 'generalTheme'] as const;

export function getScoreColor(score: number): string {
  if (score < THRESHOLDS.red.max) return THRESHOLDS.red.color;
  if (score < THRESHOLDS.orange.max) return THRESHOLDS.orange.color;
  return THRESHOLDS.green.color;
}

export function getScoreLabel(score: number): string {
  if (score < THRESHOLDS.red.max) return THRESHOLDS.red.label;
  if (score < THRESHOLDS.orange.max) return THRESHOLDS.orange.label;
  return THRESHOLDS.green.label;
}
