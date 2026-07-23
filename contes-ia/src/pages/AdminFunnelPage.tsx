import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { AdminLayout } from '../components/admin/AdminLayout';

const API_BASE = process.env.REACT_APP_API_URL || 'https://conte-avec-ia-backend.onrender.com';

// ═══════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growWidth = keyframes`
  from { width: 0%; }
`;

// ═══════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════

const Page = styled.div`
  animation: ${fadeIn} 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #6B7280;
  margin: 0;
`;

const PeriodPicker = styled.div`
  display: flex;
  background: #F3F4F6;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
`;

const PeriodBtn = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active ? 'white' : 'transparent'};
  color: ${p => p.$active ? '#111827' : '#6B7280'};
  box-shadow: ${p => p.$active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};
  &:hover { color: #111827; }
`;

// ═══════════════════════════════════════════════
// KPI CARDS
// ═══════════════════════════════════════════════

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const KpiCard = styled.div<{ $accent?: string }>`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  padding: 20px 22px;
  animation: ${fadeIn} 0.4s ease both;
  ${p => p.$accent && `border-left: 3px solid ${p.$accent};`}
`;

const KpiLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9CA3AF;
  margin-bottom: 6px;
`;

const KpiValue = styled.div<{ $color?: string }>`
  font-size: 28px;
  font-weight: 800;
  color: ${p => p.$color || '#111827'};
  letter-spacing: -0.03em;
  line-height: 1;
`;

const KpiSub = styled.div`
  font-size: 12px;
  color: #6B7280;
  margin-top: 4px;
`;

// ═══════════════════════════════════════════════
// REVENUE CARDS — la section la plus visible de la page (demande explicite :
// distinguer gratuit / completion 2,99€ / abonnement Club, meme a 0 abonnes).
// ═══════════════════════════════════════════════

const RevenueSectionTitle = styled.h2`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9CA3AF;
  margin: 0 0 12px;
`;

const RevenueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const RevenueCard = styled.div<{ $accent: string }>`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 22px 24px 20px;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease both;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${p => p.$accent};
  }
`;

const RevenueCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const RevenueCardLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
`;

const RevenueCardBadge = styled.span<{ $color: string; $bg: string }>`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 100px;
  color: ${p => p.$color};
  background: ${p => p.$bg};
  white-space: nowrap;
`;

const RevenueCardValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 8px;
`;

const RevenueCardSub = styled.div`
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
`;

const RevenueCardEmptyNote = styled.div`
  font-size: 12px;
  color: #9CA3AF;
  font-style: italic;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #E5E7EB;
`;

const RevenueFootnote = styled.div`
  font-size: 12px;
  color: #9CA3AF;
  margin-bottom: 24px;
`;

// ═══════════════════════════════════════════════
// FUNNEL CARD
// ═══════════════════════════════════════════════

const FunnelCard = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease both;
`;

const FunnelHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FunnelTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const FunnelBody = styled.div`
  padding: 24px;
`;

// Step row
const StepRow = styled.div<{ $delay: number }>`
  display: grid;
  grid-template-columns: 140px 1fr 80px;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  animation: ${fadeIn} 0.4s ease both;
  animation-delay: ${p => p.$delay * 0.06}s;
  @media (max-width: 640px) {
    grid-template-columns: 100px 1fr 60px;
    gap: 10px;
  }
`;

const StepLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const StepBarContainer = styled.div`
  height: 28px;
  background: #F9FAFB;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const StepBarFill = styled.div<{ $pct: number; $color: string; $delay: number }>`
  height: 100%;
  border-radius: 8px;
  background: ${p => p.$color};
  width: ${p => p.$pct}%;
  animation: ${growWidth} 0.8s ease both;
  animation-delay: ${p => p.$delay * 0.06 + 0.2}s;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  min-width: ${p => p.$pct > 0 ? '32px' : '0'};
`;

const StepBarPct = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
`;

const StepCount = styled.div<{ $highlight?: boolean }>`
  text-align: right;
  font-size: 14px;
  font-weight: 700;
  color: ${p => p.$highlight ? '#059669' : '#111827'};
`;

// Drop-off indicator
const DropOffRow = styled.div<{ $severity: 'critical' | 'warning' | 'ok'; $delay: number }>`
  display: grid;
  grid-template-columns: 140px 1fr 80px;
  gap: 16px;
  padding: 0 0 4px;
  animation: ${fadeIn} 0.3s ease both;
  animation-delay: ${p => p.$delay * 0.06 + 0.1}s;
  @media (max-width: 640px) {
    grid-template-columns: 100px 1fr 60px;
    gap: 10px;
  }
`;

