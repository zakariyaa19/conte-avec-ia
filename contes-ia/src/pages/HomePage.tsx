import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { PricingCard } from '../components/ui/PricingCard';
import { Accordion } from '../components/ui/Accordion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { exampleStories } from '../data/exampleStories';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';

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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;


// Shared reveal styles
const revealBase = css<{ $visible: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const revealUp = css<{ $visible: boolean }>`
  ${revealBase}
  transform: translateY(${p => p.$visible ? 0 : '36px'});
`;

const revealLeft = css<{ $visible: boolean }>`
  ${revealBase}
  transform: translateX(${p => p.$visible ? 0 : '-36px'});
`;

const revealRight = css<{ $visible: boolean }>`
  ${revealBase}
  transform: translateX(${p => p.$visible ? 0 : '36px'});
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
  color: ${theme.colors.text.primary};
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
  color: ${theme.colors.text.secondary};
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
// 1. HERO
// =============================================

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 50%, ${theme.colors.accent.creamyYellow} 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 14s ease-in-out infinite;
  padding: ${theme.spacing['4xl']} 0 ${theme.spacing['3xl']};
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0 ${theme.spacing['2xl']};
  }
`;

const HeroDecoCircle = styled.div<{ $size: number; $top: string; $left: string; $opacity: number }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: ${theme.colors.accent.coral};
  opacity: ${p => p.$opacity};
  top: ${p => p.$top};
  left: ${p => p.$left};
  pointer-events: none;
  filter: blur(60px);
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
  background: rgba(255, 255, 255, 0.8);
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
  color: ${theme.colors.text.primary};
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
  color: ${theme.colors.text.secondary};
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
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const HeroImageBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeInRight} 0.8s ease-out 0.2s both;
`;

const HeroImage = styled.img`
  width: 110%;
  max-width: 600px;
  height: auto;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.08));

  @media (max-width: ${theme.breakpoints.lg}) {
    width: 80%;
    max-width: 480px;
  }
`;

// =============================================
// 2. COMMENT CA MARCHE — Animation conte enfant
// =============================================

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

const StepsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.white};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 40px;
    left: -60px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: ${theme.colors.accent.paleYellow}25;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 30px;
    right: -40px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: ${theme.colors.accent.softPink}20;
    pointer-events: none;
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
  color: ${theme.colors.text.primary};
  line-height: 1.3;
  margin-bottom: 8px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const SlideSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
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
  background: ${theme.colors.background.secondary};
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
  color: ${p => p.$active ? theme.colors.text.primary : theme.colors.text.light};
  transition: color 0.3s ease;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.65rem;
  }
`;

// =============================================
// 3. EXEMPLES — Carrousel dynamique
// =============================================

const coverSlideIn = keyframes`
  0% { opacity: 0; transform: perspective(800px) rotateY(8deg) scale(0.92); }
  100% { opacity: 1; transform: perspective(800px) rotateY(0deg) scale(1); }
`;

const infoSlideIn = keyframes`
  0% { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const EXAMPLE_DURATION = 4500;

const ExamplesSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.primary};
  position: relative;
  overflow: hidden;
`;

const ExampleShowcase = styled.div`
  max-width: 960px;
  margin: 0 auto;
  position: relative;
`;

const ExampleStage = styled.div`
  position: relative;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.md}) {
    height: auto;
    min-height: 520px;
  }
`;

const ExampleSlide = styled.div<{ $active: boolean; $direction: 'enter' | 'exit' | 'idle' }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing['3xl']};
  padding: ${theme.spacing.lg};
  opacity: ${p => p.$active ? 1 : 0};
  pointer-events: ${p => p.$active ? 'auto' : 'none'};
  transition: opacity 0.5s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    position: ${p => p.$active ? 'relative' : 'absolute'};
    gap: ${theme.spacing.xl};
    padding: ${theme.spacing.md} 0;
  }
`;

const ExampleCoverWrap = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  width: 320px;
  height: 420px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08);
  animation: ${p => p.$active ? css`${coverSlideIn} 0.6s ease-out` : 'none'};
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 260px;
    height: 340px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 220px;
    height: 290px;
    border-radius: 16px;
  }
`;

const CoverOverlayHint = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: ${theme.spacing.lg};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ExampleCoverWrap}:hover & {
    opacity: 1;
  }
`;

const CoverHintText = styled.span`
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
  letter-spacing: 0.02em;
`;

const ExampleInfoPanel = styled.div<{ $active: boolean }>`
  flex: 1;
  animation: ${p => p.$active ? css`${infoSlideIn} 0.5s ease-out 0.2s both` : 'none'};

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
  }
