import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { metaTrackSubscribe } from '../utils/metaPixel';

/* ═══════════ ANIMATIONS ═══════════ */

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ═══════════ LAYOUT ═══════════ */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
`;

const Content = styled.main`
  flex: 1;
  max-width: 480px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  width: 100%;
`;

/* ═══════════ HERO ═══════════ */

const Hero = styled.div`
  text-align: center;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 24px;
  color: var(--text-primary);
  margin: 0 0 6px;
  line-height: 1.2;
`;

const HeroSub = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
`;

/* ═══════════ CHECKLIST CARD ═══════════ */

const ChecklistCard = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.4s ease-out 0.05s both;
`;

const ChecklistTitle = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckRow = styled.div<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: ${props => props.$locked ? 'var(--text-light)' : 'var(--text-primary)'};

  &:last-child { border-bottom: none; }
`;

const CheckIcon = styled.span<{ $type: 'free' | 'club' | 'locked' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;

  ${props => props.$type === 'free' && css`
    background: #E8F5E9;
    color: #4CAF50;
  `}
  ${props => props.$type === 'club' && css`
    background: linear-gradient(135deg, #667eea20, #764ba220);
    color: #764ba2;
  `}
  ${props => props.$type === 'locked' && css`
    background: var(--bg-secondary);
    color: var(--text-light);
  `}
`;

const CheckLabel = styled.span`
  flex: 1;
`;

const CheckBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea15, #764ba215);
  color: #764ba2;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

/* ═══════════ PRICING CARD ═══════════ */

const PricingCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24px;
  padding: 28px 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  animation: ${fadeInUp} 0.4s ease-out 0.1s both;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12), transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 50%);
  }
`;

const PricingInner = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const PricingToggle = styled.div`
  display: inline-flex;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border-radius: 30px;
  padding: 3px;
  margin-bottom: 18px;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 7px 18px;
  border: none;
  border-radius: 28px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#764ba2' : 'rgba(255,255,255,0.7)'};
`;

const SaveTag = styled.span`
  background: #4CAF50;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
`;

const PriceAmount = styled.span`
  font-size: 42px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const PriceUnit = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: rgba(255,255,255,0.8);
`;

const PriceSub = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 12px;
  margin: 4px 0 18px;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: white;
  color: #764ba2;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  transition: transform 0.15s;

  &:active { transform: scale(0.97); }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const CTAText = styled.span`
  position: relative;
  z-index: 2;
`;

/* ═══════════ GUARANTEES + TESTIMONIAL ═══════════ */

const GuaranteesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.4s ease-out 0.15s both;
`;

const Guarantee = styled.span`
  font-size: 11px;
  color: var(--text-light);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TestimonialCard = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-card);
  text-align: center;
  animation: ${fadeInUp} 0.4s ease-out 0.2s both;
`;

/* ═══════════ COMPONENT ═══════════ */

export const UpgradePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isClub } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(true);
    try {
      metaTrackSubscribe();
      const token = localStorage.getItem('userToken');
      if (!token) { navigate('/login'); return; }
      const result = await ApiService.createSubscriptionSession(token);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  if (isClub) {
    return (
      <PageContainer>
        <Header />
        <Content>
          <Hero>
            <HeroTitle>Vous etes deja membre !</HeroTitle>
            <HeroSub>Profitez de vos avantages depuis votre bibliotheque.</HeroSub>
            <div style={{ marginTop: 16 }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>Ma bibliotheque</Button>
            </div>
          </Hero>
        </Content>
        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <Content>
        <Hero>
          <HeroTitle>Passez au Club</HeroTitle>
          <HeroSub>Deverrouillez tout le potentiel de Contes d'IA</HeroSub>
        </Hero>

        {/* Checklist — ce que le Club déverrouille */}
        <ChecklistCard>
          <ChecklistTitle>
            <span style={{ fontSize: 18 }}>+</span>
            Le Club deverrouille
          </ChecklistTitle>

          <CheckRow>
            <CheckIcon $type="club">&#10003;</CheckIcon>
            <CheckLabel><strong>Livres illimites</strong> — plus de limite a 3</CheckLabel>
            <CheckBadge>Club</CheckBadge>
          </CheckRow>
          <CheckRow>
            <CheckIcon $type="club">&#10003;</CheckIcon>
            <CheckLabel><strong>9 styles d'illustration</strong> — aquarelle, manga, Disney...</CheckLabel>
            <CheckBadge>Club</CheckBadge>
          </CheckRow>
          <CheckRow>
            <CheckIcon $type="club">&#10003;</CheckIcon>
            <CheckLabel><strong>Personnages secondaires</strong> — freres, amis, famille</CheckLabel>
            <CheckBadge>Club</CheckBadge>
          </CheckRow>
          <CheckRow>
            <CheckIcon $type="club">&#10003;</CheckIcon>
            <CheckLabel><strong>Animaux de compagnie</strong> dans l'histoire</CheckLabel>
            <CheckBadge>Club</CheckBadge>
          </CheckRow>
          <CheckRow>
            <CheckIcon $type="club">&#10003;</CheckIcon>
            <CheckLabel><strong>Occasions speciales</strong> — Noel, anniversaire...</CheckLabel>
            <CheckBadge>Club</CheckBadge>
          </CheckRow>
          <CheckRow>
            <CheckIcon $type="club">&#10003;</CheckIcon>
            <CheckLabel><strong>15+ langues</strong> disponibles</CheckLabel>
            <CheckBadge>Club</CheckBadge>
          </CheckRow>

          <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 12, fontSize: 12, color: 'var(--text-light)', textAlign: 'center' }}>
            + PDF telechargeables · Credits cumulables · Annulable en 1 clic
          </div>
        </ChecklistCard>

        {/* Pricing */}
        <PricingCard>
          <PricingInner>
            <PricingToggle>
              <ToggleBtn $active={billing === 'monthly'} onClick={() => setBilling('monthly')}>
                Mensuel
              </ToggleBtn>
              <ToggleBtn $active={billing === 'annual'} onClick={() => setBilling('annual')}>
                Annuel <SaveTag>-33%</SaveTag>
              </ToggleBtn>
            </PricingToggle>

            <div>
              <PriceAmount>{billing === 'monthly' ? '9,99' : '6,67'}</PriceAmount>
              <PriceUnit>€/mois</PriceUnit>
            </div>
            <PriceSub>
              {billing === 'monthly' ? 'Sans engagement' : '79,99€/an — economisez 40€'}
            </PriceSub>

            <CTAButton onClick={handleSubscribe} disabled={loading}>
              <CTAText>{loading ? 'Redirection...' : 'Commencer maintenant'}</CTAText>
            </CTAButton>
          </PricingInner>
        </PricingCard>

        {/* Guarantees */}
        <GuaranteesRow>
          <Guarantee>Paiement securise</Guarantee>
          <Guarantee>Sans engagement</Guarantee>
          <Guarantee>Acces immediat</Guarantee>
        </GuaranteesRow>

        {/* Testimonial */}
        <TestimonialCard>
          <div style={{ color: '#FFD700', fontSize: 16, marginBottom: 8, letterSpacing: 2 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 6px' }}>
            "Ma fille me demande une nouvelle histoire tous les soirs !"
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0, fontWeight: 600 }}>
            Marie, maman de Lola (5 ans)
          </p>
        </TestimonialCard>
      </Content>
      <Footer />
    </PageContainer>
  );
};
