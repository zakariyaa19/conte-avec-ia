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

const cardShine = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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

const twinkle = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

export const WizardOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
`;

export const WizardHeader = styled.header`
  position: relative;
  z-index: 10;
  background: var(--header-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-secondary);
  transition: all 0.2s ease;
  opacity: ${p => p.$visible ? 1 : 0};
  pointer-events: ${p => p.$visible ? 'auto' : 'none'};
  &:hover { background: var(--bg-secondary); color: var(--text-primary); }
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
  background: var(--bg-secondary);
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
  padding: ${theme.spacing.xl} ${theme.spacing.lg} 140px;
  overflow-y: auto; overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  will-change: transform, opacity;
  ${stepAnimation}

  /* Starry fairy background — only in dark mode */
  background-image: radial-gradient(1px 1px at 10% 15%, rgba(255,200,220,0.25) 50%, transparent 100%),
    radial-gradient(1px 1px at 30% 45%, rgba(200,180,255,0.2) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 55% 20%, rgba(255,220,200,0.3) 50%, transparent 100%),
    radial-gradient(1px 1px at 70% 65%, rgba(200,220,255,0.2) 50%, transparent 100%),
    radial-gradient(1px 1px at 85% 30%, rgba(255,180,200,0.25) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 20% 75%, rgba(255,200,150,0.2) 50%, transparent 100%),
    radial-gradient(1px 1px at 45% 85%, rgba(200,200,255,0.2) 50%, transparent 100%),
    radial-gradient(1px 1px at 90% 80%, rgba(255,200,220,0.15) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 65% 50%, rgba(255,220,180,0.2) 50%, transparent 100%),
    radial-gradient(1px 1px at 5% 55%, rgba(220,180,255,0.2) 50%, transparent 100%);

  [data-theme="light"] & {
    background-image: none;
  }

  &::before {
    content: '';
    position: fixed;
    top: 5%;
    right: -10%;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.coral}10 0%, transparent 70%);
    pointer-events: none;
    filter: blur(50px);
  }

  &::after {
    content: '';
    position: fixed;
    bottom: 10%;
    left: -10%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, ${theme.colors.accent.pastelBlue}10 0%, transparent 70%);
    pointer-events: none;
    filter: blur(50px);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md} 140px;
  }
`;

export const StepContainerCentered = styled(StepContainer)`
  justify-content: center;
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
  color: var(--text-primary);
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
  color: var(--text-secondary);
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
  border: 2.5px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 12px;
  overflow: hidden; cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
  -webkit-tap-highlight-color: transparent;
  animation: ${cardReveal} 0.4s cubic-bezier(0.34,1.56,0.64,1) ${p => (p.$delay || 0) * 0.06}s both;
  ${p => p.$isSelected && css`
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}25, 0 4px 20px ${theme.colors.accent.coral}15, var(--shadow-card);
  `}
  &:active { transform: scale(0.96); }
  @media (min-width: ${theme.breakpoints.lg}) {
    border-radius: 14px;
    &:hover { transform: scale(1.04); box-shadow: var(--shadow-card-hover); }
  }
`;

export const CardImg = styled.div<{ $src: string }>`
  width: 100%;
  aspect-ratio: 1;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255,255,255,0.25) 50%,
      transparent 60%
    );
    background-size: 200% 100%;
    animation: ${cardShine} 4s ease-in-out infinite;
    pointer-events: none;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }
`;

export const CardImgLabel = styled.span`
  padding: 6px 4px;
  font-family: ${theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  color: var(--text-primary);
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
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 12px;
  background: ${p => p.$isSelected ? `${theme.colors.accent.coral}12` : (p.$bg || 'var(--bg-card)')};
  cursor: pointer; transition: all 0.2s ease;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: var(--text-primary);
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
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 10px;
  background: ${p => p.$isSelected ? `${theme.colors.accent.coral}12` : 'var(--bg-card)'};
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
  font-size: ${theme.fontSizes.xs}; color: var(--text-primary); font-weight: 500; text-align: center;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 10px; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.sm}; }
`;

export const ColorSectionLabel = styled.h4`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm}; font-weight: 600;
  color: var(--text-primary);
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
  border: 2px solid var(--border-input); border-radius: ${theme.borderRadius.md};
  font-size: 16px; font-family: ${theme.fonts.body};
  margin-top: ${theme.spacing.md}; transition: border-color 0.2s ease; box-sizing: border-box;
  animation: ${fadeIn} 0.3s ease;
  -webkit-appearance: none;
  background: var(--bg-input);
  color: var(--text-primary);
  &:focus { outline: none; border-color: ${theme.colors.accent.coral}; box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15; }
  &::placeholder { color: var(--text-light); }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 540px; }
`;

export const TextArea = styled.textarea`
  width: 100%; max-width: 420px;
  padding: ${theme.spacing.md};
  border: 2px solid var(--border-input); border-radius: ${theme.borderRadius.md};
  font-size: 16px; font-family: ${theme.fonts.body};
  resize: vertical; min-height: 70px; transition: border-color 0.2s ease; box-sizing: border-box;
  -webkit-appearance: none;
  background: var(--bg-input);
  color: var(--text-primary);
  &:focus { outline: none; border-color: ${theme.colors.accent.coral}; box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15; }
  &::placeholder { color: var(--text-light); }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 540px; }
`;

/* ══════════════════════════════════════════════
   PHOTO UPLOAD
   ══════════════════════════════════════════════ */

export const PhotoUploadZone = styled.div<{ $hasPhoto: boolean }>`
  border: 2px dashed ${p => p.$hasPhoto ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  text-align: center; width: 100%; max-width: 360px;
  cursor: pointer; transition: all 0.2s ease;
  background: ${p => p.$hasPhoto
    ? `linear-gradient(135deg, ${`${theme.colors.accent.coral}12`}40, ${theme.colors.accent.lightCoral}15)`
    : 'var(--bg-secondary)'};
  &:hover { border-color: ${theme.colors.accent.coral}; box-shadow: ${theme.shadows.md}; }
`;
export const PhotoIcon = styled.div`font-size: 2.5rem; margin-bottom: ${theme.spacing.sm};`;
export const PhotoMainText = styled.p`font-size: ${theme.fontSizes.sm}; font-weight: 600; color: var(--text-primary); margin: 0 0 4px;`;
export const PhotoSubText = styled.p`font-size: ${theme.fontSizes.xs}; color: var(--text-secondary); margin: 0; line-height: 1.4;`;
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
    : 'var(--border-input)'};
  ${p => p.$isReady && css`&:hover { transform: scale(1.02); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }`}
  &:disabled { cursor: not-allowed; opacity: 0.5; }
  @media (max-width: ${theme.breakpoints.sm}) { max-width: 100%; font-size: ${theme.fontSizes.sm}; padding: 12px; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 380px; font-size: ${theme.fontSizes.lg}; padding: 16px; }
`;

export const SkipLink = styled.button`
  display: block; margin: ${theme.spacing.md} auto 0; padding: ${theme.spacing.sm};
  background: none; border: none; cursor: pointer;
  font-family: ${theme.fonts.body}; font-size: ${theme.fontSizes.xs};
  color: var(--text-light); font-weight: 500; transition: color 0.2s ease;
  &:hover { color: ${theme.colors.accent.coral}; }
`;

export const ChoiceCard = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  width: 100%; max-width: 340px;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 440px; padding: ${theme.spacing['2xl']} ${theme.spacing.xl}; }
  border: 2px solid ${p => p.$variant === 'primary' ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: ${theme.borderRadius.xl};
  cursor: pointer; transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  background: ${p => p.$variant === 'primary'
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : 'var(--bg-card)'};
  ${p => p.$variant === 'primary' && css`animation: ${ctaPulse} 2.5s ease-in-out infinite; color: white;`}
  ${p => p.$variant === 'secondary' && css`
    color: var(--text-primary); box-shadow: ${theme.shadows.sm};
    &:hover { border-color: ${theme.colors.accent.lightCoral}; box-shadow: ${theme.shadows.md}; }
  `}
  &:active { transform: scale(0.97); }
`;

export const ChoiceTitle = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.lg}; font-weight: 700;
  color: ${p => p.$variant === 'primary' ? 'white' : 'var(--text-primary)'}; text-align: center;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.base}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.xl}; }
`;

export const ChoiceDesc = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-size: ${theme.fontSizes.xs};
  color: ${p => p.$variant === 'primary' ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)'};
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
  color: var(--text-primary); margin: 0 0 ${theme.spacing.sm};
`;

export const CollapsiblePill = styled.button<{ $isOpen: boolean }>`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px ${theme.spacing.md};
  border: 1.5px solid ${p => p.$isOpen ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.full};
  background: ${p => p.$isOpen ? `${theme.colors.accent.coral}12` : 'transparent'};
  color: ${p => p.$isOpen ? theme.colors.accent.coral : 'var(--text-secondary)'};
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
  display: flex; flex-direction: column;
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 16px; padding: ${theme.spacing.md} ${theme.spacing.sm};
  cursor: pointer; transition: all 0.3s ease;
  background: ${p => p.$isSelected ? 'linear-gradient(160deg, #FFF8F5, var(--bg-card))' : 'var(--bg-card)'};
  overflow: hidden; -webkit-tap-highlight-color: transparent;
  ${p => p.$isSelected && css`box-shadow: 0 4px 20px ${theme.colors.accent.coral}18;`}
  &:hover { border-color: ${theme.colors.accent.coral}80; }
  &:active { transform: scale(0.98); }
  @media (max-width: ${theme.breakpoints.sm}) { padding: 10px 8px; border-radius: 12px; }
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
  color: white; padding: 2px 8px; border-radius: 8px;
  font-size: 8px; font-weight: 700; letter-spacing: 0.3px;
  margin-bottom: 4px;
`;

export const PricingName = styled.h4`
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.sm}; font-weight: 700;
  color: var(--text-primary); margin: 0 0 2px;
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.base}; margin-bottom: 4px; }
`;

export const PricingPrice = styled.p`
  font-family: ${theme.fonts.heading}; font-size: ${theme.fontSizes.lg}; font-weight: 800;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin: 0; line-height: 1.1;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.base}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 1.4rem; }
