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
  { key: 'page_view',        label: 'Visite formulaire',  color: '#6366F1' },
  { key: 'chat_to_preview',  label: 'Histoire decrite',   color: '#8B5CF6' },
  { key: 'email_entered',    label: 'Email/Auth',         color: '#10B981' },
  { key: 'form_submitted',   label: 'Livre cree',         color: '#059669' },
];

const SOURCE_LABELS: Record<string, string> = {
  ad: 'Meta Ads',
  google: 'Google (SEO)',
  social: 'Reseaux sociaux',
  referral: 'Lien externe',
  direct: 'Acces direct',
};

// ═══════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════

interface FunnelData {
  period: string;
  totalSessions: number;
  funnel: { step: string; sessions: number; percentage: number }[];
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
            <Subtitle>Parcours nouveau formulaire 2-step (description histoire → identification → livre cree)</Subtitle>
          </HeaderLeft>
          <PeriodPicker>
            {periods.map(p => (
              <PeriodBtn key={p.value} $active={days === p.value} onClick={() => setDays(p.value)}>
                {p.label}
              </PeriodBtn>
            ))}
          </PeriodPicker>
        </Header>

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
                <KpiLabel>Conversion</KpiLabel>
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
