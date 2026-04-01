import React, { useState, useEffect } from 'react';
import { safeLocalStorage } from '../utils/safeStorage';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { metaTrackSubscribe } from '../utils/metaPixel';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: 24px 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  animation: ${fadeIn} 0.5s ease both;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.coralDark});
  padding: 20px 24px;
  text-align: center;
  color: white;
`;

const BackBtn = styled.button`
  all: unset;
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.8;
  &:hover { opacity: 1; }
`;

const CardBody = styled.div`
  padding: 24px;
`;

const Toggle = styled.div`
  display: flex;
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 20px;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  ${p => p.$active ? css`
    background: ${theme.colors.accent.coral};
    color: white;
  ` : css`
    background: transparent;
    color: var(--text-secondary);
  `}
`;

const SaveTag = styled.span`
  position: absolute;
  top: -7px;
  right: -4px;
  background: #4CAF50;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 6px;
`;

const FeatureList = styled.div`
  margin-bottom: 20px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  font-size: 13px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  &:last-child { border-bottom: none; }
`;

const Check = styled.span`
  color: #4CAF50;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
`;

const PriceBlock = styled.div`
  text-align: center;
  padding: 16px 0;
  margin-bottom: 16px;
`;

const PriceAmount = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 2.2rem;
  font-weight: 800;
  color: ${theme.colors.accent.coral};
`;

const PricePer = styled.span`
  font-size: ${theme.fontSizes.base};
  color: var(--text-light);
  margin-left: 4px;
`;

const CTA = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: white;
  cursor: pointer;
  background-size: 200% auto;
  background-image: linear-gradient(
    90deg,
    ${theme.colors.accent.coral} 0%,
    ${theme.colors.accent.softPink} 50%,
    ${theme.colors.accent.coral} 100%
  );
  animation: ${shimmer} 3s linear infinite;
  box-shadow: 0 4px 20px ${theme.colors.accent.coral}40;
  transition: all 0.3s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px ${theme.colors.accent.coral}50; }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const TrustRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
  span {
    font-size: 10px;
    color: var(--text-light);
  }
`;

const ErrorMsg = styled.p`
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  margin: 8px 0 0;
`;

const Legal = styled.p`
  font-size: 10px;
  color: var(--text-light);
  text-align: center;
  margin-top: 12px;
  line-height: 1.4;
`;

// =============================================
export const ClubCheckoutPage: React.FC = () => {
  const { isClub, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect Club members immediately
  useEffect(() => {
    if (isClub) navigate('/dashboard');
  }, [isClub, navigate]);

  const price = plan === 'monthly' ? '1,99' : '6,67';
  const fullPrice = '9,99';
  const perLabel = plan === 'monthly' ? '/mois' : '/mois';
  const billingDetail = plan === 'monthly'
    ? '1,99€ le 1er mois puis 9,99€/mois. Annulable à tout moment'
    : 'Prélèvement annuel de 79,99€ (soit 6,67€/mois)';

  const handlePay = async () => {
    if (!isAuthenticated) {
      metaTrackSubscribe();
      navigate(`/login?mode=register&plan=${plan === 'annual' ? 'club_annual' : 'club'}`);
      return;
    }
    if (isClub) {
      navigate('/dashboard');
      return;
    }
    metaTrackSubscribe();
    setLoading(true);
    setError('');
    try {
      const token = safeLocalStorage.getItem('userToken') || '';
      const response = await ApiService.createSubscriptionSession(token, undefined, plan);
      if (response.url) {
        window.location.href = response.url;
      } else {
        setError('Erreur lors de la création de la session');
      }
    } catch {
      setError('Erreur de connexion à Stripe');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    '4 livres gratuits par mois',
    '2x plus de pages et d\'illustrations',
    '9 styles d\'illustration exclusifs',
    'Jusqu\'à 5 personnages secondaires',
    'Multi-langues',
    'Crédits cumulables',
  ];

  return (
    <Page>
      <Card>
        <CardHeader style={{ position: 'relative' }}>
          <BackBtn onClick={() => navigate('/club')}>← Retour</BackBtn>
          <p style={{ fontSize: '11px', opacity: 0.8, margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Votre abonnement
          </p>
          <h1 style={{
            fontFamily: theme.fonts.heading, fontSize: theme.fontSizes['2xl'],
            fontWeight: 800, margin: 0,
          }}>
            Club des Histoires
          </h1>
        </CardHeader>

        <CardBody>
          {/* Plan toggle */}
          <Toggle>
            <ToggleBtn $active={plan === 'monthly'} onClick={() => setPlan('monthly')}>
              Mensuel
            </ToggleBtn>
            <ToggleBtn $active={plan === 'annual'} onClick={() => setPlan('annual')}>
              Annuel
              <SaveTag>-33%</SaveTag>
            </ToggleBtn>
          </Toggle>

          {/* Features */}
          <FeatureList>
            {features.map(f => (
              <Feature key={f}>
                <Check>✓</Check>
                {f}
              </Feature>
            ))}
          </FeatureList>

          {/* Price */}
          <PriceBlock>
            {plan === 'monthly' && (
              <p style={{
                fontSize: '12px', color: 'var(--text-secondary)',
                margin: '0 0 4px', textDecoration: 'line-through', opacity: 0.6,
              }}>
                {fullPrice}€/mois
              </p>
            )}
            <PriceAmount>{price}€</PriceAmount>
            <PricePer>{perLabel}</PricePer>
            {plan === 'monthly' && (
              <p style={{
                fontSize: '12px', fontWeight: 700, margin: '6px 0 0',
                color: '#fff', background: 'linear-gradient(135deg, #e74c8a, #a855f7)',
                display: 'inline-block', padding: '3px 12px', borderRadius: '20px',
              }}>
                -80% le 1er mois
              </p>
            )}
            {plan === 'annual' && (
              <p style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 600, margin: '4px 0 0' }}>
                Économisez 40€/an
              </p>
            )}
          </PriceBlock>

          {/* CTA */}
          <CTA onClick={handlePay} disabled={loading}>
            {loading
              ? 'Redirection...'
              : isAuthenticated
                ? plan === 'monthly' ? 'Commencer pour 1,99€ →' : 'Rejoindre le Club →'
                : plan === 'monthly' ? 'Commencer pour 1,99€ →' : 'Créer mon compte Club →'}
          </CTA>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <TrustRow>
            <span>🔒 Paiement Stripe sécurisé</span>
            <span>·</span>
            <span>Sans engagement</span>
            <span>·</span>
            <span>Annulable</span>
          </TrustRow>

          <Legal>
            {billingDetail}. Annulable à tout moment depuis votre espace client.
            Vous serez redirigé vers Stripe pour finaliser.
          </Legal>
        </CardBody>
      </Card>
    </Page>
  );
};

export default ClubCheckoutPage;
