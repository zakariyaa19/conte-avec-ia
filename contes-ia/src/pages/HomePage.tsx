import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { PricingTiers, PricingPlan } from '../components/PricingTiers';
import { Accordion } from '../components/ui/Accordion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { exampleStories } from '../data/exampleStories';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { StoryReader } from '../components/ui/StoryReader';
import { ApiService } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { SchemaOrganization, SchemaWebSite, SchemaFAQ } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';

// =============================================
// ANIMATIONS
// =============================================

const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-32px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(32px); }
  to { opacity: 1; transform: translateX(0); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const revealBase = css<{ $visible: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const revealUp = css<{ $visible: boolean }>`
  ${revealBase}
  transform: translateY(${p => p.$visible ? 0 : '36px'});
`;

const progressFill = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const slideIn = keyframes`
  0% { opacity: 0; transform: translateY(24px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const floatSoft = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(2deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const bookFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
`;

const coverSlideIn = keyframes`
  0% { opacity: 0; transform: scale(0.9) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const shimmerGlow = keyframes`
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
  position: relative;
  overflow-x: hidden;
`;

const SectionWrapper = styled.div<{ $visible: boolean; $delay?: string }>`
  ${revealUp}
  transition-delay: ${p => p.$delay || '0ms'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.md};
  letter-spacing: -0.01em;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.lg};
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto ${theme.spacing['3xl']};
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.base};
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

const Divider = styled.div`
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: ${theme.borderRadius.full};
  margin: 0 auto ${theme.spacing.xl};
`;

// =============================================
// 1. HERO + EXEMPLES FUSIONNES
// =============================================

const HeroSection = styled.section`
  background: var(--bg-primary);
  padding: ${theme.spacing['4xl']} 0 ${theme.spacing['2xl']};
  position: relative;
  overflow: hidden;

  /* Orbe corail en haut à droite */
  &::before {
    content: '';
    position: absolute;
    top: -15%;
    right: -10%;
    width: 55%;
    height: 80%;
    background: radial-gradient(circle, ${theme.colors.accent.coral}18 0%, ${theme.colors.accent.softPink}10 40%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(40px);
  }

  /* Orbe dorée en bas à gauche */
  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -15%;
    width: 50%;
    height: 70%;
    background: radial-gradient(circle, ${theme.colors.accent.paleYellow}30 0%, ${theme.colors.accent.creamyYellow}15 40%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(50px);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0 ${theme.spacing['3xl']};
  }
`;

const HeroDecoCircle = styled.div<{ $size: number; $top: string; $left: string; $opacity: number; $color?: string; $delay?: string }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: ${p => p.$color || theme.colors.accent.coral};
  opacity: ${p => p.$opacity};
  top: ${p => p.$top};
  left: ${p => p.$left};
  pointer-events: none;
  animation: ${floatSoft} ${p => 5 + (p.$size % 4)}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
    text-align: center;
  }
`;

const HeroTextBlock = styled.div`
  animation: ${fadeInLeft} 0.8s ease-out both;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--hover-bg);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 153, 153, 0.25);
  padding: 6px 16px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.accent.coralDark};
  margin-bottom: ${theme.spacing.lg};
  letter-spacing: 0.01em;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['6xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.lg};
  text-align: left;
  letter-spacing: -0.025em;
  line-height: 1.08;

  span {
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
    font-size: ${theme.fontSizes['5xl']};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['4xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: var(--text-secondary);
  margin-bottom: ${theme.spacing['2xl']};
  line-height: 1.7;
  text-align: left;

  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;

    button {
      width: 100%;
      max-width: 320px;
    }
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  font-weight: 500;
`;

// Hero right side: Book carousel preview
const HeroBooksBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeInRight} 0.8s ease-out 0.2s both;
  position: relative;
  min-height: 420px;

  @media (max-width: ${theme.breakpoints.lg}) {
    min-height: 340px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 280px;
  }
`;

const BookStack = styled.div`
  position: relative;
  width: 320px;
  height: 420px;
  perspective: 1000px;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 260px;
    height: 340px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 220px;
    height: 290px;
  }
`;

const BookCover = styled.div<{ $active: boolean; $offset: number; $zIndex: number }>`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${p => p.$active
    ? 'translateX(0) translateY(0) scale(1) rotate(0deg)'
    : `translateX(${p.$offset * 20}px) translateY(${p.$offset * 8}px) scale(${1 - p.$offset * 0.06}) rotate(${p.$offset * 2}deg)`
  };
  opacity: ${p => p.$active ? 1 : Math.max(0.3, 1 - p.$offset * 0.3)};
  z-index: ${p => p.$zIndex};
  box-shadow: ${p => p.$active
    ? '0 25px 60px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1)'
    : '0 10px 30px rgba(0, 0, 0, 0.1)'
  };

  &:hover {
    ${p => p.$active && `
      transform: scale(1.03) translateY(-4px);
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25), 0 12px 30px rgba(0, 0, 0, 0.12);
    `}
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }
`;

const BookOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: ${theme.spacing.lg};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${BookCover}:hover & {
    opacity: 1;
  }
`;

const BookOverlayText = styled.span`
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
`;

const BookDots = styled.div`
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;

  @media (max-width: ${theme.breakpoints.sm}) {
    bottom: -28px;
  }
`;

const BookDot = styled.button<{ $active: boolean }>`
  width: ${p => p.$active ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: ${p => p.$active
    ? `linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : 'var(--border-input)'
  };
  transition: all 0.3s ease;
  padding: 0;
`;

// =============================================
// 2. STORY SHOWCASE — Galerie detaillee sous le hero
// =============================================

const ShowcaseSection = styled.section`
  padding: ${theme.spacing['3xl']} 0 ${theme.spacing['4xl']};
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: 10%;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.pastelBlue}12 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5%;
    left: 5%;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.coral}08 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }
`;

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
    gap: ${theme.spacing.lg};
  }
`;

const ShowcaseCard = styled.div<{ $visible: boolean; $delay: string }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: var(--shadow-card);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  ${revealUp}
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-card-hover);
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const ShowcardCover = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    transition: transform 0.5s ease;
  }

  ${ShowcaseCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ShowcardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 70%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${theme.spacing.lg};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ShowcaseCard}:hover & {
    opacity: 1;
  }
`;

const ShowcardHint = styled.span`
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
  text-align: center;
  align-self: center;
`;

const ShowcardInfo = styled.div`
  padding: ${theme.spacing.lg};
`;

const ShowcardStyleBadge = styled.span<{ $color: string }>`
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${p => p.$color};
  background: ${p => p.$color}12;
  border: 1px solid ${p => p.$color}25;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.sm};
`;

const ShowcardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.3;
`;

const ShowcardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: ${theme.spacing.sm};
`;

const ShowcardTag = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
`;

const ShowcardDescription = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  line-height: 1.6;
  margin: 0;
`;

const ShowcaseFooter = styled.div`
  text-align: center;
  margin-top: ${theme.spacing['2xl']};
`;

// =============================================
// 3. COMMENT CA MARCHE — Animation conte enfant
// =============================================

const StepsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: -8%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.paleYellow}20 0%, transparent 70%);
    pointer-events: none;
    filter: blur(30px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 5%;
    right: -5%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.softPink}15 0%, transparent 70%);
    pointer-events: none;
    filter: blur(30px);
  }
