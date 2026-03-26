import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { AdminLayout } from '../components/admin/AdminLayout';

const API_BASE = process.env.REACT_APP_API_URL || 'https://conte-avec-ia-backend.onrender.com';

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.lg};
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  overflow: hidden;
  margin-bottom: ${theme.spacing.lg};
`;

const CardHeader = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.admin.cardBorder};
  font-weight: 600;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.admin.contentBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const FunnelRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
`;

const FunnelLabel = styled.div`
  width: 160px;
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  flex-shrink: 0;
`;

const FunnelBarBg = styled.div`
  flex: 1;
  background: #F3F4F6;
  border-radius: 8px;
  height: 32px;
  overflow: hidden;
  position: relative;
`;

const FunnelBarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  border-radius: 8px;
  background: ${props => props.$color};
  width: ${props => props.$pct}%;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  padding-left: 10px;
  min-width: ${props => props.$pct > 0 ? '40px' : '0'};
`;

const FunnelBarText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
`;

const FunnelStats = styled.div`
  width: 100px;
  text-align: right;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  flex-shrink: 0;
`;

const DropOff = styled.div`
  margin-left: 172px;
  font-size: 11px;
  color: #EF4444;
  margin-bottom: ${theme.spacing.sm};
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.xs} 0;
  border-bottom: 1px solid ${theme.colors.admin.cardBorder}40;
  font-size: ${theme.fontSizes.sm};
  &:last-child { border-bottom: none; }
`;

const PeriodSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
  color: ${theme.colors.text.light};
`;

const STEP_LABELS: Record<string, string> = {
  page_view: 'Page formulaire',
  wizard_age: 'Age selectionne',
  wizard_theme: 'Theme choisi',
  wizard_character: 'Personnage cree',
  wizard_preview: 'Preview affiche',
  email_entered: 'Email entre',
  form_submitted: 'Formulaire soumis',
};

const STEP_COLORS: Record<string, string> = {
  page_view: '#6366F1',
  wizard_age: '#8B5CF6',
  wizard_theme: '#A78BFA',
  wizard_character: '#F59E0B',
  wizard_preview: '#3B82F6',
  email_entered: '#10B981',
  form_submitted: '#059669',
};

interface FunnelData {
  period: string;
  totalSessions: number;
  funnel: { step: string; sessions: number; percentage: number }[];
  bySource: { source: string; count: number }[];
  byDevice: { device: string; count: number }[];
}

interface AdminFunnelPageProps {
  token: string;
}

export const AdminFunnelPage: React.FC<AdminFunnelPageProps> = ({ token }) => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const loadFunnel = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken') || token;
      const res = await fetch(`${API_BASE}/api/admin/funnel?days=${days}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error('Erreur chargement funnel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFunnel(); }, [days]);

  if (loading) return <AdminLayout><EmptyState>Chargement...</EmptyState></AdminLayout>;
  if (!data) return <AdminLayout><EmptyState>Aucune donnee disponible</EmptyState></AdminLayout>;

  // Calculer les drop-off entre chaque étape
  const funnelWithDropOff = data.funnel.map((step, i) => {
    const prev = i > 0 ? data.funnel[i - 1] : null;
    const dropOff = prev && prev.sessions > 0
      ? Math.round(((prev.sessions - step.sessions) / prev.sessions) * 100)
      : 0;
    return { ...step, dropOff };
  });

  const conversionRate = data.funnel.length > 1 && data.funnel[0].sessions > 0
    ? ((data.funnel[data.funnel.length - 1].sessions / data.funnel[0].sessions) * 100).toFixed(1)
    : '0';

  return (
    <AdminLayout>
      <PageTitle>Funnel de conversion</PageTitle>

      {/* Entonnoir principal */}
      <Card>
        <CardHeader>
          <span>Parcours utilisateur — {data.totalSessions} session{data.totalSessions > 1 ? 's' : ''} uniques</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Periode :</span>
            <PeriodSelect value={days} onChange={e => setDays(Number(e.target.value))}>
              <option value={1}>Aujourd'hui</option>
              <option value={3}>3 jours</option>
              <option value={7}>7 jours</option>
              <option value={14}>14 jours</option>
              <option value={30}>30 jours</option>
            </PeriodSelect>
          </div>
        </CardHeader>
        <CardBody>
          {data.totalSessions === 0 ? (
            <EmptyState>Aucune visite sur cette periode. Les donnees apparaitront quand des visiteurs arriveront sur le formulaire.</EmptyState>
          ) : (
            <>
              {funnelWithDropOff.map((step, i) => (
                <React.Fragment key={step.step}>
                  <FunnelRow>
                    <FunnelLabel>{STEP_LABELS[step.step] || step.step}</FunnelLabel>
                    <FunnelBarBg>
                      <FunnelBarFill $pct={step.percentage} $color={STEP_COLORS[step.step] || '#6B7280'}>
                        {step.percentage > 8 && (
                          <FunnelBarText>{step.percentage}%</FunnelBarText>
                        )}
                      </FunnelBarFill>
                    </FunnelBarBg>
                    <FunnelStats>
                      <strong>{step.sessions}</strong> ({step.percentage}%)
                    </FunnelStats>
                  </FunnelRow>
                  {i > 0 && step.dropOff > 0 && (
                    <DropOff>-{step.dropOff}% abandonnent ici</DropOff>
                  )}
                </React.Fragment>
              ))}
              <div style={{ marginTop: 16, padding: '12px 16px', background: '#F0FDF4', borderRadius: 8, fontSize: 14 }}>
                <strong style={{ color: '#059669' }}>Taux de conversion global : {conversionRate}%</strong>
                <span style={{ color: '#666', marginLeft: 8 }}>
                  ({data.funnel[data.funnel.length - 1]?.sessions || 0} formulaires soumis sur {data.funnel[0]?.sessions || 0} visiteurs)
                </span>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Source + Device */}
      <MetaGrid>
        <Card>
          <CardHeader>Source du trafic</CardHeader>
          <CardBody>
            {data.bySource.length === 0 ? (
              <EmptyState>Aucune donnee</EmptyState>
            ) : (
              data.bySource
                .sort((a, b) => b.count - a.count)
                .map(s => (
                  <MetaItem key={s.source}>
                    <span style={{ fontWeight: 500 }}>
                      {s.source === 'ad' ? 'Meta Ads' : s.source === 'google' ? 'Google (SEO)' : s.source === 'social' ? 'Reseaux sociaux' : s.source === 'referral' ? 'Lien externe' : 'Direct'}
                    </span>
                    <strong>{s.count} visite{s.count > 1 ? 's' : ''}</strong>
                  </MetaItem>
                ))
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Appareil</CardHeader>
          <CardBody>
            {data.byDevice.length === 0 ? (
              <EmptyState>Aucune donnee</EmptyState>
            ) : (
              data.byDevice
                .sort((a, b) => b.count - a.count)
                .map(d => (
                  <MetaItem key={d.device}>
                    <span style={{ fontWeight: 500 }}>
                      {d.device === 'mobile' ? 'Mobile' : d.device === 'desktop' ? 'Desktop' : d.device}
                    </span>
                    <strong>{d.count} visite{d.count > 1 ? 's' : ''}</strong>
                  </MetaItem>
                ))
            )}
          </CardBody>
        </Card>
      </MetaGrid>
    </AdminLayout>
  );
};

export default AdminFunnelPage;