const DropOffIndicator = styled.div<{ $severity: 'critical' | 'warning' | 'ok' }>`
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: ${p => p.$severity === 'critical' ? '#DC2626' : p.$severity === 'warning' ? '#D97706' : '#6B7280'};
`;

const DropDot = styled.span<{ $severity: 'critical' | 'warning' | 'ok' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.$severity === 'critical' ? '#DC2626' : p.$severity === 'warning' ? '#D97706' : '#6B7280'};
  flex-shrink: 0;
`;

// ═══════════════════════════════════════════════
// FRICTION ALERT
// ═══════════════════════════════════════════════

const FrictionAlert = styled.div`
  background: linear-gradient(135deg, #FEF2F2, #FFF7ED);
  border: 1px solid #FECACA;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease both;
  animation-delay: 0.3s;
`;

const FrictionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #991B1B;
  margin-bottom: 4px;
`;

const FrictionText = styled.div`
  font-size: 12px;
  color: #7F1D1D;
  line-height: 1.5;
`;

// ═══════════════════════════════════════════════
// INSIGHT SUMMARY
// ═══════════════════════════════════════════════

const InsightCard = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease both;
  animation-delay: 0.4s;
`;

const InsightTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 10px;
`;

const InsightItem = styled.div`
  font-size: 12px;
  color: #4B5563;
  line-height: 1.6;
  padding: 3px 0;
`;

// ═══════════════════════════════════════════════
// META ROW (source + device)
// ═══════════════════════════════════════════════

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const MetaCard = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease both;
  animation-delay: 0.5s;
`;

const MetaHeader = styled.div`
  padding: 14px 20px;
  border-bottom: 1px solid #F3F4F6;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
`;

const MetaBody = styled.div`
  padding: 16px 20px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  &:not(:last-child) { border-bottom: 1px solid #F9FAFB; }
`;

const MetaLabel = styled.span`
  font-size: 13px;
  color: #374151;
`;

const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9CA3AF;
  font-size: 14px;
`;

// ═══════════════════════════════════════════════
// STEP CONFIG — nouveau formulaire 2-step (ChatStoryCreator)
// step 1 (form) : prenom + description histoire + photo optionnelle
// step 2 (preview) : cover preview + auth/email + soumission finale
// ═══════════════════════════════════════════════

const STEPS: { key: string; label: string; color: string }[] = [
  { key: 'page_view',           label: 'Visite formulaire',   color: '#6366F1' },
  { key: 'chat_started_typing', label: 'Commence a ecrire',   color: '#818CF8' },
  { key: 'chat_name_detected',  label: 'Prenom detecte',      color: '#A78BFA' },
  { key: 'chat_score_ready',    label: 'Brief pret (70%)',    color: '#8B5CF6' },
  { key: 'chat_to_preview',     label: 'Histoire decrite',    color: '#7C3AED' },
  { key: 'chat_cover_ready',    label: 'Couverture generee',  color: '#C084FC' },
  { key: 'email_entered',       label: 'Email/Auth',          color: '#10B981' },
  { key: 'form_submitted',      label: 'Livre cree',          color: '#059669' },
];

const SOURCE_LABELS: Record<string, string> = {
  ad: 'Meta Ads',
  google: 'Google (SEO)',
  social: 'Reseaux sociaux',
  referral: 'Lien externe',
  direct: 'Acces direct',
};

// Signaux de blocage — pas une sequence, des moments precis a surveiller.
// Cle = step envoye par trackFunnelStep(), voir funnelTracker.ts / ChatStoryCreator.tsx.
const BLOCKER_LABELS: Record<string, string> = {
  chat_text_no_name_20chars: "Brief long sans prenom detecte",
  chat_photo_added: "Photo jointe",
  chat_photo_read_failed: "Echec lecture photo (upload)",
  chat_cover_photo_conversion_failed: "Photo non prise en compte (cover)",
  chat_cover_error: "Echec generation couverture",
  chat_google_auth_error: "Echec connexion Google",
  form_submit_error: "Erreur a la soumission finale",
  story_generation_failed_seen: "Livre gratuit : echec de generation",
  draft_restored: "Brouillon restaure (utile)",
};
// Ces steps sont des signaux positifs/neutres, pas des blocages — a afficher
// dans une couleur differente pour ne pas les faire lire comme des problemes.
const BLOCKER_NEUTRAL = new Set(['chat_photo_added', 'draft_restored']);

// Moments de sortie — captures via sendBeacon au moment reel ou la page se
// ferme (registerExitTracking, funnelTracker.ts). Dit OU precisement
// quelqu'un a lache prise, ce que les steps francdis seuls ne disent pas.
const EXIT_LABELS: Record<string, string> = {
  exit_form_empty: 'Parti sans rien ecrire',
  exit_form_short_text: 'Parti apres un debut de texte (moins de 20 caracteres)',
  exit_form_text_no_name: 'Parti avec du texte mais sans prenom detecte',
  exit_form_name_not_ready: 'Parti avec prenom detecte mais brief incomplet',
  exit_form_ready_not_clicked: 'Parti alors que le bouton "Pret" etait actif',
  exit_preview_cover_loading: 'Parti pendant que la couverture generait',
  exit_preview_cover_error: 'Parti apres un echec de generation de couverture',
  exit_preview_awaiting_auth: 'Parti sans donner son email / se connecter',
  exit_preview_ready_not_submitted: 'Parti alors que tout etait pret — pas clique sur le CTA final',
};

// Paywall (cliffhanger -> completion 2,99€) — deja tracke vers Clarity/Meta/
// TikTok (paywallTracking.ts), desormais aussi visible ici depuis le 23/07.
const PAYWALL_STEPS: { key: string; label: string; color: string }[] = [
  { key: 'paywall_view', label: 'Voit "Offrir la suite"', color: '#F59E0B' },
  { key: 'paywall_click', label: 'Clique le CTA', color: '#EA580C' },
  { key: 'paywall_checkout_open', label: 'Ouvre le paiement', color: '#DC2626' },
  { key: 'paywall_payment_success', label: 'Paiement confirme', color: '#059669' },
];
const PAYWALL_EXIT_LABELS: Record<string, string> = {
  exit_paywall_seen_not_clicked: "Parti apres avoir vu le paywall, sans cliquer",
  exit_paywall_checkout_open_not_paid: "Parti avec le paiement ouvert, sans le finir",
};

// ═══════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════

interface FunnelData {
  period: string;
  totalSessions: number;
  funnel: { step: string; sessions: number; percentage: number }[];
  blockers: { step: string; sessions: number; percentage: number }[];
  exits: { step: string; sessions: number; percentage: number }[];
  paywallFunnel: { step: string; sessions: number; percentage: number }[];
  paywallExits: { step: string; sessions: number; percentage: number }[];
  revenue: {
    freeBooks: number;
    completion: { count: number; revenue: number; conversionPct: number };
    directPurchase: { count: number; revenue: number };
    club: { newSubscribers: number; activeSubscribers: number };
  };
  bySource: { source: string; count: number }[];
  byDevice: { device: string; count: number }[];
}

interface Props { token: string; }

export const AdminFunnelPage: React.FC<Props> = ({ token }) => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    setLoading(true);
    const adminToken = localStorage.getItem('adminToken') || token;
    fetch(`${API_BASE}/api/admin/funnel?days=${days}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days, token]);

  if (loading) return <AdminLayout><EmptyState>Chargement...</EmptyState></AdminLayout>;
  if (!data) return <AdminLayout><EmptyState>Aucune donnee disponible</EmptyState></AdminLayout>;

  // ── Build funnel with drop-off ──
  const funnel = STEPS.map((s, i) => {
    const found = data.funnel.find(f => f.step === s.key);
    const sessions = found?.sessions || 0;
    const pct = found?.percentage || 0;
    const prev = i > 0 ? (data.funnel.find(f => f.step === STEPS[i - 1].key)?.sessions || 0) : sessions;
    const dropPct = i > 0 && prev > 0 ? Math.round(((prev - sessions) / prev) * 100) : 0;
    const severity: 'critical' | 'warning' | 'ok' = dropPct >= 70 ? 'critical' : dropPct >= 40 ? 'warning' : 'ok';
    return { ...s, sessions, pct, dropPct, severity };
  });

  const visitors = funnel[0]?.sessions || 0;
  const conversions = funnel[funnel.length - 1]?.sessions || 0;
  const convRate = visitors > 0 ? ((conversions / visitors) * 100).toFixed(1) : '0';

  // Find biggest friction point (highest dropPct, excluding first step)
  const frictionStep = funnel.slice(1).reduce((max, s) => s.dropPct > max.dropPct ? s : max, funnel[1]);

  const periods = [
    { value: 1, label: "Aujourd'hui" },
    { value: 3, label: '3j' },
    { value: 7, label: '7j' },
    { value: 14, label: '14j' },
    { value: 30, label: '30j' },
  ];

  return (
    <AdminLayout>
      <Page>
        {/* ── HEADER ── */}
        <Header>
          <HeaderLeft>
            <Title>Funnel de conversion</Title>
            <Subtitle>Revenus (gratuit / completion 2,99€ / Club), parcours visiteur et points de blocage</Subtitle>
          </HeaderLeft>
          <PeriodPicker>
            {periods.map(p => (
              <PeriodBtn key={p.value} $active={days === p.value} onClick={() => setDays(p.value)}>
                {p.label}
              </PeriodBtn>
            ))}
          </PeriodPicker>
        </Header>

        {/* ── REVENUS & CONVERSIONS PAYANTES ── toujours visible, meme sans
            visite de funnel : c'est de l'argent reel confirme par Stripe,
            pas un evenement client qui peut manquer. Les 3 cartes distinguent
            explicitement gratuit / completion 2,99€ / abonnement Club. */}
        <RevenueSectionTitle>Revenus &amp; conversions payantes — {data.period}</RevenueSectionTitle>
        <RevenueGrid>
          <RevenueCard $accent="#6366F1">
            <RevenueCardHeader>
              <RevenueCardLabel>Livre gratuit</RevenueCardLabel>
              <RevenueCardBadge $color="#4338CA" $bg="#EEF2FF">Entree du funnel</RevenueCardBadge>
            </RevenueCardHeader>
            <RevenueCardValue>{data.revenue.freeBooks}</RevenueCardValue>
            <RevenueCardSub>livre{data.revenue.freeBooks > 1 ? 's' : ''} delivre{data.revenue.freeBooks > 1 ? 's' : ''} gratuitement — 0€, sert de base au taux de completion ci-contre</RevenueCardSub>
          </RevenueCard>

          <RevenueCard $accent="#059669">
            <RevenueCardHeader>
              <RevenueCardLabel>Completion — 2,99€</RevenueCardLabel>
              <RevenueCardBadge $color="#047857" $bg="#ECFDF5">Paiement unique</RevenueCardBadge>
            </RevenueCardHeader>
            <RevenueCardValue>{data.revenue.completion.count}</RevenueCardValue>
            <RevenueCardSub>
              <strong style={{ color: '#111827' }}>{data.revenue.completion.revenue.toFixed(2)}€</strong> encaisses
              {data.revenue.freeBooks > 0 && <> — <strong style={{ color: '#111827' }}>{data.revenue.completion.conversionPct}%</strong> des livres gratuits</>}
            </RevenueCardSub>
            {data.revenue.directPurchase.count > 0 && (
              <RevenueCardEmptyNote>
                + {data.revenue.directPurchase.count} achat{data.revenue.directPurchase.count > 1 ? 's' : ''} direct{data.revenue.directPurchase.count > 1 ? 's' : ''} (2eme livre+, hors completion) : {data.revenue.directPurchase.revenue.toFixed(2)}€
              </RevenueCardEmptyNote>
            )}
          </RevenueCard>

          <RevenueCard $accent="#7C3AED">
            <RevenueCardHeader>
              <RevenueCardLabel>Club — Abonnement</RevenueCardLabel>
              <RevenueCardBadge $color="#6D28D9" $bg="#F5F3FF">Recurrent</RevenueCardBadge>
            </RevenueCardHeader>
            <RevenueCardValue>{data.revenue.club.newSubscribers}</RevenueCardValue>
            <RevenueCardSub>nouvel{data.revenue.club.newSubscribers > 1 ? 's' : ''} abonne{data.revenue.club.newSubscribers > 1 ? 's' : ''} sur la periode</RevenueCardSub>
            {data.revenue.club.activeSubscribers === 0 ? (
              <RevenueCardEmptyNote>Aucun abonne actif pour l'instant — pret a detecter des la premiere conversion (1,99€ puis 9,99€/mois, ou 79,99€/an).</RevenueCardEmptyNote>
            ) : (
              <RevenueCardEmptyNote style={{ fontStyle: 'normal', color: '#6B7280' }}>{data.revenue.club.activeSubscribers} abonne{data.revenue.club.activeSubscribers > 1 ? 's' : ''} actif{data.revenue.club.activeSubscribers > 1 ? 's' : ''} au total (tous historiques, pas juste cette periode)</RevenueCardEmptyNote>
            )}
          </RevenueCard>
        </RevenueGrid>
        <RevenueFootnote>Le MRR Club (montants variables 1er mois vs suivants) n'est pas calcule ici — voir le dashboard Stripe pour le chiffre exact.</RevenueFootnote>

        {data.totalSessions === 0 ? (
          <EmptyState>
            Aucune visite sur cette periode.<br />
            Les donnees apparaitront quand des visiteurs arriveront sur le formulaire.
          </EmptyState>
        ) : (
          <>
            {/* ── KPI CARDS ── */}
            <KpiGrid>
              <KpiCard $accent="#6366F1">
                <KpiLabel>Visiteurs</KpiLabel>
                <KpiValue>{visitors}</KpiValue>
                <KpiSub>sessions uniques</KpiSub>
              </KpiCard>
              <KpiCard $accent="#059669">
                <KpiLabel>Conversion livre gratuit</KpiLabel>
                <KpiValue $color={Number(convRate) >= 3 ? '#059669' : Number(convRate) >= 1 ? '#D97706' : '#DC2626'}>
                  {convRate}%
                </KpiValue>
                <KpiSub>{conversions} livre{conversions > 1 ? 's' : ''} cree{conversions > 1 ? 's' : ''}</KpiSub>
              </KpiCard>
              <KpiCard $accent="#DC2626">
                <KpiLabel>Point de friction</KpiLabel>
                <KpiValue $color="#DC2626" style={{ fontSize: 18 }}>
                  {frictionStep?.label || '-'}
                </KpiValue>
                <KpiSub>{frictionStep ? `-${frictionStep.dropPct}% d'abandon` : '-'}</KpiSub>
              </KpiCard>
            </KpiGrid>

            {/* ── FRICTION ALERT ── */}
            {frictionStep && frictionStep.dropPct >= 50 && (
              <FrictionAlert>
                <FrictionTitle>
                  Point de friction principal : {frictionStep.label} (-{frictionStep.dropPct}%)
                </FrictionTitle>
                <FrictionText>
                  {frictionStep.dropPct >= 80
                    ? `La majorite des visiteurs quittent a cette etape. C'est le probleme prioritaire a resoudre.`
                    : `Un abandon significatif se produit ici. Verifiez l'experience utilisateur sur cette etape.`
                  }
                </FrictionText>
              </FrictionAlert>
            )}

            {/* ── FUNNEL ── */}
            <FunnelCard>
              <FunnelHeader>
                <FunnelTitle>Parcours etape par etape</FunnelTitle>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>{visitors} visiteurs</span>
              </FunnelHeader>
              <FunnelBody>
                {funnel.map((step, i) => (
                  <React.Fragment key={step.key}>
                    <StepRow $delay={i}>
                      <StepLabel>{step.label}</StepLabel>
                      <StepBarContainer>
                        <StepBarFill $pct={step.pct} $color={step.color} $delay={i}>
                          {step.pct >= 12 && <StepBarPct>{step.pct}%</StepBarPct>}
                        </StepBarFill>
                      </StepBarContainer>
                      <StepCount $highlight={i === funnel.length - 1}>
                        {step.sessions}
                      </StepCount>
                    </StepRow>
                    {i > 0 && step.dropPct > 0 && (
                      <DropOffRow $severity={step.severity} $delay={i}>
                        <DropOffIndicator $severity={step.severity}>
                          <DropDot $severity={step.severity} />
                          -{step.dropPct}% abandon{step.dropPct > 1 ? 'nent' : 'ne'}
                          {step.severity === 'critical' && ' — critique'}
                          {step.severity === 'warning' && ' — a surveiller'}
                        </DropOffIndicator>
                      </DropOffRow>
                    )}
                  </React.Fragment>
                ))}
              </FunnelBody>
            </FunnelCard>

            {/* ── SIGNAUX DE BLOCAGE ── */}
            {data.blockers.length > 0 && (
              <MetaCard style={{ marginBottom: 24 }}>
                <MetaHeader>Signaux de blocage (moments precis, pas une sequence)</MetaHeader>
                <MetaBody>
                  {data.blockers
                    .slice()
                    .sort((a, b) => b.sessions - a.sessions)
                    .map(b => (
                      <MetaRow key={b.step}>
                        <MetaLabel>{BLOCKER_LABELS[b.step] || b.step}</MetaLabel>
                        <MetaValue style={{ color: BLOCKER_NEUTRAL.has(b.step) ? '#059669' : b.percentage >= 20 ? '#DC2626' : '#111827' }}>
                          {b.sessions} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>({b.percentage}% des visiteurs)</span>
                        </MetaValue>
                      </MetaRow>
                    ))}
                </MetaBody>
              </MetaCard>
            )}

            {/* ── MOMENTS DE SORTIE ── captures via sendBeacon au moment reel
                ou la page se ferme : dit OU precisement les gens partent,
                pas seulement quelles etapes ont ete franchies. */}
            {data.exits.length > 0 && (
              <MetaCard style={{ marginBottom: 24 }}>
                <MetaHeader>Moments de sortie (ou exactement les gens partent)</MetaHeader>
                <MetaBody>
                  {data.exits
                    .slice()
                    .sort((a, b) => b.sessions - a.sessions)
                    .map(e => (
                      <MetaRow key={e.step}>
                        <MetaLabel>{EXIT_LABELS[e.step] || e.step}</MetaLabel>
                        <MetaValue style={{ color: e.percentage >= 20 ? '#DC2626' : '#111827' }}>
                          {e.sessions} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>({e.percentage}% des visiteurs)</span>
                        </MetaValue>
                      </MetaRow>
                    ))}
                </MetaBody>
              </MetaCard>
            )}

            {/* ── PAYWALL : cliffhanger -> completion 2,99€ ── deja tracke vers
                Clarity/Meta/TikTok (paywallTracking.ts), visible ici depuis le
                23/07. Base 100% = paywall_view, PAS les visiteurs du formulaire
                (quelqu'un peut lire son livre gratuit plusieurs jours apres). */}
            {(() => {
              const paywallViews = data.paywallFunnel.find(p => p.step === 'paywall_view')?.sessions || 0;
              if (paywallViews === 0) return null;
              return (
                <FunnelCard>
                  <FunnelHeader>
                    <FunnelTitle>Paywall — livre gratuit lu → complétion 2,99€</FunnelTitle>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{paywallViews} vue{paywallViews > 1 ? 's' : ''} du paywall</span>
                  </FunnelHeader>
                  <FunnelBody>
                    {PAYWALL_STEPS.map((s, i) => {
                      const row = data.paywallFunnel.find(p => p.step === s.key);
                      const sessions = row?.sessions || 0;
                      const pct = row?.percentage || 0;
                      const prevSessions = i > 0 ? (data.paywallFunnel.find(p => p.step === PAYWALL_STEPS[i - 1].key)?.sessions || 0) : sessions;
                      const dropPct = i > 0 && prevSessions > 0 ? Math.round(((prevSessions - sessions) / prevSessions) * 100) : 0;
                      const severity: 'critical' | 'warning' | 'ok' = dropPct >= 70 ? 'critical' : dropPct >= 40 ? 'warning' : 'ok';
                      return (
                        <React.Fragment key={s.key}>
                          <StepRow $delay={i}>
                            <StepLabel>{s.label}</StepLabel>
                            <StepBarContainer>
                              <StepBarFill $pct={pct} $color={s.color} $delay={i}>
                                {pct >= 12 && <StepBarPct>{pct}%</StepBarPct>}
                              </StepBarFill>
                            </StepBarContainer>
                            <StepCount $highlight={i === PAYWALL_STEPS.length - 1}>{sessions}</StepCount>
                          </StepRow>
                          {i > 0 && dropPct > 0 && (
                            <DropOffRow $severity={severity} $delay={i}>
                              <DropOffIndicator $severity={severity}>
                                <DropDot $severity={severity} />
                                -{dropPct}% abandonnent{severity === 'critical' && ' — critique'}{severity === 'warning' && ' — a surveiller'}
                              </DropOffIndicator>
                            </DropOffRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </FunnelBody>
                </FunnelCard>
              );
            })()}

            {data.paywallExits.length > 0 && (
              <MetaCard style={{ marginBottom: 24 }}>
                <MetaHeader>Sorties du paywall (ou exactement, pas juste quelles etapes)</MetaHeader>
                <MetaBody>
                  {data.paywallExits
                    .slice()
                    .sort((a, b) => b.sessions - a.sessions)
                    .map(e => (
                      <MetaRow key={e.step}>
                        <MetaLabel>{PAYWALL_EXIT_LABELS[e.step] || e.step}</MetaLabel>
                        <MetaValue style={{ color: e.percentage >= 20 ? '#DC2626' : '#111827' }}>
                          {e.sessions} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>({e.percentage}% des vues du paywall)</span>
                        </MetaValue>
                      </MetaRow>
                    ))}
                </MetaBody>
              </MetaCard>
            )}

            {/* ── INSIGHT SUMMARY ── */}
            <InsightCard>
              <InsightTitle>Resume</InsightTitle>
              {(() => {
                const chatStep = funnel.find(s => s.key === 'chat_to_preview');
                if (chatStep && chatStep.pct < 30) {
                  return (
                    <InsightItem>
                      Seulement <strong>{chatStep.pct}%</strong> des visiteurs decrivent une histoire. Le step 1 (prenom + description) ne donne pas assez envie d'avancer.
                    </InsightItem>
                  );
                }
                return null;
              })()}
              {(() => {
                const chatStep = funnel.find(s => s.key === 'chat_to_preview');
                const emailStep = funnel.find(s => s.key === 'email_entered');
                if (chatStep && emailStep && chatStep.sessions > 0) {
                  const chatToEmail = Math.round((emailStep.sessions / chatStep.sessions) * 100);
                  return chatToEmail >= 60 ? (
                    <InsightItem>
                      <strong>{chatToEmail}%</strong> des visiteurs qui arrivent en preview s'identifient. Bonne friction d'auth.
                    </InsightItem>
                  ) : (
                    <InsightItem>
                      Seulement <strong>{chatToEmail}%</strong> s'identifient apres avoir vu la preview. La cover preview ou l'auth doit convertir mieux.
                    </InsightItem>
                  );
                }
                return null;
              })()}
              {(() => {
                const emailStep = funnel.find(s => s.key === 'email_entered');
                const submitStep = funnel.find(s => s.key === 'form_submitted');
                if (emailStep && submitStep && emailStep.sessions > 0) {
                  const emailToSubmit = Math.round((submitStep.sessions / emailStep.sessions) * 100);
                  return emailToSubmit < 80 ? (
                    <InsightItem>
                      <strong>{100 - emailToSubmit}%</strong> abandonnent apres avoir saisi leur email — verifier que le CTA final fonctionne et que la cover est prete.
                    </InsightItem>
                  ) : null;
                }
                return null;
              })()}
              <InsightItem>
                Taux de conversion global : <strong>{convRate}%</strong> ({conversions} sur {visitors} visiteurs)
              </InsightItem>
            </InsightCard>

            {/* ── SOURCE + DEVICE ── */}
            <MetaGrid>
              <MetaCard>
                <MetaHeader>Source du trafic</MetaHeader>
                <MetaBody>
                  {data.bySource.length === 0 ? (
                    <EmptyState style={{ padding: 20 }}>Aucune donnee</EmptyState>
                  ) : (
                    data.bySource.sort((a, b) => b.count - a.count).map(s => (
                      <MetaRow key={s.source}>
                        <MetaLabel>{SOURCE_LABELS[s.source] || s.source}</MetaLabel>
                        <MetaValue>{s.count}</MetaValue>
                      </MetaRow>
                    ))
                  )}
                </MetaBody>
              </MetaCard>
              <MetaCard>
                <MetaHeader>Appareil</MetaHeader>
                <MetaBody>
                  {data.byDevice.length === 0 ? (
                    <EmptyState style={{ padding: 20 }}>Aucune donnee</EmptyState>
                  ) : (
                    data.byDevice.sort((a, b) => b.count - a.count).map(d => (
                      <MetaRow key={d.device}>
                        <MetaLabel>{d.device === 'mobile' ? 'Mobile' : d.device === 'desktop' ? 'Desktop' : d.device}</MetaLabel>
                        <MetaValue>{d.count}</MetaValue>
                      </MetaRow>
                    ))
                  )}
                </MetaBody>
              </MetaCard>
            </MetaGrid>
          </>
        )}
      </Page>
    </AdminLayout>
  );
};

export default AdminFunnelPage;
