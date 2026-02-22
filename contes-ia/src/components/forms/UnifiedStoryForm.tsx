import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { SelectionCard } from '../ui/SelectionCard';
import { ImageSelectionCard } from '../ui/ImageSelectionCard';
import { ImageAgeCard } from '../ui/ImageAgeCard';
import { ImageThemeCard } from '../ui/ImageThemeCard';
import { CustomThemeCard } from '../ui/CustomThemeCard';
import { ImageOccasionCard } from '../ui/ImageOccasionCard';
import { CustomOccasionCard } from '../ui/CustomOccasionCard';
import { ImageMessageCard } from '../ui/ImageMessageCard';
import { CustomMessageCard } from '../ui/CustomMessageCard';
import { Button } from '../ui/Button';
import { ValidatedInput } from '../ui/ValidatedInput';
import { AgeSelector } from '../ui/AgeSelector';
import { PricingCard } from '../ui/PricingCard';
import { SecondaryCharactersSection } from './SecondaryCharactersSection';
import {
  AGE_RANGES,
  GENERAL_THEMES,
  SPECIFIC_SUBJECTS,
  CENTRAL_MESSAGES,
  ILLUSTRATION_STYLES,
  EYE_COLORS,
  HAIR_COLORS,
  LANGUAGES,
  RELIGIONS,
  GENDERS,
  StoryFormData,
  SecondaryCharacter
} from '../../types/FormTypes';
import { validateEmail, validateRequired } from '../../utils/validation';
import { ApiService } from '../../config/api';
import { BookCoverPreview } from '../ui/BookCoverPreview';

interface UnifiedStoryFormProps {
  formData: Partial<StoryFormData>;
  onUpdate: (data: Partial<StoryFormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isAuthenticated?: boolean;
  isClub?: boolean;
  currentUser?: { id: string; email: string; firstName?: string; lastName?: string; role: string } | null;
  clubCredit?: { canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null;
}

/* ──────────────────────────────────────────────
   V2 Keyframe Animations
   ────────────────────────────────────────────── */

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px ${theme.colors.accent.coral}40, 0 0 40px ${theme.colors.accent.coral}20;
  }
  50% {
    box-shadow: 0 0 30px ${theme.colors.accent.coral}60, 0 0 60px ${theme.colors.accent.coral}30;
  }
`;

const buttonPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
`;

/* ──────────────────────────────────────────────
   V2 Styled Components
   ────────────────────────────────────────────── */

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.sm};
    overflow-x: hidden;
    width: 100%;
  }
`;

const Section = styled.div<{ $isVisible: boolean; $isCompleted: boolean }>`
  opacity: ${props => props.$isVisible ? 1 : 0.3};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  margin-bottom: ${theme.spacing['3xl']};
  transition: all ${theme.transitions.smooth};
  position: relative;
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 1100px;

  /* V2: Better visual separation for active sections */
  background: ${props => props.$isVisible && !props.$isCompleted
    ? theme.colors.background.white
    : props.$isCompleted
      ? theme.colors.background.primary
      : 'transparent'
  };
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${props => props.$isVisible && !props.$isCompleted
    ? theme.shadows.card
    : props.$isCompleted
      ? theme.shadows.sm
      : 'none'
  };
  border: ${props => props.$isVisible && !props.$isCompleted
    ? '1px solid rgba(0,0,0,0.04)'
    : props.$isCompleted
      ? `1px solid ${theme.colors.accent.lightCoral}30`
      : '1px solid transparent'
  };

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.xl};
    /* V2: Subtle background on mobile */
    background: ${props => props.$isVisible
      ? theme.colors.background.secondary
      : 'transparent'
    };
    border: none;
    box-shadow: ${props => props.$isVisible ? theme.shadows.sm : 'none'};
  }
`;

const SectionHeader = styled.div<{ $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.md} 0 ${theme.spacing.lg};
  position: relative;

  /* V2: Gradient underline instead of plain border */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: ${theme.borderRadius.full};
    background: ${props => props.$isCompleted
      ? `linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink})`
      : `linear-gradient(90deg, ${theme.colors.background.secondary}, ${theme.colors.background.secondary})`
    };
    transition: background ${theme.transitions.smooth};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const SectionTitle = styled.h3<{ $isCompleted: boolean }>`
  font-family: ${theme.fonts.heading};
  /* V2: Larger on desktop */
  font-size: ${theme.fontSizes['2xl']};
  color: ${props => props.$isCompleted ? theme.colors.accent.coral : theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: color ${theme.transitions.base};

  @media (min-width: ${theme.breakpoints.md}) {
    justify-content: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CompletedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.accent.creamyYellow};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${theme.colors.accent.coral};
  transition: all ${theme.transitions.base};
`;

const EditButton = styled.button`
  background: transparent;
  border: 1px solid ${theme.colors.accent.coral};
  color: ${theme.colors.accent.coral};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};

  &:hover {
    background: ${theme.colors.accent.coral};
    color: ${theme.colors.background.white};
    box-shadow: ${theme.shadows.glow};
  }
