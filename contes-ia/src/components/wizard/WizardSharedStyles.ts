import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

/* ══════════════════════════════════════════════
   ANIMATIONS — Living, breathing UI
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

export const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.015); }
`;

export const gradientDrift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const softFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
`;

export const iconPop = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

export const shimmerGlow = keyframes`
  0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  50%      { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
`;

export const ctaPulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }
  50%      { transform: scale(1.02); box-shadow: 0 6px 30px ${theme.colors.accent.coral}60; }
`;

/* ══════════════════════════════════════════════
   WIZARD LAYOUT — Full-screen immersive
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
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
  flex: 1;
  position: relative;
  overflow: hidden;
`;

/* ══════════════════════════════════════════════
   STEP CONTAINERS — Animated transitions
   ══════════════════════════════════════════════ */

const stepAnimation = css<{ $state: 'entering' | 'active' | 'exiting'; $direction: 'forward' | 'backward' }>`
  ${p => {
    if (p.$state === 'entering') {
      const anim = p.$direction === 'forward' ? slideInFromRight : slideInFromLeft;
      return css`
        animation: ${anim} 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        pointer-events: none;
      `;
    }
    if (p.$state === 'exiting') {
      const anim = p.$direction === 'forward' ? slideOutLeft : slideOutRight;
      return css`
        animation: ${anim} 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        pointer-events: none;
      `;
    }
    return css`pointer-events: auto;`;
  }}
`;

export const StepContainer = styled.div<{
  $state: 'entering' | 'active' | 'exiting';
  $direction: 'forward' | 'backward';
}>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing['2xl']};
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  will-change: transform, opacity;
  ${stepAnimation}

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.xl};
  }
`;

export const StepContainerCentered = styled(StepContainer)`
  justify-content: center;
  padding-top: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding-top: ${theme.spacing.md};
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
`;

export const StepSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.lg};
  max-width: 400px;
  line-height: 1.5;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    margin-bottom: ${theme.spacing.md};
  }
`;

/* ══════════════════════════════════════════════
   LIVING CARD — Animated, breathing card system
   ══════════════════════════════════════════════ */

export const CardGrid = styled.div<{ $columns?: number; $compact?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$columns || 2}, 1fr);
  gap: ${p => p.$compact ? theme.spacing.sm : theme.spacing.md};
  width: 100%;
  max-width: ${p => (p.$columns || 2) >= 3 ? '640px' : '420px'};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.sm};
    max-width: 100%;
  }
`;

export const LivingCard = styled.button<{
  $isSelected: boolean;
  $gradient: string;
  $delay?: number;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'transparent'};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: border-color 0.25s ease, transform 0.25s ease;
  background: ${p => p.$gradient};
  background-size: 200% 200%;
  animation:
    ${gradientDrift} ${p => 6 + (p.$delay || 0) * 2}s ease-in-out infinite,
    ${shimmerGlow} ${p => 4 + (p.$delay || 0)}s ease-in-out infinite,
    ${iconPop} 0.4s cubic-bezier(0.34,1.56,0.64,1) ${p => (p.$delay || 0) * 0.08}s both;
  overflow: hidden;
  min-height: 80px;
  -webkit-tap-highlight-color: transparent;

  ${p => p.$isSelected && css`
    transform: scale(0.96);
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}25;
  `}

  &:active { transform: scale(0.95); }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} 6px;
    min-height: 68px;
    gap: 4px;
    border-radius: ${theme.borderRadius.md};
  }
`;

export const CardEmoji = styled.span<{ $size?: string }>`
  font-size: ${p => p.$size || '1.6rem'};
  line-height: 1;
  animation: ${softFloat} 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${p => p.$size ? `calc(${p.$size} * 0.85)` : '1.3rem'};
  }
`;

export const CardLabel = styled.span<{ $small?: boolean }>`
  font-family: ${theme.fonts.body};
  font-size: ${p => p.$small ? theme.fontSizes.xs : theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

export const CardDescription = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  color: ${theme.colors.text.light};
  text-align: center;
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

/* ══════════════════════════════════════════════
   COLOR CARDS — Visual eye/hair selectors
   ══════════════════════════════════════════════ */

export const ColorCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 400px;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    max-width: 100%;
  }
`;

export const ColorCard = styled.button<{ $isSelected: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: ${theme.spacing.sm};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'rgba(0,0,0,0.06)'};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.white};
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  ${p => p.$isSelected && css`
    background: ${theme.colors.accent.creamyYellow};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}20;
  `}

  &:active { transform: scale(0.95); }
