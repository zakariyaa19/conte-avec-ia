import { useEffect, useRef, useState } from 'react';
import { ApiService } from '../../config/api';
import { DetectedEntities } from './useStoryDetection';

const FIRST_HINT = "Décris-moi l'enfant et l'histoire que tu imagines.";

export interface SmartHintResult {
  hint: string;
  /** True quand l'IA est en train d'analyser (debounce ou appel API en cours) */
  thinking: boolean;
}

/** Fallback local si l'API est en flight ou KO. */
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
 * Hook IA qui retourne {hint, thinking}.
 *
 * - Pendant le debounce et l'appel API : thinking=true → composant affiche 3 dots
 * - Quand le hint arrive : thinking=false, hint = la phrase de conseil
 * - Cache memoire 50 entries (par hash de description)
 * - Abort previous request a chaque nouvelle frappe
 * - Fallback local si API timeout/erreur
 */
export function useSmartHint(description: string, detected: DetectedEntities): SmartHintResult {
  const [hint, setHint] = useState<string>(FIRST_HINT);
  const [thinking, setThinking] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const desc = description.trim();
    if (desc.length < 3) {
      setHint(FIRST_HINT);
      setThinking(false);
      return;
    }

    // Cache hit immediat → pas de spinner
    const cacheKey = desc.toLowerCase().replace(/\s+/g, ' ').slice(0, 400);
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setHint(cached);
      setThinking(false);
      return;
    }

    // L'IA "reflechit" : montrer les 3 dots tant qu'on n'a pas la reponse
    setThinking(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await ApiService.generateSmartHint(desc, ctrl.signal);
        if (ctrl.signal.aborted) return;
        if (res.success && res.data?.hint) {
          cacheRef.current.set(cacheKey, res.data.hint);
          if (cacheRef.current.size > 50) {
            const first = cacheRef.current.keys().next().value;
            if (first) cacheRef.current.delete(first);
          }
          setHint(res.data.hint);
          setThinking(false);
        } else {
          setHint(localFallback(detected));
          setThinking(false);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setHint(localFallback(detected));
        setThinking(false);
      }
    }, 1100);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [description, detected]);

  return { hint, thinking };
}