`;

export const PricingSubtext = styled.p`
  font-size: 10px; color: var(--text-light); margin: 2px 0 0; font-weight: 500;
`;

export const PricingDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  margin: ${theme.spacing.sm} 0;
`;

export const PricingFeatures = styled.ul`list-style: none; padding: 0; margin: 0;`;

export const PricingFeature = styled.li`
  font-size: 9px; color: var(--text-secondary);
  padding: 1.5px 0; display: flex; align-items: center; gap: 4px; line-height: 1.3;
  &::before {
    content: ''; flex-shrink: 0; width: 4px; height: 4px;
    border-radius: 50%;
    background: ${theme.colors.accent.coral};
  }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 12px; padding: 3px 0; gap: 6px;
    &::before { width: 5px; height: 5px; }
  }
`;

export const PricingHighlight = styled.li`
  font-size: 10px; color: ${theme.colors.accent.coral};
  padding: 2px 0; display: flex; align-items: center; gap: 4px; line-height: 1.3;
  font-weight: 700;
  &::before {
    content: ''; flex-shrink: 0; width: 5px; height: 5px;
    border-radius: 50%;
    background: ${theme.colors.accent.coral};
    box-shadow: 0 0 4px ${theme.colors.accent.coral}60;
  }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 13px; padding: 4px 0; gap: 6px;
    &::before { width: 6px; height: 6px; }
  }
`;

/* Club CTA - "Recevez ce conte gratuitement" */
export const ClubFreeTitle = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 800;
  color: ${theme.colors.accent.coral};
  margin: 0 0 1px;
  line-height: 1.2;
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.base}; }
`;

export const ClubSmallPrice = styled.p`
  font-size: 9px;
  color: var(--text-light);
  margin: 0 0 4px;
  font-weight: 500;
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 10px; }
`;

/* ══════════════════════════════════════════════
   ORDER / PAYMENT
   ══════════════════════════════════════════════ */

export const OrderInfoSection = styled.div`
  background: var(--bg-secondary);
  padding: ${theme.spacing.md}; border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.xl}; margin-bottom: ${theme.spacing.md}; width: 100%; max-width: 560px;
  @media (max-width: ${theme.breakpoints.sm}) { margin-top: ${theme.spacing.lg}; }
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
  background: ${p => p.$variant === 'free' ? 'rgba(16,185,129,0.1)' : p.$variant === 'paid' ? `${theme.colors.accent.coral}10` : 'var(--bg-secondary)'};
  color: ${p => p.$variant === 'free' ? '#10b981' : 'var(--text-primary)'};
  border: 1px solid ${p => p.$variant === 'free' ? 'rgba(16,185,129,0.3)' : p.$variant === 'paid' ? `${theme.colors.accent.lightCoral}30` : 'var(--border-input)'};
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
  font-size: 10px; color: var(--text-light); font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background: rgba(197,48,48,0.08); border: 1px solid rgba(197,48,48,0.2); border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.md}; margin-bottom: ${theme.spacing.md};
  color: #E53E3E; font-size: ${theme.fontSizes.xs}; text-align: center; max-width: 500px; width: 100%;
`;

export const ConnectedBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.accent.coral}10;
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.md}; margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xs}; color: var(--text-primary);
  font-weight: 500; overflow-wrap: anywhere;
`;

export const ClubFreeCard = styled.div<{ $isSelected: boolean }>`
  background: ${p => p.$isSelected ? `${theme.colors.accent.coral}12` : 'var(--bg-card)'};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-input)'};
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
  padding: ${theme.spacing.sm}; background: var(--bg-secondary);
  border: 1px solid var(--border-input); border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md}; font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary); text-align: center; max-width: 560px; width: 100%;
`;

/* ══════════════════════════════════════════════
   STORY PREVIEW (emotional preview step)
   ══════════════════════════════════════════════ */

const skeletonShimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const StoryExcerptCard = styled.div`
  position: relative;
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg} ${theme.spacing.lg} 48px;
  box-shadow: var(--shadow-card);
  width: 100%; max-width: 460px;
  overflow: hidden;
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.md} 40px;
    border-radius: ${theme.borderRadius.lg};
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: 540px; padding: ${theme.spacing.xl} ${theme.spacing.xl} 56px;
  }
`;

export const StoryParagraph = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-primary);
  line-height: 1.7;
  margin: 0 0 ${theme.spacing.md};
  &:last-child { margin-bottom: 0; }
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.xs}; line-height: 1.6; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.base}; }
`;

export const FadeOverlay = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-card));
  pointer-events: none;
`;

export const StoryPreviewSkeleton = styled.div`
  width: 100%; max-width: 460px;
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  box-shadow: var(--shadow-card);

  & > div {
    height: 14px;
    border-radius: 6px;
    margin-bottom: 12px;
    background: #f0f0f0;
    background-image: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
    background-size: 200px 100%;
    background-repeat: no-repeat;
    animation: ${skeletonShimmer} 1.4s ease-in-out infinite;
  }
  & > div:nth-child(1) { width: 95%; }
  & > div:nth-child(2) { width: 100%; }
  & > div:nth-child(3) { width: 80%; }
  & > div:nth-child(4) { width: 0; height: 8px; }
  & > div:nth-child(5) { width: 100%; }
  & > div:nth-child(6) { width: 90%; }
  & > div:nth-child(7) { width: 70%; }
  & > div:nth-child(8) { width: 0; height: 8px; }
  & > div:nth-child(9) { width: 95%; }
  & > div:nth-child(10) { width: 85%; }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.lg};
  }
`;

export const PaywallDivider = styled.div`
  display: flex; align-items: center; justify-content: center;
  gap: ${theme.spacing.sm}; margin: ${theme.spacing.lg} 0;
  width: 100%; max-width: 460px;
  &::before, &::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.accent.coral}40, transparent);
  }
  font-size: 14px; color: ${theme.colors.accent.coral}; white-space: nowrap;
`;

export const PaywallTitle = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin: 0 0 ${theme.spacing.md};
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.base}; }
`;

export const UnlockCard = styled.div`
  display: flex; flex-direction: column; align-items: center;
  width: 100%; max-width: 460px;
  padding: ${theme.spacing.lg};
  background: var(--bg-secondary);
  border-radius: ${theme.borderRadius.xl};
  @media (max-width: ${theme.breakpoints.sm}) { padding: ${theme.spacing.md}; }
  @media (min-width: ${theme.breakpoints.lg}) { max-width: 540px; }