`;

const VideoShowcase = styled.div`
  max-width: 960px;
  margin: 0 auto;
  position: relative;
`;

const VideoStage = styled.div`
  position: relative;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 300px;
  }
`;

const StageDeco = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const DecoStar = styled.div<{ $top: string; $left: string; $size: number; $delay: string; $color: string }>`
  position: absolute;
  top: ${p => p.$top};
  left: ${p => p.$left};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  animation: ${sparkle} 3s ease-in-out ${p => p.$delay} infinite;

  &::before, &::after {
    content: '';
    position: absolute;
    background: ${p => p.$color};
    border-radius: 50%;
  }

  &::before {
    width: 100%;
    height: 30%;
    top: 35%;
    left: 0;
  }

  &::after {
    width: 30%;
    height: 100%;
    top: 0;
    left: 35%;
  }
`;

const DecoCircle = styled.div<{ $top: string; $left: string; $size: number; $color: string }>`
  position: absolute;
  top: ${p => p.$top};
  left: ${p => p.$left};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: ${p => p.$color};
  opacity: 0.4;
`;

const SlideContainer = styled.div<{ $active: boolean; $direction: 'enter' | 'exit' | 'idle' }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing['2xl']};
  padding: ${theme.spacing.xl} ${theme.spacing['2xl']};
  opacity: ${p => p.$active ? 1 : 0};
  transform: ${p => {
    if (!p.$active && p.$direction === 'exit') return 'translateX(-40px) scale(0.95)';
    if (!p.$active && p.$direction === 'enter') return 'translateX(40px) scale(0.95)';
    return 'translateX(0) scale(1)';
  }};
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${p => p.$active ? 'auto' : 'none'};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing.lg};
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const SlideIllustration = styled.div<{ $active: boolean; $bgColor: string }>`
  flex-shrink: 0;
  width: 190px;
  height: 190px;
  border-radius: 36px;
  background: ${p => p.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${p => p.$active ? css`${slideIn} 0.5s ease-out, ${floatSoft} 4s ease-in-out 0.5s infinite` : 'none'};

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 120px;
    height: 120px;
    border-radius: 24px;
  }
`;

const SlideTextBlock = styled.div<{ $active: boolean }>`
  text-align: left;
  max-width: 340px;
  animation: ${p => p.$active ? css`${slideIn} 0.5s ease-out 0.15s both` : 'none'};

  @media (max-width: ${theme.breakpoints.sm}) {
    text-align: center;
    max-width: 280px;
  }
`;

const SlideStepLabel = styled.span`
  display: inline-block;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

const SlideTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 8px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const SlideSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const VideoControls = styled.div`
  padding: ${theme.spacing.lg} 0 0;
  display: flex;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} 0 0;
  }
`;

const StepIndicator = styled.button<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const IndicatorBar = styled.div<{ $active: boolean; $completed: boolean; $duration: number }>`
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: var(--bg-secondary);
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    border-radius: 4px;
    width: ${p => p.$completed ? '100%' : '0%'};
    ${p => p.$active ? css`animation: ${progressFill} ${p.$duration}ms linear forwards;` : ''}
  }
`;