`;

export const ColorBubble = styled.div<{ $color: string; $isSelected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  background: ${p => p.$color};
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: 0 2px 8px ${p => p.$color}40, inset 0 -2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  animation: ${breathe} 3s ease-in-out infinite;

  ${p => p.$isSelected && css`
    transform: scale(1.1);
    box-shadow: 0 2px 12px ${p.$color}60;
  `}

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 30px;
    height: 30px;
  }
`;

export const ColorLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.primary};
  font-weight: 500;
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
  }
`;

export const ColorSectionLabel = styled.h4`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    margin-bottom: 6px;
  }
`;

/* ══════════════════════════════════════════════
   ILLUSTRATION STYLE CARD — With image
   ══════════════════════════════════════════════ */

export const StyleCard = styled.button<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : 'transparent'};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  background: ${theme.colors.background.white};
  -webkit-tap-highlight-color: transparent;

  ${p => p.$isSelected && css`
    transform: scale(0.96);
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}25;
  `}

  &:active { transform: scale(0.95); }
`;

export const StyleImage = styled.div<{ $src: string }>`
  width: 100%;
  aspect-ratio: 1;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
  transition: transform 8s ease;

  ${StyleCard}:hover & {
    transform: scale(1.08);
  }
`;

export const StyleLabel = styled.span`
  padding: 6px 4px;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  text-align: center;
  width: 100%;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
    padding: 4px 2px;
  }
`;

/* ══════════════════════════════════════════════
   INPUT FIELDS
   ══════════════════════════════════════════════ */

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 420px;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
  }
`;

export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const CustomInput = styled.input`
  width: 100%;
  max-width: 420px;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  margin-top: ${theme.spacing.md};
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  animation: ${fadeIn} 0.3s ease;

  &:focus { outline: none; border-color: ${theme.colors.accent.coral}; box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15; }
  &::placeholder { color: ${theme.colors.text.light}; }
  @media (max-width: 480px) { font-size: 16px; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  max-width: 420px;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  resize: vertical;
  min-height: 70px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus { outline: none; border-color: ${theme.colors.accent.coral}; box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15; }
  &::placeholder { color: ${theme.colors.text.light}; }
  @media (max-width: 480px) { font-size: 16px; }
`;

/* ══════════════════════════════════════════════
   PHOTO UPLOAD
   ══════════════════════════════════════════════ */

export const PhotoUploadZone = styled.div<{ $hasPhoto: boolean }>`
  border: 2px dashed ${p => p.$hasPhoto ? theme.colors.accent.coral : '#D1D5DB'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  text-align: center;
  width: 100%;
  max-width: 380px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.$hasPhoto
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}40, ${theme.colors.accent.lightCoral}15)`
    : theme.colors.background.secondary
  };

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.md};
  }
`;

export const PhotoIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.sm};
`;

export const PhotoMainText = styled.p`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 4px;
`;

export const PhotoSubText = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

/* ══════════════════════════════════════════════
   BUTTONS
   ══════════════════════════════════════════════ */

export const ContinueButton = styled.button<{ $isReady: boolean }>`
  display: block;
  width: 100%;
  max-width: 320px;
  margin: ${theme.spacing.lg} auto 0;
  padding: 14px ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${p => p.$isReady
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : '#D1D5DB'
  };

  ${p => p.$isReady && css`
    &:hover { transform: scale(1.02); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }
  `}

  &:disabled { cursor: not-allowed; opacity: 0.5; }

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 100%;
    font-size: ${theme.fontSizes.sm};
    padding: 12px ${theme.spacing.lg};
  }