`;

export const LockIcon = styled.span`
  font-size: 1.6rem;
  margin-bottom: ${theme.spacing.xs};
`;

export const UnlockTitle = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.sm};
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.base}; }
`;

export const UnlockFeatures = styled.ul`
  list-style: none; padding: 0; margin: 0 0 ${theme.spacing.sm};
  display: flex; flex-direction: column; gap: 4px;
`;

export const UnlockFeature = styled.li`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  display: flex; align-items: center; gap: 6px;
  &::before {
    content: ''; width: 4px; height: 4px; border-radius: 50%;
    background: ${theme.colors.accent.coral}; flex-shrink: 0;
  }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.sm}; }
`;

export const TimerContainer = styled.div`
  display: flex; align-items: center; gap: 6px;
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
`;

export const TimerDigits = styled.span`
  font-family: ${theme.fonts.heading};
  font-weight: 700;
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
`;

/* ══════════════════════════════════════════════
   PREVIEW LOADING — premium animated wait screen
   ══════════════════════════════════════════════ */

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const pageFlip = keyframes`
  0%, 100% { transform: perspective(800px) rotateY(0deg); }
  35% { transform: perspective(800px) rotateY(-30deg); }
  65% { transform: perspective(800px) rotateY(-30deg); }
`;

const sparkleRise = keyframes`
  0% { opacity: 0; transform: translateY(10px) scale(0); }
  15% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-80px) scale(0.2); }
`;

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
`;

const bookReveal = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${theme.colors.accent.coral}30; }
  50%      { box-shadow: 0 0 20px 4px ${theme.colors.accent.coral}25; }
`;

/* ══════════════════════════════════════════════
   IMMERSIVE GENERATION CANVAS — fullscreen animated scene
   ══════════════════════════════════════════════ */

const materialize = keyframes`
  0% { opacity: 0; filter: blur(12px) saturate(0.3); transform: scale(1.02); }
  60% { opacity: 1; filter: blur(3px) saturate(0.7); transform: scale(1.005); }
  100% { opacity: 1; filter: blur(0) saturate(1); transform: scale(1); }
`;

const textMaterialize = keyframes`
  0% { opacity: 0; filter: blur(8px); }
  40% { opacity: 0.6; filter: blur(3px); }
  100% { opacity: 1; filter: blur(0); }
`;

/* Canvas animations */
const canvasGradientAnim = keyframes`
  0%   { background-position: 0% 50%; }
  25%  { background-position: 50% 0%; }
  50%  { background-position: 100% 50%; }
  75%  { background-position: 50% 100%; }
  100% { background-position: 0% 50%; }
`;

const pageFloatAnim = keyframes`
  0%   { transform: translateY(0) rotate(var(--r)) scale(1); opacity: 0.15; }
  25%  { transform: translateY(-12px) rotate(calc(var(--r) + 3deg)) scale(1.03); opacity: 0.25; }
  50%  { transform: translateY(-6px) rotate(calc(var(--r) - 2deg)) scale(1.01); opacity: 0.2; }
  75%  { transform: translateY(-14px) rotate(calc(var(--r) + 1deg)) scale(1.04); opacity: 0.22; }
  100% { transform: translateY(0) rotate(var(--r)) scale(1); opacity: 0.15; }
`;

const splashPulseAnim = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%      { transform: scale(1.3); opacity: 0.8; }
`;

const sparkleTwinkleAnim = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  20%      { opacity: 1; transform: scale(1) rotate(90deg); }
  50%      { opacity: 0.8; transform: scale(0.8) rotate(180deg); }
  80%      { opacity: 1; transform: scale(1.1) rotate(270deg); }
`;

const bookBreathAnim = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-8px) scale(1.04); }
`;

const bookGlowAnim = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50%      { opacity: 0.6; transform: scale(1.1); }
`;

const bookPageFlipAnim = keyframes`
  0%, 100% { transform: perspective(400px) rotateY(0); }
  30%      { transform: perspective(400px) rotateY(-25deg); }
  60%      { transform: perspective(400px) rotateY(-25deg); }
`;

const canvasMsgCycleAnim = keyframes`
  0%, 100% { opacity: 0; transform: translateY(8px); }
  10%, 30%  { opacity: 1; transform: translateY(0); }
  38%       { opacity: 0; transform: translateY(-8px); }
`;

const progressStage0Anim = keyframes`
  0% { width: 2%; } 100% { width: 30%; }
`;
const progressStage1Anim = keyframes`
  0% { width: 33%; } 100% { width: 62%; }
`;
const progressStage2Anim = keyframes`
  0% { width: 66%; } 100% { width: 92%; }
`;

/* ── Main canvas container ── */
export const GenerationCanvas = styled.div`
  width: 100%;
  max-width: 680px;
  aspect-ratio: 4 / 3;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(30, 20, 40, 0.15),
    0 2px 8px rgba(30, 20, 40, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.sm}) {
    aspect-ratio: 3 / 4;
    border-radius: 18px;
    max-width: 340px;
  }
`;

export const CanvasLayer = styled.div<{ $z: number }>`
  position: absolute;
  inset: 0;
  z-index: ${p => p.$z};
  pointer-events: none;
`;

export const CanvasGradientBg = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #1a1025 0%, #2d1b3d 15%, #1e2a4a 30%,
    #2a1f3a 45%, #1a2540 60%, #2d1b3d 75%, #1a1025 100%
  );
  background-size: 400% 400%;
  animation: ${canvasGradientAnim} 12s ease infinite;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(10, 5, 20, 0.4) 100%);
  }
`;

export const FloatingPage = styled.div<{ $delay: number; $left: string; $top: string; $rotate: number; $size: number }>`
  position: absolute;
  left: ${p => p.$left};
  top: ${p => p.$top};
  width: ${p => p.$size}px;
  height: ${p => p.$size * 1.4}px;
  background: linear-gradient(145deg, rgba(255, 250, 240, 0.12), rgba(255, 240, 220, 0.06));
  border-radius: 3px;
  border: 1px solid rgba(255, 250, 240, 0.08);
  --r: ${p => p.$rotate}deg;
  animation: ${pageFloatAnim} ${p => 5 + (p.$delay % 3)}s ease-in-out ${p => p.$delay}s infinite;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &::before {
    content: '';
    position: absolute;
    top: 25%; left: 15%; right: 15%;
    height: 2px;
    background: rgba(255, 250, 240, 0.06);
    box-shadow: 0 8px 0 rgba(255, 250, 240, 0.05), 0 16px 0 rgba(255, 250, 240, 0.04), 0 24px 0 rgba(255, 250, 240, 0.03);
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    width: ${p => p.$size * 0.7}px;
    height: ${p => p.$size * 0.7 * 1.4}px;
  }
`;

export const CanvasSplash = styled.div<{ $delay: number; $left: string; $top: string; $color: string; $size: number }>`
  position: absolute;
  left: ${p => p.$left};
  top: ${p => p.$top};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: radial-gradient(circle, ${p => p.$color}, transparent 70%);
  border-radius: 50%;
  animation: ${splashPulseAnim} ${p => 4 + (p.$delay % 3)}s ease-in-out ${p => p.$delay}s infinite;
  filter: blur(20px);
  @media (max-width: ${theme.breakpoints.sm}) {
    width: ${p => p.$size * 0.6}px;
    height: ${p => p.$size * 0.6}px;
    filter: blur(12px);
  }
`;

export const CanvasSparkle = styled.div<{ $delay: number; $left: string; $top: string }>`
  position: absolute;
  left: ${p => p.$left};
  top: ${p => p.$top};
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 220, 150, 0.9), rgba(255, 180, 100, 0.4));
  border-radius: 50%;
  animation: ${sparkleTwinkleAnim} ${p => 3 + (p.$delay % 2)}s ease-in-out ${p => p.$delay}s infinite;
  box-shadow: 0 0 6px 2px rgba(255, 220, 150, 0.3);
  @media (max-width: ${theme.breakpoints.sm}) { width: 3px; height: 3px; }
`;

/* ── Central book icon ── */
export const CanvasCenterContent = styled.div`
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
`;

export const CanvasBookIcon = styled.div`
  width: 90px; height: 120px;
  position: relative;
  animation: ${bookBreathAnim} 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
  @media (max-width: ${theme.breakpoints.sm}) { width: 70px; height: 94px; }
