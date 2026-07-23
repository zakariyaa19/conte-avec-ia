// Rapport funnel en ligne de commande — lit directement les FunnelEvent en
// base, sans passer par l'admin web ni un export Clarity manuel.
//
// Usage : npm run funnel:report -- --days=30
//
// Le parcours sequentiel (FUNNEL_ORDER) et les signaux de blocage (BLOCKERS)
// doivent rester synchronises avec les appels trackFunnelStep() du frontend
// (ChatStoryCreator.tsx, StoryFormPage.tsx, StoryDetailPage.tsx,
// useCoverPreview.ts) et avec contes-ia/src/pages/AdminFunnelPage.tsx —
// c'est la meme donnee, deux vues (script pour moi, dashboard pour l'humain).

import { PrismaClient } from '@prisma/client';
import { PRODUCT_PRICES } from './pricing';

const prisma = new PrismaClient();

const FUNNEL_ORDER: { key: string; label: string }[] = [
  { key: 'page_view', label: 'Visite formulaire' },
  { key: 'chat_started_typing', label: 'Commence a ecrire' },
  { key: 'chat_name_detected', label: 'Prenom detecte' },
  { key: 'chat_score_ready', label: 'Brief pret (score >= 70%)' },
  { key: 'chat_to_preview', label: 'Histoire decrite -> preview' },
  { key: 'chat_cover_ready', label: 'Couverture generee' },
  { key: 'email_entered', label: 'Email / Auth' },
  { key: 'form_submitted', label: 'Livre cree' },
];

const BLOCKERS: { key: string; label: string; kind: 'warn' | 'info' }[] = [
  { key: 'chat_text_no_name_20chars', label: 'Brief long (20+ car.) sans prenom detecte', kind: 'warn' },
  { key: 'chat_photo_added', label: 'Photo jointe', kind: 'info' },
  { key: 'chat_photo_read_failed', label: 'Echec lecture photo (upload cote client)', kind: 'warn' },
  { key: 'chat_cover_photo_conversion_failed', label: 'Photo non prise en compte pour la cover', kind: 'warn' },
  { key: 'chat_cover_error', label: 'Echec generation couverture (preview)', kind: 'warn' },
  { key: 'chat_google_auth_error', label: 'Echec connexion Google', kind: 'warn' },
  { key: 'form_submit_error', label: 'Erreur a la soumission finale (ex-alert())', kind: 'warn' },
  { key: 'story_generation_failed_seen', label: 'Livre gratuit : ecran d\'echec de generation vu', kind: 'warn' },
  { key: 'draft_restored', label: 'Brouillon restaure apres fermeture/refresh', kind: 'info' },
];

// Captures via sendBeacon au moment reel ou la page se ferme (registerExitTracking,
// funnelTracker.ts) — dit OU precisement quelqu'un a lache prise, contrairement
// aux steps ci-dessus qui disent seulement quelles etapes ont ete franchies.
const EXIT_LABELS: Record<string, string> = {
  exit_form_empty: "Parti sans rien ecrire",
  exit_form_short_text: 'Parti apres un debut de texte (<20 car.)',
  exit_form_text_no_name: 'Parti avec du texte mais sans prenom detecte',
  exit_form_name_not_ready: 'Parti avec prenom detecte mais brief incomplet (<70%)',
  exit_form_ready_not_clicked: "Parti alors que le bouton \"Pret\" etait actif — n'a pas clique",
  exit_preview_cover_loading: 'Parti pendant que la couverture generait',
  exit_preview_cover_error: 'Parti apres un echec de generation de couverture',
  exit_preview_awaiting_auth: 'Parti sans donner son email / se connecter',
  exit_preview_ready_not_submitted: "Parti alors que tout etait pret — n'a pas clique sur le CTA final",
};

// Paywall (cliffhanger -> completion 2,99€) — existait deja cote Clarity/
// Meta/TikTok (paywallTracking.ts) mais etait invisible ici avant le 23/07.
// Population differente du reste (quelqu'un peut lire son livre gratuit
// plusieurs jours apres l'avoir cree) : base 100% sur paywall_view, pas sur
// les visiteurs du formulaire.
const PAYWALL_ORDER: { key: string; label: string }[] = [
  { key: 'paywall_view', label: 'Voit l\'ecran "Offrir la suite"' },
  { key: 'paywall_click', label: 'Clique sur le CTA principal' },
  { key: 'paywall_checkout_open', label: 'Ouvre le paiement (Stripe Elements)' },
  { key: 'paywall_payment_success', label: 'Paiement confirme (cote client)' },
];
const PAYWALL_EXIT_LABELS: Record<string, string> = {
  exit_paywall_seen_not_clicked: 'Parti apres avoir vu le paywall, sans cliquer',
  exit_paywall_checkout_open_not_paid: 'Parti avec le paiement ouvert, sans le finir',
};

