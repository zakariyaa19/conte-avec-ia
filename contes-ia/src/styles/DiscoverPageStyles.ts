import styled, { keyframes } from 'styled-components';
import { theme } from './theme';

// ─── Keyframes ───

export const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Page Container ───

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

// ─── Hero Section ───

export const HeroSection = styled.section<{ $accentColor?: string }>`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 40vh;
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

export const HeroDecoBlur = styled.div<{
  $size: number;
  $top: string;
  $left: string;
  $color: string;
  $opacity: number;
}>`
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

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  animation: ${fadeInUp} 0.9s ease-out;
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--header-glass);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 153, 153, 0.25);
  padding: 6px 18px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.accent.coralDark};
  margin-bottom: ${theme.spacing.xl};
`;

export const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['5xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.1;

  span {
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

export const HeroDivider = styled.div`
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: 2px;
  margin: 0 auto ${theme.spacing.lg};
`;

export const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.base};
  }
`;

// ─── Content Sections ───

export const ContentSection = styled.section<{ $alt?: boolean }>`
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
  background: ${p => p.$alt ? 'var(--bg-primary)' : 'var(--bg-card)'};
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

export const SectionDeco = styled.div<{
  $size?: number;
  $top?: string;
  $left?: string;
  $right?: string;
  $color?: string;
}>`
  position: absolute;
  width: ${p => p.$size || 300}px;
  height: ${p => p.$size || 300}px;
  border-radius: 50%;
  background: ${p => p.$color || theme.colors.accent.lightCoral};
  opacity: 0.05;
  top: ${p => p.$top || 'auto'};
  left: ${p => p.$left || 'auto'};
  right: ${p => p.$right || 'auto'};
  filter: blur(60px);
  pointer-events: none;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

// ─── Section Reveal Wrapper ───

export const SectionWrapper = styled.div<{ $visible: boolean; $delay?: string }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '30px'});
  transition: opacity 0.7s ease ${p => p.$delay || '0ms'},
              transform 0.7s ease ${p => p.$delay || '0ms'};
`;

// ─── Section Typography ───

export const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: ${theme.spacing.sm};

  span {
    color: ${theme.colors.accent.coral};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

export const SectionSubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${theme.spacing['2xl']};
  line-height: 1.7;
`;

export const SectionDivider = styled.div`
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: 2px;
  margin: 0 auto ${theme.spacing.lg};
`;

// ─── Cards Grid ───

export const CardsGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$columns || 3}, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

// ─── Feature Card ───

export const FeatureCard = styled.div<{
  $visible?: boolean;
  $delay?: string;
  $accentColor?: string;
}>`
  background: var(--bg-card);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
  transition: all ${theme.transitions.smooth};
  opacity: ${p => p.$visible !== undefined ? (p.$visible ? 1 : 0) : 1};
  transform: translateY(${p => p.$visible !== undefined ? (p.$visible ? '0' : '30px') : '0'});
  transition: opacity 0.6s ease ${p => p.$delay || '0ms'},
              transform 0.6s ease ${p => p.$delay || '0ms'},
              box-shadow 0.3s ease,
              border-color 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-card-hover);
    border-color: ${p => p.$accentColor || theme.colors.accent.lightCoral};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl};
  }
`;

export const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.md};
`;

export const CardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

export const CardDescription = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: ${theme.spacing.md};
`;

export const CardTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

export const CardTag = styled.span<{ $color?: string }>`
  display: inline-block;
  background: ${p => p.$color ? `${p.$color}20` : `${theme.colors.accent.coral}12`};
  color: ${p => p.$color || theme.colors.accent.coralDark};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.full};
`;

// ─── Steps / Numbered Items ───

export const StepNumber = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${p => p.$color || `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
  flex-shrink: 0;
  margin-bottom: ${theme.spacing.md};
`;

// ─── Two Column Layout ───

export const TwoColumnGrid = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['2xl']};
  align-items: center;

  ${p => p.$reverse && `
    > *:first-child { order: 2; }
    > *:last-child { order: 1; }
  `}

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;

    > *:first-child { order: 1 !important; }
    > *:last-child { order: 2 !important; }
  }
`;

// ─── Final CTA Section ───

export const FinalCTASection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
  text-align: center;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

export const FinalCTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const FinalCTATitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: white;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

export const FinalCTAText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
`;

export const WhiteButton = styled.button`
  background: white;
  color: ${theme.colors.accent.coralDark};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  border: none;
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;
