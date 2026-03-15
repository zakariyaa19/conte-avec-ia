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
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const gradientMove = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

/* ═══════════ LAYOUT ═══════════ */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
`;

const Content = styled.main`
  flex: 1;
  max-width: 520px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  width: 100%;
`;

/* ═══════════ HERO ═══════════ */

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeInUp} 0.5s ease-out;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  color: #764ba2;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  padding: 6px 16px;
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.md};
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 28px;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.base};
  margin: 0;
  line-height: 1.6;
`;

/* ═══════════ FEATURES SHOWCASE ═══════════ */

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeInUp} 0.5s ease-out 0.15s both;
`;

const FeatureCard = styled.div<{ $delay: number }>`
  background: white;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  animation: ${fadeInUp} 0.4s ease-out ${props => 0.2 + props.$delay * 0.08}s both;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }
`;

const FeatureIcon = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
  line-height: 1;
`;

const FeatureTitle = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  margin-bottom: 2px;
`;

const FeatureDesc = styled.div`
  font-size: 11px;
  color: ${theme.colors.text.light};
  line-height: 1.4;
`;

/* ═══════════ PRICING CARD ═══════════ */

const PricingSection = styled.div`
  animation: ${fadeInUp} 0.5s ease-out 0.25s both;
  margin-bottom: ${theme.spacing.xl};
`;

const PricingCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24px;
  padding: 32px 24px;
  position: relative;
  overflow: hidden;
  animation: ${pulse} 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15), transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%);
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
  margin-bottom: 24px;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
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

const PriceDisplay = styled.div`
  color: white;
  margin-bottom: 4px;
`;

const PriceAmount = styled.span`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const PriceUnit = styled.span`
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
`;

const PriceSubtext = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  margin: 4px 0 24px;
`;

const CTAButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: white;
  color: #764ba2;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  ${props => !props.$loading && css`
    &:active {
      transform: scale(0.97);
    }
  `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const CTAButtonText = styled.span`
  position: relative;
  z-index: 2;
`;

/* ═══════════ GUARANTEES ═══════════ */

const GuaranteesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.5s ease-out 0.35s both;
  margin-bottom: ${theme.spacing.xl};
`;

const Guarantee = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.colors.text.light};
  font-weight: 500;
`;

/* ═══════════ TESTIMONIAL ═══════════ */

const TestimonialCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
  text-align: center;
  animation: ${fadeInUp} 0.5s ease-out 0.4s both;
  margin-bottom: ${theme.spacing.lg};
`;

const Stars = styled.div`
  color: #FFD700;
  font-size: 18px;
  margin-bottom: 12px;
  letter-spacing: 2px;
`;

const TestimonialText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-style: italic;
  line-height: 1.7;
  margin: 0 0 8px;
`;

const TestimonialAuthor = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  margin: 0;
  font-weight: 600;
`;

/* ═══════════ COMPONENT ═══════════ */

export const UpgradePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isClub } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      metaTrackSubscribe();
      const token = localStorage.getItem('userToken');
      if (!token) { navigate('/login'); return; }
      const result = await ApiService.createSubscriptionSession(token);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      console.error('Erreur creation session abonnement:', error);
      setLoading(false);
    }
  };

  if (isClub) {
    return (
      <PageContainer>
        <Header />
        <Content>
          <HeroSection>
            <HeroTitle>Vous etes deja membre !</HeroTitle>
            <HeroSubtitle>Profitez de tous les avantages depuis votre bibliotheque.</HeroSubtitle>
            <div style={{ marginTop: theme.spacing.lg }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
                Ma bibliotheque
              </Button>
            </div>
          </HeroSection>
        </Content>
        <Footer />
      </PageContainer>
    );
  }

  const features = [
    { icon: '\uD83D\uDCD6', title: '1 livre par semaine', desc: 'Credits cumulables' },
    { icon: '\uD83D\uDC64', title: 'Personnages', desc: 'Freres, soeurs, amis...' },
    { icon: '\uD83C\uDFA8', title: 'Styles uniques', desc: 'Aquarelle, manga...' },
    { icon: '\uD83D\uDCDA', title: 'Illimite', desc: 'Bibliotheque sans limite' },
    { icon: '\uD83C\uDF81', title: 'Occasions', desc: 'Noel, anniversaire...' },
    { icon: '\u274C', title: 'Sans engagement', desc: 'Annulable en 1 clic' },
  ];

  return (
    <PageContainer>
      <Header />
      <Content>
        {/* Hero */}
        <HeroSection>
          <HeroBadge>Club des Histoires</HeroBadge>
          <HeroTitle>Des histoires sans limites pour votre enfant</HeroTitle>
          <HeroSubtitle>
            Un nouveau livre personnalise chaque semaine, avec une personnalisation avancee.
          </HeroSubtitle>
        </HeroSection>

        {/* Features grid */}
        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard key={f.title} $delay={i}>
              <FeatureIcon>{f.icon}</FeatureIcon>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        {/* Pricing card */}
        <PricingSection>
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

              <PriceDisplay>
                <PriceAmount>{billing === 'monthly' ? '9,99' : '6,67'}</PriceAmount>
                <PriceUnit>€/mois</PriceUnit>
              </PriceDisplay>
              <PriceSubtext>
                {billing === 'monthly'
                  ? 'Facture mensuellement'
                  : '79,99€ facture annuellement — economisez 40€'}
              </PriceSubtext>

              <CTAButton onClick={handleSubscribe} $loading={loading} disabled={loading}>
                <CTAButtonText>
                  {loading ? 'Redirection...' : 'Commencer maintenant'}
                </CTAButtonText>
              </CTAButton>
            </PricingInner>
          </PricingCard>
        </PricingSection>

        {/* Guarantees */}
        <GuaranteesRow>
          <Guarantee><span>&#x1F512;</span> Paiement securise</Guarantee>
          <Guarantee><span>&#x274C;</span> Sans engagement</Guarantee>
          <Guarantee><span>&#x26A1;</span> Acces immediat</Guarantee>
        </GuaranteesRow>

        {/* Testimonial */}
        <TestimonialCard>
          <Stars>&#x2B50;&#x2B50;&#x2B50;&#x2B50;&#x2B50;</Stars>
          <TestimonialText>
            "Ma fille me demande une nouvelle histoire tous les soirs ! Le Club c'est le cadeau parfait pour les enfants curieux."
          </TestimonialText>
          <TestimonialAuthor>Marie, maman de Lola (5 ans)</TestimonialAuthor>
        </TestimonialCard>
      </Content>
      <Footer />
    </PageContainer>
  );
};
