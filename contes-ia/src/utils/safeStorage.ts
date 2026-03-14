/**
 * Safe storage utility — fallback to in-memory when sessionStorage/localStorage
 * is blocked (Facebook WebView, private browsing, etc.)
 */

const memoryStore: Record<string, string> = {};

function isStorageAvailable(storage: Storage): boolean {
  try {
    const testKey = '__storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasSessionStorage = typeof window !== 'undefined' && isStorageAvailable(window.sessionStorage);
const hasLocalStorage = typeof window !== 'undefined' && isStorageAvailable(window.localStorage);

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (hasSessionStorage) {
      try { return sessionStorage.getItem(key); } catch { /* fall through */ }
    }
    return memoryStore[`session_${key}`] ?? null;
  },
  setItem(key: string, value: string): void {
    if (hasSessionStorage) {
      try { sessionStorage.setItem(key, value); return; } catch { /* fall through */ }
    }
    memoryStore[`session_${key}`] = value;
  },
  removeItem(key: string): void {
    if (hasSessionStorage) {
      try { sessionStorage.removeItem(key); } catch { /* ignore */ }
    }
    delete memoryStore[`session_${key}`];
  },
};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (hasLocalStorage) {
      try { return localStorage.getItem(key); } catch { /* fall through */ }
    }
    return memoryStore[`local_${key}`] ?? null;
  },
  setItem(key: string, value: string): void {
    if (hasLocalStorage) {
      try { localStorage.setItem(key, value); return; } catch { /* fall through */ }
    }
    memoryStore[`local_${key}`] = value;
  },
  removeItem(key: string): void {
    if (hasLocalStorage) {
      try { localStorage.removeItem(key); } catch { /* ignore */ }
    }
    delete memoryStore[`local_${key}`];
  },
};

/** Detect Facebook / Instagram in-app browser (WebView) */
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|Line\/|Twitter|MicroMessenger/i.test(ua);
}

/** Detect specifically Facebook WebView */
export function isFacebookWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV/i.test(ua);
}

/** Build an intent URL to open the current page in the real browser */
export function getOpenInBrowserUrl(): string {
  const url = window.location.href;
  const ua = navigator.userAgent || '';

  // Android: use intent scheme to open in Chrome/default browser
  if (/android/i.test(ua)) {
    return `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;end`;
  }

  // iOS: just return the URL — we'll guide users to tap Safari icon
  return url;
}