function parseDays(): number {
  const arg = process.argv.find(a => a.startsWith('--days='));
  const days = arg ? parseInt(arg.split('=')[1], 10) : 30;
  return Number.isFinite(days) && days > 0 ? days : 30;
}

function bar(pct: number, width = 28): string {
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  return '#'.repeat(filled) + '-'.repeat(width - filled);
}

function pad(n: number | string, width: number): string {
  return String(n).padStart(width);
}

async function main() {
  const days = parseDays();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const sessionsPerStep = await prisma.$queryRawUnsafe<{ step: string; sessions: bigint }[]>(
    `SELECT step, COUNT(DISTINCT "sessionId") as sessions FROM funnel_events WHERE "createdAt" >= $1 GROUP BY step ORDER BY sessions DESC`,
    since
  );
  const totalRow = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(DISTINCT "sessionId") as count FROM funnel_events WHERE "createdAt" >= $1`,
    since
  );
  const total = Number(totalRow[0]?.count || 0);

  const bySource = await prisma.funnelEvent.groupBy({
    by: ['source'],
    where: { createdAt: { gte: since }, step: 'page_view' },
    _count: { id: true },
  });
  const byDevice = await prisma.funnelEvent.groupBy({
    by: ['device'],
    where: { createdAt: { gte: since }, step: 'page_view' },
    _count: { id: true },
  });

  const find = (step: string) => Number(sessionsPerStep.find(s => s.step === step)?.sessions || 0);

  // ═══ Revenus & conversions payantes — verite terrain (Order/User), pas
  // des evenements client qui peuvent echouer silencieusement. C'est Stripe
  // qui confirme cote serveur, pas le navigateur. Trois conversions bien
  // distinctes : livre gratuit (aucun revenu), completion 2,99€, Club. ═══
  const freeBooks = await prisma.order.count({
    where: { price: 0, purchaseType: 'SINGLE', storyStatus: 'DISPONIBLE', createdAt: { gte: since } },
  });
  const completions = await prisma.order.aggregate({
    where: { price: PRODUCT_PRICES.EBOOK_COMPLETE, purchaseType: 'SINGLE', paidAt: { gte: since } },
    _count: { id: true },
    _sum: { price: true },
  });
  const directPurchases = await prisma.order.aggregate({
    where: { purchaseType: 'SINGLE', price: { gt: 0, not: PRODUCT_PRICES.EBOOK_COMPLETE }, paidAt: { gte: since } },
    _count: { id: true },
    _sum: { price: true },
  });
  const newClubSubscribers = await prisma.user.count({ where: { clubSince: { gte: since } } });
  const activeClubSubscribers = await prisma.user.count({ where: { role: 'CLUB', subscriptionStatus: 'active' } });

  const completionCount = completions._count.id;
  const completionRevenue = Number(completions._sum.price || 0);
  const completionPct = freeBooks > 0 ? Math.round((completionCount / freeBooks) * 100) : 0;
  const directCount = directPurchases._count.id;
  const directRevenue = Number(directPurchases._sum.price || 0);

  console.log('');
  console.log(`FUNNEL DE CONVERSION — ${days} derniers jours`);
  console.log('');
  console.log('== Revenus & conversions payantes ================================');
  console.log(`  Livres gratuits delivres      : ${freeBooks}`);
  console.log(`  Completion (2,99€)            : ${completionCount}  ->  ${completionRevenue.toFixed(2)}€  (${completionPct}% des livres gratuits)`);
  console.log(`  Achat direct / 2eme livre+    : ${directCount}  ->  ${directRevenue.toFixed(2)}€`);
  console.log(`  Nouveaux abonnes Club         : ${newClubSubscribers}`);
  console.log(`  Abonnes Club actifs (total)   : ${activeClubSubscribers}`);
  console.log(`  Revenu one-shot total periode : ${(completionRevenue + directRevenue).toFixed(2)}€  (Club MRR non calcule ici — voir Stripe)`);
  console.log('');

  console.log(`${total} visiteurs uniques (sessions distinctes)`);
  console.log('');

  if (total === 0) {
    console.log('Aucune donnee de funnel visiteur sur cette periode (mais les chiffres de revenus ci-dessus restent valides).');
    await prisma.$disconnect();
    return;
  }

  console.log('== Parcours sequentiel ==========================================');
  let prevSessions = total;
  FUNNEL_ORDER.forEach((s, i) => {
    const sessions = find(s.key);
    const pct = Math.round((sessions / total) * 100);
    const dropFromPrev = i > 0 && prevSessions > 0 ? Math.round(((prevSessions - sessions) / prevSessions) * 100) : 0;
    const dropTag = i > 0 && dropFromPrev > 0 ? `  (-${dropFromPrev}% vs etape precedente)` : '';
    console.log(`${bar(pct)} ${pad(pct, 3)}%  ${pad(sessions, 4)}  ${s.label}${dropTag}`);
    prevSessions = sessions;
  });

  console.log('');
  console.log('== Signaux de blocage (moments precis, pas une sequence) =======');
  const blockerRows = BLOCKERS.map(b => ({ ...b, sessions: find(b.key) })).filter(b => b.sessions > 0);
  if (blockerRows.length === 0) {
    console.log('Aucun signal de blocage enregistre sur cette periode.');
  } else {
    blockerRows
      .sort((a, b) => b.sessions - a.sessions)
      .forEach(b => {
        const pct = Math.round((b.sessions / total) * 100);
        const flag = b.kind === 'warn' && pct >= 20 ? '  <!> a regarder en priorite' : '';
        console.log(`  ${pad(b.sessions, 4)} (${pad(pct, 2)}%)  ${b.label}${flag}`);
      });
  }

  console.log('');
  console.log('== Moments de sortie (ou exactement les gens partent) ===========');
  const exitRows = Object.keys(EXIT_LABELS).map(key => ({ key, sessions: find(key) })).filter(e => e.sessions > 0);
  if (exitRows.length === 0) {
    console.log('Aucune sortie capturee sur cette periode.');
  } else {
    exitRows
      .sort((a, b) => b.sessions - a.sessions)
      .forEach(e => {
        const pct = Math.round((e.sessions / total) * 100);
        console.log(`  ${pad(e.sessions, 4)} (${pad(pct, 2)}%)  ${EXIT_LABELS[e.key]}`);
      });
  }

  console.log('');
  console.log('== Paywall — cliffhanger -> completion 2,99€ =====================');
  const paywallViewSessions = find('paywall_view');
  if (paywallViewSessions === 0) {
    console.log('Aucune vue du paywall capturee sur cette periode.');
  } else {
    let prevPaywall = paywallViewSessions;
    PAYWALL_ORDER.forEach((s, i) => {
      const sessions = find(s.key);
      const pct = Math.round((sessions / paywallViewSessions) * 100);
      const dropFromPrev = i > 0 && prevPaywall > 0 ? Math.round(((prevPaywall - sessions) / prevPaywall) * 100) : 0;
      const dropTag = i > 0 && dropFromPrev > 0 ? `  (-${dropFromPrev}% vs etape precedente)` : '';
      console.log(`${bar(pct)} ${pad(pct, 3)}%  ${pad(sessions, 4)}  ${s.label}${dropTag}`);
      prevPaywall = sessions;
    });
    const paywallExitRows = Object.keys(PAYWALL_EXIT_LABELS).map(key => ({ key, sessions: find(key) })).filter(e => e.sessions > 0);
    if (paywallExitRows.length > 0) {
      console.log('');
      paywallExitRows.sort((a, b) => b.sessions - a.sessions).forEach(e => {
        const pct = Math.round((e.sessions / paywallViewSessions) * 100);
        console.log(`  ${pad(e.sessions, 4)} (${pad(pct, 2)}%)  ${PAYWALL_EXIT_LABELS[e.key]}`);
      });
    }
  }

  console.log('');
  console.log('== Source du trafic (sur page_view) =============================');
  bySource.sort((a, b) => b._count.id - a._count.id).forEach(s => {
    console.log(`  ${pad(s._count.id, 4)}  ${s.source || 'direct'}`);
  });

  console.log('');
  console.log('== Appareil (sur page_view) ======================================');
  byDevice.sort((a, b) => b._count.id - a._count.id).forEach(d => {
    console.log(`  ${pad(d._count.id, 4)}  ${d.device === 'mobile' ? 'mobile' : d.device === 'desktop' ? 'desktop' : (d.device || 'inconnu')}`);
  });

  console.log('');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
