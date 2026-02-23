import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

/* ══════════════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════════════ */

export const slideOutLeft = keyframes`
  to { transform: translateX(-60px); opacity: 0; }
`;
export const slideInFromRight = keyframes`
  from { transform: translateX(60px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;
export const slideOutRight = keyframes`
  to { transform: translateX(60px); opacity: 0; }
`;
export const slideInFromLeft = keyframes`
  from { transform: translateX(-60px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slowZoom = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.015); }
`;

const ctaPulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }
  50%      { transform: scale(1.02); box-shadow: 0 6px 28px ${theme.colors.accent.coral}55; }
`;

const cardReveal = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const pricingShimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

/* ══════════════════════════════════════════════
   WIZARD LAYOUT
   ══════════════════════════════════════════════ */

export const WizardOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: ${theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
`;

export const WizardHeader = styled.header`
  position: relative;
  z-index: 10;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0,0,0,0.04);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    min-height: 46px;
  }
`;

export const BackArrow = styled.button<{ $visible: boolean }>`
  position: absolute;
  left: ${theme.spacing.lg};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  transition: all 0.2s ease;
  opacity: ${p => p.$visible ? 1 : 0};
  pointer-events: ${p => p.$visible ? 'auto' : 'none'};
  &:hover { background: ${theme.colors.background.secondary}; color: ${theme.colors.text.primary}; }
  @media (max-width: ${theme.breakpoints.sm}) { left: ${theme.spacing.sm}; }
`;

export const WizardTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.sm}; }
`;

export const ProgressTrack = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: ${theme.colors.background.secondary};
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: 0 4px 4px 0;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const WizardViewport = styled.div`
  flex: 1; position: relative; overflow: hidden;
`;

/* ══════════════════════════════════════════════
   STEP CONTAINERS
   ══════════════════════════════════════════════ */

const stepAnimation = css<{ $state: 'entering' | 'active' | 'exiting'; $direction: 'forward' | 'backward' }>`
  ${p => {
    if (p.$state === 'entering') {
      const anim = p.$direction === 'forward' ? slideInFromRight : slideInFromLeft;
      return css`animation: ${anim} 350ms cubic-bezier(0.4,0,0.2,1) forwards; pointer-events: none;`;
    }
    if (p.$state === 'exiting') {
      const anim = p.$direction === 'forward' ? slideOutLeft : slideOutRight;
      return css`animation: ${anim} 350ms cubic-bezier(0.4,0,0.2,1) forwards; pointer-events: none;`;
    }
    return css`pointer-events: auto;`;
  }}
`;

export const StepContainer = styled.div<{
  $state: 'entering' | 'active' | 'exiting';
  $direction: 'forward' | 'backward';
}>`
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center;
  padding: ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing['2xl']};
  overflow-y: auto; overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  will-change: transform, opacity;
  ${stepAnimation}
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.xl};
  }
`;

export const StepContainerCentered = styled(StepContainer)`
  &::before, &::after {
    content: '';
    flex: 1;
  }
`;

export const StepContainerTop = styled(StepContainer)`
  justify-content: flex-start;
`;

/* ══════════════════════════════════════════════
   STEP TITLE & SUBTITLE
   ══════════════════════════════════════════════ */

export const StepTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  text-align: center;
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
    margin-bottom: ${theme.spacing.sm};
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: 2rem;
    margin-bottom: ${theme.spacing.lg};
  }
`;

export const StepSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.lg};
  max-width: 400px; line-height: 1.5;
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    margin-bottom: ${theme.spacing.md};
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.base};
    max-width: 520px;
    margin-bottom: ${theme.spacing.xl};
  }
`;

/* ══════════════════════════════════════════════
   IMAGE CARD — All image-based selections
   ══════════════════════════════════════════════ */