`;

export const CanvasBookSpine = styled.div`
  position: absolute; left: 0; top: 0;
  width: 42%; height: 100%;
  background: linear-gradient(135deg, #F5E6D0, #E8D5BE);
  border-radius: 4px 0 0 4px;
  box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.15);
  border-right: 2px solid rgba(200, 170, 130, 0.5);
  &::after {
    content: '';
    position: absolute; top: 30%; left: 20%; right: 20%;
    height: 1.5px;
    background: rgba(180, 150, 110, 0.3);
    box-shadow: 0 7px 0 rgba(180, 150, 110, 0.25), 0 14px 0 rgba(180, 150, 110, 0.2), 0 21px 0 rgba(180, 150, 110, 0.15);
  }
`;

export const CanvasBookCover = styled.div`
  position: absolute; right: 0; top: 0;
  width: 55%; height: 100%;
  background: linear-gradient(135deg, #F5E6D0, #EDD9C2);
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.12);
  transform-origin: left center;
  animation: ${bookPageFlipAnim} 4s ease-in-out infinite;
  display: flex; align-items: center; justify-content: center;
`;

export const CanvasBookStar = styled.span`
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(255, 200, 100, 0.5));
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 18px; }
`;

export const CanvasBookGlow = styled.div`
  position: absolute; inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 100, 0.15), transparent 70%);
  animation: ${bookGlowAnim} 3s ease-in-out infinite;
  pointer-events: none;
`;

/* ── Text overlay ── */
export const CanvasTextOverlay = styled.div`
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: flex-end;
  padding-bottom: 70px; gap: 8px;
  @media (max-width: ${theme.breakpoints.sm}) { padding-bottom: 60px; }
`;

export const CanvasTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 200, 100, 0.15);
  margin: 0; text-align: center;
  letter-spacing: 0.02em; padding: 0 20px;
  animation: ${fadeIn} 0.6s ease both;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.sm}; }
`;

export const CanvasMessagesContainer = styled.div`
  position: relative; height: 22px; width: 100%;
  display: flex; align-items: center; justify-content: center;
`;

export const CanvasMessage = styled.span<{ $index: number; $total: number }>`
  position: absolute;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  color: rgba(255, 220, 180, 0.75);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  animation: ${canvasMsgCycleAnim} ${p => p.$total * 3.5}s ease-in-out ${p => p.$index * 3.5}s infinite;
  opacity: 0;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 10px; }
`;

/* ── Progress bar ── */
export const CanvasProgressContainer = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0;
  z-index: 10; padding: 0 24px 16px;
  @media (max-width: ${theme.breakpoints.sm}) { padding: 0 16px 12px; }
`;

export const CanvasProgressTrack = styled.div`
  width: 100%; height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px; overflow: hidden; margin-bottom: 10px;
`;

export const CanvasProgressFill = styled.div<{ $stage: number }>`
  height: 100%; border-radius: 4px;
  background: linear-gradient(90deg, rgba(255, 200, 100, 0.9), rgba(255, 160, 100, 0.9), rgba(255, 200, 100, 0.9));
  background-size: 200% 100%;
  box-shadow: 0 0 12px rgba(255, 200, 100, 0.4);
  animation:
    ${p => p.$stage === 0 ? progressStage0Anim : p.$stage === 1 ? progressStage1Anim : progressStage2Anim}
    ${p => p.$stage === 0 ? 20 : p.$stage === 1 ? 15 : 25}s
    cubic-bezier(0.4, 0, 0.2, 1) both,
    ${pricingShimmer} 2s linear infinite;
`;

export const CanvasProgressSteps = styled.div`
  display: flex; justify-content: space-between; gap: 8px;
`;

export const CanvasProgressStep = styled.span<{ $done: boolean; $active: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: 10px;
  font-weight: ${p => p.$active ? 600 : 400};
  color: ${p => p.$done ? 'rgba(255, 200, 100, 0.8)' : p.$active ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.5s ease;
  display: flex; align-items: center; gap: 4px;
  &::before {
    content: '${p => p.$done ? '\\2713' : p.$active ? '\\25CF' : '\\25CB'}';
    font-size: ${p => p.$active ? '8px' : '6px'};
    ${p => p.$active && css`animation: ${dotPulse} 1.2s ease-in-out infinite;`}
  }
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 8px; }
`;


export const MaterializeImage = styled.div<{ $ready: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    ${p => p.$ready && css`
      animation: ${materialize} 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    `}
  }
`;

export const MaterializeText = styled.div<{ $ready: boolean; $delay?: number }>`
  ${p => p.$ready ? css`
    animation: ${textMaterialize} 1s cubic-bezier(0.16, 1, 0.3, 1) ${p.$delay || 0}s both;
  ` : css`
    opacity: 0;
  `}
`;

export const PreviewLoadingContainer = styled.div`
  width: 100%;
  max-width: 700px;
  aspect-ratio: 3 / 2;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(135deg, #FFF9F0, #FFE8D6, #FFDAB9, #FFE5B4, #FFF9F0);
  background-size: 300% 300%;
  animation: ${gradientShift} 6s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: ${theme.breakpoints.sm}) {
    aspect-ratio: 4 / 3;
    border-radius: ${theme.borderRadius.lg};
    gap: 14px;
  }
`;

export const PreviewLoadingBook = styled.div`
  width: 80px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 38px;
    height: 100%;
    background: #FFF9F0;
    border-radius: 4px 0 0 4px;
    box-shadow: -2px 2px 10px rgba(0,0,0,0.08);
    border-right: 2px solid #E8D5C0;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 38px;
    height: 100%;
    background: linear-gradient(135deg, #FFF9F0, #FDF6E3);
    border-radius: 0 4px 4px 0;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.06);
    transform-origin: left center;
    animation: ${pageFlip} 3s ease-in-out infinite;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 60px;
    height: 75px;
    &::before { width: 28px; }
    &::after { width: 28px; }
  }
`;

export const PreviewLoadingSparkle = styled.span<{ $delay: number; $left: string; $size?: number }>`
  position: absolute;
  bottom: 35%;
  left: ${p => p.$left};
  width: ${p => p.$size || 6}px;
  height: ${p => p.$size || 6}px;
  background: radial-gradient(circle, #FFD700, #FF9999);
  border-radius: 50%;
  animation: ${sparkleRise} 3s ease-out ${p => p.$delay}s infinite;
  pointer-events: none;
`;

export const PreviewLoadingText = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  margin: 0;
  z-index: 1;
  text-align: center;
  padding: 0 20px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

export const PreviewLoadingDots = styled.span`
  display: inline-flex;
  gap: 4px;
  margin-left: 4px;
  vertical-align: middle;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #D4A574;
    display: inline-block;
    animation: ${dotPulse} 1.4s ease-in-out infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

export const PreviewLoadingStages = styled.div`
  display: flex;
  gap: 10px;
  z-index: 1;
`;

export const PreviewLoadingStage = styled.div<{ $active: boolean; $done: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$done ? '#D4A574' : p.$active ? '#FFB088' : 'rgba(212, 165, 116, 0.25)'};
  transition: all 0.6s ease;
  ${p => p.$active && css`
    transform: scale(1.4);
    box-shadow: 0 0 10px rgba(255, 176, 136, 0.5);
  `}
`;

/* ══════════════════════════════════════════════
   BOOK PREVIEW — immersive magical storybook
   ══════════════════════════════════════════════ */

/* --- Animations --- */
const coverReveal = keyframes`
  0% { opacity: 0; transform: scale(0.88) rotate(-1deg); }
  60% { opacity: 1; transform: scale(1.02) rotate(0.3deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

const storyPageReveal = keyframes`
  0% { opacity: 0; transform: translateX(40px) rotateY(-6deg); }
  100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
`;

const illustrationFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const pageBadgePop = keyframes`
  0% { opacity: 0; transform: translateX(-50%) scale(0.3); }
  60% { transform: translateX(-50%) scale(1.15); }
  100% { opacity: 1; transform: translateX(-50%) scale(1); }
`;

const lockFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-3px) rotate(-2deg); }
  75% { transform: translateY(-1px) rotate(2deg); }
`;

const lockGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 215, 140, 0), 0 0 20px rgba(255, 215, 140, 0); }
  50% { box-shadow: 0 0 30px 8px rgba(255, 215, 140, 0.15), 0 0 60px rgba(255, 215, 140, 0.08); }
`;

const magicFloat = keyframes`
  0% { opacity: 0; transform: translateY(0) scale(0); }
  10% { opacity: 0.8; transform: translateY(-5px) scale(1); }
  80% { opacity: 0.4; }
  100% { opacity: 0; transform: translateY(-100px) scale(0.2) rotate(180deg); }
`;

export const BookPreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${theme.spacing.lg};
  position: relative;
  padding: ${theme.spacing.xl} 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} 0;
  }
