import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

/* ──────────────────────────────────────────────
   Animations
   ────────────────────────────────────────────── */

export const slideOutLeft = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(-80px); opacity: 0; }
`;

export const slideInFromRight = keyframes`
  from { transform: translateX(80px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;

export const slideOutRight = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(80px); opacity: 0; }
`;

export const slideInFromLeft = keyframes`
  from { transform: translateX(-80px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const ctaPulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }
  50% { transform: scale(1.02); box-shadow: 0 6px 30px ${theme.colors.accent.coral}60; }
`;

export const buttonPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

/* ──────────────────────────────────────────────
   Wizard Layout
   ────────────────────────────────────────────── */

export const WizardOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: ${theme.colors.background.primary};
  display: flex;
  flex-direction: column;
`;

export const WizardHeader = styled.header`
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    min-height: 48px;
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
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};

  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    left: ${theme.spacing.md};
  }
`;

export const WizardTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

export const ProgressTrack = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${theme.colors.background.secondary};
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: 0 ${theme.borderRadius.full} ${theme.borderRadius.full} 0;
  transition: width 0.5s ${theme.transitions.smooth};
  box-shadow: 0 0 8px ${theme.colors.accent.coral}40;
`;

export const WizardViewport = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

/* ──────────────────────────────────────────────
   Step Container (animated)
   ────────────────────────────────────────────── */

export const StepContainer = styled.div<{
  $state: 'entering' | 'active' | 'exiting';
  $direction: 'forward' | 'backward';
}>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg} ${theme.spacing.xl};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  will-change: transform, opacity;

  ${props => {
    if (props.$state === 'entering') {
      const anim = props.$direction === 'forward' ? slideInFromRight : slideInFromLeft;
      return css`animation: ${anim} 400ms ${theme.transitions.smooth} forwards;`;
    }
    if (props.$state === 'exiting') {
      const anim = props.$direction === 'forward' ? slideOutLeft : slideOutRight;
      return css`animation: ${anim} 400ms ${theme.transitions.smooth} forwards; pointer-events: none;`;
    }
    return '';
  }}

  @supports (height: 100dvh) {
    /* handled by parent */
  }
`;

export const StepContainerCentered = styled(StepContainer)`
  justify-content: center;
`;

export const StepContainerTop = styled(StepContainer)`
  justify-content: flex-start;
  padding-top: ${theme.spacing.xl};
`;

/* ──────────────────────────────────────────────
   Step Title & Subtitle
   ────────────────────────────────────────────── */

export const StepTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  text-align: center;
  margin: 0 0 ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
    margin-bottom: ${theme.spacing.md};
  }
`;

export const StepSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl};
  max-width: 500px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    margin-bottom: ${theme.spacing.lg};
  }
`;

/* ──────────────────────────────────────────────
   Card Grids
   ────────────────────────────────────────────── */

export const CardGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 4}, 1fr);
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 900px;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.sm};
    max-width: 100%;
  }
`;

/* ──────────────────────────────────────────────
   Color Selectors (eye + hair)
   ────────────────────────────────────────────── */

export const ColorSectionLabel = styled.h4`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 600px;
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.lg};
  }
`;

export const ColorOption = styled.div<{ color: string; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${props => props.$isSelected ? theme.colors.accent.coral : '#E5E5E5'};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  background: ${props => props.$isSelected ? theme.colors.accent.creamyYellow : theme.colors.background.white};

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.sm};
  }
`;

export const ColorCircle = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${props => props.color};
  margin-right: ${theme.spacing.sm};
  border: 1px solid #ccc;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 16px;
    height: 16px;
    margin-right: ${theme.spacing.xs};
  }
`;

export const ColorLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

/* ──────────────────────────────────────────────
   Input Fields
   ────────────────────────────────────────────── */

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
  }
`;

export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const CustomInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  margin-top: ${theme.spacing.md};
  transition: border-color ${theme.transitions.smooth};
  box-sizing: border-box;
  animation: ${fadeIn} 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15;
  }

  &::placeholder { color: ${theme.colors.text.light}; }

  @media (max-width: 480px) { font-size: 16px; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  max-width: 600px;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  resize: vertical;
  min-height: 80px;
  transition: border-color ${theme.transitions.smooth};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15;
  }

  &::placeholder { color: ${theme.colors.text.light}; }

  @media (max-width: 480px) { font-size: 16px; }
`;

/* ──────────────────────────────────────────────
   Photo Upload
   ────────────────────────────────────────────── */

export const PhotoUploadZone = styled.div<{ $hasPhoto: boolean }>`
  border: 2px dashed ${props => props.$hasPhoto ? theme.colors.accent.coral : theme.colors.accent.lightCoral};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']} ${theme.spacing['2xl']};
  text-align: center;
  width: 100%;
  max-width: 500px;
  transition: all ${theme.transitions.smooth};
  background: ${props => props.$hasPhoto
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}40, ${theme.colors.accent.lightCoral}15)`
    : `linear-gradient(135deg, ${theme.colors.background.secondary}, ${theme.colors.accent.creamyYellow}20)`
  };
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.accent.coral};
    background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}60, ${theme.colors.accent.lightCoral}20);
    box-shadow: ${theme.shadows.md};
  }
`;