export const CardGrid = styled.div<{ $columns?: number; $compact?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$columns || 2}, 1fr);
  gap: ${p => p.$compact ? '6px' : theme.spacing.sm};
  width: 100%;
  max-width: ${p => (p.$columns || 2) >= 3 ? '560px' : '380px'};
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(${p => p.$compact ? 3 : 2}, 1fr);
    gap: ${p => p.$compact ? '4px' : '6px'}; max-width: 100%;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: ${p => {
      const cols = p.$columns || 2;
      if (cols >= 5) return '920px';
      if (cols >= 4) return '800px';
      if (cols >= 3) return '660px';
      return '560px';
    }};
    gap: ${p => p.$compact ? '14px' : theme.spacing.lg};
  }
`;

export const ImageCard = styled.button<{ $isSelected: boolean; $delay?: number }>`
  position: relative;
  display: flex; flex-direction: column;
  border: 2.5px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'rgba(0,0,0,0.04)'};
  border-radius: 12px;
  overflow: hidden; cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  -webkit-tap-highlight-color: transparent;
  animation: ${cardReveal} 0.4s cubic-bezier(0.34,1.56,0.64,1) ${p => (p.$delay || 0) * 0.06}s both;
  ${p => p.$isSelected && css`
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}20, 0 4px 16px rgba(0,0,0,0.08);
  `}
  &:active { transform: scale(0.96); }
  @media (min-width: ${theme.breakpoints.lg}) {
    border-radius: 14px;
    &:hover { transform: scale(1.04); box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
  }
`;

export const CardImg = styled.div<{ $src: string }>`
  width: 100%;
  aspect-ratio: 1;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
  animation: ${slowZoom} 10s ease-in-out infinite;
`;

export const CardImgLabel = styled.span`
  padding: 6px 4px;
  font-family: ${theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  color: ${theme.colors.text.primary};
  line-height: 1.2;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 10px; padding: 4px 2px; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 14px; padding: 10px 6px; }
`;

/* ══════════════════════════════════════════════
   TEXT CARD — Gender, Language, Religion
   ══════════════════════════════════════════════ */

export const TextCard = styled.button<{ $isSelected: boolean; $bg?: string; $delay?: number }>`
  display: flex; align-items: center; justify-content: center;
  padding: 14px 12px;
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'rgba(0,0,0,0.06)'};
  border-radius: 12px;
  background: ${p => p.$isSelected ? theme.colors.accent.creamyYellow : (p.$bg || 'white')};
  cursor: pointer; transition: all 0.2s ease;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;
  animation: ${cardReveal} 0.35s ease ${p => (p.$delay || 0) * 0.06}s both;
  ${p => p.$isSelected && css`box-shadow: 0 0 0 3px ${theme.colors.accent.coral}20;`}
  &:active { transform: scale(0.96); }
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 10px 8px; font-size: ${theme.fontSizes.xs}; min-height: 42px;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 16px 24px; font-size: ${theme.fontSizes.base}; min-height: 56px; border-radius: 14px;
    &:hover { transform: scale(1.03); box-shadow: ${theme.shadows.md}; }
  }
`;

/* ══════════════════════════════════════════════
   COLOR CARDS — Eye/hair
   ══════════════════════════════════════════════ */

export const ColorCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.sm};
  width: 100%; max-width: 380px;
  @media (max-width: ${theme.breakpoints.sm}) { gap: 6px; max-width: 100%; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 520px; gap: ${theme.spacing.md}; }
`;

export const ColorCard = styled.button<{ $isSelected: boolean; $color: string }>`
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: ${theme.spacing.sm};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'rgba(0,0,0,0.06)'};
  border-radius: 10px;
  background: ${p => p.$isSelected ? theme.colors.accent.creamyYellow : 'white'};
  cursor: pointer; transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  ${p => p.$isSelected && css`box-shadow: 0 0 0 3px ${theme.colors.accent.coral}20;`}
  &:active { transform: scale(0.95); }
`;