`;

/* Floating magic particles — very subtle */
export const MagicParticle = styled.span<{ $delay: number; $left: string; $size?: number; $color?: string }>`
  position: absolute;
  bottom: 20%;
  left: ${p => p.$left};
  width: ${p => p.$size || 4}px;
  height: ${p => p.$size || 4}px;
  background: ${p => p.$color || 'radial-gradient(circle, rgba(255, 215, 140, 0.9), rgba(255, 180, 120, 0.4))'};
  border-radius: 50%;
  animation: ${magicFloat} ${p => 4 + (p.$delay % 2)}s ease-out ${p => p.$delay}s infinite;
  pointer-events: none;
  z-index: 5;
  filter: blur(0.5px);
`;

export const BookPageFrame = styled.div<{ $delay?: number; $portrait?: boolean; $compact?: boolean }>`
  width: 100%;
  max-width: ${p => p.$portrait ? '340px' : '680px'};
  aspect-ratio: ${p => p.$portrait ? '2 / 3' : p.$compact ? '5 / 2' : '3 / 2'};
  overflow: hidden;
  border-radius: ${theme.borderRadius.xl};
  position: relative;

  /* Book-like shadow — deep, warm */
  box-shadow:
    0 4px 8px rgba(120, 90, 60, 0.06),
    0 12px 28px rgba(120, 90, 60, 0.10),
    0 24px 48px rgba(120, 90, 60, 0.06);

  /* Per-type animations */
  ${p => p.$portrait && css`
    animation: ${coverReveal} 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  `}
  ${p => !p.$portrait && !p.$compact && css`
    animation: ${storyPageReveal} 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
  `}
  ${p => p.$compact && css`
    animation: ${bookReveal} 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
  `}

  @media (min-width: ${theme.breakpoints.md}) {
    max-width: ${p => p.$portrait ? '380px' : '720px'};
    border-radius: 20px;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: ${p => p.$portrait ? '400px' : '760px'};
  }
`;

export const BookCoverImage = styled.div`
  width: 100%;
  height: 100%;
  background: #2C2C2C;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Subtle inner shadow to give depth */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.12);
    pointer-events: none;
    border-radius: inherit;
  }
`;

/* Story page: cream bg, 50/50 split — PDF match + book feel */
export const BookStoryLayout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #FAF3E0;
  position: relative;

  /* Paper texture feel */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(255, 245, 220, 0.5) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 30%, rgba(255, 230, 200, 0.3) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Spine shadow between text and image */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 20px;
    transform: translateX(-50%);
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(120, 90, 60, 0.04) 30%,
      rgba(120, 90, 60, 0.06) 50%,
      rgba(120, 90, 60, 0.04) 70%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

export const BookTextHalf = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 28px 44px;
  position: relative;
  z-index: 1;

  /* Decorative border — elegant frame */
  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1.5px solid rgba(210, 165, 120, 0.25);
    border-radius: 6px;
    pointer-events: none;
  }

  /* Ornamental divider below text */
  &::after {
    content: '~';
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    font-family: serif;
    font-size: 18px;
    color: rgba(210, 165, 120, 0.35);
    letter-spacing: 8px;
  }

  p {
    font-family: ${theme.fonts.heading};
    font-size: 13px;
    color: var(--text-primary);
    line-height: 2.1;
    margin: 0;
    text-align: center;
    max-width: 86%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 18px 12px 36px;
    &::before { inset: 10px; border-width: 1px; }
    &::after { bottom: 32px; font-size: 14px; letter-spacing: 4px; }
    p { font-size: 9px; line-height: 1.7; max-width: 94%; -webkit-line-clamp: 8; }
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 40px 32px 48px;
    &::before { inset: 24px; }
    p { font-size: 15px; line-height: 2.2; }
  }
`;

export const BookCreatorTag = styled.span`
  position: absolute;
  top: 30px;
  left: 30px;
  font-family: ${theme.fonts.heading};
  font-size: 8px;
  font-weight: 700;
  color: rgba(120, 100, 80, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    top: 14px;
    left: 14px;
    font-size: 6px;
    letter-spacing: 1px;
  }
`;

export const BookImageHalf = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    animation: ${illustrationFloat} 6s ease-in-out 1.5s infinite;
  }

  /* Soft vignette on the illustration */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 30px rgba(120, 90, 60, 0.08);
    pointer-events: none;
  }
`;

/* Page number badge — animated pop-in */
export const BookPageBadge = styled.span`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 218, 185, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.heading};
  font-size: 13px;
  font-weight: 700;
  color: #5A4A3A;
  box-shadow:
    inset 0 0 0 2px rgba(210, 165, 120, 0.3),
    0 2px 8px rgba(120, 90, 60, 0.1);
  animation: ${pageBadgePop} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both;

  /* Orbital dots */
  &::before, &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(210, 165, 120, 0.4);
  }
  &::before { top: -6px; right: -2px; }
  &::after { bottom: -4px; left: -4px; }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 24px;
    height: 24px;
    font-size: 10px;
    bottom: 8px;
  }
`;

/* Locked page — emotional with glow + animation */
export const BookLockedOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #FAF3E0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${lockGlow} 3s ease-in-out 1.5s infinite;

  &:hover {
    transform: scale(1.01);
    &::after { background: radial-gradient(ellipse at center, rgba(250, 243, 224, 0.65) 0%, rgba(250, 243, 224, 0.85) 70%); }
  }
  &:active { transform: scale(0.99); }

  /* Blurred fake content underneath */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        0deg,
        transparent, transparent 14px,
        rgba(180, 160, 140, 0.15) 14px, rgba(180, 160, 140, 0.15) 16px
      ),
      linear-gradient(90deg, rgba(250, 243, 224, 1) 48%, rgba(200, 180, 150, 0.3) 48%);
    filter: blur(5px);
    opacity: 0.8;
  }

  /* Warm cream overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(250, 243, 224, 0.7) 0%,
      rgba(250, 243, 224, 0.92) 65%
    );
    transition: background 0.3s ease;
  }
`;

export const BookLockedContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 0 24px;
`;

export const BookLockedIcon = styled.span`
  font-size: 2rem;
  animation: ${lockFloat} 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 8px rgba(200, 170, 100, 0.3));
`;

export const BookLockedTitle = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

export const BookLockedSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
  opacity: 0.8;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

export const BookLockedFeatures = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  max-width: 280px;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.sm};
    max-width: 340px;
  }
`;

/* ══════════════════════════════════════════════
   TIMER BAR — urgency with pulse
   ══════════════════════════════════════════════ */

const timerPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

export const PreviewTimerBar = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: ${theme.spacing.xl};
  background: linear-gradient(135deg, #FFF8F2, #FFF0E6, #FFF8F2);
  border: 1.5px solid rgba(255, 153, 153, 0.2);
  border-radius: ${theme.borderRadius.xl};
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${fadeIn} 0.5s ease both;
  box-shadow: 0 2px 12px rgba(255, 153, 153, 0.08);

  span {
    font-family: ${theme.fonts.body};
    font-size: ${theme.fontSizes.sm};
    color: var(--text-secondary);
    font-weight: 500;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: ${theme.spacing.lg};
    padding: 12px 16px;
    border-radius: ${theme.borderRadius.lg};
    gap: 6px;
    span { font-size: 11px; }
  }
`;

export const PreviewTimerDigits = styled.span`
  && {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.xl};
    font-weight: 800;
    color: ${theme.colors.accent.coral};
    font-variant-numeric: tabular-nums;
    animation: ${timerPulse} 2s ease-in-out infinite;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: ${theme.fontSizes.lg};
    }
  }
`;

/* ══════════════════════════════════════════════
   VALUE PROPOSITION — what's included
   ══════════════════════════════════════════════ */

export const ValueBlock = styled.div`
  width: 100%;
  max-width: 500px;
  margin-top: ${theme.spacing.xl};
  background: linear-gradient(160deg, #FFFCF5, #FFF8EE);
  border: 1px solid rgba(210, 175, 130, 0.2);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg} ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 16px rgba(120, 90, 60, 0.06);
  animation: ${fadeIn} 0.6s ease 0.2s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: ${theme.spacing.lg};
    padding: ${theme.spacing.md} ${theme.spacing.md};
    max-width: 360px;
    gap: 8px;
  }
