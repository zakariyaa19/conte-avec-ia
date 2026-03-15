import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { metaTrackPurchase, metaTrackSubscribe } from '../utils/metaPixel';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
`;

const Content = styled.main`
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  width: 100%;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  animation: ${fadeInUp} 0.5s ease-out;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const HeroSubtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.lg};
  margin: 0;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const ComparisonTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing['2xl']};
  animation: ${fadeInUp} 0.5s ease-out 0.1s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div<{ $highlighted?: boolean }>`
  background: ${props => props.$highlighted
    ? `linear-gradient(135deg, #FFF8F0, #FFF0E6)`
    : theme.colors.background.white};
  border: ${props => props.$highlighted
    ? `2px solid ${theme.colors.accent.coral}`
    : `1px solid ${theme.colors.background.secondary}`};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
`;

const PlanBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, #FF8E53);
  color: white;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.full};
`;

const PlanName = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs};
`;

const PlanPrice = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 800;
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.sm} 0;
`;

const PlanPriceUnit = styled.span`
  font-size: ${theme.fontSizes.base};
  font-weight: 400;
  color: ${theme.colors.text.secondary};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.md} 0;
`;

const Feature = styled.li<{ $available?: boolean; $premium?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 8px 0;
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.$available === false ? theme.colors.text.light : theme.colors.text.secondary};
  text-decoration: ${props => props.$available === false ? 'line-through' : 'none'};
  font-weight: ${props => props.$premium ? 600 : 400};

  &::before {
    content: '${props => props.$available === false ? '\u274C' : props.$premium ? '\u2728' : '\u2705'}';
    font-size: 14px;
    flex-shrink: 0;
  }
`;

const PricingToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  border-radius: ${theme.borderRadius.full};
  border: 2px solid ${props => props.$active ? theme.colors.accent.coral : theme.colors.background.secondary};
  background: ${props => props.$active ? `${theme.colors.accent.coral}10` : 'white'};
  color: ${props => props.$active ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;
`;

const SaveBadge = styled.span`
  background: #E8F5E9;
  color: #2E7D32;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
  margin-left: ${theme.spacing.xs};
`;

const TestimonialSection = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  animation: ${fadeInUp} 0.5s ease-out 0.3s both;
`;

const TestimonialText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  font-style: italic;
  line-height: 1.7;
  margin: 0 0 ${theme.spacing.sm};
`;

const TestimonialAuthor = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  margin: 0;
`;

const GuaranteeText = styled.p`
  text-align: center;
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.md};
  animation: ${fadeInUp} 0.5s ease-out 0.4s both;
`;

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
      if (!token) {
        navigate('/login');
        return;
      }

      const result = await ApiService.createSubscriptionSession(token);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Erreur creation session abonnement:', error);
      setLoading(false);
    }
  };

  // Si deja Club, rediriger vers le dashboard
  if (isClub) {
    return (
      <PageContainer>
        <Header />
        <Content>
          <HeroSection>
            <HeroTitle>Vous etes deja membre du Club !</HeroTitle>
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

  return (
    <PageContainer>
      <Header />
      <Content>
        <HeroSection>
          <HeroTitle>Passez au Club des Histoires</HeroTitle>
          <HeroSubtitle>
            Creez un nouveau livre chaque semaine avec une personnalisation avancee
          </HeroSubtitle>
        </HeroSection>

        {/* Pricing toggle */}
        <PricingToggle>
          <ToggleButton $active={billing === 'monthly'} onClick={() => setBilling('monthly')}>
            Mensuel
          </ToggleButton>
          <ToggleButton $active={billing === 'annual'} onClick={() => setBilling('annual')}>
            Annuel <SaveBadge>-33%</SaveBadge>
          </ToggleButton>
        </PricingToggle>

        {/* Comparison table */}
        <ComparisonTable>
          {/* Free plan */}
          <PlanCard>
            <PlanName>Gratuit</PlanName>
            <PlanPrice>0€</PlanPrice>
            <FeatureList>
              <Feature $available>3 livres gratuits</Feature>
              <Feature $available>7 illustrations par livre</Feature>
              <Feature $available>PDF telechargeable</Feature>
              <Feature $available={false}>Personnages secondaires</Feature>
              <Feature $available={false}>Styles d'illustration au choix</Feature>
              <Feature $available={false}>Bibliotheque illimitee</Feature>
              <Feature $available={false}>1 livre par semaine</Feature>
            </FeatureList>
            <Button variant="outline" size="md" fullWidth onClick={() => navigate('/create-story')}>
              Continuer en gratuit
            </Button>
          </PlanCard>

          {/* Club plan */}
          <PlanCard $highlighted>
            <PlanBadge>Recommande</PlanBadge>
            <PlanName>Club des Histoires</PlanName>
            <PlanPrice>
              {billing === 'monthly' ? '9,99€' : '79,99€'}
              <PlanPriceUnit>{billing === 'monthly' ? '/mois' : '/an (6,67€/mois)'}</PlanPriceUnit>
            </PlanPrice>
            <FeatureList>
              <Feature $available $premium>1 livre par semaine (credits cumulables)</Feature>
              <Feature $available $premium>Personnages secondaires (freres, amis...)</Feature>
              <Feature $available $premium>Styles d'illustration (aquarelle, manga...)</Feature>
              <Feature $available>Bibliotheque en ligne illimitee</Feature>
              <Feature $available>PDF telechargeables</Feature>
              <Feature $available>Themes et occasions speciales</Feature>
              <Feature $available>Annulable a tout moment</Feature>
            </FeatureList>
            <Button variant="primary" size="md" fullWidth onClick={handleSubscribe} disabled={loading}>
              {loading ? 'Redirection...' : billing === 'monthly' ? 'Rejoindre le Club — 9,99€/mois' : 'Rejoindre le Club — 79,99€/an'}
            </Button>
          </PlanCard>
        </ComparisonTable>

        {/* Testimonial */}
        <TestimonialSection>
          <TestimonialText>
            "Ma fille me demande une nouvelle histoire tous les soirs ! Le Club c'est le cadeau parfait pour les enfants curieux."
          </TestimonialText>
          <TestimonialAuthor>— Marie, maman de Lola (5 ans)</TestimonialAuthor>
        </TestimonialSection>

        <GuaranteeText>
          Annulable a tout moment · Pas d'engagement · Paiement securise par Stripe
        </GuaranteeText>
      </Content>
      <Footer />
    </PageContainer>
  );
};