`;

export const SkipLink = styled.button`
  display: block;
  margin: ${theme.spacing.md} auto 0;
  padding: ${theme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover { color: ${theme.colors.accent.coral}; }
`;

/* Big choice buttons for "Discover" vs "Personalize" */
export const ChoiceCard = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 340px;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border: 2px solid ${p => p.$variant === 'primary' ? theme.colors.accent.coral : 'rgba(0,0,0,0.08)'};
  border-radius: ${theme.borderRadius.xl};
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  background: ${p => p.$variant === 'primary'
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : theme.colors.background.white
  };

  ${p => p.$variant === 'primary' && css`
    animation: ${ctaPulse} 2.5s ease-in-out infinite;
    color: white;
  `}

  ${p => p.$variant === 'secondary' && css`
    color: ${theme.colors.text.primary};
    box-shadow: ${theme.shadows.sm};
    &:hover { border-color: ${theme.colors.accent.lightCoral}; box-shadow: ${theme.shadows.md}; }
  `}

  &:active { transform: scale(0.97); }
`;

export const ChoiceEmoji = styled.span`
  font-size: 2rem;
  line-height: 1;
`;

export const ChoiceTitle = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${p => p.$variant === 'primary' ? 'white' : theme.colors.text.primary};
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

export const ChoiceDesc = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-size: ${theme.fontSizes.xs};
  color: ${p => p.$variant === 'primary' ? 'rgba(255,255,255,0.85)' : theme.colors.text.secondary};
  text-align: center;
  line-height: 1.4;
`;

export const DiscoverCTA = styled.button`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  animation: ${ctaPulse} 2.5s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;

  &:hover { transform: scale(1.03); }
  &:active { transform: scale(0.98); }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
    padding: 14px ${theme.spacing.lg};
    max-width: 100%;
  }
`;

/* ══════════════════════════════════════════════
   EXTRAS SECTIONS
   ══════════════════════════════════════════════ */

export const ExtrasSection = styled.div`
  width: 100%;
  max-width: 420px;
  margin-bottom: ${theme.spacing.lg};
`;

export const SectionTitle = styled.h4`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

export const CollapsiblePill = styled.button<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: 6px ${theme.spacing.md};
  border: 1.5px solid ${p => p.$isOpen ? theme.colors.accent.coral : '#E5E7EB'};
  border-radius: ${theme.borderRadius.full};
  background: ${p => p.$isOpen ? theme.colors.accent.creamyYellow : 'transparent'};
  color: ${p => p.$isOpen ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${theme.spacing.xs};
  -webkit-tap-highlight-color: transparent;

  &:hover { border-color: ${theme.colors.accent.coral}; color: ${theme.colors.accent.coral}; }
`;

export const CollapsibleChevron = styled.span<{ $isOpen: boolean }>`
  font-size: 0.6rem;
  transition: transform 0.3s ease;
  transform: ${p => p.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const CollapsibleContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${p => p.$isOpen ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
  margin-top: ${p => p.$isOpen ? theme.spacing.sm : '0'};
  width: 100%;
`;

/* ══════════════════════════════════════════════
   PAYMENT STYLES
   ══════════════════════════════════════════════ */

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  max-width: 600px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

export const OrderInfoSection = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  width: 100%;
  max-width: 600px;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

export const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
`;

export const FullWidthField = styled(InputField)`
  grid-column: 1 / -1;
`;

export const OrderCostSummary = styled.div<{ $variant: 'free' | 'paid' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  margin-bottom: ${theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  text-align: center;
  background: ${p => p.$variant === 'free' ? '#ecfdf5' : p.$variant === 'paid' ? theme.colors.accent.creamyYellow : theme.colors.background.secondary};
  color: ${p => p.$variant === 'free' ? '#065f46' : theme.colors.text.primary};
  border: 1px solid ${p => p.$variant === 'free' ? '#a7f3d0' : p.$variant === 'paid' ? `${theme.colors.accent.lightCoral}30` : '#E5E7EB'};
`;

export const PayButton = styled.button<{ $isReady: boolean }>`
  display: block;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});

  ${p => p.$isReady && css`
    box-shadow: 0 0 20px ${theme.colors.accent.coral}40;
    &:hover { box-shadow: 0 0 30px ${theme.colors.accent.coral}60; }
  `}

  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

export const TrustBadgesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) { gap: ${theme.spacing.sm}; }
`;

export const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-weight: 500;

  span.trust-icon { font-size: ${theme.fontSizes.sm}; line-height: 1; }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF5F5;
  border: 1px solid #FED7D7;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  color: #C53030;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

export const ConnectedBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.accent.creamyYellow};
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.primary};
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const ClubFreeCard = styled.div<{ $isSelected: boolean }>`
  background: ${p => p.$isSelected ? theme.colors.accent.creamyYellow : theme.colors.background.white};
  border: 2px solid ${p => p.$isSelected ? theme.colors.accent.coral : '#E5E7EB'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: ${theme.spacing.lg};

  &:hover { border-color: ${theme.colors.accent.coral}; box-shadow: ${theme.shadows.md}; }
`;

export const ClubBadge = styled.span`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 3px ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  white-space: nowrap;
`;

export const ClubExhaustedMsg = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border: 1px solid #E5E7EB;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;