`;

export const ValueBlockTitle = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: var(--text-secondary);
  text-align: center;
  margin: 0 0 4px;
  letter-spacing: 0.3px;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.base};
  }
`;

export const ValueBlockItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.4;

  &::before {
    content: '';
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 153, 153, 0.15), rgba(255, 180, 120, 0.15));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    gap: 8px;
    &::before { width: 18px; height: 18px; }
  }
`;

/* ══════════════════════════════════════════════
   SECTION TITLE — emotional headline
   ══════════════════════════════════════════════ */

export const PreviewSectionTitle = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin: ${theme.spacing.xl} 0 ${theme.spacing.lg};
  max-width: 420px;
  line-height: 1.4;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
    margin: ${theme.spacing.lg} 0 ${theme.spacing.md};
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

/* ══════════════════════════════════════════════
   PRICING GRID — conversion optimized
   ══════════════════════════════════════════════ */

const cardSlideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const badgeBounce = keyframes`
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.05); }
`;

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.08fr 1fr;
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 680px;
  align-items: stretch;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    max-width: 380px;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: 820px;
    gap: ${theme.spacing.lg};
    grid-template-columns: 1fr 1.1fr 1fr;
  }
`;

export const PricingCard = styled.div<{ $isSelected: boolean; $featured?: boolean; $mobileOrder?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  border: 2px solid ${p => p.$isSelected
    ? theme.colors.accent.coral
    : p.$featured
      ? 'rgba(255, 153, 153, 0.35)'
      : 'var(--border-color)'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${p => p.$isSelected
    ? 'linear-gradient(160deg, #FFF0EC, #FFFAF8)'
    : p.$featured
      ? 'linear-gradient(160deg, #FFFBF8, #FFF5EE)'
      : 'var(--bg-card)'};
  -webkit-tap-highlight-color: transparent;
  animation: ${cardSlideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: ${p => p.$featured ? '0s' : '0.1s'};

  ${p => p.$isSelected && css`
    border-color: ${theme.colors.accent.coral};
    box-shadow:
      0 4px 24px ${theme.colors.accent.coral}20,
      0 0 0 1px ${theme.colors.accent.coral}10,
      0 8px 32px rgba(0, 0, 0, 0.06);
  `}

  ${p => p.$featured && !p.$isSelected && css`
    box-shadow:
      0 8px 32px rgba(255, 153, 153, 0.12),
      0 4px 16px rgba(0, 0, 0, 0.04);
    animation: ${cardSlideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  `}

  &:hover {
    border-color: ${theme.colors.accent.coral}90;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  &:active { transform: scale(0.98); }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.md};
    border-radius: 16px;
    order: ${p => p.$mobileOrder ?? 0};
    ${p => p.$featured && css`
      padding: ${theme.spacing.lg} ${theme.spacing.md};
      border-width: 2.5px;
      border-color: ${p.$isSelected ? theme.colors.accent.coral : 'rgba(255, 153, 153, 0.4)'};
    `}
    &:hover { transform: none; }
    ${p => p.$isSelected && css`transform: none;`}
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
    border-radius: 24px;
    &:hover { transform: ${p => p.$featured ? 'translateY(-4px)' : 'translateY(-2px)'}; }
  }
`;

export const PricingSelectedCheck = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px ${theme.colors.accent.coral}40;
  z-index: 2;
  animation: ${cardSlideUp} 0.3s ease both;
`;

export const PricingCardBadge = styled.span`
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 4px 16px;
  border-radius: ${theme.borderRadius.full};
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px ${theme.colors.accent.coral}30;
  animation: ${badgeBounce} 3s ease-in-out 2s infinite;
`;

export const PricingCardName = styled.h4`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
  text-align: center;
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes.lg}; }
`;

export const PricingCardPrice = styled.p<{ $small?: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${p => p.$small ? theme.fontSizes.base : theme.fontSizes['2xl']};
  font-weight: ${p => p.$small ? 600 : 800};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.1;
  opacity: ${p => p.$small ? 0.7 : 1};

  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${p => p.$small ? theme.fontSizes.sm : theme.fontSizes.xl}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${p => p.$small ? theme.fontSizes.lg : theme.fontSizes['3xl']}; }
`;

export const PricingFreeLabel = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 800;
  color: #16a34a;
  margin: 0 0 2px;
  text-align: center;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.lg}; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: ${theme.fontSizes['2xl']}; }
`;

export const PricingCardSub = styled.p`
  font-size: 11px;
  color: var(--text-light);
  margin: 4px 0 0;
  font-weight: 500;
  text-align: center;

  @media (min-width: ${theme.breakpoints.lg}) { font-size: 12px; }
`;

/* Highlight price per story */
export const PricingPerStory = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.accent.coral};
  background: rgba(255, 153, 153, 0.08);
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
  margin: 6px 0 0;
  text-align: center;

  @media (min-width: ${theme.breakpoints.lg}) { font-size: 11px; padding: 4px 12px; }
`;

export const PricingCardFeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.md} 0 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: ${theme.spacing.sm};
    gap: 4px;
  }
`;

export const PricingCardFeatureItem = styled.li<{ $highlight?: boolean }>`
  font-size: 12px;
  color: ${p => p.$highlight ? theme.colors.accent.coral : 'var(--text-secondary)'};
  font-weight: ${p => p.$highlight ? 600 : 400};
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;

  &::before {
    content: '${p => p.$highlight ? '\\2713' : '\\2713'}';
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${p => p.$highlight
      ? 'linear-gradient(135deg, rgba(255,153,153,0.15), rgba(255,180,120,0.15))'
      : 'var(--border-color)'};
    color: ${p => p.$highlight ? theme.colors.accent.coral : 'var(--text-light)'};
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) { font-size: 11px; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 13px; gap: 10px; }
`;

export const PricingCardCTA = styled.button<{ $primary?: boolean }>`
  margin-top: auto;
  padding: 12px 20px;
  border: ${p => p.$primary ? 'none' : `1.5px solid ${theme.colors.accent.coral}60`};
  border-radius: ${theme.borderRadius.xl};
  background: ${p => p.$primary
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : 'transparent'};
  color: ${p => p.$primary ? 'white' : theme.colors.accent.coral};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
  margin-top: ${theme.spacing.md};
  ${p => p.$primary && css`box-shadow: 0 4px 16px ${theme.colors.accent.coral}25;`}

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px ${theme.colors.accent.coral}30;
  }
  &:active { transform: scale(0.97); }

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.base};
    padding: 14px 24px;
  }
`;

/* ── Hero Tripwire Card (1.99€ dominant) ── */
export const TripwireHeroCard = styled.div<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border: 3px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'rgba(255, 153, 153, 0.4)'};
  border-radius: 24px;
  cursor: pointer;
  background: linear-gradient(160deg, #FFF5EE, #FFFAF8, #FFF0EC);
  box-shadow:
    0 12px 40px rgba(255, 153, 153, 0.18),
    0 4px 16px rgba(0, 0, 0, 0.04);
  animation: ${cardSlideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;

  ${p => p.$isSelected && css`
    border-color: ${theme.colors.accent.coral};
    box-shadow:
      0 8px 32px ${theme.colors.accent.coral}30,
      0 0 0 2px ${theme.colors.accent.coral}15,
      0 12px 48px rgba(0, 0, 0, 0.08);
  `}

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 16px 48px rgba(255, 153, 153, 0.22),
      0 8px 24px rgba(0, 0, 0, 0.06);
  }
  &:active { transform: scale(0.98); }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
    border-radius: 20px;
    max-width: 100%;
    &:hover { transform: none; }
  }
`;

export const TripwireHeroBadge = styled.span`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 6px 20px;
  border-radius: ${theme.borderRadius.full};
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px ${theme.colors.accent.coral}40;
  animation: ${badgeBounce} 3s ease-in-out 2s infinite;
`;

export const TripwireHeroPrice = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin: ${theme.spacing.sm} 0 4px;

  @media (max-width: ${theme.breakpoints.sm}) { font-size: 40px; }
  @media (min-width: ${theme.breakpoints.lg}) { font-size: 56px; }
`;