export const ColorBubble = styled.div<{ $color: string; $isSelected: boolean }>`
  width: 36px; height: 36px;
  border-radius: ${theme.borderRadius.full};
  background: ${p => p.$color};
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: 0 2px 8px ${p => p.$color}40, inset 0 -2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  animation: ${breathe} 3s ease-in-out infinite;
  ${p => p.$isSelected && css`transform: scale(1.1); box-shadow: 0 2px 12px ${p.$color}60;`}
  @media (max-width: ${theme.breakpoints.sm}) { width: 30px; height: 30px; }
  @media (min-width: ${theme.breakpoints.lg}) { width: 48px; height: 48px; }
`;

export const ColorLabel = styled.span`
  font-size: ${theme.fontSizes.xs}; color: ${theme.colors.text.primary}; font-weight: 500; text-align: center;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 10px; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.sm}; }
`;

export const ColorSectionLabel = styled.h4`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm}; font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm}; text-align: center;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.xs}; margin-bottom: 6px; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.base}; margin-bottom: ${theme.spacing.md}; }
`;

/* ══════════════════════════════════════════════
   INPUT FIELDS
   ══════════════════════════════════════════════ */

export const InputRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md}; width: 100%; max-width: 420px;
  margin-bottom: ${theme.spacing.md};
  @media (max-width: ${theme.breakpoints.sm}) { grid-template-columns: 1fr; gap: ${theme.spacing.sm}; margin-bottom: ${theme.spacing.sm}; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 540px; gap: ${theme.spacing.lg}; }
`;

export const InputField = styled.div`display: flex; flex-direction: column; min-width: 0;`;

export const CustomInput = styled.input`
  width: 100%; max-width: 420px;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB; border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base}; font-family: ${theme.fonts.body};
  margin-top: ${theme.spacing.md}; transition: border-color 0.2s ease; box-sizing: border-box;
  animation: ${fadeIn} 0.3s ease;
  &:focus { outline: none; border-color: ${theme.colors.accent.coral}; box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15; }
  &::placeholder { color: ${theme.colors.text.light}; }
  @media (max-width: 480px) { font-size: 16px; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 540px; }
`;

export const TextArea = styled.textarea`
  width: 100%; max-width: 420px;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB; border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base}; font-family: ${theme.fonts.body};
  resize: vertical; min-height: 70px; transition: border-color 0.2s ease; box-sizing: border-box;
  &:focus { outline: none; border-color: ${theme.colors.accent.coral}; box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15; }
  &::placeholder { color: ${theme.colors.text.light}; }
  @media (max-width: 480px) { font-size: 16px; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 540px; }
`;

/* ══════════════════════════════════════════════
   PHOTO UPLOAD
   ══════════════════════════════════════════════ */

export const PhotoUploadZone = styled.div<{ $hasPhoto: boolean }>`
  border: 2px dashed ${p => p.$hasPhoto ? theme.colors.accent.coral : '#D1D5DB'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  text-align: center; width: 100%; max-width: 360px;
  cursor: pointer; transition: all 0.2s ease;
  background: ${p => p.$hasPhoto
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}40, ${theme.colors.accent.lightCoral}15)`
    : theme.colors.background.secondary};
  &:hover { border-color: ${theme.colors.accent.coral}; box-shadow: ${theme.shadows.md}; }
`;
export const PhotoIcon = styled.div`font-size: 2.5rem; margin-bottom: ${theme.spacing.sm};`;
export const PhotoMainText = styled.p`font-size: ${theme.fontSizes.sm}; font-weight: 600; color: ${theme.colors.text.primary}; margin: 0 0 4px;`;
export const PhotoSubText = styled.p`font-size: ${theme.fontSizes.xs}; color: ${theme.colors.text.secondary}; margin: 0; line-height: 1.4;`;
export const HiddenFileInput = styled.input`display: none;`;

/* ══════════════════════════════════════════════
   BUTTONS
   ══════════════════════════════════════════════ */

