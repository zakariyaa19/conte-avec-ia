// Funnel tracking — envoie les étapes du parcours utilisateur au backend

const API_BASE = process.env.REACT_APP_API_URL || 'https://conte-avec-ia-backend.onrender.com';

// Session ID unique par visite (reset à chaque nouvel onglet)
function getSessionId(): string {
  let sid = sessionStorage.getItem('funnel_session_id');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('funnel_session_id', sid);
  }
  return sid;
}

function getSource(): string {
  const params = new URLSearchParams(window.location.search);
  if (params.get('from') === 'ad') return 'ad';
  if (document.referrer.includes('google')) return 'google';
  if (document.referrer.includes('facebook') || document.referrer.includes('instagram')) return 'social';
  if (document.referrer && !document.referrer.includes('contedia.fr')) return 'referral';
  return 'direct';
}

function getDevice(): string {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

// Dédoublonnage par session — chaque étape ne fire qu'une fois
const firedSteps = new Set<string>();

export function trackFunnelStep(step: string): void {
  if (firedSteps.has(step)) return;
  firedSteps.add(step);

  const payload = {
    sessionId: getSessionId(),
    step,
    source: getSource(),
    device: getDevice(),
  };

  // Fire-and-forget — ne jamais bloquer l'UI
  fetch(`${API_BASE}/api/public/funnel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
