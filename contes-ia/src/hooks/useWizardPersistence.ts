import { useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'wizard_draft_v2';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface WizardDraft {
  formData: Record<string, unknown>;
  currentStep: number;
  savedAt: number;
}

function isExpired(draft: WizardDraft): boolean {
  return Date.now() - draft.savedAt > TTL_MS;
}

/** Strips non-serializable values (File objects) */
function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v instanceof File || v instanceof Blob) continue;
    clean[k] = v;
  }
  return clean;
}

export function useWizardPersistence() {
  const savedRef = useRef(false);

  const save = useCallback((formData: Record<string, unknown>, currentStep: number) => {
    try {
      const draft: WizardDraft = {
        formData: sanitize(formData),
        currentStep,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch { /* quota exceeded — ignore */ }
  }, []);

  const load = useCallback((): WizardDraft | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const draft: WizardDraft = JSON.parse(raw);
      if (isExpired(draft)) { localStorage.removeItem(STORAGE_KEY); return null; }
      return draft;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasDraft = useCallback((): boolean => {
    return load() !== null;
  }, [load]);

  // Auto-save helper
  const autoSave = useCallback((formData: Record<string, unknown>, currentStep: number) => {
    // Don't save preview step
    if (currentStep >= 9) return;
    save(formData, currentStep);
    savedRef.current = true;
  }, [save]);

  // Clear on unmount if form was submitted
  useEffect(() => {
    return () => {
      // cleanup if needed
    };
  }, []);

  return { save, load, clear, hasDraft, autoSave };
}