`;

const ExampleLabel = styled.span`
  display: inline-block;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.sm};
`;

const ExampleTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.3;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const ExampleTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const ExampleTag = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${p => p.$color || theme.colors.text.secondary};
  background: ${p => p.$color ? p.$color + '15' : theme.colors.background.secondary};
  padding: 5px 14px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${p => p.$color ? p.$color + '25' : 'transparent'};
`;

const ExampleDescription = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const ExampleControls = styled.div`
  padding: ${theme.spacing.lg} 0 0;
  display: flex;
  gap: ${theme.spacing.xs};
  max-width: 960px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} 0 0;
  }
`;

const ExampleDot = styled.button<{ $active: boolean; $completed: boolean; $duration: number }>`
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

const ExampleDotBar = styled.div<{ $active: boolean; $completed: boolean; $duration: number }>`
  width: 100%;
  height: 3px;
  border-radius: 3px;
  background: rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    border-radius: 3px;
    width: ${p => p.$completed ? '100%' : '0%'};
    ${p => p.$active ? css`animation: ${progressFill} ${p.$duration}ms linear forwards;` : ''}
  }
`;

const ExampleDotLabel = styled.span<{ $active: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: 0.6rem;
  font-weight: ${p => p.$active ? 700 : 500};
  color: ${p => p.$active ? theme.colors.text.primary : theme.colors.text.light};
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

// =============================================
// 4. CLUB DES HISTOIRES UNIQUES
// =============================================

const ClubSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow} 0%, ${theme.colors.background.primary} 50%, ${theme.colors.accent.paleYellow} 100%);
  position: relative;
  overflow: hidden;
`;

const ClubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
  }
`;

const ClubTextBlock = styled.div<{ $visible: boolean }>`
  ${revealLeft}
`;

const ClubVisualBlock = styled.div<{ $visible: boolean }>`
  ${revealRight}
  display: flex;
  justify-content: center;
`;

const ClubBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 6px 16px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  letter-spacing: 0.02em;
  box-shadow: ${theme.shadows.glow};
`;

const ClubTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.15;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const ClubPrice = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  margin-bottom: ${theme.spacing.md};

  small {
    font-size: ${theme.fontSizes.base};
    font-weight: 500;
    color: ${theme.colors.text.secondary};
  }
`;

const ClubDescription = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const ClubFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const ClubFeature = styled.div`
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
  margin-top: 1px;
`;

const ClubCard = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.lg};
  border: 2px solid ${theme.colors.accent.lightCoral};
  position: relative;
  overflow: hidden;
  max-width: 400px;
  width: 100%;

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

const ClubCardIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(135deg, ${theme.colors.accent.paleYellow}, ${theme.colors.accent.creamyYellow});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: ${theme.spacing.lg};
`;

const ClubCardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const ClubCardText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
  margin-bottom: ${theme.spacing.lg};
`;

const ClubCardFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
`;

const ClubCardFeatureItem = styled.div`
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

// =============================================
// 5. BIBLIOTHEQUE
// =============================================

const LibrarySection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.white};
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
  background: ${theme.colors.background.white};
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  box-shadow: ${theme.shadows.card};
  transition: all ${theme.transitions.smooth};
  ${revealUp}
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadows.cardHover};
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
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const LibraryCardText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
`;

// =============================================
// 6. TARIFS
// =============================================

const PricingSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: linear-gradient(180deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.white} 100%);

  &#tarifs {
    scroll-margin-top: 80px;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};
  align-items: start;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 440px;
    gap: ${theme.spacing.xl};
  }
`;

// =============================================
// 7. POURQUOI CHOISIR
// =============================================

const FeaturesSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.white};
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
  background: ${theme.colors.background.white};
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  box-shadow: ${theme.shadows.card};
  transition: all ${theme.transitions.smooth};
  ${revealUp}
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadows.cardHover};
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
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.7;
`;

// =============================================
// 8. TEMOIGNAGES
// =============================================

const TestimonialsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin: 0 auto;
  }
`;

const TestimonialCard = styled.div<{ $visible: boolean; $delay: string }>`
  background: ${theme.colors.background.white};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0,0,0,0.04);
  transition: all ${theme.transitions.smooth};
  position: relative;
  ${revealUp}
  transition-delay: ${p => p.$delay};

  &::before {
    content: '"';
    position: absolute;
    top: 16px;
    right: 20px;
    font-size: 4rem;
    font-family: Georgia, serif;
    color: ${theme.colors.accent.lightCoral};
    opacity: 0.3;
    line-height: 1;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.cardHover};
  }
