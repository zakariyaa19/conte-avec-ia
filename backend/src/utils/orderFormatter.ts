import { formatSecondaryCharacters, parseSecondaryCharacters } from './formatters';

/**
 * Construit la chaine de details de commande pour les emails admin/client.
 * Reutilisable dans stripeController et orderController.
 */
export function buildOrderDetailsString(order: any): string {
  return `
=== INFORMATIONS DU CONTE ===
Tranche d'age: ${order.ageRange}
Theme general: ${order.generalTheme}${order.customTheme ? ` (Personnalise: ${order.customTheme})` : ''}
Sujet: ${order.specificSubject}${order.customSubject ? ` (Personnalise: ${order.customSubject})` : ''}
Message central: ${order.centralMessage}${order.customMessage ? ` (Personnalise: ${order.customMessage})` : ''}
Style d'illustration: ${order.illustrationStyle}
${order.language ? `Langue du conte: ${order.language}` : ''}

=== INFORMATIONS DU PROTAGONISTE ===
Nom: ${order.protagonistName}
Age: ${order.protagonistAge || 'Non specifie'}
${order.protagonistGender ? `Sexe: ${order.protagonistGender === 'boy' ? 'Garcon' : 'Fille'}` : ''}
${order.photoUrl ? `Photo fournie: Oui` : `Couleur des yeux: ${order.eyeColor || 'Non specifie'}
Couleur des cheveux: ${order.hairColor || 'Non specifie'}
Couleur de la peau: ${order.skinColor || 'Non specifie'}`}
${order.hobbies ? `Loisirs: ${order.hobbies}` : ''}
${order.favoriteDish ? `Plat prefere: ${order.favoriteDish}` : ''}
${order.specialEvents ? `Evenements speciaux: ${order.specialEvents}` : ''}
${order.religion ? `Religion: ${order.religion}${order.customReligion ? ` (${order.customReligion})` : ''}` : ''}

=== PERSONNAGES SECONDAIRES ===
${formatSecondaryCharacters(parseSecondaryCharacters(order.secondaryCharactersJson))}

=== DETAILS PERSONNELS ===
${order.creatorName ? `Createur: ${order.creatorName}` : 'Non specifie'}

=== COMMANDE ===
Type d'achat: ${order.purchaseType === 'CLUB' ? 'Club' : 'Achat unique'}
Prix: ${order.price}EUR`;
}