export const PhotoIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
`;

export const PhotoMainText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs};
`;

export const PhotoSubText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

/* ──────────────────────────────────────────────
   Buttons
   ────────────────────────────────────────────── */

export const ContinueButton = styled.button<{ $isReady: boolean }>`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: ${theme.spacing.xl} auto 0;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isReady
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : '#ccc'
  };

  ${props => props.$isReady && css`
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 25px ${theme.colors.accent.coral}40;
    }
  `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    max-width: 100%;
  }
`;

export const SkipLink = styled.button`
  display: block;
  margin: ${theme.spacing.lg} auto 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.accent.coral};
  }
`;

export const DiscoverCTA = styled.button<{ $isReady?: boolean }>`
  display: block;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});

  ${props => props.$isReady !== false && css`
    animation: ${ctaPulse} 2.5s ease-in-out infinite;
  `}

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 35px ${theme.colors.accent.coral}50;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    max-width: 100%;
  }
`;

/* ──────────────────────────────────────────────
   Collapsible Pill (for extras step)
   ────────────────────────────────────────────── */

export const CollapsiblePill = styled.button<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: 1.5px solid ${props => props.$isOpen ? theme.colors.accent.coral : theme.colors.accent.lightCoral};
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.$isOpen
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}50, ${theme.colors.accent.lightCoral}15)`
    : 'transparent'
  };
  color: ${props => props.$isOpen ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${theme.spacing.sm};

  &:hover {
    border-color: ${theme.colors.accent.coral};
    color: ${theme.colors.accent.coral};
    background: ${theme.colors.accent.creamyYellow}40;
  }
`;

export const CollapsibleChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const CollapsibleContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '5000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
  margin-top: ${props => props.$isOpen ? theme.spacing.md : '0'};
  width: 100%;
  max-width: 900px;
`;

/* ──────────────────────────────────────────────
   Section Wrapper (extras step)
   ────────────────────────────────────────────── */

export const ExtrasSection = styled.div`
  width: 100%;
  max-width: 900px;
  margin-bottom: ${theme.spacing.lg};
`;

export const SectionTitle = styled.h4`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: ${theme.borderRadius.full};
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
    flex-shrink: 0;
  }
`;

/* ──────────────────────────────────────────────
   Payment Styles (reused from UnifiedStoryForm)
   ────────────────────────────────────────────── */

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  max-width: 800px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }
`;

export const OrderInfoSection = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};
  width: 100%;
  max-width: 800px;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
  }
`;

export const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
  @media (max-width: ${theme.breakpoints.sm}) { gap: ${theme.spacing.md}; }
`;

export const FullWidthField = styled(InputField)`
  grid-column: 1 / -1;
`;

export const OrderCostSummary = styled.div<{ $variant: 'free' | 'paid' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  margin-bottom: ${theme.spacing.xl};
  width: 100%;
  max-width: 800px;
  background: ${props => {
    switch (props.$variant) {
      case 'free': return `linear-gradient(135deg, ${theme.colors.accent.lightGreen}30, #a8e6cf30)`;
      case 'paid': return theme.colors.accent.creamyYellow;
      case 'info': return theme.colors.background.secondary;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'free': return '#2d6a4f';
      case 'paid': return theme.colors.text.primary;
      case 'info': return theme.colors.text.secondary;
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'free': return '#a8e6cf';
      case 'paid': return `${theme.colors.accent.lightCoral}30`;
      case 'info': return '#E5E7EB';
    }
  }};
`;

export const PayButton = styled.button<{ $isReady: boolean }>`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});

  ${props => props.$isReady && css`
    animation: ${buttonPulse} 2s ease infinite;
    box-shadow: 0 0 20px ${theme.colors.accent.coral}40;

    &:hover {
      box-shadow: 0 0 30px ${theme.colors.accent.coral}60;
    }
  `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    animation: none;
  }
`;

export const TrustBadgesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) { gap: ${theme.spacing.md}; }
`;

export const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-weight: 500;

  span.trust-icon {
    font-size: ${theme.fontSizes.base};
    line-height: 1;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  background: #FFF5F5;
  border: 1px solid #FED7D7;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  color: #C53030;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

export const ConnectedBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.softPink}15);
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  font-weight: 500;
  overflow-wrap: anywhere;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.xs};
  }
`;

export const ClubFreeCard = styled.div<{ $isSelected: boolean }>`
  background: ${props => props.$isSelected
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.lightCoral}20)`
    : theme.colors.background.white
  };
  border: 2px solid ${props => props.$isSelected ? theme.colors.accent.coral : '#E5E7EB'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  position: relative;
  margin-bottom: ${theme.spacing.xl};

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.md};
  }
`;

export const ClubBadge = styled.span`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  padding: 4px ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  white-space: nowrap;
`;

export const ClubExhaustedMsg = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border: 1px solid #E5E7EB;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

export const StyledIconCircle = styled.span<{ $gradient: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.$gradient};
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-size: 12px;
  flex-shrink: 0;
`;