const IndicatorLabel = styled.span<{ $active: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${p => p.$active ? 700 : 600};
  color: ${p => p.$active ? 'var(--text-primary)' : 'var(--text-light)'};
  transition: color 0.3s ease;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.65rem;
  }
`;

// =============================================
// 4. BIBLIOTHEQUE
// =============================================

const LibrarySection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    right: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.lightGreen}10 0%, transparent 70%);
    pointer-events: none;
    filter: blur(50px);
  }
`;

const LibraryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
`;

const LibraryCard = styled.div<{ $visible: boolean; $delay: string }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  box-shadow: var(--shadow-card);
  transition: all ${theme.transitions.smooth};
  ${revealUp}
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-card-hover);
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const LibraryIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: ${theme.borderRadius.xl};
  margin: 0 auto ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const LibraryCardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};
`;

const LibraryCardText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  line-height: 1.7;
`;

// =============================================
// 5. TARIFS
// =============================================

const PricingSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-card) 100%);

  &#tarifs {
    scroll-margin-top: 80px;
  }
`;

// =============================================
// 6. POURQUOI CHOISIR
// =============================================

const FeaturesSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 10%;
    left: -5%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.paleYellow}15 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 15%;
    right: -8%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.pastelBlue}10 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
`;

const FeatureCard = styled.div<{ $visible: boolean; $delay: string }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  box-shadow: var(--shadow-card);
  transition: all ${theme.transitions.smooth};
  ${revealUp}
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-card-hover);
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
`;

const FeatureImage = styled.img`
  width: 280px;
  height: 160px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.xl};
  transition: transform ${theme.transitions.smooth};
  box-shadow: ${theme.shadows.md};

  &:hover {
    transform: scale(1.03);
  }

  &:not([src]), &[src=""] {
    display: none;
  }
`;

const FeatureIconFallback = styled.div`
  font-size: ${theme.fontSizes['5xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, ${theme.colors.accent.pastelBlue}, ${theme.colors.accent.lightGreen});
  border-radius: ${theme.borderRadius['2xl']};
  color: white;
  box-shadow: ${theme.shadows.md};
`;

const FeatureTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  font-size: ${theme.fontSizes.sm};
  line-height: 1.7;
`;

// =============================================
// 7. TEMOIGNAGES
// =============================================

// =============================================
// 8. FAQ
// =============================================

const FAQSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: var(--bg-primary);
`;

// =============================================
// 9. CTA FINAL
// =============================================

const FinalCTASection = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.accent.coral} 0%, ${theme.colors.button.primaryHover} 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
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
  color: rgba(255,255,255,0.9);
  margin-bottom: ${theme.spacing.xl};
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const FinalCTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;

const GhostWhiteButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.5);
  padding: 12px 32px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  font-family: ${theme.fonts.body};

  &:hover {
    background: rgba(255,255,255,0.15);
    border-color: white;
  }
