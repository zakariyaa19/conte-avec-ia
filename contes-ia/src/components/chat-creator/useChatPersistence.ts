import { useEffect, useRef, useCallback } from 'react';
import { safeLocalStorage } from '../../utils/safeStorage';

const STORAGE_KEY = 'chat_creator_draft';
const SAVE_DEBOUNCE_MS = 1000;

interface ChatDraft {
  rawText: string;
  photoName?: string;
  timestamp: number;
}

export function useChatPersistence(rawText: string, photoName?: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sauvegarder le brouillon (debounce)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!rawText.trim()) return;

    timerRef.current = setTimeout(() => {
      const draft: ChatDraft = {
        rawText,
        photoName,
        timestamp: Date.now(),
      };
      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [rawText, photoName]);

  return null;
}

// Charger un brouillon existant (max 24h)
export function loadChatDraft(): ChatDraft | null {
  try {
    const raw = safeLocalStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const draft: ChatDraft = JSON.parse(raw);
    // Expire apres 24h
    if (Date.now() - draft.timestamp > 24 * 60 * 60 * 1000) {
      safeLocalStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearChatDraft(): void {
  safeLocalStorage.removeItem(STORAGE_KEY);
}