`;

const StarRating = styled.div`
  color: #F5A623;
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.md};
  letter-spacing: 2px;
`;

const TestimonialText = styled.p`
  font-style: italic;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.base};
  line-height: 1.7;
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
`;

// =============================================
// 9. FAQ
// =============================================

const FAQSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: ${theme.colors.background.white};
`;

// =============================================
// 10. CTA FINAL
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

const slidesData = [
  {
    label: 'Personnaliser',
    stepLabel: 'Etape 1',
    title: 'Personnalisez votre conte',
    subtitle: 'Choisissez le theme, ajoutez le prenom et la photo de votre enfant. Chaque detail rend l\'histoire unique.',
    bgColor: `${theme.colors.accent.paleYellow}35`,
    illustrationId: 'customize' as const
  },
  {
    label: 'Commander',
    stepLabel: 'Etape 2',
    title: 'Commandez en un clic',
    subtitle: 'Paiement rapide et securise. eBook a 4,99€, ou rejoignez le Club pour 1 eBook gratuit par semaine.',
    bgColor: `${theme.colors.accent.softPink}25`,
    illustrationId: 'order' as const
  },
  {
    label: 'Recevoir',
    stepLabel: 'Etape 3',
    title: 'Recevez votre eBook',
    subtitle: 'Votre conte personnalise arrive dans la journee, directement dans votre bibliotheque et par email.',
    bgColor: `${theme.colors.accent.pastelBlue}25`,
    illustrationId: 'receive' as const
  }
];

// SVG illustrations style conte enfant
const StepIllustration: React.FC<{ id: 'customize' | 'order' | 'receive'; size?: number }> = ({ id, size = 105 }) => {
  if (id === 'customize') {
    return (
      <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
        {/* Livre ouvert */}
        <rect x="10" y="25" width="32" height="44" rx="3" fill={theme.colors.accent.coral} opacity="0.85" />
        <rect x="48" y="25" width="32" height="44" rx="3" fill={theme.colors.accent.coralDark} opacity="0.7" />
        <rect x="12" y="27" width="28" height="40" rx="2" fill="#FFF" opacity="0.9" />
        <rect x="50" y="27" width="28" height="40" rx="2" fill="#FFF" opacity="0.85" />
        {/* Lignes de texte */}
        <rect x="16" y="34" width="20" height="2.5" rx="1" fill={theme.colors.accent.coral} opacity="0.3" />
        <rect x="16" y="40" width="16" height="2.5" rx="1" fill={theme.colors.accent.coral} opacity="0.25" />
        <rect x="16" y="46" width="18" height="2.5" rx="1" fill={theme.colors.accent.coral} opacity="0.2" />
        {/* Photo placeholder sur page droite */}
        <rect x="54" y="32" width="20" height="16" rx="3" fill={theme.colors.accent.paleYellow} />
        <circle cx="64" cy="38" r="4" fill={theme.colors.accent.coral} opacity="0.5" />
        {/* Etoiles decoratives */}
        <circle cx="20" cy="14" r="3" fill={theme.colors.accent.paleYellow} />
        <circle cx="72" cy="18" r="2.5" fill={theme.colors.accent.softPink} />
        <circle cx="50" cy="10" r="2" fill={theme.colors.accent.lightGreen} />
        {/* Crayon */}
        <rect x="68" y="52" width="4" height="18" rx="1" fill={theme.colors.accent.pastelBlue} transform="rotate(-20 70 61)" />
        <polygon points="66,68 70,70 68,72" fill={theme.colors.accent.paleYellow} transform="rotate(-20 68 70)" />
      </svg>
    );
  }

  if (id === 'order') {
    return (
      <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
        {/* Bouton / carte de paiement */}
        <rect x="15" y="22" width="60" height="40" rx="10" fill={theme.colors.accent.coral} opacity="0.85" />
        <rect x="19" y="26" width="52" height="32" rx="7" fill="#FFF" opacity="0.15" />
        {/* Symbole check au centre */}
        <circle cx="45" cy="42" r="14" fill="#FFF" opacity="0.95" />
        <path d="M37 42 L42 47 L53 36" stroke={theme.colors.accent.lightGreen} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Petites etoiles / confettis */}
        <circle cx="22" cy="14" r="3" fill={theme.colors.accent.paleYellow} />
        <circle cx="70" cy="12" r="2.5" fill={theme.colors.accent.softPink} />
        <circle cx="12" cy="50" r="2" fill={theme.colors.accent.pastelBlue} />
        <circle cx="78" cy="48" r="2.5" fill={theme.colors.accent.lightGreen} />
        {/* Petit cadenas securite */}
        <rect x="58" y="56" width="14" height="11" rx="3" fill={theme.colors.accent.pastelBlue} opacity="0.8" />
        <path d="M61 56 V52 A4 4 0 0 1 69 52 V56" stroke={theme.colors.accent.pastelBlue} strokeWidth="2" fill="none" opacity="0.8" />
        {/* Eclair rapidite */}
        <polygon points="28,68 34,68 32,74 38,74 26,84 30,76 24,76" fill={theme.colors.accent.paleYellow} opacity="0.9" />
      </svg>
    );
  }

  // receive
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
      {/* Enveloppe */}
      <rect x="12" y="30" width="50" height="35" rx="5" fill={theme.colors.accent.pastelBlue} opacity="0.8" />
      <path d="M12 35 L37 52 L62 35" stroke="#FFF" strokeWidth="2.5" fill="none" opacity="0.7" />
      {/* Livre sortant de l'enveloppe */}
      <rect x="22" y="18" width="30" height="22" rx="3" fill={theme.colors.accent.coral} opacity="0.85" />
      <rect x="24" y="20" width="26" height="18" rx="2" fill="#FFF" opacity="0.9" />
      <rect x="28" y="24" width="18" height="2" rx="1" fill={theme.colors.accent.coral} opacity="0.3" />
      <rect x="28" y="29" width="14" height="2" rx="1" fill={theme.colors.accent.coral} opacity="0.25" />
      <rect x="28" y="34" width="10" height="2" rx="1" fill={theme.colors.accent.coral} opacity="0.2" />
      {/* Coeur */}
      <path d="M72 28 C72 24, 78 24, 78 28 C78 24, 84 24, 84 28 C84 34, 78 38, 78 38 C78 38, 72 34, 72 28Z" fill={theme.colors.accent.softPink} opacity="0.7" />
      {/* Etoiles decoratives */}
      <circle cx="75" cy="52" r="3" fill={theme.colors.accent.paleYellow} />
      <circle cx="8" cy="22" r="2.5" fill={theme.colors.accent.lightGreen} />
      <circle cx="68" cy="65" r="2" fill={theme.colors.accent.softPink} />
      {/* Etincelles autour du livre */}
      <circle cx="18" cy="16" r="2" fill={theme.colors.accent.paleYellow} opacity="0.8" />
      <circle cx="56" cy="14" r="1.5" fill={theme.colors.accent.pastelBlue} opacity="0.6" />
    </svg>
  );
};