`;


const FormSection = styled.div`
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const OptionTitle = styled.h4`
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  /* V2: Subtle colored dot accent before the text */
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: ${theme.borderRadius.full};
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
    flex-shrink: 0;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
    font-weight: 700;

    &::before {
      width: 10px;
      height: 10px;
    }
  }
`;

const SelectionGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 4}, 1fr);
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${theme.spacing.md};
  }

  /* V2: Better gap on mobile */
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${theme.spacing.md};
  }
`;

const CustomInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  margin-top: ${theme.spacing.md};
  transition: border-color ${theme.transitions.smooth};
  box-sizing: border-box;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15;
  }

  &::placeholder {
    color: ${theme.colors.text.light};
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.md};
  }
`;

const ColorOption = styled.div<{ color: string; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm};
  border: 2px solid ${props => props.$isSelected ? theme.colors.accent.coral : '#E5E5E5'};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  background-color: ${props => props.$isSelected ? theme.colors.accent.creamyYellow : theme.colors.background.white};

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.sm};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs};
  }
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${props => props.color};
  margin-right: ${theme.spacing.sm};
  border: 1px solid #ccc;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 16px;
    height: 16px;
    margin-right: ${theme.spacing.xs};
  }
`;

const ColorLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

/* V2: More inviting PhotoUploadSection with icon and better background */
const PhotoUploadSection = styled.div`
  border: 2px dashed ${theme.colors.accent.lightCoral};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  transition: all ${theme.transitions.smooth};
  background: ${theme.colors.background.secondary};
  position: relative;

  /* V2: Camera icon decoration */
  &::before {
    content: '📷';
    display: block;
    font-size: ${theme.fontSizes['3xl']};
    margin-bottom: ${theme.spacing.sm};
    opacity: 0.7;
    transition: opacity ${theme.transitions.smooth};
  }

  &:hover {
    border-color: ${theme.colors.accent.coral};
    background: ${theme.colors.accent.creamyYellow};
    box-shadow: ${theme.shadows.md};

    &::before {
      opacity: 1;
    }
  }
`;

const PhotoUploadText = styled.p`
  color: ${theme.colors.text.light};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  resize: vertical;
  min-height: 80px;
  transition: border-color ${theme.transitions.smooth};
  box-sizing: border-box;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15;
  }

  &::placeholder {
    color: ${theme.colors.text.light};
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.fontSizes.xs};
  }
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  background: ${props => props.$isActive ?
    `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.lightCoral})` :
    theme.colors.background.white
  };
  color: ${props => props.$isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  border: 2px solid ${props => props.$isActive ? 'transparent' : '#E5E7EB'};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  margin-bottom: ${theme.spacing.lg};

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.sm};
  }
`;

const SecondaryCharacterSection = styled.div`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.xl};
`;

const ConnectedBanner = styled.div`
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
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-wrap: wrap;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.xs};
    gap: ${theme.spacing.xs};
    line-height: 1.4;
  }
`;

const ClubFreeCard = styled.div<{ $isSelected: boolean }>`
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

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.md};
  }
`;

const ClubBadge = styled.span`
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

