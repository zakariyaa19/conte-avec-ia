import { useMemo } from 'react';
import { DetectedEntities } from './useStoryDetection';

/**
 * Retourne la suggestion de plus haute priorite non encore satisfaite.
 * Phrases courtes, perçues comme un conseil optionnel — l'utilisateur peut
 * totalement les ignorer et soumettre quand il veut.
 *
 * Priorite (haut = plus important) :
 *   1. prenom    2. age      3. genre    4. theme    5. morale
 *   6. perso     7. style    8. hobby    9. photo    10. occasion
 */
export function useSmartHint(d: DetectedEntities): string {
  return useMemo(() => {
    if (!d.name) return "Le prénom de l'enfant ?";
    if (!d.age) return `Quel âge a ${d.name} ?`;
    if (!d.gender) return `${d.name} est une fille ou un garçon ?`;
    if (!d.theme) return "Dans quel univers va se dérouler l'histoire ?";
    if (!d.moral) return "Une morale ou un message à transmettre ?";
    if (!d.secondary) return "Un compagnon à ajouter (animal, ami) ?";
    if (!d.style) return "Un style d'illustration ? (manga, aquarelle, 3D)";
    if (!d.hobby) return "Quelles sont ses passions ?";
    if (!d.hasPhoto) return "Ajoutez sa photo pour des illustrations fidèles";
    if (!d.occasion) return "Une occasion spéciale ? (anniversaire, Noël)";
    return "Tout est prêt, lancez la création.";
  }, [d.name, d.age, d.gender, d.theme, d.moral, d.secondary, d.style, d.hobby, d.hasPhoto, d.occasion]);
}
