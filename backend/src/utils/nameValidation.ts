/**
 * Validation et nettoyage des noms (prenoms enfants et noms parents) avant
 * usage dans les emails, prompts GPT, et notifications.
 *
 * Bug historique : la detection regex frontend prenait "Un" comme prenom quand
 * le parent ecrivait "Un enfant de 6 ans...". Resultat : mail "L'histoire de Un
 * est prete !". Cet utilitaire bloque ce genre de valeurs en bout de chaine.
 */

const STOP_WORDS_NAME = new Set<string>([
  // Articles
  'un', 'une', 'le', 'la', 'les', 'des', 'du', 'de', 'au', 'aux', 'l',
  // Pronoms
  'il', 'elle', 'ils', 'elles', 'on', 'je', 'tu', 'nous', 'vous',
  'moi', 'toi', 'lui', 'eux',
  // Possessifs
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
  'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
  // Demonstratifs
  'ce', 'cet', 'cette', 'ces', 'ca',
  // Prepositions / conjonctions courantes
  'avec', 'sans', 'pour', 'dans', 'sur', 'sous', 'chez', 'et', 'ou', 'mais',
  // Adverbes / particules
  'oui', 'non', 'voici', 'voila', 'tres', 'tout', 'tous', 'toute', 'toutes',
  // Substituts courants au prenom dans une description
  'enfant', 'fille', 'fils', 'bebe', 'fillette', 'garcon',
  'petit', 'petite', 'grand', 'grande',
  // Termes generiques compte
  'client', 'user', 'utilisateur', 'parent', 'admin', 'test',
]);

/**
 * Verifie qu'une valeur ressemble a un vrai prenom (enfant ou parent) :
 * - 2 a 30 caracteres apres trim
 * - Lettres ASCII/accentuees, espaces, apostrophes, traits d'union uniquement
 * - Commence par une lettre (pas un chiffre)
 * - Pas une suite de chiffres
 * - Pas dans la liste des stop-words francais
 */
export function isPlausibleName(value: string | null | undefined): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 2 || trimmed.length > 30) return false;
  if (/^\d+$/.test(trimmed)) return false;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]*$/.test(trimmed)) return false;
  const normalized = trimmed.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (STOP_WORDS_NAME.has(normalized)) return false;
  return true;
}

/**
 * Resout un nom client (parent) pour les emails en cherchant la PREMIERE valeur
 * plausible parmi les candidats fournis. Retourne `fallback` si aucune ne passe.
 *
 * Usage : `resolveCustomerName([user.firstName, formData.creatorName], 'Bonjour')`
 */
export function resolveCustomerName(
  candidates: Array<string | null | undefined>,
  fallback: string = 'Bonjour'
): string {
  for (const c of candidates) {
    if (isPlausibleName(c)) return c.trim();
  }
  return fallback;
}

/**
 * Resout un prenom d'enfant pour AFFICHAGE (sujets de mails, corps, prompts GPT).
 * Si le nom stocke est invalide (vieille donnee avec "Un", "313", etc.), retourne
 * un fallback neutre au lieu d'envoyer "L'histoire de Un est prete !".
 *
 * Usage : `displayChildName(order.protagonistName)` -> "Lea" ou "votre enfant"
 */
export function displayChildName(
  name: string | null | undefined,
  fallback: string = 'votre enfant'
): string {
  return isPlausibleName(name) ? name.trim() : fallback;
}

/**
 * Nettoie un prenom recu du formulaire (trim, capitalisation premiere lettre).
 * Suppose que la validation `isPlausibleName` a deja passe.
 */
export function normalizeChildName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  // Capitalisation de la 1ere lettre des mots composes (ex: "marie-louise" -> "Marie-Louise")
  return trimmed
    .split(/(\s|-)/)
    .map(part => {
      if (part === ' ' || part === '-') return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}
