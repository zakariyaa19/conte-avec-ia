import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { PricingTiers, PricingPlan } from '../components/PricingTiers';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { metaTrackSubscribe } from '../utils/metaPixel';

// =============================================
// ANIMATIONS
// =============================================

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatBook = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-14px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// =============================================
// LAYOUT
// =============================================

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

// =============================================
// 1. HERO
// =============================================

const HeroSection = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #FDF2F8 0%, ${theme.colors.accent.paleYellow} 40%, ${theme.colors.accent.creamyYellow} 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 14s ease-in-out infinite;
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
`;

const HeroDecoBlur = styled.div<{ $size: number; $top: string; $left: string; $color: string; $opacity: number }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: ${p => p.$color};
  opacity: ${p => p.$opacity};
  top: ${p => p.$top};
  left: ${p => p.$left};
  filter: blur(80px);
  pointer-events: none;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 700px;
  animation: ${fadeInUp} 0.9s ease-out;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.glow};
  letter-spacing: 0.02em;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['6xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.1;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['4xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const HeroPrice = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  margin-bottom: ${theme.spacing.md};

  small {
    font-size: ${theme.fontSizes.lg};
    font-weight: 500;
    color: ${theme.colors.text.secondary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.secondary};
  max-width: 560px;
  margin: 0 auto ${theme.spacing['2xl']};
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const ErrorMsg = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: #DC2626;
  background: #FEE2E2;
  text-align: center;
`;

// =============================================
// 2. EBOOK GRATUIT
// =============================================

const EbookSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.white};
  position: relative;
  overflow: hidden;
`;

const TwoColGrid = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
  }
`;

const VisualBlock = styled.div<{ $visible: boolean; $fromRight?: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : p.$fromRight ? '60px' : '-60px'});
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
`;

const TextBlock = styled.div<{ $visible: boolean; $fromRight?: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : p.$fromRight ? '60px' : '-60px'});
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
`;

const BookVisual = styled.div`
  width: 280px;
  height: 360px;
  border-radius: 20px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}20, ${theme.colors.accent.softPink}30, ${theme.colors.accent.paleYellow}40);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floatBook} 5s ease-in-out infinite;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink}, ${theme.colors.accent.pastelBlue});
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 220px;
    height: 280px;
  }
`;

const BookVisualInner = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const BookEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.md};
  line-height: 1;
`;

const BookLabel = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const BookSub = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const SectionText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  line-height: 1.8;
  margin-bottom: ${theme.spacing.xl};
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  line-height: 1.5;
`;

const FeatureCheck = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #8FE6A0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  margin-top: 2px;
`;

// =============================================
// 3. BIBLIOTHEQUE
// =============================================

const LibrarySection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.primary};
`;

const CenteredTitle = styled.div<{ $visible: boolean }>`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '36px'});
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Divider = styled.div`
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: ${theme.borderRadius.full};
  margin: 0 auto ${theme.spacing.xl};
`;

const CenterSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
`;

const LibCard = styled.div<{ $visible: boolean; $delay: string }>`
  background: ${theme.colors.background.white};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  box-shadow: ${theme.shadows.card};
  transition: all ${theme.transitions.smooth};
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '36px'});
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadows.cardHover};
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const LibCardIcon = styled.div<{ $bg: string }>`
  width: 72px;
  height: 72px;
  border-radius: ${theme.borderRadius.xl};
  background: ${p => p.$bg};
  margin: 0 auto ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const LibCardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const LibCardText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
`;

// =============================================
// 4. COMMENT CA MARCHE
// =============================================

const StepsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.white};
  position: relative;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const StepCard = styled.div<{ $visible: boolean; $delay: string }>`
  text-align: center;
  position: relative;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '36px'});
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: ${p => p.$delay};
`;

const StepNumber = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${p => p.$color};
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg};
  box-shadow: 0 8px 24px ${p => p.$color}40;
`;

const StepTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StepText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
`;

// =============================================
// 5. PRIX + GARANTIES
// =============================================

const PriceSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow}40 100%);
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: start;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
  }
`;

const PriceCard = styled.div<{ $visible: boolean }>`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.lg};
  border: 2px solid ${theme.colors.accent.lightCoral};
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '36px'});
  transition: opacity 0.8s ease, transform 0.8s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink}, ${theme.colors.accent.pastelBlue});
  }
`;

const PriceCardBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  padding: 4px 14px;
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.lg};
`;

const PriceAmount = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};

  small {
    font-size: ${theme.fontSizes.lg};
    font-weight: 500;
    color: ${theme.colors.text.secondary};
  }
`;

const PriceSavings = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent.coral};
  font-weight: 600;
  margin-bottom: ${theme.spacing.xl};
`;

const PriceFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
`;

const PriceFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};

  &::before {
    content: '';
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #8FE6A0);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='10' height='10'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 10px;
  }
`;

const GuaranteesBlock = styled.div<{ $visible: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : '60px'});
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
`;

const GuaranteesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const GuaranteeCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: ${theme.shadows.card};
`;

const GuaranteeIcon = styled.div`
  flex-shrink: 0;
  font-size: 1.5rem;
  line-height: 1;
`;

const GuaranteeTitle = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const GuaranteeText = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

// =============================================
// FINAL CTA
// =============================================

const FinalCTASection = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.accent.coral} 0%, ${theme.colors.button.primaryHover} 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const FinalCTAContent = styled.div<{ $visible: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '36px'});
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const FinalCTATitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: white;
  margin-bottom: ${theme.spacing.md};
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const FinalCTAText = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const WhiteButton = styled.button`
  background: white;
  color: ${theme.colors.accent.coral};
  border: none;
  padding: 14px 32px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  font-family: ${theme.fonts.body};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// =============================================
// CTA HELPER — Intelligent buttons
// =============================================

const ClubCTA: React.FC<{
  variant: 'hero' | 'section' | 'final';
  loading: boolean;
  error: string;
  onJoin: () => void;
  onPortal: () => void;
  isAuthenticated: boolean;
  isClub: boolean;
  navigate: (path: string) => void;
}> = ({ variant, loading, error, onJoin, onPortal, isAuthenticated, isClub, navigate }) => {
  if (variant === 'final') {
    if (isClub) {
      return (
        <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap', justifyContent: 'center' }}>
          <WhiteButton onClick={() => navigate('/dashboard')}>
            Ma bibliotheque
          </WhiteButton>
          <WhiteButton onClick={() => navigate('/dashboard/account')} style={{ background: 'transparent', border: '2px solid white' }}>
            Mon compte
          </WhiteButton>
        </div>
      );
    }
    if (isAuthenticated) {
      return (
        <WhiteButton onClick={onJoin} disabled={loading}>
          {loading ? 'Redirection...' : 'Passer au Club — 9,99€/mois'}
        </WhiteButton>
      );
    }
    return (
      <WhiteButton onClick={() => navigate('/login?mode=register&plan=club')}>
        Creer mon compte Club
      </WhiteButton>
    );
  }

  // hero or section variant
  if (isClub) {
    return (
      <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap', justifyContent: variant === 'hero' ? 'center' : 'flex-start' }}>
        <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
          Ma bibliotheque
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate('/dashboard/account')}>
          Mon compte
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button variant="primary" size="lg" onClick={onJoin} disabled={loading}>
          {loading ? 'Redirection vers Stripe...' : 'Passer au Club — 9,99€/mois'}
        </Button>
      </>
    );
  }

  return (
    <Button variant="primary" size="lg" onClick={() => navigate('/login?mode=register&plan=club')}>
      Creer mon compte Club
    </Button>
  );
};

// =============================================
// COMPONENT
// =============================================

