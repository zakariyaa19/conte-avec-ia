// Funnel tracking — envoie les étapes du parcours utilisateur au backend
//
// La fonction getSource() catégorise l'origine du visiteur de façon précise
// pour /admin/funnel : pub vs organique vs IA vs communautés. Les valeurs
// "source" ne sont pas une enum côté backend (string libre) donc tu peux en
// ajouter sans migration.

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

// Détection fine de la source du visiteur.
// Ordre = priorité : un clic FB pub doit être taggé 'social_paid' avant 'social_organic'.
function getSource(): string {
  const params = new URLSearchParams(window.location.search);
  const referrer = (document.referrer || '').toLowerCase();
  const utmSource = params.get('utm_source')?.toLowerCase() || '';
  const utmMedium = params.get('utm_medium')?.toLowerCase() || '';
  const gclid = params.get('gclid');     // Google Ads click ID
  const fbclid = params.get('fbclid');   // Meta Ads click ID
  const ttclid = params.get('ttclid');   // TikTok Ads click ID
  const msclkid = params.get('msclkid'); // Bing Ads click ID

  // 1. Pub explicite par UTM (la plus fiable, sous notre contrôle)
  if (params.get('from') === 'ad') return 'ad';
  if (['cpc', 'paid', 'ppc', 'cpm', 'paidsocial', 'paid_social'].includes(utmMedium)) {
    if (utmSource.includes('facebook') || utmSource.includes('instagram') || utmSource.includes('meta')) return 'social_paid';
    if (utmSource.includes('tiktok')) return 'tiktok_paid';
    if (utmSource.includes('google')) return 'google_paid';
    if (utmSource.includes('bing') || utmSource.includes('microsoft')) return 'bing_paid';
    return 'ad';
  }

  // 2. Click IDs (preuve mécanique d'un clic pub, indépendant des UTM)
  if (fbclid) return 'social_paid';
  if (ttclid) return 'tiktok_paid';
  if (gclid) return 'google_paid';
  if (msclkid) return 'bing_paid';

  // 3. Trafic IA générative (nouveau bucket — GEO Generative Engine Optimization)
  if (
    referrer.includes('chat.openai.com') ||
    referrer.includes('chatgpt.com') ||
    referrer.includes('claude.ai') ||
    referrer.includes('anthropic.com') ||
    referrer.includes('perplexity.ai') ||
    referrer.includes('copilot.microsoft.com') ||
    referrer.includes('gemini.google.com') ||
    referrer.includes('bard.google.com') ||
    referrer.includes('you.com') ||
    referrer.includes('phind.com')
  ) return 'ai';

  // 4. Moteurs de recherche organiques
  if (referrer.includes('google.')) return 'google';
  if (referrer.includes('bing.com')) return 'bing';
  if (referrer.includes('duckduckgo.com')) return 'duckduckgo';
  if (referrer.includes('yahoo.')) return 'yahoo';
  if (referrer.includes('ecosia.org')) return 'ecosia';
  if (referrer.includes('qwant.com')) return 'qwant';

  // 5. Réseaux sociaux organiques (referrer sans click ID = partage humain)
  if (referrer.includes('facebook.com') || referrer.includes('fb.com') || referrer.includes('m.facebook.com') || referrer.includes('l.facebook.com')) return 'social_organic';
  if (referrer.includes('instagram.com')) return 'social_organic';
  if (referrer.includes('tiktok.com')) return 'tiktok_organic';
  if (referrer.includes('youtube.com') || referrer.includes('youtu.be')) return 'youtube';
  if (referrer.includes('twitter.com') || referrer.includes('x.com')) return 'twitter';
  if (referrer.includes('linkedin.com')) return 'linkedin';
  if (referrer.includes('pinterest.')) return 'pinterest';
  if (referrer.includes('reddit.com')) return 'reddit';
  if (referrer.includes('snapchat.com')) return 'snapchat';

  // 6. Communautés / agrégateurs / blogs partagés
  if (referrer.includes('dealabs.com') || referrer.includes('dealabs.fr')) return 'community';
  if (referrer.includes('hackernews.com') || referrer.includes('news.ycombinator.com')) return 'community';
  if (referrer.includes('producthunt.com')) return 'community';

  // 7. Email (Mailjet ouverts/clics)
  if (utmMedium === 'email' || referrer.includes('mailjet') || referrer.includes('mail.google.com')) return 'email';

  // 8. Trafic interne (toi qui visites depuis Vercel dashboard, etc.)
  if (referrer.includes('vercel.com')) return 'internal';

  // 9. Referrer existe mais inconnu = referral
  if (referrer && !referrer.includes('contedia.fr')) return 'referral';

  // 10. Pas de referrer = direct (tapé URL, bookmark, app mobile)
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