`;

// =============================================
// DATA
// =============================================

const STEP_DURATION = 3500;
const HERO_BOOK_DURATION = 3000;

const STYLE_COLORS: Record<string, string> = {
  'Animation 3D': '#6C5CE7',
  'Manga': '#D63031',
  'Kawaii': '#E84393',
  'Papier Découpé': '#E17055',
  'Aquarelle': '#00B894',
  'Géométrique': '#0984E3',
};

const slidesData = [
  {
    label: 'Personnaliser',
    stepLabel: 'Étape 1',
    title: 'Personnalisez votre conte',
    subtitle: 'Choisissez le thème, ajoutez le prénom et la photo de votre enfant. Chaque détail rend l\'histoire unique.',
    bgColor: `${theme.colors.accent.paleYellow}35`,
    illustrationId: 'customize' as const
  },
  {
    label: 'Recevoir',
    stepLabel: 'Étape 2',
    title: 'Recevez votre aperçu gratuit',
    subtitle: 'Pas de carte bancaire. Entrez votre email et recevez les premières pages de votre conte en quelques minutes.',
    bgColor: `${theme.colors.accent.softPink}25`,
    illustrationId: 'order' as const
  },
  {
    label: 'Lire',
    stepLabel: 'Étape 3',
    title: 'Lisez-le dans votre bibliothèque',
    subtitle: 'Retrouvez votre livre dans votre espace personnel. Lisez-le en ligne, partagez-le avec vos proches.',
    bgColor: `${theme.colors.accent.pastelBlue}25`,
    illustrationId: 'receive' as const
  }
];

const StepIllustration: React.FC<{ id: 'customize' | 'order' | 'receive'; size?: number }> = ({ id, size = 105 }) => {
  if (id === 'customize') {
    return (
      <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
        <rect x="10" y="25" width="32" height="44" rx="3" fill={theme.colors.accent.coral} opacity="0.85" />
        <rect x="48" y="25" width="32" height="44" rx="3" fill={theme.colors.accent.coralDark} opacity="0.7" />
        <rect x="12" y="27" width="28" height="40" rx="2" fill="#FFF" opacity="0.9" />
        <rect x="50" y="27" width="28" height="40" rx="2" fill="#FFF" opacity="0.85" />
        <rect x="16" y="34" width="20" height="2.5" rx="1" fill={theme.colors.accent.coral} opacity="0.3" />
        <rect x="16" y="40" width="16" height="2.5" rx="1" fill={theme.colors.accent.coral} opacity="0.25" />
        <rect x="16" y="46" width="18" height="2.5" rx="1" fill={theme.colors.accent.coral} opacity="0.2" />
        <rect x="54" y="32" width="20" height="16" rx="3" fill={theme.colors.accent.paleYellow} />
        <circle cx="64" cy="38" r="4" fill={theme.colors.accent.coral} opacity="0.5" />
        <circle cx="20" cy="14" r="3" fill={theme.colors.accent.paleYellow} />
        <circle cx="72" cy="18" r="2.5" fill={theme.colors.accent.softPink} />
        <circle cx="50" cy="10" r="2" fill={theme.colors.accent.lightGreen} />
        <rect x="68" y="52" width="4" height="18" rx="1" fill={theme.colors.accent.pastelBlue} transform="rotate(-20 70 61)" />
        <polygon points="66,68 70,70 68,72" fill={theme.colors.accent.paleYellow} transform="rotate(-20 68 70)" />
      </svg>
    );
  }

  if (id === 'order') {
    return (
      <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
        <rect x="15" y="22" width="60" height="40" rx="10" fill={theme.colors.accent.coral} opacity="0.85" />
        <rect x="19" y="26" width="52" height="32" rx="7" fill="#FFF" opacity="0.15" />
        <circle cx="45" cy="42" r="14" fill="#FFF" opacity="0.95" />
        <path d="M37 42 L42 47 L53 36" stroke={theme.colors.accent.lightGreen} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="22" cy="14" r="3" fill={theme.colors.accent.paleYellow} />
        <circle cx="70" cy="12" r="2.5" fill={theme.colors.accent.softPink} />
        <circle cx="12" cy="50" r="2" fill={theme.colors.accent.pastelBlue} />
        <circle cx="78" cy="48" r="2.5" fill={theme.colors.accent.lightGreen} />
        <rect x="58" y="56" width="14" height="11" rx="3" fill={theme.colors.accent.pastelBlue} opacity="0.8" />
        <path d="M61 56 V52 A4 4 0 0 1 69 52 V56" stroke={theme.colors.accent.pastelBlue} strokeWidth="2" fill="none" opacity="0.8" />
        <polygon points="28,68 34,68 32,74 38,74 26,84 30,76 24,76" fill={theme.colors.accent.paleYellow} opacity="0.9" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
      <rect x="12" y="30" width="50" height="35" rx="5" fill={theme.colors.accent.pastelBlue} opacity="0.8" />
      <path d="M12 35 L37 52 L62 35" stroke="#FFF" strokeWidth="2.5" fill="none" opacity="0.7" />
      <rect x="22" y="18" width="30" height="22" rx="3" fill={theme.colors.accent.coral} opacity="0.85" />
      <rect x="24" y="20" width="26" height="18" rx="2" fill="#FFF" opacity="0.9" />
      <rect x="28" y="24" width="18" height="2" rx="1" fill={theme.colors.accent.coral} opacity="0.3" />
      <rect x="28" y="29" width="14" height="2" rx="1" fill={theme.colors.accent.coral} opacity="0.25" />
      <rect x="28" y="34" width="10" height="2" rx="1" fill={theme.colors.accent.coral} opacity="0.2" />
      <path d="M72 28 C72 24, 78 24, 78 28 C78 24, 84 24, 84 28 C84 34, 78 38, 78 38 C78 38, 72 34, 72 28Z" fill={theme.colors.accent.softPink} opacity="0.7" />
      <circle cx="75" cy="52" r="3" fill={theme.colors.accent.paleYellow} />
      <circle cx="8" cy="22" r="2.5" fill={theme.colors.accent.lightGreen} />
      <circle cx="68" cy="65" r="2" fill={theme.colors.accent.softPink} />
      <circle cx="18" cy="16" r="2" fill={theme.colors.accent.paleYellow} opacity="0.8" />
      <circle cx="56" cy="14" r="1.5" fill={theme.colors.accent.pastelBlue} opacity="0.6" />
    </svg>
  );
};

const faqItems = [
  {
    id: '1',
    question: "Comment fonctionne la création d'un conte personnalisé ?",
    answer: "Vous remplissez un formulaire en 3 étapes : choix du thème, personnalisation du héros (prénom, photo), et choix du style d'illustration. L'IA génère ensuite un conte unique avec des illustrations personnalisées en 5 minutes."
  },
  {
    id: '2',
    question: "Combien de temps faut-il pour recevoir mon conte ?",
    answer: "Le livre personnalisé est prêt en 5 minutes ! L'IA génère le texte et les illustrations automatiquement. Vous recevez une notification par email dès que votre eBook est disponible dans votre bibliothèque."
  },
  {
    id: '3',
    question: "Qu'est-ce que le Club des Histoires Uniques ?",
    answer: "Vous pouvez créer votre premier chapitre gratuitement (3 pages illustrées). Pour découvrir la suite complète du livre (20 pages), c'est seulement 2,99€. Ou rejoignez le Club des Histoires à 1,99€ le premier mois (puis 9,99€/mois) pour des livres complets illimités, 9 styles d'illustration, 5 personnages secondaires et bien plus. Sans engagement."
  },
  {
    id: '4',
    question: "Comment fonctionne la bibliothèque personnelle ?",
    answer: "Chaque conte est stocké dans votre espace personnel. Vous pouvez le lire en ligne via notre visionneuse intégrée, le télécharger en PDF, le partager avec la famille, et y accéder depuis n'importe quel appareil."
  },
  {
    id: '5',
    question: "Les contes sont-ils adaptés à tous les âges ?",
    answer: "Oui ! Vous choisissez la tranche d'âge lors de la création (0-2 ans, 3-5 ans, 6-9 ans) et le contenu s'adapte automatiquement au niveau de lecture, au vocabulaire et aux centres d'intérêt correspondants."
  },
  {
    id: '6',
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer: "Nous offrons une garantie satisfaction. Si le conte ne vous convient pas, nous le modifions gratuitement ou vous remboursons intégralement. Votre satisfaction est notre priorité."
  },
  {
    id: '7',
    question: "Puis-je offrir un conte en cadeau ?",
    answer: "Absolument ! Un conte personnalisé fait un cadeau original et mémorable pour un anniversaire, Noël ou toute autre occasion spéciale. Il suffit de renseigner les informations de l'enfant à qui vous souhaitez l'offrir."
  }
];

// =============================================
// COMPONENT
// =============================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [stepKey, setStepKey] = useState(0);
  const [activeBook, setActiveBook] = useState(0);
  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<typeof exampleStories[0] | null>(null);
  const [readerData, setReaderData] = useState<{ paragraphs: string[]; illustrationUrls: string[]; creatorName?: string } | null>(null);
  const [apiExamples, setApiExamples] = useState<any[] | null>(null);

  // Pré-charger les données exemples depuis l'API
  useEffect(() => {
    const baseUrl = ApiService.getBaseUrl();
    fetch(`${baseUrl}/api/public/examples`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setApiExamples(res.data);
      })
      .catch(() => {});
  }, []);

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan === 'single') {
      navigate('/create-story');
    } else if (isAuthenticated) {
      // Connecté → direct vers checkout Club
      navigate('/club/checkout');
    } else if (plan === 'annual') {
      navigate('/login?mode=register&plan=club_annual');
    } else {
      navigate('/login?mode=register&plan=club');
    }
  };

  // Scroll reveal hooks
  const stepsReveal = useScrollReveal();
  const showcaseReveal = useStaggerReveal(6);
  const libraryReveal = useStaggerReveal(3);
  const pricingReveal = useScrollReveal();
  const featuresReveal = useStaggerReveal(3);
const faqReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  // Auto-play hero books
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBook(prev => (prev + 1) % exampleStories.length);
    }, HERO_BOOK_DURATION);
    return () => clearInterval(timer);
  }, []);

  // Auto-play des etapes
  useEffect(() => {
    if (!stepsReveal.isVisible) return;
    const timer = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % slidesData.length;
        setStepKey(k => k + 1);
        return next;
      });
    }, STEP_DURATION);
    return () => clearInterval(timer);
  }, [stepsReveal.isVisible]);

  const goToStep = (index: number) => {
    setActiveStep(index);
    setStepKey(k => k + 1);
  };

  const openStoryViewer = useCallback((story: typeof exampleStories[0]) => {
    setSelectedStory(story);
    if (!apiExamples) return;
    // Matcher par nom du protagoniste (les IDs statiques != IDs base de données)
    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const match = apiExamples.find((s: any) =>
      normalize(s.protagonistName) === normalize(story.protagonistName)
    );
    if (match && match.paragraphs?.length > 0) {
      setReaderData({ paragraphs: match.paragraphs, illustrationUrls: match.illustrationUrls, creatorName: match.creatorName });
      setReaderOpen(true);
    }
  }, [apiExamples]);

  const closeStoryViewer = useCallback(() => {
    setReaderOpen(false);
    setSelectedStory(null);
  }, []);

  return (
    <PageContainer>
      <SEOHead
        title="Livre Personnalisé Enfant GRATUIT — Histoire IA en 5 min | Contedia"
        description="Votre enfant héros de son propre livre illustré par IA. Prénom + passions = histoire unique. 1er livre 100% gratuit, sans carte bancaire. Prêt en 5 minutes."
      />
      <SchemaOrganization />
      <SchemaWebSite />
      <SchemaFAQ questions={faqItems.map(f => ({ question: f.question, answer: f.answer }))} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Contedia",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web",
          "url": "https://contedia.fr",
          "description": "Créez des contes personnalisés pour enfants avec l'IA. Votre enfant devient le héros de son propre livre illustré.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "description": "Premier livre personnalisé gratuit" }
        })}</script>
      </Helmet>
      <Header />
      <main>

        {/* ============ 1. HERO + BOOK CAROUSEL ============ */}
        <HeroSection>
          <HeroDecoCircle $size={12} $top="15%" $left="8%" $opacity={0.25} $color={theme.colors.accent.coral} $delay="0s" />
          <HeroDecoCircle $size={8} $top="35%" $left="18%" $opacity={0.2} $color={theme.colors.accent.pastelBlue} $delay="1s" />
          <HeroDecoCircle $size={6} $top="20%" $left="42%" $opacity={0.18} $color={theme.colors.accent.paleYellow} $delay="2s" />
          <HeroDecoCircle $size={10} $top="70%" $left="12%" $opacity={0.15} $color={theme.colors.accent.softPink} $delay="0.5s" />
          <HeroDecoCircle $size={7} $top="55%" $left="92%" $opacity={0.2} $color={theme.colors.accent.lightGreen} $delay="1.5s" />
          <HeroDecoCircle $size={9} $top="10%" $left="75%" $opacity={0.15} $color={theme.colors.accent.coral} $delay="3s" />

          <HeroContent>
            <HeroTextBlock>
              <HeroBadge>+500 histoires déjà créées · ★★★★★</HeroBadge>
              <HeroTitle>
                Créez un <span>livre personnalisé</span> gratuit pour votre enfant
              </HeroTitle>
              <HeroSubtitle>
                Votre enfant devient le héros d'un conte personnalisé unique. Prénom, photo, illustrations IA sur mesure. Commencez gratuitement, prêt en 5 minutes !
              </HeroSubtitle>
              <CTAButtons>
                <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
                  Créer mon 1er chapitre GRATUIT
                </Button>
              </CTAButtons>
              <TrustRow>
                <TrustItem>
                  <span>&#10003;</span> 1er chapitre gratuit
                </TrustItem>
                <TrustItem>
                  <span>&#10003;</span> Prêt en 5 minutes
                </TrustItem>
                <TrustItem>
                  <span>&#10003;</span> Sans carte bancaire
                </TrustItem>
              </TrustRow>
            </HeroTextBlock>

            <HeroBooksBlock>
              <BookStack>
                {exampleStories.map((story, i) => {
                  const offset = (i - activeBook + exampleStories.length) % exampleStories.length;
                  const isActive = offset === 0;
                  return (
                    <BookCover
                      key={story.id}
                      $active={isActive}
                      $offset={offset > exampleStories.length / 2 ? exampleStories.length - offset : offset}
                      $zIndex={exampleStories.length - (offset > exampleStories.length / 2 ? exampleStories.length - offset : offset)}
                      onClick={() => isActive ? openStoryViewer(story) : setActiveBook(i)}
                    >
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        crossOrigin="anonymous"
                      />
                      {isActive && (
                        <BookOverlay>
                          <BookOverlayText>Feuilleter ce conte</BookOverlayText>
                        </BookOverlay>
                      )}
                    </BookCover>
                  );
                })}
                <BookDots>
                  {exampleStories.map((_, i) => (
                    <BookDot
                      key={i}
                      $active={activeBook === i}
                      onClick={() => setActiveBook(i)}
                    />
                  ))}
                </BookDots>
              </BookStack>
            </HeroBooksBlock>
          </HeroContent>
        </HeroSection>

        {/* ============ 2. SHOWCASE — Galerie de contes ============ */}
        <ShowcaseSection id="contes-exemples" ref={showcaseReveal.ref}>
          <Container>
            <SectionWrapper $visible={showcaseReveal.isVisible}>
              <SectionTitle>Découvrez nos contes personnalisés</SectionTitle>
              <Divider />
              <SectionSubtitle>
                Chaque conte est une création unique. Cliquez pour feuilleter directement dans votre navigateur.
              </SectionSubtitle>
            </SectionWrapper>

            <ShowcaseGrid>
              {exampleStories.map((story, i) => {
                const styleColor = STYLE_COLORS[story.illustrationStyle] || theme.colors.accent.coral;
                return (
                  <ShowcaseCard
                    key={story.id}
                    $visible={showcaseReveal.isVisible}
                    $delay={showcaseReveal.getDelay(i)}
                    onClick={() => openStoryViewer(story)}
                  >
                    <ShowcardCover>
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                      <ShowcardOverlay>
                        <ShowcardHint>Feuilleter le conte</ShowcardHint>
                      </ShowcardOverlay>
                    </ShowcardCover>
                    <ShowcardInfo>
                      <ShowcardStyleBadge $color={styleColor}>
                        {story.illustrationStyle}
                      </ShowcardStyleBadge>
                      <ShowcardTitle>{story.title}</ShowcardTitle>
                      <ShowcardMeta>
                        <ShowcardTag>{story.ageRange}</ShowcardTag>
                        <ShowcardTag>{story.generalTheme}</ShowcardTag>
                        <ShowcardTag>{story.centralMessage}</ShowcardTag>
                      </ShowcardMeta>
                      <ShowcardDescription>
                        L'histoire de {story.protagonistName}, {story.protagonistAge}
                        {story.secondaryCharacterName && `, accompagne de ${story.secondaryCharacterName}`}.
                      </ShowcardDescription>
                    </ShowcardInfo>
                  </ShowcaseCard>
                );
              })}
            </ShowcaseGrid>

            <ShowcaseFooter>
              <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
                Créer mon propre conte
              </Button>
            </ShowcaseFooter>
          </Container>
        </ShowcaseSection>

        {/* ============ 4. COMMENT CA MARCHE ============ */}
        <StepsSection ref={stepsReveal.ref}>
          <Container>
            <SectionWrapper $visible={stepsReveal.isVisible}>
              <SectionTitle>Comment ça marche ?</SectionTitle>
              <Divider />
            </SectionWrapper>

            <SectionWrapper $visible={stepsReveal.isVisible} $delay="200ms">
              <VideoShowcase>
                <VideoStage>
                  <StageDeco>
                    <DecoStar $top="12%" $left="8%" $size={10} $delay="0s" $color={theme.colors.accent.paleYellow} />
                    <DecoStar $top="20%" $left="88%" $size={8} $delay="1s" $color={theme.colors.accent.softPink} />
                    <DecoStar $top="75%" $left="5%" $size={7} $delay="0.5s" $color={theme.colors.accent.lightGreen} />
                    <DecoStar $top="80%" $left="92%" $size={9} $delay="1.5s" $color={theme.colors.accent.pastelBlue} />
                    <DecoCircle $top="60%" $left="85%" $size={20} $color={theme.colors.accent.paleYellow + '30'} />
                    <DecoCircle $top="15%" $left="75%" $size={14} $color={theme.colors.accent.softPink + '20'} />
                  </StageDeco>

                  {slidesData.map((slide, i) => (
                    <SlideContainer
                      key={i}
                      $active={activeStep === i}
                      $direction={i < activeStep ? 'exit' : i > activeStep ? 'enter' : 'idle'}
                    >
                      <SlideIllustration $active={activeStep === i} $bgColor={slide.bgColor} key={`ill-${i}-${stepKey}`}>
                        <StepIllustration id={slide.illustrationId} />
                      </SlideIllustration>
                      <SlideTextBlock $active={activeStep === i} key={`txt-${i}-${stepKey}`}>
                        <SlideStepLabel>{slide.stepLabel}</SlideStepLabel>
                        <SlideTitle>{slide.title}</SlideTitle>
                        <SlideSubtitle>{slide.subtitle}</SlideSubtitle>
                      </SlideTextBlock>
                    </SlideContainer>
                  ))}
                </VideoStage>

                <VideoControls>
                  {slidesData.map((slide, i) => (
                    <StepIndicator
                      key={i}
                      $active={activeStep === i}
                      $completed={i < activeStep}
                      onClick={() => goToStep(i)}
                    >
                      <IndicatorBar
                        key={`bar-${i}-${stepKey}`}
                        $active={activeStep === i}
                        $completed={i < activeStep}
                        $duration={STEP_DURATION}
                      />
                      <IndicatorLabel $active={activeStep === i}>
                        {slide.label}
                      </IndicatorLabel>
                    </StepIndicator>
                  ))}
                </VideoControls>
              </VideoShowcase>
            </SectionWrapper>

            <div style={{ textAlign: 'center', marginTop: theme.spacing['2xl'] }}>
              <SectionWrapper $visible={stepsReveal.isVisible} $delay="400ms">
                <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
                  Commencer mon conte
                </Button>
              </SectionWrapper>
            </div>
          </Container>
        </StepsSection>

        {/* ============ 5. TARIFS ============ */}
        <PricingSection id="tarifs" ref={pricingReveal.ref}>
          <Container>
            <SectionWrapper $visible={pricingReveal.isVisible}>
              <SectionTitle>Gratuit ou Club ?</SectionTitle>
              <Divider />
              <SectionSubtitle>
                1er chapitre gratuit. Le Club déverrouille les histoires complètes.
              </SectionSubtitle>
            </SectionWrapper>

            <SectionWrapper $visible={pricingReveal.isVisible} $delay="200ms">
              <PricingTiers onSelectPlan={handleSelectPlan} />
            </SectionWrapper>
          </Container>
        </PricingSection>

        {/* ============ 6. BIBLIOTHEQUE ============ */}
        <LibrarySection ref={libraryReveal.ref}>
          <Container>
            <SectionWrapper $visible={libraryReveal.isVisible}>
              <SectionTitle>Votre bibliothèque personnelle</SectionTitle>
              <Divider />
              <SectionSubtitle>
                Tous vos contes au même endroit. Consultez, relisez et téléchargez à tout moment.
              </SectionSubtitle>
            </SectionWrapper>

            <LibraryGrid>
              <LibraryCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(0)}>
                <LibraryIcon style={{ background: `linear-gradient(135deg, ${theme.colors.accent.paleYellow}, ${theme.colors.accent.creamyYellow})` }}>
                  👁️
                </LibraryIcon>
                <LibraryCardTitle>Visionneuse en ligne</LibraryCardTitle>
                <LibraryCardText>
                  Lisez vos contes directement sur le site, comme un vrai livre numerique. Compatible ordinateur, tablette et mobile.
                </LibraryCardText>
              </LibraryCard>

              <LibraryCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(1)}>
                <LibraryIcon style={{ background: `linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #8FE6A0)` }}>
                  📥
                </LibraryIcon>
                <LibraryCardTitle>Téléchargement PDF</LibraryCardTitle>
                <LibraryCardText>
                  Télécharger vos eBooks en PDF haute qualité, à tout moment. Imprimez-les ou lisez-les hors ligne.
                </LibraryCardText>
              </LibraryCard>

              <LibraryCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(2)}>
                <LibraryIcon style={{ background: `linear-gradient(135deg, ${theme.colors.accent.pastelBlue}, ${theme.colors.accent.softPink})` }}>
                  📬
                </LibraryIcon>
                <LibraryCardTitle>Notification par email</LibraryCardTitle>
                <LibraryCardText>
                  Recevez un email avec votre eBook en pièce jointe dès qu'il est disponible, ainsi qu'un lien direct vers votre bibliothèque.
                </LibraryCardText>
              </LibraryCard>
            </LibraryGrid>
          </Container>
        </LibrarySection>

        {/* ============ 7. POURQUOI CHOISIR ============ */}
        <FeaturesSection ref={featuresReveal.ref}>
          <Container>
            <SectionWrapper $visible={featuresReveal.isVisible}>
              <SectionTitle>Pourquoi choisir Contedia ?</SectionTitle>
              <Divider />
            </SectionWrapper>

            <FeaturesGrid>
              <FeatureCard $visible={featuresReveal.isVisible} $delay={featuresReveal.getDelay(0)}>
                <FeatureIcon>
                  <FeatureImage
                    src="/images/homepage/feature-personnalisation.jpg"
                    alt="Personnalisation complète"
                    width="766"
                    height="511"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <FeatureIconFallback style={{display: 'none'}}>🎨</FeatureIconFallback>
                </FeatureIcon>
                <FeatureTitle>Personnalisation complète</FeatureTitle>
                <FeatureDescription>
                  Thème, personnages, style d'illustration, message éducatif... chaque détail est choisi par vous pour créer un conte qui ressemble à votre enfant.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard $visible={featuresReveal.isVisible} $delay={featuresReveal.getDelay(1)}>
                <FeatureIcon>
                  <FeatureImage
                    src="/images/homepage/feature-qualite.jpg"
                    alt="Qualité professionnelle"
                    width="1024"
                    height="683"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <FeatureIconFallback style={{display: 'none'}}>📚</FeatureIconFallback>
                </FeatureIcon>
                <FeatureTitle>Qualité professionnelle</FeatureTitle>
                <FeatureDescription>
                  eBook haute qualité créé avec soin. Chaque conte est conçu pour offrir une expérience de lecture exceptionnelle.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard $visible={featuresReveal.isVisible} $delay={featuresReveal.getDelay(2)}>
                <FeatureIcon>
                  <FeatureImage
                    src="/images/homepage/feature-livraison.jpg"
                    alt="Livraison rapide"
                    width="827"
                    height="551"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <FeatureIconFallback style={{display: 'none'}}>⚡</FeatureIconFallback>
                </FeatureIcon>
                <FeatureTitle>Livraison instantanée</FeatureTitle>
                <FeatureDescription>
                  Votre conte est disponible dans votre bibliothèque et par email dès qu'il est prêt. Téléchargez-le immédiatement en PDF.
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </Container>
        </FeaturesSection>

        {/* ============ 8. FAQ ============ */}
        <FAQSection ref={faqReveal.ref}>
          <Container>
            <SectionWrapper $visible={faqReveal.isVisible}>
              <SectionTitle>Questions fréquentes</SectionTitle>
              <Divider />
            </SectionWrapper>
            <SectionWrapper $visible={faqReveal.isVisible} $delay="200ms">
              <Accordion items={faqItems} />
            </SectionWrapper>
          </Container>
        </FAQSection>

        {/* ============ 9. CTA FINAL ============ */}
        <FinalCTASection ref={ctaReveal.ref}>
          <Container>
            <SectionWrapper $visible={ctaReveal.isVisible}>
              <FinalCTATitle>Créez la première histoire de votre enfant</FinalCTATitle>
              <FinalCTAText>
                1er chapitre GRATUIT — Prêt en 5 minutes
              </FinalCTAText>
              <FinalCTAButtons>
                <WhiteButton onClick={() => navigate('/create-story')}>
                  Créer l'histoire de mon enfant
                </WhiteButton>
                <GhostWhiteButton onClick={() => {
                  document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Découvrir les tarifs
                </GhostWhiteButton>
              </FinalCTAButtons>
            </SectionWrapper>
          </Container>
        </FinalCTASection>

      </main>
      <Footer />

      {/* ============ STORY READER MODAL ============ */}
      {readerOpen && selectedStory && readerData && (
        <StoryReader
          coverImageUrl={(() => { const n = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return apiExamples?.find((s: any) => n(s.protagonistName) === n(selectedStory.protagonistName))?.coverImageUrl || selectedStory.coverImage; })()}
          coverTitle={selectedStory.title}
          paragraphs={readerData.paragraphs}
          illustrationUrls={readerData.illustrationUrls}
          creatorName={readerData.creatorName}
          protagonistName={selectedStory.protagonistName}
          onClose={closeStoryViewer}
          onCreateAnother={() => navigate('/create-story')}
        />
      )}

    </PageContainer>
  );
};