const faqItems = [
  {
    id: '1',
    question: "Comment fonctionne la creation d'un conte personnalise ?",
    answer: "Vous remplissez un formulaire en quelques etapes : choix du theme, du style d'illustration, informations sur le protagoniste et upload de photo. Notre equipe cree ensuite un conte unique avec des illustrations personnalisees."
  },
  {
    id: '2',
    question: "Combien de temps faut-il pour recevoir mon conte ?",
    answer: "Le delai de creation est generalement de quelques jours ouvrables. Vous recevez une notification par email des que votre eBook est disponible dans votre bibliotheque."
  },
  {
    id: '3',
    question: "Qu'est-ce que le Club des Histoires Uniques ?",
    answer: "C'est un abonnement a 12,99€ par mois qui vous donne droit a 1 eBook personnalise gratuit chaque semaine, soit jusqu'a 4 contes par mois. Vous accedez aussi a votre bibliotheque personnelle avec visionneuse et telechargement. L'abonnement est sans engagement, annulable a tout moment."
  },
  {
    id: '4',
    question: "Comment fonctionne la bibliotheque personnelle ?",
    answer: "Chaque conte commande est stocke dans votre espace personnel. Vous pouvez le consulter en ligne via notre visionneuse integree, le telecharger en PDF, et y acceder depuis n'importe quel appareil. C'est votre casier numerique de contes."
  },
  {
    id: '5',
    question: "Les contes sont-ils adaptes a tous les ages ?",
    answer: "Oui ! Vous choisissez la tranche d'age lors de la commande (0-2 ans, 3-5 ans, 6-9 ans, 10+ ans) et le contenu s'adapte automatiquement au niveau de lecture et aux centres d'interet correspondants."
  },
  {
    id: '6',
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer: "Nous offrons une garantie satisfaction. Si le conte ne vous convient pas, nous le modifions gratuitement ou vous remboursons integralement. Votre satisfaction est notre priorite."
  },
  {
    id: '7',
    question: "Puis-je offrir un conte en cadeau ?",
    answer: "Absolument ! Un conte personnalise fait un cadeau original et memorable pour un anniversaire, Noel ou toute autre occasion speciale. Il suffit de renseigner les informations de l'enfant a qui vous souhaitez l'offrir."
  }
];