export const ContinueButton = styled.button<{ $isReady: boolean }>`
  display: block; width: 100%; max-width: 320px;
  margin: ${theme.spacing.lg} auto 0; padding: 14px ${theme.spacing.xl};
  border: none; border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.base}; font-weight: 700;
  color: #fff; cursor: pointer; transition: all 0.3s ease;
  background: ${p => p.$isReady
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : '#D1D5DB'};
  ${p => p.$isReady && css`&:hover { transform: scale(1.02); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }`}
  &:disabled { cursor: not-allowed; opacity: 0.5; }
  @media (max-width: ${theme.breakpoints.sm}) { max-width: 100%; font-size: ${theme.fontSizes.sm}; padding: 12px; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 380px; font-size: ${theme.fontSizes.lg}; padding: 16px; }
`;

export const SkipLink = styled.button`
  display: block; margin: ${theme.spacing.md} auto 0; padding: ${theme.spacing.sm};
  background: none; border: none; cursor: pointer;
  font-family: ${theme.fonts.body}; font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light}; font-weight: 500; transition: color 0.2s ease;
  &:hover { color: ${theme.colors.accent.coral}; }
`;

export const ChoiceCard = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  width: 100%; max-width: 340px;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 440px; padding: ${theme.spacing['2xl']} ${theme.spacing.xl}; }
  border: 2px solid ${p => p.$variant === 'primary' ? theme.colors.accent.coral : 'rgba(0,0,0,0.08)'};
  border-radius: ${theme.borderRadius.xl};
  cursor: pointer; transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  background: ${p => p.$variant === 'primary'
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : 'white'};
  ${p => p.$variant === 'primary' && css`animation: ${ctaPulse} 2.5s ease-in-out infinite; color: white;`}
  ${p => p.$variant === 'secondary' && css`
    color: ${theme.colors.text.primary}; box-shadow: ${theme.shadows.sm};
    &:hover { border-color: ${theme.colors.accent.lightCoral}; box-shadow: ${theme.shadows.md}; }
  `}
  &:active { transform: scale(0.97); }
`;

export const ChoiceTitle = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.lg}; font-weight: 700;
  color: ${p => p.$variant === 'primary' ? 'white' : theme.colors.text.primary}; text-align: center;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.base}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.xl}; }
`;

export const ChoiceDesc = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-size: ${theme.fontSizes.xs};
  color: ${p => p.$variant === 'primary' ? 'rgba(255,255,255,0.85)' : theme.colors.text.secondary};
  text-align: center;
`;

export const DiscoverCTA = styled.button`
  display: block; width: 100%; max-width: 380px;
  margin: 0 auto; padding: ${theme.spacing.md} ${theme.spacing.xl};
  border: none; border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.lg}; font-weight: 700;
  color: #fff; cursor: pointer; transition: all 0.3s ease;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  animation: ${ctaPulse} 2.5s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
  &:hover { transform: scale(1.03); }
  &:active { transform: scale(0.98); }
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.base}; padding: 14px; max-width: 100%; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 440px; font-size: ${theme.fontSizes.xl}; padding: ${theme.spacing.lg}; }
`;

/* ══════════════════════════════════════════════
   EXTRAS SECTIONS
   ══════════════════════════════════════════════ */

export const ExtrasSection = styled.div`
  width: 100%; max-width: 420px; margin-bottom: ${theme.spacing.lg};
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 580px; margin-bottom: ${theme.spacing.xl}; }
`;

export const SectionTitle = styled.h4`
  font-family: ${theme.fonts.body}; font-size: ${theme.fontSizes.sm}; font-weight: 600;
  color: ${theme.colors.text.primary}; margin: 0 0 ${theme.spacing.sm};
