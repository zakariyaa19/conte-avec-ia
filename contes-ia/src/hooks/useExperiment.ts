import { useMemo, useEffect } from 'react';

/**
 * A/B testing hook — assignation deterministe (6.3 devbook)
 *
 * Usage :
 *   const variant = useExperiment('paywall_cta_wording', ['control', 'urgency', 'value']);
 *   <Button>{variant === 'urgency' ? 'Derniere chance' : 'Offrir la suite'}</Button>
 *
 * - L'assignation est stable pour un meme utilisateur (basee sur le hash de son email/userId)
 * - Si pas d'identite : genere un id anonyme en localStorage (cookie persistence)
 * - Expose la variante a window.clarity / window.fbq / window.ttq pour segmenter les conversions
 */

const ANON_ID_KEY = 'contedia_anon_id';

function getAnonId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = window.localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    try { window.localStorage.setItem(ANON_ID_KEY, id); } catch { /* quota */ }
  }
  return id;
}

// Hash deterministe simple (FNV-1a 32-bit) — suffisant pour la distribution de variantes
function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

interface UseExperimentOptions {
  identity?: string | null; // override (ex: email ou userId)
  trackExposure?: boolean;  // defaut true : envoie a Clarity/Meta/TikTok
}

export function useExperiment<T extends string>(
  experimentName: string,
  variants: readonly T[],
  options: UseExperimentOptions = {}
): T {
  const { identity, trackExposure = true } = options;

  const variant = useMemo<T>(() => {
    if (!variants.length) throw new Error('useExperiment: variants vide');
    const who = identity || getAnonId();
    const key = `${experimentName}|${who}`;
    const idx = hashString(key) % variants.length;
    return variants[idx];
  }, [experimentName, variants, identity]);

  useEffect(() => {
    if (!trackExposure || typeof window === 'undefined') return;
    const payload = { experiment: experimentName, variant };
    try {
      const w: any = window;
      // Microsoft Clarity
      if (w.clarity) w.clarity('set', `exp_${experimentName}`, variant);
      // Meta Pixel
      if (w.fbq) w.fbq('trackCustom', 'ExperimentExposure', payload);
      // TikTok Pixel
      if (w.ttq && typeof w.ttq.track === 'function') w.ttq.track('ExperimentExposure', payload);
    } catch { /* never break UI */ }
  }, [experimentName, variant, trackExposure]);

  return variant;
}