const ClubExhaustedMsg = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border: 1px solid #E5E7EB;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const OrderCostSummary = styled.div<{ $variant: 'free' | 'paid' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  margin-bottom: ${theme.spacing.xl};
  background: ${props => {
    switch (props.$variant) {
      case 'free': return `linear-gradient(135deg, ${theme.colors.accent.lightGreen}30, #a8e6cf30)`;
      case 'paid': return `${theme.colors.accent.creamyYellow}`;
      case 'info': return `${theme.colors.background.secondary}`;
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

const OrderInfoSection = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'block' : 'none'};
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};
  transition: all ${theme.transitions.smooth};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

const FullWidthField = styled(InputField)`
  grid-column: 1 / -1;
`;

/* V2: Enhanced PaymentSection */
const PaymentSection = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
`;

/* V2: Green gradient ReadyMessage instead of coral */
const ReadyMessage = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #a8e6cf);
  border-radius: ${theme.borderRadius.lg};
  color: #2d6a4f;
  font-weight: 600;
  font-size: ${theme.fontSizes.base};
  animation: ${slideIn} 0.5s ${theme.transitions.smooth};
  border: 1px solid #a8e6cf;
`;

/* V2: Larger pay button with glow animation when ready */
const PayButton = styled(Button)<{ $isReady: boolean }>`
  position: relative;
  transition: all ${theme.transitions.smooth};

  ${props => props.$isReady && css`
    font-size: ${theme.fontSizes.lg};
    padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
    animation: ${buttonPulse} 2s ease infinite;
    box-shadow: 0 0 20px ${theme.colors.accent.coral}40, 0 0 40px ${theme.colors.accent.coral}20;

    &:hover {
      box-shadow: 0 0 30px ${theme.colors.accent.coral}60, 0 0 60px ${theme.colors.accent.coral}30;
    }
  `}
`;

/* V2: Softer error with icon */
const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  background-color: #FFF5F5;
  border: 1px solid #FED7D7;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  color: #C53030;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  transition: all ${theme.transitions.base};

  &::before {
    content: '\u26A0\uFE0F';
    font-size: ${theme.fontSizes.lg};
    flex-shrink: 0;
  }
`;

/* V2: Trust badges row */
const TrustBadgesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

const TrustBadge = styled.div`
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

export const UnifiedStoryForm: React.FC<UnifiedStoryFormProps> = ({
  formData,
  onUpdate,
  onSubmit,
  isSubmitting,
  isAuthenticated = false,
  isClub = false,
  currentUser = null,
  clubCredit = null
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string>('');
  const [showReligionSection, setShowReligionSection] = useState<boolean>(!!formData.religion);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs pour auto-scroll
  const themeRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const protagonistRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const eyeColorRef = useRef<HTMLDivElement>(null);
  const hairColorRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  // Fonction utilitaire pour auto-scroll optimisé
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, offset = 120) => {
    setTimeout(() => {
      if (ref.current) {
        const elementPosition = ref.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 200);
  };

  // Vérifier la complétion des sections
  const isChoicesComplete = !!(
    formData.ageRange &&
    formData.generalTheme &&
    formData.specificSubject &&
    formData.centralMessage &&
    formData.illustrationStyle
  );

  const isProtagonistComplete = !!(
    formData.protagonistName &&
    formData.protagonistAge &&
    formData.protagonistGender &&
    formData.eyeColor &&
    formData.hairColor
  );

  const isPaymentInfoComplete = () => {
    return !!(
      formData.productType &&
      formData.userEmail &&
      formData.firstName &&
      formData.lastName
    );
  };

  // Déterminer quelles sections sont visibles
  const isProtagonistVisible = isChoicesComplete || editingSection === 'protagonist';
  const isPaymentVisible = isProtagonistComplete || editingSection === 'payment';

  // Gestion des sélections avec auto-advance
  const handleSelection = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });

    if (value === 'custom' || value === 'other') {
      return;
    }

    switch (field) {
      case 'ageRange':
        scrollToSection(themeRef);
        break;
      case 'generalTheme':
        scrollToSection(subjectRef);
        break;
      case 'specificSubject':
        scrollToSection(messageRef);
        break;
      case 'centralMessage':
        scrollToSection(styleRef);
        break;
      case 'illustrationStyle':
        if (isChoicesComplete) {
          scrollToSection(protagonistRef);
        }
        break;
      case 'protagonistGender':
        scrollToSection(eyeColorRef);
        break;
      case 'eyeColor':
        scrollToSection(hairColorRef);
        break;
      case 'hairColor':
        scrollToSection(photoRef);
        break;
    }
  };

  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdate({ photo: file });
      scrollToSection(languageRef);
    }
  };

  const handleProductSelection = (purchaseType: 'single' | 'club') => {
    setGlobalError('');
    onUpdate({ productType: 'ebook', purchaseType });
    scrollToSection(paymentRef, 150);
  };

  const handleEmailBlurCheck = async () => {
    if (!formData.userEmail) return;
    const emailValidation = validateEmail(formData.userEmail);
    if (!emailValidation.isValid) return;
    try {
      const response = await ApiService.checkEmail(formData.userEmail);
      if (response.success) {
        setEmailStatus({ exists: response.exists, hasPassword: !!response.hasPassword });
      }
    } catch (error) {
      // Silent fail - non-blocking
    }
  };

  const handlePasswordChange = (value: string) => {
    onUpdate({ password: value });
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    setGlobalError('');
    onUpdate({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmailChange = (value: string) => {
    setGlobalError('');
    onUpdate({ userEmail: value });
    if (errors.userEmail) {
      setErrors(prev => ({ ...prev, userEmail: '' }));
    }
  };

  const validateField = (field: string, value: string, validationType?: 'email') => {
    let validation: { isValid: boolean; error?: string };

    switch (validationType) {
      case 'email':
        validation = validateEmail(value);
        break;
      default:
        validation = validateRequired(value, field);
    }

    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field]: validation.error || '' }));
      return false;
    }

    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.userEmail) {
      newErrors.userEmail = 'L\'email est obligatoire';
      isValid = false;
    } else {
      const emailValidation = validateEmail(formData.userEmail);
      if (!emailValidation.isValid) {
        newErrors.userEmail = emailValidation.error || 'Email invalide';
        isValid = false;
      }
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est obligatoire';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est obligatoire';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      scrollToSection(paymentRef, 150);
      setGlobalError('Veuillez remplir tous les champs obligatoires (Email, Prénom, Nom)');
    }

    return isValid;
  };

  const handleFormSubmit = () => {
    setGlobalError('');
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);
    if (section === 'choices') {
      scrollToSection(themeRef);
    } else if (section === 'protagonist') {
      scrollToSection(protagonistRef);
    }
  };

  useEffect(() => {
    if (isChoicesComplete && !editingSection) {
      scrollToSection(protagonistRef);
    }
  }, [isChoicesComplete]);

  useEffect(() => {
    if (isProtagonistComplete && !editingSection) {
      scrollToSection(optionsRef);
    }
  }, [isProtagonistComplete]);

  return (
    <FormContainer>
      {/* Section 1: Choix du conte */}
      <Section
        $isVisible={true}
        $isCompleted={isChoicesComplete}
        id="choices-section"
      >
        <SectionHeader $isCompleted={isChoicesComplete}>
          <SectionTitle $isCompleted={isChoicesComplete}>
            ✨ Choix du conte
            {isChoicesComplete && <CompletedBadge>✓ Complété</CompletedBadge>}
          </SectionTitle>
          {isChoicesComplete && !editingSection && (
            <EditButton onClick={() => handleEdit('choices')}>Modifier</EditButton>
          )}
        </SectionHeader>

        <FormSection>
          <OptionTitle>
            Pour quel âge ?
          </OptionTitle>
          <SelectionGrid $columns={4}>
            {AGE_RANGES.map((range) => (
              <ImageAgeCard
                key={range.value}
                value={range.value}
                label={range.label}
                description={range.description}
                imagePath={range.imagePath}
                isSelected={formData.ageRange === range.value}
                onClick={(value) => handleSelection('ageRange', value)}
              />
            ))}
          </SelectionGrid>
        </FormSection>

        <FormSection ref={themeRef}>
          <OptionTitle>
            Quel univers ?
          </OptionTitle>
          <SelectionGrid>
            {GENERAL_THEMES.map((theme_item) => (
              <ImageThemeCard
                key={theme_item.value}
                value={theme_item.value}
                label={theme_item.label}
                imagePath={theme_item.imagePath}
                isSelected={formData.generalTheme === theme_item.value}
                onClick={(value) => handleSelection('generalTheme', value)}
              />
            ))}
            <CustomThemeCard
              value="custom"
              label="Personnalisé"
              imagePath="/image/themes/personnalise.png"
              isSelected={formData.generalTheme === 'custom'}
              onClick={(value) => handleSelection('generalTheme', value)}
            />
          </SelectionGrid>
          {formData.generalTheme === 'custom' && (
            <CustomInput
              type="text"
              placeholder="Entrez le thème que vous souhaitez"
              value={formData.customTheme || ''}
              onChange={(e) => handleInputChange('customTheme', e.target.value)}
            />
          )}
        </FormSection>

        <FormSection ref={subjectRef}>
          <OptionTitle>
            Quelle occasion ?
          </OptionTitle>
          <SelectionGrid>
            {SPECIFIC_SUBJECTS.map((subject) => (
              <ImageOccasionCard
                key={subject.value}
                value={subject.value}
                label={subject.label}
                imagePath={subject.imagePath}
                isSelected={formData.specificSubject === subject.value}
                onClick={(value) => handleSelection('specificSubject', value)}
              />
            ))}
            <CustomOccasionCard
              value="custom"
              label="Occasion personnalisée"
              imagePath="/image/occasions/personnalise.png"
              isSelected={formData.specificSubject === 'custom'}
              onClick={(value) => handleSelection('specificSubject', value)}
            />
          </SelectionGrid>
          {formData.specificSubject === 'custom' && (
            <CustomInput
              type="text"
              placeholder="Entrez votre sujet souhaité"
              value={formData.customSubject || ''}
              onChange={(e) => handleInputChange('customSubject', e.target.value)}
            />
          )}
        </FormSection>

        <FormSection ref={messageRef}>
          <OptionTitle>
            Quel message transmettre ?
          </OptionTitle>
          <SelectionGrid>
            {CENTRAL_MESSAGES.map((message) => (
              <ImageMessageCard
                key={message.value}
                value={message.value}
                label={message.label}
                imagePath={message.imagePath}
                isSelected={formData.centralMessage === message.value}
                onClick={(value) => handleSelection('centralMessage', value)}
              />
            ))}
            <CustomMessageCard
              value="custom"
              label="Message personnalisé"
              imagePath="/image/messages/personnalise.png"
              isSelected={formData.centralMessage === 'custom'}
              onClick={(value) => handleSelection('centralMessage', value)}
            />
          </SelectionGrid>
          {formData.centralMessage === 'custom' && (
            <CustomInput
              type="text"
              placeholder="Message central personnalisé"
              value={formData.customMessage || ''}
              onChange={(e) => handleInputChange('customMessage', e.target.value)}
            />
          )}
        </FormSection>

        <FormSection ref={styleRef}>
          <OptionTitle>
            Quel style d'illustration ?
          </OptionTitle>
          <SelectionGrid $columns={3}>
            {ILLUSTRATION_STYLES.map((style) => (
              <ImageSelectionCard
                key={style.value}
                value={style.value}
                label={style.label}
                imagePath={style.imagePath}
                isSelected={formData.illustrationStyle === style.value}
                onClick={(value) => handleSelection('illustrationStyle', value)}
              />
            ))}
          </SelectionGrid>
        </FormSection>
      </Section>

      {/* Section 2: Informations du protagoniste */}
      <Section
        $isVisible={isProtagonistVisible}
        $isCompleted={isProtagonistComplete}
        ref={protagonistRef}
        id="protagonist-section"
      >
        <SectionHeader $isCompleted={isProtagonistComplete}>
          <SectionTitle $isCompleted={isProtagonistComplete}>
            🧍 Informations du protagoniste
            {isProtagonistComplete && <CompletedBadge>✓ Complété</CompletedBadge>}
          </SectionTitle>
          {isProtagonistComplete && !editingSection && (
            <EditButton onClick={() => handleEdit('protagonist')}>Modifier</EditButton>
          )}
        </SectionHeader>

        <FormSection>
          <InputGroup>
            <InputField>
              <ValidatedInput
                label="Prénom du héros/héroïne *"
                value={formData.protagonistName || ''}
                onChange={(value) => handleInputChange('protagonistName', value)}
                placeholder="Ex: Emma, Lucas..."
                required={true}
                error={errors.protagonistName}
                onBlur={() => validateField('protagonistName', formData.protagonistName || '', undefined)}
              />
            </InputField>

            <InputField>
              <AgeSelector
                label="Âge *"
                value={formData.protagonistAge || ''}
                onChange={(value) => handleInputChange('protagonistAge', value)}
                required={true}
                error={errors.protagonistAge}
              />
            </InputField>
          </InputGroup>

          <FormSection ref={genderRef}>
            <OptionTitle>
              Sexe *
            </OptionTitle>
            <SelectionGrid>
              {GENDERS.map((gender) => (
                <SelectionCard
                  key={gender.value}
                  value={gender.value}
                  label={gender.label}
                  icon={gender.icon}
                  isSelected={formData.protagonistGender === gender.value}
                  onClick={(value) => handleSelection('protagonistGender', value)}
                />
              ))}
            </SelectionGrid>
          </FormSection>
        </FormSection>

        <FormSection ref={eyeColorRef}>
          <OptionTitle>
            Couleur des yeux *
          </OptionTitle>
          <ColorGrid>
            {EYE_COLORS.map((eyeColor) => (
              <ColorOption
                key={eyeColor.value}
                color={eyeColor.color}
                $isSelected={formData.eyeColor === eyeColor.value}
                onClick={() => handleSelection('eyeColor', eyeColor.value)}
              >
                <ColorCircle color={eyeColor.color} />
                <ColorLabel>{eyeColor.label}</ColorLabel>
              </ColorOption>
            ))}
          </ColorGrid>
        </FormSection>

        <FormSection ref={hairColorRef}>
          <OptionTitle>
            Couleur des cheveux *
          </OptionTitle>
          <ColorGrid>
            {HAIR_COLORS.map((hairColor) => (
              <ColorOption
                key={hairColor.value}
                color={hairColor.color}
                $isSelected={formData.hairColor === hairColor.value}
                onClick={() => handleSelection('hairColor', hairColor.value)}
              >
                <ColorCircle color={hairColor.color} />
                <ColorLabel>{hairColor.label}</ColorLabel>
              </ColorOption>
            ))}
          </ColorGrid>
        </FormSection>

        <FormSection ref={photoRef}>
          <OptionTitle>
            📸 Photo (optionnel)
          </OptionTitle>
          <PhotoUploadSection>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              {formData.photo ? `✓ ${formData.photo.name}` : 'Choisir une photo'}
            </Button>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </PhotoUploadSection>
        </FormSection>

        <FormSection ref={languageRef}>
          <OptionTitle>
            🌍 Langue du conte
          </OptionTitle>
          <SelectionGrid>
            {LANGUAGES.map((language) => (
              <SelectionCard
                key={language.value}
                value={language.value}
                label={language.label}
                icon={language.flag}
                isSelected={formData.language === language.value}
                onClick={(value) => handleInputChange('language', value)}
              />
            ))}
          </SelectionGrid>
        </FormSection>

        <FormSection ref={optionsRef}>
          <OptionTitle>
            💡 Infos supplémentaires (facultatif)
          </OptionTitle>

          <InputField style={{ marginBottom: theme.spacing.lg }}>
            <Label>Loisirs / Centres d'intérêt</Label>
            <TextArea
              placeholder="Ex. : dessin, vélo, lecture..."
              value={formData.hobbies || ''}
              onChange={(e) => handleInputChange('hobbies', e.target.value)}
            />
          </InputField>

          <InputField style={{ marginBottom: theme.spacing.lg }}>
            <Label>Plat préféré</Label>
            <CustomInput
              type="text"
              placeholder="Ex. : pizza, glace, pâtes..."
              value={formData.favoriteDish || ''}
              onChange={(e) => handleInputChange('favoriteDish', e.target.value)}
            />
          </InputField>

          <InputField style={{ marginBottom: theme.spacing.lg }}>
            <Label>Événements particuliers à inclure</Label>
            <TextArea
              placeholder="Décrivez des événements spéciaux à intégrer dans l'histoire..."
              value={formData.specialEvents || ''}
              onChange={(e) => handleInputChange('specialEvents', e.target.value)}
            />
          </InputField>
        </FormSection>

        <FormSection>
          <OptionTitle>
            🕊️ Dimension religieuse (optionnel)
          </OptionTitle>

          <ToggleButton
            $isActive={showReligionSection}
            onClick={() => {
              setShowReligionSection(!showReligionSection);
              if (showReligionSection) {
                onUpdate({ religion: undefined, customReligion: undefined });
              }
            }}
          >
            Définir une religion au personnage principal
          </ToggleButton>

          {showReligionSection && (
            <>
              <SelectionGrid>
                {RELIGIONS.map((religion) => (
                  <SelectionCard
                    key={religion.value}
                    value={religion.value}
                    label={religion.label}
                    icon={religion.icon}
                    isSelected={formData.religion === religion.value}
                    onClick={(value) => handleInputChange('religion', value)}
                  />
                ))}
                <SelectionCard
                  value="other"
                  label="Autre"
                  icon="✏️"
                  isSelected={formData.religion === 'other'}
                  onClick={(value) => handleInputChange('religion', value)}
                />
              </SelectionGrid>

              {formData.religion === 'other' && (
                <CustomInput
                  type="text"
                  placeholder="Précisez la religion..."
                  value={formData.customReligion || ''}
                  onChange={(e) => handleInputChange('customReligion', e.target.value)}
                />
              )}
            </>
          )}
        </FormSection>

        <SecondaryCharactersSection
          secondaryCharacters={formData.secondaryCharacters || []}
          onChange={(characters) => onUpdate({ secondaryCharacters: characters })}
        />

        <FormSection style={{ marginTop: theme.spacing['3xl'], paddingTop: theme.spacing.xl, borderTop: `1px solid ${theme.colors.background.secondary}` }}>
          <OptionTitle>
            🧑‍🎨 Créateur du livre (optionnel)
          </OptionTitle>

          <InputField>
            <ValidatedInput
              label="Nom ou signature du créateur (facultatif)"
              value={formData.creatorName || ''}
              onChange={(value) => handleInputChange('creatorName', value)}
              placeholder="Ex: Créé par Papa et Maman, Fait avec amour par Grand-mère..."
              required={false}
            />
          </InputField>
        </FormSection>
      </Section>

      {/* Prévisualisation couverture */}
      {isProtagonistVisible && formData.protagonistName && (
        <BookCoverPreview formData={formData} />
      )}

      {/* Section 3: Paiement */}
      <Section
        $isVisible={isPaymentVisible}
        $isCompleted={false}
        id="payment-section"
      >
        <SectionHeader $isCompleted={false}>
          <SectionTitle $isCompleted={false}>
            💳 Paiement
          </SectionTitle>
        </SectionHeader>

        <FormSection>
          <OptionTitle style={{ textAlign: 'center' }}>
            📦 Choisissez votre format
          </OptionTitle>

          {/* Club avec credit disponible : carte gratuite mise en avant */}
          {isClub && clubCredit?.canSubmit && (
            <div style={{ marginBottom: theme.spacing.xl }}>
              <ClubFreeCard
                $isSelected={formData.purchaseType === 'club'}
                onClick={() => handleProductSelection('club')}
              >
                <ClubBadge>Membre Club</ClubBadge>
                <div style={{ fontSize: theme.fontSizes['2xl'], marginBottom: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                  🎁
                </div>
                <h3 style={{ fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.xl, margin: `0 0 ${theme.spacing.xs}` }}>
                  Utiliser mon eBook gratuit
                </h3>
                <p style={{ fontSize: theme.fontSizes.base, color: theme.colors.accent.coral, fontWeight: 700, margin: `0 0 ${theme.spacing.sm}` }}>
                  0,00EUR — Inclus dans votre abonnement Club
                </p>
                <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.secondary, margin: 0 }}>
                  Il vous reste {clubCredit.remaining} eBook(s) gratuit(s) cette semaine
                </p>
              </ClubFreeCard>
            </div>
          )}

          {/* Club sans credit : message d'info */}
          {isClub && clubCredit && !clubCredit.canSubmit && (
            <ClubExhaustedMsg>
              Votre credit hebdomadaire est epuise (0/1). Choisissez un format payant ci-dessous.
            </ClubExhaustedMsg>
          )}

          <PricingGrid>
            <PricingCard
              title="eBook Numerique"
              price="4,99€"
              features={[
                "Conte personnalise de 20-30 pages",
                "Illustrations haute qualite",
                "Format PDF optimise",
                "Telechargement immediat",
                "Compatible tous appareils"
              ]}
              isPopular={formData.purchaseType === 'single'}
              ctaText="Choisir l'eBook"
              onSelect={() => handleProductSelection('single')}
            />

            {!isClub && (
              <PricingCard
                title="Club des Histoires"
                price="12,99€/mois"
                features={[
                  "Cet eBook est inclus immediatement",
                  "1 eBook gratuit chaque semaine",
                  "Bibliotheque illimitee",
                  "Annulable a tout moment"
                ]}
                isPopular={formData.purchaseType === 'club' || !formData.purchaseType}
                ctaText="Recevoir cet eBook + rejoindre le Club"
                badge="Recommande"
                subtitle="Soit ~3,25EUR par conte"
                onSelect={() => handleProductSelection('club')}
              />
            )}
          </PricingGrid>

          {/* Order cost summary */}
          {formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit && (
            <OrderCostSummary $variant="free">
              Cette commande sera gratuite (credit Club)
            </OrderCostSummary>
          )}
          {formData.purchaseType === 'club' && !isClub && (
            <OrderCostSummary $variant="info">
              Abonnement Club : 12,99EUR/mois — Cet eBook est inclus, sans frais supplementaires
            </OrderCostSummary>
          )}
          {formData.purchaseType === 'single' && (
            <OrderCostSummary $variant="paid">
              Cette commande sera payante : 4,99EUR
            </OrderCostSummary>
          )}
        </FormSection>

        <OrderInfoSection $show={true} ref={paymentRef}>
          <OptionTitle>
            Informations de commande
          </OptionTitle>

          {isAuthenticated && currentUser && (
            <ConnectedBanner>
              ✅ Connecte en tant que <strong>{currentUser.email}</strong>
            </ConnectedBanner>
          )}

          <OrderInfoGrid>
            {isAuthenticated ? (
              <FullWidthField>
                <ValidatedInput
                  type="email"
                  label="Email"
                  value={formData.userEmail || ''}
                  onChange={() => {}}
                  placeholder=""
                  required={true}
                  disabled={true}
                />
              </FullWidthField>
            ) : (
              <>
                <FullWidthField>
                  <ValidatedInput
                    type="email"
                    label="Email"
                    value={formData.userEmail || ''}
                    onChange={handleEmailChange}
                    placeholder="votre@email.com"
                    required={true}
                    error={errors.userEmail}
                    onBlur={() => { validateField('userEmail', formData.userEmail || '', 'email'); handleEmailBlurCheck(); }}
                  />
                  {emailStatus?.exists && emailStatus?.hasPassword && (
                    <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.accent.coral, marginTop: theme.spacing.xs }}>
                      Ce compte existe deja. <span style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }} onClick={() => window.location.href = '/login'}>Connectez-vous</span>
                    </p>
                  )}
                  {emailStatus?.exists && !emailStatus?.hasPassword && (
                    <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.status.warning, marginTop: theme.spacing.xs }}>
                      Ce compte existe mais n'a pas de mot de passe. Creez-en un ci-dessous pour securiser votre compte.
                    </p>
                  )}
                </FullWidthField>

                <FullWidthField>
                  <ValidatedInput
                    type="password"
                    label="Mot de passe (creez votre compte)"
                    value={formData.password || ''}
                    onChange={handlePasswordChange}
                    placeholder="Min. 8 caracteres"
                    required={false}
                    error={errors.password}
                  />
                  <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.light, marginTop: theme.spacing.xs }}>
                    Creez un compte pour retrouver vos contes dans votre bibliotheque personnelle
                  </p>
                </FullWidthField>
              </>
            )}

            <InputField>
              <ValidatedInput
                label="Prénom"
                value={formData.firstName || ''}
                onChange={(value) => handleNameChange('firstName', value)}
                placeholder="Votre prénom"
                required={true}
                error={errors.firstName}
                onBlur={() => validateField('firstName', formData.firstName || '')}
              />
            </InputField>

            <InputField>
              <ValidatedInput
                label="Nom"
                value={formData.lastName || ''}
                onChange={(value) => handleNameChange('lastName', value)}
                placeholder="Votre nom"
                required={true}
                error={errors.lastName}
                onBlur={() => validateField('lastName', formData.lastName || '')}
              />
            </InputField>
          </OrderInfoGrid>
        </OrderInfoSection>

        <PaymentSection>
          <ReadyMessage $show={isPaymentInfoComplete()}>
            ✅ Tout est prêt
          </ReadyMessage>

          {globalError && (
            <ErrorMessage>
              {globalError}
            </ErrorMessage>
          )}

          <PayButton
            variant="primary"
            size="lg"
            onClick={handleFormSubmit}
            disabled={!formData.productType || isSubmitting}
            $isReady={isPaymentInfoComplete()}
          >
            {isSubmitting
              ? '\u23F3 Traitement en cours...'
              : formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit
                ? '\u2728 Creer mon eBook gratuit'
                : '\u2728 Creer le conte de mon enfant'
            }
          </PayButton>

          {!(formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) && (
            <p style={{
              marginTop: theme.spacing.md,
              fontSize: theme.fontSizes.xs,
              color: theme.colors.text.light
            }}>
              Paiement securise par Stripe
            </p>
          )}

          {/* V2: Trust badges */}
          <TrustBadgesRow>
            <TrustBadge>
              <span className="trust-icon">🔒</span>
              Paiement 100% sécurisé
            </TrustBadge>
            <TrustBadge>
              <span className="trust-icon">✅</span>
              Satisfait ou remboursé
            </TrustBadge>
            <TrustBadge>
              <span className="trust-icon">⚡</span>
              Livraison instantanee
            </TrustBadge>
          </TrustBadgesRow>
        </PaymentSection>
      </Section>
    </FormContainer>
  );
};