const testimonials = [
  {
    stars: 5,
    text: "Ma fille de 5 ans adore son conte personnalise ! Elle se reconnait dans l'heroine et redemande l'histoire tous les soirs. Un cadeau magique !",
    author: 'Sophie M.',
    detail: 'Maman de Lea'
  },
  {
    stars: 5,
    text: "Depuis qu'on est au Club, on recoit un nouveau conte chaque semaine. Les enfants n'ont jamais autant lu ! La bibliotheque en ligne est tres pratique.",
    author: 'Marc D.',
    detail: 'Papa de Thomas et Nina'
  },
  {
    stars: 5,
    text: "La qualite des illustrations est bluffante. Mon fils etait emerveille de se voir en heros de sa propre aventure. Je recommande vivement !",
    author: 'Julie L.',
    detail: "Maman d'Emma"
  }
];

// =============================================
// COMPONENT
// =============================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [stepKey, setStepKey] = useState(0);
  const [activeExample, setActiveExample] = useState(0);
  const [exampleKey, setExampleKey] = useState(0);

  // Scroll reveal hooks
  const stepsReveal = useScrollReveal();
  const examplesReveal = useScrollReveal();
  const clubReveal = useScrollReveal();
  const libraryReveal = useStaggerReveal(3);
  const pricingReveal = useScrollReveal();
  const featuresReveal = useStaggerReveal(3);
  const testimonialsReveal = useStaggerReveal(3);
  const faqReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

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

  // Auto-play des exemples
  const allStories = exampleStories;
  useEffect(() => {
    if (!examplesReveal.isVisible) return;
    const timer = setInterval(() => {
      setActiveExample(prev => {
        const next = (prev + 1) % allStories.length;
        setExampleKey(k => k + 1);
        return next;
      });
    }, EXAMPLE_DURATION);
    return () => clearInterval(timer);
  }, [examplesReveal.isVisible, allStories.length]);

  const goToExample = (index: number) => {
    setActiveExample(index);
    setExampleKey(k => k + 1);
  };

  useEffect(() => {
    document.title = "Creez un conte personnalise avec l'IA | Contes d'IA";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Offrez a votre enfant un livre unique et magique ! Creez facilement un conte personnalise avec l'intelligence artificielle. Rejoignez le Club pour 1 eBook gratuit par semaine.");
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = "Offrez a votre enfant un livre unique et magique ! Creez facilement un conte personnalise avec l'intelligence artificielle. Rejoignez le Club pour 1 eBook gratuit par semaine.";
      document.head.appendChild(meta);
    }
  }, []);

  const handleViewExample = (story?: any) => {
    if (story && story.pdfUrl) {
      window.open(story.pdfUrl, '_blank');
    } else {
      window.open('/pdfs/exemple-conte.pdf', '_blank');
    }
  };

  return (
    <PageContainer>
      <Header />
      <main>

        {/* ============ 1. HERO ============ */}
        <HeroSection>
          <HeroDecoCircle $size={400} $top="-10%" $left="-5%" $opacity={0.04} />
          <HeroDecoCircle $size={250} $top="60%" $left="85%" $opacity={0.05} />

          <HeroContent>
            <HeroTextBlock>
              <HeroBadge>Nouveau : Club des Histoires Uniques</HeroBadge>
              <HeroTitle>
                Votre enfant, <span>heros</span> de son propre conte
              </HeroTitle>
              <HeroSubtitle>
                Creez un livre personnalise unique grace a l'IA : prenom, photo, theme et message educatif sur mesure. En eBook ou via le Club.
              </HeroSubtitle>
              <CTAButtons>
                <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
                  Commencer mon conte
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/club')}>
                  Decouvrir le Club
                </Button>
              </CTAButtons>
              <TrustRow>
                <TrustItem>
                  <span>&#10003;</span> Paiement securise
                </TrustItem>
                <TrustItem>
                  <span>&#10003;</span> Satisfait ou rembourse
                </TrustItem>
                <TrustItem>
                  <span>&#10003;</span> Sans engagement
                </TrustItem>
              </TrustRow>
            </HeroTextBlock>

            <HeroImageBlock>
              <HeroImage
                src="/images/homepage/hero-image.png"
                alt="Enfants decouvrant des contes magiques personnalises"
                width="1605"
                height="1152"
                fetchPriority="high"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </HeroImageBlock>
          </HeroContent>
        </HeroSection>

        {/* ============ 2. COMMENT CA MARCHE ============ */}
        <StepsSection ref={stepsReveal.ref}>
          <Container>
            <SectionWrapper $visible={stepsReveal.isVisible}>
              <SectionTitle>Comment ca marche ?</SectionTitle>
              <Divider />
            </SectionWrapper>

            <SectionWrapper $visible={stepsReveal.isVisible} $delay="200ms">
              <VideoShowcase>
                <VideoStage>
                  {/* Decorations fond */}
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

        {/* ============ 3. EXEMPLES ============ */}
        <ExamplesSection ref={examplesReveal.ref}>
          <Container>
            <SectionWrapper $visible={examplesReveal.isVisible}>
              <SectionTitle>Decouvrez nos contes personnalises</SectionTitle>
              <Divider />
              <SectionSubtitle>
                Chaque conte est une creation unique, adaptee a l'enfant qui le recoit.
              </SectionSubtitle>
            </SectionWrapper>

            <SectionWrapper $visible={examplesReveal.isVisible} $delay="200ms">
              <ExampleShowcase>
                <ExampleStage>
                  {allStories.map((story, i) => (
                    <ExampleSlide
                      key={story.id}
                      $active={activeExample === i}
                      $direction={i < activeExample ? 'exit' : i > activeExample ? 'enter' : 'idle'}
                    >
                      <ExampleCoverWrap
                        $active={activeExample === i}
                        key={`cover-${i}-${exampleKey}`}
                        onClick={() => handleViewExample(story)}
                      >
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          loading="lazy"
                          crossOrigin="anonymous"
                        />
                        <CoverOverlayHint>
                          <CoverHintText>Feuilleter le conte</CoverHintText>
                        </CoverOverlayHint>
                      </ExampleCoverWrap>

                      <ExampleInfoPanel $active={activeExample === i} key={`info-${i}-${exampleKey}`}>
                        <ExampleLabel>Conte exemple</ExampleLabel>
                        <ExampleTitle>{story.title}</ExampleTitle>
                        <ExampleTagsRow>
                          <ExampleTag $color={theme.colors.accent.coral}>{story.ageRange}</ExampleTag>
                          <ExampleTag $color={theme.colors.accent.pastelBlue}>{story.illustrationStyle}</ExampleTag>
                          <ExampleTag>{story.generalTheme}</ExampleTag>
                        </ExampleTagsRow>
                        <ExampleDescription>
                          L'histoire de {story.protagonistName}, {story.protagonistAge}, dans un univers {story.specificSubject.toLowerCase()}. Un conte sur le theme : {story.centralMessage.toLowerCase()}.
                          {story.secondaryCharacterName && ` Accompagne de ${story.secondaryCharacterName}.`}
                        </ExampleDescription>
                        <Button variant="primary" size="md" onClick={() => handleViewExample(story)}>
                          Lire ce conte
                        </Button>
                      </ExampleInfoPanel>
                    </ExampleSlide>
                  ))}
                </ExampleStage>

                <ExampleControls>
                  {allStories.map((story, i) => (
                    <ExampleDot
                      key={story.id}
                      $active={activeExample === i}
                      $completed={i < activeExample}
                      $duration={EXAMPLE_DURATION}
                      onClick={() => goToExample(i)}
                    >
                      <ExampleDotBar
                        key={`ebar-${i}-${exampleKey}`}
                        $active={activeExample === i}
                        $completed={i < activeExample}
                        $duration={EXAMPLE_DURATION}
                      />
                      <ExampleDotLabel $active={activeExample === i}>
                        {story.protagonistName}
                      </ExampleDotLabel>
                    </ExampleDot>
                  ))}
                </ExampleControls>
              </ExampleShowcase>
            </SectionWrapper>
          </Container>
        </ExamplesSection>

        {/* ============ 4. CLUB DES HISTOIRES UNIQUES ============ */}
        <ClubSection ref={clubReveal.ref}>
          <Container>
            <ClubGrid>
              <ClubTextBlock $visible={clubReveal.isVisible}>
                <ClubBadge>Nouveau</ClubBadge>
                <ClubTitle>Le Club des Histoires Uniques</ClubTitle>
                <ClubPrice>
                  12,99€<small> / mois</small>
                </ClubPrice>
                <ClubDescription>
                  Recevez chaque semaine un eBook personnalise pour votre enfant. Jusqu'a 4 contes par mois, accessibles dans votre bibliotheque personnelle.
                </ClubDescription>
                <ClubFeatures>
                  <ClubFeature>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    1 eBook gratuit par semaine
                  </ClubFeature>
                  <ClubFeature>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    Bibliotheque personnelle avec visionneuse
                  </ClubFeature>
                  <ClubFeature>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    Telechargement PDF illimite
                  </ClubFeature>
                  <ClubFeature>
                    <FeatureCheck>&#10003;</FeatureCheck>
                    Sans engagement — annulable a tout moment
                  </ClubFeature>
                </ClubFeatures>
                <Button variant="primary" size="lg" onClick={() => navigate('/club')}>
                  Decouvrir le Club
                </Button>
              </ClubTextBlock>

              <ClubVisualBlock $visible={clubReveal.isVisible}>
                <ClubCard>
                  <ClubCardIcon>📚</ClubCardIcon>
                  <ClubCardTitle>Votre semaine type</ClubCardTitle>
                  <ClubCardText>
                    Un nouveau conte personnalise chaque semaine, cree sur mesure pour votre enfant.
                  </ClubCardText>
                  <ClubCardFeatureList>
                    <ClubCardFeatureItem>Vous personnalisez votre conte</ClubCardFeatureItem>
                    <ClubCardFeatureItem>Votre eBook est pret dans la journee</ClubCardFeatureItem>
                    <ClubCardFeatureItem>Notification email + bibliotheque</ClubCardFeatureItem>
                    <ClubCardFeatureItem>Lecture en ligne ou telechargement</ClubCardFeatureItem>
                  </ClubCardFeatureList>
                  <div style={{
                    padding: `${theme.spacing.md}`,
                    background: `${theme.colors.accent.paleYellow}40`,
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.fontSizes.sm,
                    color: theme.colors.text.secondary,
                    textAlign: 'center',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: theme.colors.text.primary }}>Jusqu'a 4 contes / mois</strong><br />
                    soit 3,25€ par conte au lieu de 4,99€
                  </div>
                </ClubCard>
              </ClubVisualBlock>
            </ClubGrid>
          </Container>
        </ClubSection>

        {/* ============ 5. BIBLIOTHEQUE ============ */}
        <LibrarySection ref={libraryReveal.ref}>
          <Container>
            <SectionWrapper $visible={libraryReveal.isVisible}>
              <SectionTitle>Votre bibliotheque personnelle</SectionTitle>
              <Divider />
              <SectionSubtitle>
                Tous vos contes au meme endroit. Consultez, relisez et telechargez a tout moment.
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
                <LibraryCardTitle>Telechargement PDF</LibraryCardTitle>
                <LibraryCardText>
                  Telecharger vos eBooks en PDF haute qualite, a tout moment. Imprimez-les ou lisez-les hors ligne.
                </LibraryCardText>
              </LibraryCard>

              <LibraryCard $visible={libraryReveal.isVisible} $delay={libraryReveal.getDelay(2)}>
                <LibraryIcon style={{ background: `linear-gradient(135deg, ${theme.colors.accent.pastelBlue}, ${theme.colors.accent.softPink})` }}>
                  📬
                </LibraryIcon>
                <LibraryCardTitle>Notification par email</LibraryCardTitle>
                <LibraryCardText>
                  Recevez un email avec votre eBook en piece jointe des qu'il est disponible, ainsi qu'un lien direct vers votre bibliotheque.
                </LibraryCardText>
              </LibraryCard>
            </LibraryGrid>
          </Container>
        </LibrarySection>

        {/* ============ 6. TARIFS ============ */}
        <PricingSection id="tarifs" ref={pricingReveal.ref}>
          <Container>
            <SectionWrapper $visible={pricingReveal.isVisible}>
              <SectionTitle>Nos tarifs</SectionTitle>
              <Divider />
              <SectionSubtitle>
                Un conte unique pour chaque enfant. Choisissez la formule qui vous convient.
              </SectionSubtitle>
            </SectionWrapper>

            <PricingGrid>
              <PricingCard
                title="eBook Numerique"
                price="4,99€"
                features={[
                  'Conte personnalise de 20 pages',
                  'Illustrations sur mesure',
                  'Format PDF haute qualite',
                  'Disponible dans votre bibliotheque',
                  'Compatible tous appareils'
                ]}
                ctaText="Commander l'eBook"
                onSelect={() => navigate('/create-story')}
              />

              <PricingCard
                title="Club des Histoires"
                price="12,99€/mois"
                features={[
                  '1 eBook gratuit par semaine',
                  "Jusqu'a 4 contes par mois",
                  'Bibliotheque avec visionneuse',
                  'Telechargement PDF illimite',
                  'Sans engagement',
                  'Soit 3,25€ par conte'
                ]}
                isPopular={true}
                badge="Meilleure offre"
                subtitle="Soit ~3,25EUR par conte"
                ctaText="Decouvrir le Club"
                onSelect={() => navigate('/club')}
              />

            </PricingGrid>
          </Container>
        </PricingSection>

        {/* ============ 7. POURQUOI CHOISIR ============ */}
        <FeaturesSection ref={featuresReveal.ref}>
          <Container>
            <SectionWrapper $visible={featuresReveal.isVisible}>
              <SectionTitle>Pourquoi choisir Contes d'IA ?</SectionTitle>
              <Divider />
            </SectionWrapper>

            <FeaturesGrid>
              <FeatureCard $visible={featuresReveal.isVisible} $delay={featuresReveal.getDelay(0)}>
                <FeatureIcon>
                  <FeatureImage
                    src="/images/homepage/feature-personnalisation.png"
                    alt="Personnalisation complete"
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
                <FeatureTitle>Personnalisation complete</FeatureTitle>
                <FeatureDescription>
                  Theme, personnages, style d'illustration, message educatif... chaque detail est choisi par vous pour creer un conte qui ressemble a votre enfant.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard $visible={featuresReveal.isVisible} $delay={featuresReveal.getDelay(1)}>
                <FeatureIcon>
                  <FeatureImage
                    src="/images/homepage/feature-qualite.png"
                    alt="Qualite professionnelle"
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
                <FeatureTitle>Qualite professionnelle</FeatureTitle>
                <FeatureDescription>
                  eBook haute qualite cree avec soin. Chaque conte est concu pour offrir une experience de lecture exceptionnelle.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard $visible={featuresReveal.isVisible} $delay={featuresReveal.getDelay(2)}>
                <FeatureIcon>
                  <FeatureImage
                    src="/images/homepage/feature-livraison.png"
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
                <FeatureTitle>Livraison instantanee</FeatureTitle>
                <FeatureDescription>
                  Votre conte est disponible dans votre bibliotheque et par email des qu'il est pret. Telechargez-le immediatement en PDF.
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </Container>
        </FeaturesSection>

        {/* ============ 8. TEMOIGNAGES ============ */}
        <TestimonialsSection ref={testimonialsReveal.ref}>
          <Container>
            <SectionWrapper $visible={testimonialsReveal.isVisible}>
              <SectionTitle>Ce que disent nos clients</SectionTitle>
              <Divider />
            </SectionWrapper>

            <TestimonialGrid>
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={i}
                  $visible={testimonialsReveal.isVisible}
                  $delay={testimonialsReveal.getDelay(i)}
                >
                  <StarRating>{'★'.repeat(t.stars)}</StarRating>
                  <TestimonialText>"{t.text}"</TestimonialText>
                  <TestimonialAuthor>
                    {t.author} <span style={{ color: theme.colors.text.light, fontWeight: 400 }}>— {t.detail}</span>
                  </TestimonialAuthor>
                </TestimonialCard>
              ))}
            </TestimonialGrid>
          </Container>
        </TestimonialsSection>

        {/* ============ 9. FAQ ============ */}
        <FAQSection ref={faqReveal.ref}>
          <Container>
            <SectionWrapper $visible={faqReveal.isVisible}>
              <SectionTitle>Questions frequentes</SectionTitle>
              <Divider />
            </SectionWrapper>
            <SectionWrapper $visible={faqReveal.isVisible} $delay="200ms">
              <Accordion items={faqItems} />
            </SectionWrapper>
          </Container>
        </FAQSection>

        {/* ============ 10. CTA FINAL ============ */}
        <FinalCTASection ref={ctaReveal.ref}>
          <Container>
            <SectionWrapper $visible={ctaReveal.isVisible}>
              <FinalCTATitle>Pret a creer un conte magique ?</FinalCTATitle>
              <FinalCTAText>
                Offrez a votre enfant une histoire unique dont il est le heros. Commencez maintenant ou rejoignez le Club.
              </FinalCTAText>
              <FinalCTAButtons>
                <WhiteButton onClick={() => navigate('/create-story')}>
                  Commencer mon conte
                </WhiteButton>
                <GhostWhiteButton onClick={() => {
                  document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Decouvrir les tarifs
                </GhostWhiteButton>
              </FinalCTAButtons>
            </SectionWrapper>
          </Container>
        </FinalCTASection>

      </main>
      <Footer />

    </PageContainer>
  );
};