export const TripwireHeroOldPrice = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 2px;
`;

export const TripwireHeroCTA = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
  margin-top: ${theme.spacing.md};
  box-shadow: 0 6px 24px ${theme.colors.accent.coral}35;
  letter-spacing: 0.3px;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 32px ${theme.colors.accent.coral}45;
  }
  &:active { transform: scale(0.97); }

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.lg};
    padding: 18px 36px;
  }
`;

export const ClubAlternativeSection = styled.div`
  width: 100%;
  max-width: 440px;
  margin-top: ${theme.spacing.lg};
  text-align: center;
`;

export const ClubAlternativeDivider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  color: var(--text-light);
  font-size: ${theme.fontSizes.xs};
  font-weight: 500;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
`;

export const ClubMiniCard = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border: 1.5px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 14px;
  cursor: pointer;
  background: ${p => p.$isSelected ? 'linear-gradient(160deg, #FFF0EC, #FFFAF8)' : 'var(--bg-card)'};
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: ${theme.spacing.sm};

  ${p => p.$isSelected && css`
    box-shadow: 0 4px 16px ${theme.colors.accent.coral}15;
  `}

  &:hover {
    border-color: ${theme.colors.accent.coral}60;
  }
  &:active { transform: scale(0.98); }
`;

export const ClubMiniInfo = styled.div`
  text-align: left;
`;

export const ClubMiniName = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const ClubMiniDetail = styled.p`
  font-size: 11px;
  color: var(--text-light);
  margin: 2px 0 0;
`;

export const ClubMiniPrice = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  margin: 0;
  white-space: nowrap;
`;

/* ══════════════════════════════════════════════
   CLUB SHOWCASE (enriched Club cards)
   ══════════════════════════════════════════════ */

const clubShine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const clubPulse = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(255, 130, 100, 0.12); }
  50% { box-shadow: 0 8px 32px rgba(255, 130, 100, 0.22); }
`;

const floatBadge = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-3px) rotate(1deg); }
`;

export const ClubShowcaseCard = styled.div<{ $isSelected: boolean; $hero?: boolean }>`
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  padding: ${p => p.$hero ? '28px 24px 24px' : '20px'};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-tap-highlight-color: transparent;

  background: ${p => p.$isSelected
    ? 'linear-gradient(160deg, #FFF0EC 0%, #FFFAF8 40%, #FFF5EE 100%)'
    : 'linear-gradient(160deg, #FAFBFF 0%, #FFF9F6 40%, #FFFBF8 100%)'};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};

  ${p => p.$hero && css`
    animation: ${clubPulse} 3s ease-in-out infinite;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      ${theme.colors.accent.coral},
      ${theme.colors.accent.softPink},
      ${theme.colors.accent.pastelBlue},
      ${theme.colors.accent.coral}
    );
    background-size: 200% auto;
    animation: ${clubShine} 3s linear infinite;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: ${theme.colors.accent.coral}80;
  }
  &:active { transform: scale(0.98); }
`;

export const ClubShowcaseBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  animation: ${floatBadge} 3s ease-in-out infinite;
`;

export const ClubShowcaseHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

export const ClubShowcaseTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

export const ClubShowcaseSubtitle = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  margin: 0;
`;

export const ClubShowcasePrice = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

export const ClubShowcasePriceValue = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
`;

export const ClubShowcasePriceUnit = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-light);
  margin-left: 4px;
`;

export const ClubShowcaseFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

export const ClubShowcaseFeature = styled.div<{ $premium?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${p => p.$premium ? theme.colors.accent.coral : 'var(--text-secondary)'};
  font-weight: ${p => p.$premium ? 600 : 400};
  line-height: 1.3;
`;

export const ClubFeatureIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}40, #a8e6cf40);
`;

export const ClubShowcaseCTA = styled.div<{ $selected?: boolean }>`
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  text-align: center;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: ${p => p.$selected ? 'white' : theme.colors.accent.coral};
  background: ${p => p.$selected
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : `linear-gradient(135deg, ${theme.colors.accent.coral}10, ${theme.colors.accent.softPink}15)`};
  border: 1.5px solid ${p => p.$selected ? 'transparent' : `${theme.colors.accent.coral}30`};
  transition: all 0.2s ease;
`;

export const ClubShowcaseFreeTag = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}30, #a8e6cf30);
  border: 1px solid #a8e6cf;
  border-radius: ${theme.borderRadius.full};
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #2d6a4f;
  margin-bottom: 8px;
`;

export const SingleFallbackCard = styled.div<{ $isSelected: boolean }>`
  width: 100%;
  max-width: 440px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border: 1.5px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 14px;
  cursor: pointer;
  background: ${p => p.$isSelected ? '#FFFAF8' : 'var(--bg-card)'};
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  margin-top: ${theme.spacing.sm};

  &:hover { border-color: rgba(0, 0, 0, 0.15); }
  &:active { transform: scale(0.98); }
`;

export const SingleFallbackInfo = styled.div`
  text-align: left;
`;

export const SingleFallbackName = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
`;

export const SingleFallbackDetail = styled.p`
  font-size: 11px;
  color: var(--text-light);
  margin: 2px 0 0;
`;

export const SingleFallbackPrice = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: var(--text-secondary);
  margin: 0;
`;

/* ══════════════════════════════════════════════
   SOCIAL PROOF
   ══════════════════════════════════════════════ */

export const SocialProofLine = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  text-align: center;
  margin: ${theme.spacing.lg} 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  animation: ${fadeIn} 0.5s ease 0.6s both;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.sm};
    margin-top: ${theme.spacing.xl};
  }
`;

/* ══════════════════════════════════════════════
   V2 WIZARD — NEW COMPONENTS (steps 0-8 redesign)
   Existing components above are kept for preview step
   ══════════════════════════════════════════════ */

/* ── Animations ── */

export const shimmerSegment = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const cardPop = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const chipSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const sparkleFloat = keyframes`
  0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
  50%      { opacity: 1; transform: translateY(-20px) scale(1); }
`;

/* ── 2.1 Header Redesigné ── */

export const WizardHeaderNew = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--header-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: ${theme.spacing.xs} ${theme.spacing.lg} ${theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 4px ${theme.spacing.md} 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--header-glass);
  }
`;

export const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
`;

export const HeaderTitle = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeaderBadge = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  font-weight: 600;
  color: var(--text-light);
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
`;

export const HeaderStepLabel = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  margin: 0 0 ${theme.spacing.xs};
  text-align: center;
  font-weight: 500;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 11px;
    margin-bottom: 3px;
  }
`;

export const SegmentedProgressBar = styled.div`
  display: flex;
  gap: 3px;
  width: 100%;
  align-items: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: 2px;
  }
`;

