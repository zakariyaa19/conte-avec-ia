import { useEffect, useRef, useState } from 'react';
import { ApiService } from '../../config/api';
import { DetectedEntities, HintTopic, getNextHintTopic, isCoreComplete } from './useStoryDetection';

const FIRST_HINT = "Décris-moi l'enfant et l'histoire que tu imagines.";

// Au-dela de ce nombre de nouveaux caracteres tapes sans repondre au sujet
// suggere, on considere que la personne est passee a autre chose et on
// suggere le sujet suivant — plutot qu'un minuteur fixe (ex: 10s), qui
// penaliserait une frappe lente (mobile, peu fluide) en coupant avant
// qu'elle ait fini de repondre. A ~1,5-2 caracteres/seconde en frappe
// casuelle, 50 caracteres representent environ 25-35 secondes de frappe
// reelle — le temps d'ecrire une reponse courte complete.
const SKIP_CHARS = 50;

const HINT_LABELS: Record<HintTopic, (d: DetectedEntities) => string> = {
  name: () => "Le prénom de l'enfant ?",
  age: (d) => `Quel âge a ${d.name} ?`,
  gender: (d) => `${d.name} est une fille ou un garçon ?`,
  theme: () => "Dans quel univers va se dérouler l'histoire ?",
  secondary: () => "Un compagnon à ajouter (animal, ami) ?",
  moral: () => "Une morale ou un message à transmettre ?",
  photo: () => "Ajoute sa photo pour des illustrations qui lui ressemblent ?",
  style: () => "Un style d'illustration en tête ? (manga, aquarelle, 3D...)",
  hobby: () => "Quelles sont ses passions préférées ?",
  occasion: () => "Une occasion spéciale à fêter ?",
};

export interface SmartHintResult {
  hint: string;
  /** True quand l'IA est en train d'analyser (debounce ou appel API en cours) */
  thinking: boolean;
}

/**
 * Fallback local si l'API est en flight ou KO. Palier COEUR (prenom, age,
 * genre, univers) = vraie question. Palier BONUS (le reste, y compris la
 * photo) = jamais bloquant : une fois le coeur complet, on affirme que
 * c'est pret et on ajoute la suggestion bonus en plus, pas a la place.
 */
function localFallback(d: DetectedEntities, skipped: Set<HintTopic>): string {
  const topic = getNextHintTopic(d, skipped);
  if (!topic) return 'Tout est prêt, lance la création.';
  const label = HINT_LABELS[topic](d);
  return isCoreComplete(d) ? `C'est prêt ! ${label}` : label;
}

/**
 * Hook IA qui retourne {hint, thinking}.
 *
 * - Pendant le debounce et l'appel API : thinking=true → composant affiche 3 dots
 * - Quand le hint arrive : thinking=false, hint = la phrase de conseil
 * - Cache memoire 50 entries (par hash de description + sujets ignores)
 * - Abort previous request a chaque nouvelle frappe
 * - Fallback local si API timeout/erreur
 * - Suivi de sujet + skip : voir SKIP_CHARS ci-dessus
 */
export function useSmartHint(description: string, detected: DetectedEntities): SmartHintResult {
  const [hint, setHint] = useState<string>(FIRST_HINT);
  const [thinking, setThinking] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Suivi du sujet actuellement suggere — vit pour toute la session (pas
  // reinitialise entre deux frappes), pour detecter qu'on tape "a cote".
  const skippedTopicsRef = useRef<Set<HintTopic>>(new Set());
  const currentTopicRef = useRef<HintTopic | null>(null);
  const topicStartLenRef = useRef<number>(0);

  useEffect(() => {
    const desc = description.trim();
    if (desc.length < 3) {
      setHint(FIRST_HINT);
      setThinking(false);
      return;
    }

    // ── Suivi/skip de sujet — tourne a chaque frappe, independamment du
    // debounce de l'appel IA plus bas.
    let nextTopic = getNextHintTopic(detected, skippedTopicsRef.current);
    if (nextTopic !== currentTopicRef.current) {
      // Sujet different de celui suivi jusque-la (repondu, ou deja skip
      // ailleurs) : on redemarre le suivi sur ce nouveau sujet.
      currentTopicRef.current = nextTopic;
      topicStartLenRef.current = description.length;
    } else if (nextTopic && description.length - topicStartLenRef.current > SKIP_CHARS) {
      // Meme sujet suggere depuis plus de SKIP_CHARS caracteres sans que le
      // champ correspondant se remplisse : on passe au suivant.
      skippedTopicsRef.current.add(nextTopic);
      nextTopic = getNextHintTopic(detected, skippedTopicsRef.current);
      currentTopicRef.current = nextTopic;
      topicStartLenRef.current = description.length;
    }

    // Cle de cache : inclut hasPhoto + sujets ignores (le hint doit changer
    // quand l'un ou l'autre change, meme si le texte brut reste identique).
    const skippedKey = Array.from(skippedTopicsRef.current).sort().join(',');
    const cacheKey = desc.toLowerCase().replace(/\s+/g, ' ').slice(0, 400) + '|p=' + (detected.hasPhoto ? '1' : '0') + '|s=' + skippedKey;
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
        const res = await ApiService.generateSmartHint(
          desc,
          detected.hasPhoto,
          Array.from(skippedTopicsRef.current),
          ctrl.signal
        );
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
          setHint(localFallback(detected, skippedTopicsRef.current));
          setThinking(false);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setHint(localFallback(detected, skippedTopicsRef.current));
        setThinking(false);
      }
    }, 1100);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [description, detected]);

  return { hint, thinking };
}