export const ClubPage: React.FC = () => {
  const { isClub, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Scroll reveal hooks
  const ebookReveal = useScrollReveal();
  const libraryReveal = useStaggerReveal(3);
  const stepsReveal = useStaggerReveal(4);
  const priceReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const handleJoinClub = async (plan: 'monthly' | 'annual' = 'monthly') => {
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
      const token = localStorage.getItem('userToken') || '';
      const response = await ApiService.createSubscriptionSession(token, undefined, plan);
      if (response.url) {
        window.location.href = response.url;
      } else {
        setError('Erreur lors de la creation de la session de paiement');
      }
    } catch {
      setError('Erreur lors de la connexion a Stripe');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan === 'single') {
      navigate('/create-story');
    } else {
      handleJoinClub(plan);
    }
  };

  const handlePortal = async () => {
    const token = localStorage.getItem('userToken') || '';
    try {
      const result = await ApiService.createCustomerPortal(token);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setError('Erreur lors de l\'ouverture du portail');
    }
  };

  const ctaProps = {
    loading,
    error,
    onJoin: () => handleJoinClub('monthly'),
    onPortal: handlePortal,
    isAuthenticated,
    isClub,
    navigate
  };

  return (
    <PageContainer>
      <Header />
      <main>

        {/* ============ 1. HERO ============ */}
        <HeroSection>
          <HeroDecoBlur $size={400} $top="-15%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.06} />
          <HeroDecoBlur $size={300} $top="55%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.08} />
          <HeroDecoBlur $size={200} $top="70%" $left="10%" $color={theme.colors.accent.softPink} $opacity={0.05} />

          <HeroContent>
            <HeroBadge>Abonnement Premium</HeroBadge>
            <HeroTitle>
              Le Club des <span>Histoires Uniques</span>
            </HeroTitle>
            <HeroPrice>
              A partir de 9,99{'€'}<small> / mois</small>
            </HeroPrice>
            <HeroSubtitle>
              Un nouveau conte personnalise chaque semaine pour votre enfant. Credits cumulables, bibliotheque illimitee, sans engagement.
            </HeroSubtitle>

            <ClubCTA variant="hero" {...ctaProps} />

            <TrustRow>
              <TrustItem>&#10003; Sans engagement</TrustItem>
              <TrustItem>&#10003; Annulable a tout moment</TrustItem>
              <TrustItem>&#10003; Paiement securise</TrustItem>
            </TrustRow>
          </HeroContent>
        </HeroSection>

        {/* ============ 2. EBOOK GRATUIT ============ */}
        <EbookSection ref={ebookReveal.ref}>
          <Container>
            <TwoColGrid>
              <VisualBlock $visible={ebookReveal.isVisible}>
                <BookVisual>
                  <BookVisualInner>
                    <BookEmoji>📚</BookEmoji>
                    <BookLabel>1 eBook / semaine</BookLabel>
                    <BookSub>Personnalise pour votre enfant</BookSub>
                  </BookVisualInner>
                </BookVisual>
              </VisualBlock>

              <TextBlock $visible={ebookReveal.isVisible} $fromRight>
                <SectionLabel>Avantage principal</SectionLabel>
                <SectionTitle>Un nouveau conte chaque semaine</SectionTitle>
                <SectionText>
                  Chaque semaine, recevez un credit pour creer un conte personnalise au format eBook. Choisissez le theme, les personnages, le style d'illustration et le message educatif.
                </SectionText>
                <FeatureList>
                  <FeatureItem>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    Credits cumulables — jamais perdus, utilisez-les quand vous voulez
                  </FeatureItem>
                  <FeatureItem>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    1 conte par semaine, soit ~2,50{'€'} par conte
                  </FeatureItem>
                  <FeatureItem>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    Contes 100% personnalises avec la photo de votre enfant
                  </FeatureItem>
                </FeatureList>
              </TextBlock>
            </TwoColGrid>
          </Container>
        </EbookSection>

        {/* ============ 3. BIBLIOTHEQUE ============ */}
        <LibrarySection ref={libraryReveal.ref}>
          <Container>
            <CenteredTitle $visible={libraryReveal.isVisible}>
              <SectionTitle style={{ textAlign: 'center' }}>Votre bibliotheque numerique</SectionTitle>
              <Divider />
              <CenterSubtitle>
                Tous vos contes au meme endroit. Consultez, relisez et telechargez a tout moment.
              </CenterSubtitle>
            </CenteredTitle>

            <CardsGrid>
              <LibCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(0)}>
                <LibCardIcon $bg={`linear-gradient(135deg, ${theme.colors.accent.paleYellow}, ${theme.colors.accent.creamyYellow})`}>
                  👁️
                </LibCardIcon>
                <LibCardTitle>Visionneuse en ligne</LibCardTitle>
                <LibCardText>
                  Lisez vos contes directement sur le site, comme un vrai livre numerique. Compatible ordinateur, tablette et mobile.
                </LibCardText>
              </LibCard>

              <LibCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(1)}>
                <LibCardIcon $bg={`linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #8FE6A0)`}>
                  📥
                </LibCardIcon>
                <LibCardTitle>Telechargement PDF</LibCardTitle>
                <LibCardText>
                  Telechargez vos eBooks en PDF haute qualite, a tout moment. Imprimez-les ou lisez-les hors ligne.
                </LibCardText>
              </LibCard>

              <LibCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(2)}>
                <LibCardIcon $bg={`linear-gradient(135deg, ${theme.colors.accent.pastelBlue}, ${theme.colors.accent.softPink})`}>
                  📬
                </LibCardIcon>
                <LibCardTitle>Notification par email</LibCardTitle>
                <LibCardText>
                  Recevez un email avec votre eBook des qu'il est disponible, ainsi qu'un lien direct vers votre bibliotheque.
                </LibCardText>
              </LibCard>
            </CardsGrid>
          </Container>
        </LibrarySection>

        {/* ============ 4. COMMENT CA MARCHE ============ */}
        <StepsSection ref={stepsReveal.ref}>
          <Container>
            <CenteredTitle $visible={stepsReveal.isVisible}>
              <SectionTitle style={{ textAlign: 'center' }}>Comment ca marche ?</SectionTitle>
              <Divider />
            </CenteredTitle>

            <StepsGrid>
              <StepCard $visible={stepsReveal.isVisible} $delay={stepsReveal.getDelay(0)}>
                <StepNumber $color={theme.colors.accent.coral}>1</StepNumber>
                <StepTitle>Abonnez-vous</StepTitle>
                <StepText>Creez votre compte et souscrivez au Club. Premier credit disponible immediatement.</StepText>
              </StepCard>

              <StepCard $visible={stepsReveal.isVisible} $delay={stepsReveal.getDelay(1)}>
                <StepNumber $color={theme.colors.accent.pastelBlue}>2</StepNumber>
                <StepTitle>Recevez vos credits</StepTitle>
                <StepText>1 credit par semaine, cumulable. Utilisez-le quand vous voulez pour creer un eBook.</StepText>
              </StepCard>

              <StepCard $visible={stepsReveal.isVisible} $delay={stepsReveal.getDelay(2)}>
                <StepNumber $color={theme.colors.accent.paleYellow}>3</StepNumber>
                <StepTitle>Personnalisez</StepTitle>
                <StepText>Choisissez le theme, les personnages, la photo et le style. Chaque conte est unique.</StepText>
              </StepCard>

              <StepCard $visible={stepsReveal.isVisible} $delay={stepsReveal.getDelay(3)}>
                <StepNumber $color={theme.colors.accent.lightGreen}>4</StepNumber>
                <StepTitle>Recevez votre eBook</StepTitle>
                <StepText>Votre conte arrive dans votre bibliotheque et par email. Lisez-le en ligne ou telechargez-le.</StepText>
              </StepCard>
            </StepsGrid>
          </Container>
        </StepsSection>

        {/* ============ 5. PRIX + GARANTIES ============ */}
        <PriceSection ref={priceReveal.ref}>
          <Container>
            <CenteredTitle $visible={priceReveal.isVisible}>
              <SectionTitle style={{ textAlign: 'center' }}>Choisissez votre formule</SectionTitle>
              <Divider />
              <CenterSubtitle>Un conte unique pour chaque enfant. Choisissez la formule qui vous convient.</CenterSubtitle>
            </CenteredTitle>

            <PricingTiers onSelectPlan={handleSelectPlan} />

            <div style={{ marginTop: theme.spacing['3xl'] }}>
              <GuaranteesBlock $visible={priceReveal.isVisible}>
                <SectionTitle style={{ textAlign: 'center' }}>Nos garanties</SectionTitle>
                <SectionText style={{ textAlign: 'center' }}>
                  Nous voulons que vous soyez 100% satisfait. Pas de mauvaise surprise, pas de piege.
                </SectionText>
                <GuaranteesGrid>
                  <GuaranteeCard>
                    <GuaranteeIcon>&#128275;</GuaranteeIcon>
                    <div>
                      <GuaranteeTitle>Sans engagement</GuaranteeTitle>
                      <GuaranteeText>Annulez quand vous voulez, en un clic depuis votre espace ou le portail Stripe.</GuaranteeText>
                    </div>
                  </GuaranteeCard>
                  <GuaranteeCard>
                    <GuaranteeIcon>&#128737;&#65039;</GuaranteeIcon>
                    <div>
                      <GuaranteeTitle>Paiement securise</GuaranteeTitle>
                      <GuaranteeText>Paiement gere par Stripe, le leader mondial du paiement en ligne.</GuaranteeText>
                    </div>
                  </GuaranteeCard>
                  <GuaranteeCard>
                    <GuaranteeIcon>&#128172;</GuaranteeIcon>
                    <div>
                      <GuaranteeTitle>Support reactif</GuaranteeTitle>
                      <GuaranteeText>Une question ? Notre equipe vous repond rapidement par email.</GuaranteeText>
                    </div>
                  </GuaranteeCard>
                  <GuaranteeCard>
                    <GuaranteeIcon>&#11088;</GuaranteeIcon>
                    <div>
                      <GuaranteeTitle>Satisfait ou rembourse</GuaranteeTitle>
                      <GuaranteeText>Si un conte ne vous plait pas, nous le modifions ou vous remboursons.</GuaranteeText>
                    </div>
                  </GuaranteeCard>
                </GuaranteesGrid>
              </GuaranteesBlock>
            </div>
          </Container>
        </PriceSection>

        {/* ============ CTA FINAL ============ */}
        <FinalCTASection ref={ctaReveal.ref}>
          <Container>
            <FinalCTAContent $visible={ctaReveal.isVisible}>
              <FinalCTATitle>
                {isClub
                  ? 'Vous etes membre du Club !'
                  : 'Pret a rejoindre le Club ?'
                }
              </FinalCTATitle>
              <FinalCTAText>
                {isClub
                  ? 'Profitez de vos avantages et decouvrez vos contes dans votre bibliotheque.'
                  : 'Offrez a votre enfant un conte personnalise chaque semaine. Premier credit disponible immediatement.'
                }
              </FinalCTAText>
              <ClubCTA variant="final" {...ctaProps} />
            </FinalCTAContent>
          </Container>
        </FinalCTASection>

      </main>
      <Footer />
    </PageContainer>
  );
};

export default ClubPage;