export const ProgressSegment = styled.div<{
  $status: 'done' | 'current' | 'future' | 'skipped';
}>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  background: ${p => {
    switch (p.$status) {
      case 'done': return `linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink})`;
      case 'current': return theme.colors.accent.coral;
      case 'skipped': return `${theme.colors.accent.coral}30`;
      default: return 'var(--border-input)';
    }
  }};

  ${p => p.$status === 'current' && css`
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
      background-size: 200% 100%;
      animation: ${shimmerSegment} 2s ease-in-out infinite;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    &::after { animation: none; }
  }
`;

export const SegmentDot = styled.div<{ $active: boolean; $done: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background: ${p => p.$done
    ? theme.colors.accent.coral
    : p.$active
      ? theme.colors.accent.coral
      : 'var(--border-input)'};
  ${p => p.$active && css`
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}25;
  `}
`;

/* ── 2.2 Sticky CTA Bar ── */

export const StickyBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 110;
  background: var(--header-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--border-color);
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  padding-bottom: max(${theme.spacing.sm}, env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    padding-bottom: max(${theme.spacing.sm}, env(safe-area-inset-bottom));
  }
`;

export const StickyBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background: none;
  border: 1.5px solid var(--border-input);
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    border-color: ${theme.colors.accent.coral};
    color: ${theme.colors.accent.coral};
  }
`;

export const StickyContinueButton = styled.button<{ $isReady: boolean }>`
  flex: 1;
  max-width: 300px;
  padding: 12px ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  background: ${p => p.$isReady
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : 'var(--border-input)'};

  ${p => p.$isReady && css`
    box-shadow: 0 4px 16px ${theme.colors.accent.coral}30;
    &:hover { transform: scale(1.02); box-shadow: 0 6px 24px ${theme.colors.accent.coral}40; }
  `}

  &:disabled { cursor: not-allowed; opacity: 0.5; }
  &:active { transform: scale(0.98); }
`;

/* ── 2.3 NewChoiceCard ── */

export const NewChoiceCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 560px;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    max-width: 100%;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: 700px;
    gap: ${theme.spacing.md};
  }
`;

export const NewChoiceCard = styled.button<{ $isSelected: boolean; $delay?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 16px;
  background: ${p => p.$isSelected
    ? `linear-gradient(160deg, #FFF8F5, #FFF)`
    : 'var(--bg-card)'};
  cursor: pointer;
  transition: all 0.25s ease;
  -webkit-tap-highlight-color: transparent;
  animation: ${cardPop} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${p => (p.$delay || 0) * 0.06}s both;

  ${p => p.$isSelected && css`
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}18, 0 4px 20px rgba(0,0,0,0.06);
  `}

  &:active { transform: scale(0.96); }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
    border-radius: 18px;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      border-color: ${theme.colors.accent.lightCoral};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const NewCardLabel = styled.span`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.25;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

export const NewCardDescription = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  color: var(--text-light);
  text-align: center;
  line-height: 1.3;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

export const CardBadgePill = styled.span<{ $variant?: 'recommended' | 'popular' }>`
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  white-space: nowrap;
  font-family: ${theme.fonts.body};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
  color: white;
  background: ${p => p.$variant === 'popular'
    ? 'linear-gradient(135deg, #A8D8EA, #7CB9D0)'
    : `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink})`};
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: 10px;
    padding: 4px 12px;
    top: 8px;
  }
`;

/* ── 2.4 Summary Chips ── */

export const SummaryChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};
  max-width: 560px;
  width: 100%;
`;

export const SummaryChip = styled.span<{ $delay?: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.fonts.body};
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
  animation: ${chipSlideIn} 0.3s ease ${p => (p.$delay || 0) * 0.08}s both;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.xs};
    padding: 5px 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

/* ── 2.5 Hero Step Specifics ── */

export const SegmentedGender = styled.div`
  display: flex;
  background: var(--bg-secondary);
  border-radius: ${theme.borderRadius.full};
  padding: 3px;
  gap: 0;
  margin-bottom: ${theme.spacing.md};
`;

export const GenderPill = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  padding: 10px 24px;
  border: none;
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  -webkit-tap-highlight-color: transparent;
  background: ${p => p.$isSelected
    ? 'var(--bg-card)'
    : 'transparent'};
  color: ${p => p.$isSelected
    ? theme.colors.accent.coral
    : 'var(--text-secondary)'};
  box-shadow: ${p => p.$isSelected
    ? '0 2px 8px rgba(0,0,0,0.08)'
    : 'none'};

  &:active { transform: scale(0.96); }
`;

/* ── 2.6 Choice / Reward Step ── */

export const RewardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  position: relative;
  padding: ${theme.spacing.xl} 0;
`;

export const RewardSparkle = styled.div<{ $delay: number; $left: string; $size: number }>`
  position: absolute;
  left: ${p => p.$left};
  top: 20%;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: ${theme.colors.accent.coral};
  animation: ${sparkleFloat} 2.5s ease-in-out ${p => p.$delay}s infinite;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0;
  }
`;

export const RewardTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  text-align: center;
  color: var(--text-primary);
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

/* ── 2.7 Extras — Detail Chips & Accordion ── */

export const DetailChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: ${theme.spacing.md};
`;

export const DetailChip = styled.button<{ $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border: 1.5px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.full};
  background: ${p => p.$isSelected ? `${theme.colors.accent.coral}12` : 'var(--bg-card)'};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    border-color: ${theme.colors.accent.coral};
    color: ${theme.colors.accent.coral};
  }
  &:active { transform: scale(0.96); }
`;

export const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1.5px solid ${p => p.$isOpen ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: ${p => p.$isOpen ? '12px 12px 0 0' : '12px'};
  background: ${p => p.$isOpen ? `${theme.colors.accent.coral}12` : 'var(--bg-card)'};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${p => p.$isOpen ? theme.colors.accent.coral : 'var(--text-primary)'};
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 0;

  &:hover { border-color: ${theme.colors.accent.coral}; }
`;

export const AccordionChevron = styled.span<{ $isOpen: boolean }>`
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  transform: ${p => p.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  color: ${p => p.$isOpen ? theme.colors.accent.coral : 'var(--text-light)'};
`;

export const AccordionBody = styled.div<{ $isOpen: boolean }>`
  max-height: ${p => p.$isOpen ? '800px' : '0'};
  overflow: hidden;
  transition: max-height 0.35s ease;
  border: ${p => p.$isOpen ? `1.5px solid ${theme.colors.accent.coral}` : '1.5px solid transparent'};
  border-top: none;
  border-radius: 0 0 12px 12px;
  background: var(--bg-card);
  padding: ${p => p.$isOpen ? `${theme.spacing.md}` : '0'};
  width: 100%;
`;

/* ── 2.8 Draft Resume Banner ── */

export const DraftBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.accent.coral}08;
  border: 1.5px solid ${theme.colors.accent.lightCoral}40;
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.sm} ${theme.spacing.lg};
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin: ${theme.spacing.xs} ${theme.spacing.md};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

export const DraftBannerText = styled.span`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: var(--text-primary);
`;

export const DraftBannerButton = styled.button`
  padding: 4px 12px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.accent.coral};
  color: white;
  font-family: ${theme.fonts.body};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover { background: ${theme.colors.button.primaryHover}; }
`;

export const DraftBannerDismiss = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-light);
  font-size: 14px;
  line-height: 1;
  &:hover { color: var(--text-secondary); }
`;

/* ── Gender Selection Cards ── */

export const GenderCard = styled.button<{ $isSelected: boolean; $delay?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  border: 2.5px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--border-color)'};
  border-radius: 20px;
  background: ${p => p.$isSelected
    ? `linear-gradient(160deg, #FFF8F5, #FFF)`
    : 'var(--bg-card)'};
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  animation: ${cardReveal} 0.4s cubic-bezier(0.34,1.56,0.64,1) ${p => (p.$delay || 0) * 0.1}s both;

  ${p => p.$isSelected && css`
    box-shadow: 0 0 0 4px ${theme.colors.accent.coral}18, 0 6px 24px rgba(0,0,0,0.08);
    transform: scale(1.02);
  `}

  &:active { transform: scale(0.96); }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
    border-radius: 24px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 32px rgba(0,0,0,0.1);
      border-color: ${theme.colors.accent.lightCoral};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const GenderCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 72px;
    height: 72px;
  }
`;

export const GenderCardLabel = styled.span<{ $isSelected: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: ${p => p.$isSelected ? theme.colors.accent.coral : 'var(--text-primary)'};
  transition: color 0.2s ease;

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

/* ══════════════════════════════════════════════
   BOOK PREVIEW — Hero banner for age step
   ══════════════════════════════════════════════ */

export const BookPreviewBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: linear-gradient(135deg, ${`${theme.colors.accent.coral}12`}, ${theme.colors.accent.softPeach}30);
  border-radius: 16px;
  margin-bottom: ${theme.spacing.md};
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
    max-width: 100%;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    max-width: 520px;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    gap: ${theme.spacing.lg};
  }
`;

export const BookPreviewCover = styled.div<{ $src: string }>`
  width: 64px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px 10px 10px 4px;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
  box-shadow:
    -3px 0 0 0 ${theme.colors.accent.coral}40,
    -6px 0 0 0 ${theme.colors.accent.coral}20,
    2px 4px 12px rgba(0,0,0,0.15);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05), rgba(0,0,0,0.1));
    border-radius: 2px 0 0 2px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 52px;
    height: 66px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 76px;
    height: 96px;
  }
`;

export const BookPreviewText = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.base};
  }
`;

export const StepMicroText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  text-align: center;
  margin: -4px 0 ${theme.spacing.md};
  line-height: 1.4;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 11px;
    margin: -2px 0 ${theme.spacing.sm};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes.sm};
    margin: -6px 0 ${theme.spacing.lg};
  }
`;

export const ProgressHintText = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  color: var(--text-light);
  text-align: center;
  display: block;
  margin-top: 4px;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;
