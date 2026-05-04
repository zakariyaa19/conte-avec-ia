import { useEffect, useRef, useState } from 'react';
import { ApiService } from '../../config/api';
import { DetectedEntities } from './useStoryDetection';

const FIRST_HINT = "Décris-moi l'enfant et l'histoire que tu imagines.";

/** Hint local de fallback : si l'API est en flight ou KO, on affiche quelque chose de pertinent. */
function localFallback(d: DetectedEntities): string {
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
  return "Tout est prêt, lance la création.";
}

/**
 * useSmartHint — vraie analyse IA du brief client.
 *
 * Le hook envoie la description au backend (qui appelle GPT-4o-mini) avec
 * un debounce de 1.1s apres la derniere frappe. Cache en memoire pour eviter
 * les requetes en doublon. Fallback sur la detection locale si API timeout
 * ou erreur — le client n'attend jamais sans hint.
 */
export function useSmartHint(description: string, detected: DetectedEntities): string {
  const [hint, setHint] = useState<string>(FIRST_HINT);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const desc = description.trim();
    if (desc.length < 3) {
      setHint(FIRST_HINT);
      return;
    }

    // Cache hit immediat (memoire client) → pas d'appel
    const cacheKey = desc.toLowerCase().replace(/\s+/g, ' ').slice(0, 400);
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setHint(cached);
      return;
    }

    // Affichage immediat du fallback local pendant que l'API travaille
    setHint(prev => prev || localFallback(detected));

    // Debounce 1.1s avant l'appel API
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Annule la requete precedente si toujours en flight
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await ApiService.generateSmartHint(desc, ctrl.signal);
        if (ctrl.signal.aborted) return;
        if (res.success && res.data?.hint) {
          cacheRef.current.set(cacheKey, res.data.hint);
          // Limite cache 50 entrees
          if (cacheRef.current.size > 50) {
            const first = cacheRef.current.keys().next().value;
            if (first) cacheRef.current.delete(first);
          }
          setHint(res.data.hint);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        // Fallback gracieux : on garde le hint local existant
        setHint(localFallback(detected));
      }
    }, 1100);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [description, detected]);

  return hint;
}