`;

export const CollapsiblePill = styled.button<{ $isOpen: boolean }>`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px ${theme.spacing.md};
  border: 1.5px solid ${p => p.$isOpen ? theme.colors.accent.coral : '#E5E7EB'};
  border-radius: ${theme.borderRadius.full};
  background: ${p => p.$isOpen ? theme.colors.accent.creamyYellow : 'transparent'};
  color: ${p => p.$isOpen ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-family: ${theme.fonts.body}; font-size: ${theme.fontSizes.xs}; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
  margin-bottom: ${theme.spacing.xs}; -webkit-tap-highlight-color: transparent;
  &:hover { border-color: ${theme.colors.accent.coral}; color: ${theme.colors.accent.coral}; }
`;

export const CollapsibleChevron = styled.span<{ $isOpen: boolean }>`
  font-size: 0.6rem; transition: transform 0.3s ease;
  transform: ${p => p.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

export const CollapsibleContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${p => p.$isOpen ? '2000px' : '0'};
  overflow: hidden; transition: max-height 0.4s ease;
  margin-top: ${p => p.$isOpen ? theme.spacing.sm : '0'}; width: 100%;
`;

/* ══════════════════════════════════════════════
   COMPACT PRICING
   ══════════════════════════════════════════════ */

export const PricingRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm}; width: 100%; max-width: 500px;
  margin-bottom: ${theme.spacing.md}; align-items: stretch;
  @media (max-width: ${theme.breakpoints.sm}) { gap: 8px; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 680px; gap: ${theme.spacing.xl}; }
`;

export const PricingOption = styled.div<{ $isSelected: boolean }>`
  position: relative;
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'rgba(0,0,0,0.06)'};
  border-radius: 16px; padding: ${theme.spacing.lg} ${theme.spacing.md};
  cursor: pointer; transition: all 0.3s ease;
  background: ${p => p.$isSelected ? 'linear-gradient(160deg, #FFF8F5, #FFF)' : 'white'};
  overflow: hidden; -webkit-tap-highlight-color: transparent;
  ${p => p.$isSelected && css`box-shadow: 0 4px 20px ${theme.colors.accent.coral}18;`}
  &:hover { border-color: ${theme.colors.accent.coral}80; }
  &:active { transform: scale(0.98); }
  @media (max-width: ${theme.breakpoints.sm}) { padding: ${theme.spacing.md} ${theme.spacing.sm}; border-radius: 14px; }
  @media (min-width: ${theme.breakpoints.lg}) { padding: ${theme.spacing.xl}; border-radius: 20px;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
  }
`;

export const PricingBadge = styled.span`
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink}, ${theme.colors.accent.coral});
  background-size: 200% 100%;
  animation: ${pricingShimmer} 3s linear infinite;
`;

export const PricingLabel = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  color: white; padding: 3px 10px; border-radius: 10px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.3px;
  margin-bottom: 8px;
`;

export const PricingName = styled.h4`
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.base}; font-weight: 700;
  color: ${theme.colors.text.primary}; margin: 0 0 4px;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.sm}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.lg}; margin-bottom: 8px; }
`;

export const PricingPrice = styled.p`
  font-family: ${theme.fonts.heading}; font-size: 1.4rem; font-weight: 800;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin: 0; line-height: 1.1;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.xl}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 1.8rem; }
`;

export const PricingSubtext = styled.p`
  font-size: 10px; color: ${theme.colors.text.light}; margin: 2px 0 0; font-weight: 500;
`;

export const PricingDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
  margin: ${theme.spacing.sm} 0;
`;

export const PricingFeatures = styled.ul`list-style: none; padding: 0; margin: 0;`;

export const PricingFeature = styled.li`
  font-size: 11px; color: ${theme.colors.text.secondary};
  padding: 2.5px 0; display: flex; align-items: center; gap: 6px; line-height: 1.3;
  &::before {
    content: ''; flex-shrink: 0; width: 5px; height: 5px;
    border-radius: 50%;
    background: ${theme.colors.accent.coral};
  }
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 10px; padding: 2px 0; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 13px; padding: 3.5px 0; gap: 8px;
    &::before { width: 6px; height: 6px; }
  }
`;

export const PricingHighlight = styled.li`
  font-size: 12px; color: ${theme.colors.accent.coral};
  padding: 4px 0; display: flex; align-items: center; gap: 6px; line-height: 1.3;
  font-weight: 700;
  &::before {
    content: ''; flex-shrink: 0; width: 6px; height: 6px;
    border-radius: 50%;
    background: ${theme.colors.accent.coral};
    box-shadow: 0 0 6px ${theme.colors.accent.coral}60;
  }
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 11px; padding: 3px 0; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 14px; padding: 5px 0; gap: 8px;
    &::before { width: 7px; height: 7px; }
  }
`;

