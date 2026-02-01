import { SecondaryCharacter } from '../types';

/**
 * Formater les personnages secondaires pour affichage (admin, telegram, email)
 */
export function formatSecondaryCharacters(secondaryCharacters?: SecondaryCharacter[]): string {
  if (!secondaryCharacters || secondaryCharacters.length === 0) {
    return 'Aucun';
  }

  return secondaryCharacters
    .map((char, index) => {
      const kindLabel = char.kind === 'human' ? 'Humain' : 'Animal';
      const parts = [
        `${index + 1}) ${kindLabel}`,
        char.name,
        char.ageOrType
      ];
      
      if (char.physical) {
        parts.push(char.physical);
      }
      
      return parts.join(' — ');
    })
    .join('\n');
}

/**
 * Formater les personnages secondaires pour HTML (emails)
 */
export function formatSecondaryCharactersHTML(secondaryCharacters?: SecondaryCharacter[]): string {
  if (!secondaryCharacters || secondaryCharacters.length === 0) {
    return '<p><em>Aucun personnage secondaire</em></p>';
  }

  const items = secondaryCharacters
    .map((char, index) => {
      const kindLabel = char.kind === 'human' ? 'Humain' : 'Animal';
      let html = `<li><strong>${index + 1}. ${kindLabel}</strong> — ${char.name}`;
      
      if (char.ageOrType) {
        html += ` — ${char.ageOrType}`;
      }
      
      if (char.physical) {
        html += `<br><em>${char.physical}</em>`;
      }
      
      html += '</li>';
      return html;
    })
    .join('');

  return `<ul>${items}</ul>`;
}

/**
 * Parser les personnages secondaires depuis JSON
 */
export function parseSecondaryCharacters(json?: string | null): SecondaryCharacter[] {
  if (!json) return [];
  
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erreur parsing secondaryCharacters:', error);
    return [];
  }
}

/**
 * Stringifier les personnages secondaires en JSON
 */
export function stringifySecondaryCharacters(characters?: SecondaryCharacter[]): string | null {
  if (!characters || characters.length === 0) return null;
  
  try {
    return JSON.stringify(characters);
  } catch (error) {
    console.error('Erreur stringify secondaryCharacters:', error);
    return null;
  }
}