/* ══════════════════════════════════════════════
   ORDER / PAYMENT
   ══════════════════════════════════════════════ */

export const OrderInfoSection = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.md}; border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md}; width: 100%; max-width: 560px;
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 680px; padding: ${theme.spacing.lg}; border-radius: ${theme.borderRadius.xl}; }
`;

export const OrderInfoGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: ${theme.spacing.sm};
  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
`;

export const FullWidthField = styled(InputField)`grid-column: 1 / -1;`;

export const OrderCostSummary = styled.div<{ $variant: 'free' | 'paid' | 'info' }>`
  display: flex; align-items: center; justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.xs}; font-weight: 600;
  margin-bottom: ${theme.spacing.md}; width: 100%; max-width: 560px; text-align: center;
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 680px; font-size: ${theme.fontSizes.sm}; }
  background: ${p => p.$variant === 'free' ? '#ecfdf5' : p.$variant === 'paid' ? theme.colors.accent.creamyYellow : theme.colors.background.secondary};
  color: ${p => p.$variant === 'free' ? '#065f46' : theme.colors.text.primary};
  border: 1px solid ${p => p.$variant === 'free' ? '#a7f3d0' : p.$variant === 'paid' ? `${theme.colors.accent.lightCoral}30` : '#E5E7EB'};
`;

export const PayButton = styled.button<{ $isReady: boolean }>`
  display: block; width: 100%; max-width: 360px;
  margin: 0 auto; padding: 14px ${theme.spacing.xl};
  border: none; border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.base}; font-weight: 700;
  color: #fff; cursor: pointer; transition: all 0.3s ease;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  ${p => p.$isReady && css`
    box-shadow: 0 0 20px ${theme.colors.accent.coral}40;
    &:hover { box-shadow: 0 0 30px ${theme.colors.accent.coral}60; }
  `}
  &:disabled { cursor: not-allowed; opacity: 0.5; }
  @media (max-width: ${theme.breakpoints.sm}) { max-width: 100%; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 440px; font-size: ${theme.fontSizes.lg}; padding: 16px; }
`;

export const TrustBadgesRow = styled.div`
  display: flex; align-items: center; justify-content: center;
  gap: ${theme.spacing.md}; margin-top: ${theme.spacing.sm}; flex-wrap: wrap;
`;

export const TrustBadge = styled.div`
  font-size: 10px; color: ${theme.colors.text.light}; font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background: #FFF5F5; border: 1px solid #FED7D7; border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.md}; margin-bottom: ${theme.spacing.md};
  color: #C53030; font-size: ${theme.fontSizes.xs}; text-align: center; max-width: 500px; width: 100%;
`;

export const ConnectedBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.accent.creamyYellow};
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.md}; margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xs}; color: ${theme.colors.text.primary};
  font-weight: 500; overflow-wrap: anywhere;
`;

export const ClubFreeCard = styled.div<{ $isSelected: boolean }>`
  background: ${p => p.$isSelected ? theme.colors.accent.creamyYellow : 'white'};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : '#E5E7EB'};
  border-radius: ${theme.borderRadius.xl}; padding: ${theme.spacing.md};
  text-align: center; cursor: pointer; transition: all 0.2s ease;
  position: relative; margin-bottom: ${theme.spacing.md};
  max-width: 560px; width: 100%;
  &:hover { border-color: ${theme.colors.accent.coral}; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 680px; padding: ${theme.spacing.lg}; }
`;

export const ClubBadge = styled.span`
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white; padding: 2px ${theme.spacing.md}; border-radius: ${theme.borderRadius.full};
  font-size: 10px; font-weight: 700; white-space: nowrap;
`;

export const ClubExhaustedMsg = styled.div`
  padding: ${theme.spacing.sm}; background: ${theme.colors.background.secondary};
  border: 1px solid #E5E7EB; border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md}; font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary}; text-align: center; max-width: 560px; width: 100%;
`;
