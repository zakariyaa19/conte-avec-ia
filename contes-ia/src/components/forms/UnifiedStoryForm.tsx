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
  StoryFormData
} from '../../types/FormTypes';
import { validateEmail, validateRequired } from '../../utils/validation';
import { ApiService } from '../../config/api';
import { BookCoverPreview } from '../ui/BookCoverPreview';
import { useCoverPreview, isPhase1Complete } from '../../hooks/useCoverPreview';

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
   Animations
   ────────────────────────────────────────────── */

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${theme.colors.accent.coral}40, 0 0 40px ${theme.colors.accent.coral}20; }
  50% { box-shadow: 0 0 30px ${theme.colors.accent.coral}60, 0 0 60px ${theme.colors.accent.coral}30; }
`;

const buttonPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

const ctaPulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px ${theme.colors.accent.coral}40; }
  50% { transform: scale(1.02); box-shadow: 0 6px 30px ${theme.colors.accent.coral}60; }
`;

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const chevronBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
`;

/* ──────────────────────────────────────────────
   Layout
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

const Phase = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  max-width: 1100px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  max-height: ${props => props.$isVisible ? '100000px' : '0'};
  overflow: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.6s ease;
  animation: ${props => props.$isVisible ? fadeSlideIn : 'none'} 0.7s ease;
  margin-bottom: ${props => props.$isVisible ? theme.spacing['3xl'] : '0'};
`;

const PhaseCard = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0,0,0,0.04);
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.xl};
    background: ${theme.colors.background.secondary};
    border: none;
    box-shadow: ${theme.shadows.sm};
  }
`;

const PhaseTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  text-align: center;
  margin: 0 0 ${theme.spacing.sm};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const PhaseSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    margin-bottom: ${theme.spacing.lg};
  }
`;

/* ──────────────────────────────────────────────
   Form Sections
   ────────────────────────────────────────────── */

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
    &::before { width: 10px; height: 10px; }
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

  &::placeholder { color: ${theme.colors.text.light}; }

  @media (max-width: 480px) { font-size: 16px; }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
  @media (max-width: ${theme.breakpoints.sm}) { gap: ${theme.spacing.md}; margin-bottom: ${theme.spacing.md}; }
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

  @media (max-width: ${theme.breakpoints.sm}) { padding: ${theme.spacing.xs}; }
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${props => props.color};
  margin-right: ${theme.spacing.sm};
  border: 1px solid #ccc;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 16px; height: 16px; margin-right: ${theme.spacing.xs};
  }
`;

const ColorLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.xs}; }
`;

/* ──────────────────────────────────────────────
   Photo Upload (Prominent)
   ────────────────────────────────────────────── */

const ProminentPhotoUpload = styled.div<{ $hasPhoto: boolean }>`
  border: 2px dashed ${props => props.$hasPhoto ? theme.colors.accent.coral : theme.colors.accent.lightCoral};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  transition: all ${theme.transitions.smooth};
  background: ${props => props.$hasPhoto
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}40, ${theme.colors.accent.lightCoral}15)`
    : `linear-gradient(135deg, ${theme.colors.background.secondary}, ${theme.colors.accent.creamyYellow}20)`
  };
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: ${theme.colors.accent.coral};
    background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}60, ${theme.colors.accent.lightCoral}20);
    box-shadow: ${theme.shadows.md};
  }
`;

const PhotoIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.sm};
`;

const PhotoMainText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs};
`;

const PhotoSubText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

/* ──────────────────────────────────────────────
   Generate CTA Button
   ────────────────────────────────────────────── */

const GenerateCTA = styled.button<{ $isReady: boolean }>`
  display: block;
  width: 100%;
  max-width: 500px;
  margin: ${theme.spacing.xl} auto 0;
  padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  background: ${props => props.$isReady
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : '#ccc'
  };

  ${props => props.$isReady && css`
    animation: ${ctaPulse} 2.5s ease-in-out infinite;
    &:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 35px ${theme.colors.accent.coral}50;
    }
  `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    animation: none;
    transform: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    max-width: 100%;
  }
`;

const CTASubtext = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  margin-top: ${theme.spacing.sm};
`;

/* ──────────────────────────────────────────────
   Phase 2: Cover Reveal + Customization
   ────────────────────────────────────────────── */

const CoverRevealSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const CustomizationToggle = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 1.5px solid ${theme.colors.accent.lightCoral};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isOpen
    ? `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}40, ${theme.colors.accent.lightCoral}10)`
    : theme.colors.background.white
  };
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.accent.creamyYellow}40;
    border-color: ${theme.colors.accent.coral};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  animation: ${chevronBounce} 2s ease-in-out infinite;
`;

const CustomizationContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '5000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
  margin-top: ${props => props.$isOpen ? theme.spacing.xl : '0'};
`;

const RegenerateNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: #FFF8E1;
  border: 1px solid #FFE082;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  color: #F57F17;
  font-weight: 500;
  animation: ${slideIn} 0.4s ease;
`;

const RegenerateBtn = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border: 1.5px solid #F57F17;
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: #F57F17;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F57F17;
    color: #fff;
  }
`;

const ContinueButton = styled.button`
  display: block;
  width: 100%;
  max-width: 500px;
  margin: ${theme.spacing.xl} auto 0;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 25px ${theme.colors.accent.coral}40;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    max-width: 100%;
  }
`;

/* ──────────────────────────────────────────────
   Phase 3: Payment
   ────────────────────────────────────────────── */

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

  &::placeholder { color: ${theme.colors.text.light}; }

  @media (max-width: 480px) { font-size: 16px; }
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

  strong { overflow: hidden; text-overflow: ellipsis; min-width: 0; }

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

const OrderInfoSection = styled.div`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
  @media (max-width: ${theme.breakpoints.sm}) { gap: ${theme.spacing.md}; }
`;

const FullWidthField = styled(InputField)`
  grid-column: 1 / -1;
`;

const PaymentSection = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
`;

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

const TrustBadgesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) { gap: ${theme.spacing.md}; }
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

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

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
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

  // Phase visibility
  const [showPhase2, setShowPhase2] = useState(false);
  const [showPhase3, setShowPhase3] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);

  // Cover preview hook (button-triggered)
  const {
    coverImageUrl,
    coverTitle,
    isGenerating: isCoverGenerating,
    error: coverError,
    generate: generateCover,
    regenerate: regenerateCover,
    hasChanged: coverHasChanged,
  } = useCoverPreview(formData);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for scroll
  const themeRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const protagonistRef = useRef<HTMLDivElement>(null);
  const eyeColorRef = useRef<HTMLDivElement>(null);
  const hairColorRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, offset = 120) => {
    setTimeout(() => {
      if (ref.current) {
        const elementPosition = ref.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 200);
  };

  // Phase 1 completion check (no centralMessage required)
  const phase1Ready = isPhase1Complete(formData);

  const isPaymentInfoComplete = () => {
    return !!(formData.productType && formData.userEmail && formData.firstName && formData.lastName);
  };

  // Auto-scroll on selections
  const handleSelection = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (value === 'custom' || value === 'other') return;

    switch (field) {
      case 'ageRange':
        scrollToSection(themeRef);
        break;
      case 'generalTheme':
        scrollToSection(subjectRef);
        break;
      case 'specificSubject':
        scrollToSection(styleRef);
        break;
      case 'illustrationStyle':
        scrollToSection(protagonistRef);
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
      // Silent fail
    }
  };

  const handlePasswordChange = (value: string) => {
    onUpdate({ password: value });
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    setGlobalError('');
    onUpdate({ [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleEmailChange = (value: string) => {
    setGlobalError('');
    onUpdate({ userEmail: value });
    if (errors.userEmail) setErrors(prev => ({ ...prev, userEmail: '' }));
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

    if (!formData.firstName) { newErrors.firstName = 'Le prenom est obligatoire'; isValid = false; }
    if (!formData.lastName) { newErrors.lastName = 'Le nom est obligatoire'; isValid = false; }

    setErrors(newErrors);

    if (!isValid) {
      scrollToSection(paymentRef, 150);
      setGlobalError('Veuillez remplir tous les champs obligatoires');
    }

    return isValid;
  };

  const handleFormSubmit = () => {
    setGlobalError('');
    if (validateForm()) onSubmit();
  };

  // --- Phase 1 CTA: Generate cover ---
  const handleGenerateCover = async () => {
    if (!phase1Ready) return;
    generateCover();
    setShowPhase2(true);
    scrollToSection(phase2Ref, 80);
  };

  // When cover image arrives, show Phase 3
  useEffect(() => {
    if (coverImageUrl && showPhase2) {
      setShowPhase3(true);
    }
  }, [coverImageUrl, showPhase2]);

  // --- Phase 2: Continue to payment ---
  const handleContinueToPayment = () => {
    setShowPhase3(true);
    scrollToSection(phase3Ref, 80);
  };

  return (
    <FormContainer>
      {/* ═══════════════════════════════════════════
          PHASE 1 : Creez votre conte
          ═══════════════════════════════════════════ */}
      <Phase $isVisible={true}>
        <PhaseCard>
          <PhaseTitle>Creez votre conte</PhaseTitle>
          <PhaseSubtitle>Quelques choix rapides pour creer une histoire unique</PhaseSubtitle>

          {/* Age */}
          <FormSection>
            <OptionTitle>Pour quel age ?</OptionTitle>
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

          {/* Theme */}
          <FormSection ref={themeRef}>
            <OptionTitle>Quel univers ?</OptionTitle>
            <SelectionGrid>
              {GENERAL_THEMES.map((t) => (
                <ImageThemeCard
                  key={t.value}
                  value={t.value}
                  label={t.label}
                  imagePath={t.imagePath}
                  isSelected={formData.generalTheme === t.value}
                  onClick={(value) => handleSelection('generalTheme', value)}
                />
              ))}
              <CustomThemeCard
                value="custom"
                label="Personnalise"
                imagePath="/image/themes/personnalise.png"
                isSelected={formData.generalTheme === 'custom'}
                onClick={(value) => handleSelection('generalTheme', value)}
              />
            </SelectionGrid>
            {formData.generalTheme === 'custom' && (
              <CustomInput
                type="text"
                placeholder="Entrez le theme que vous souhaitez"
                value={formData.customTheme || ''}
                onChange={(e) => handleInputChange('customTheme', e.target.value)}
              />
            )}
          </FormSection>

          {/* Occasion */}
          <FormSection ref={subjectRef}>
            <OptionTitle>Quelle occasion ?</OptionTitle>
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
                label="Occasion personnalisee"
                imagePath="/image/occasions/personnalise.png"
                isSelected={formData.specificSubject === 'custom'}
                onClick={(value) => handleSelection('specificSubject', value)}
              />
            </SelectionGrid>
            {formData.specificSubject === 'custom' && (
              <CustomInput
                type="text"
                placeholder="Entrez votre sujet souhaite"
                value={formData.customSubject || ''}
                onChange={(e) => handleInputChange('customSubject', e.target.value)}
              />
            )}
          </FormSection>

          {/* Illustration style */}
          <FormSection ref={styleRef}>
            <OptionTitle>Quel style d'illustration ?</OptionTitle>
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

          {/* Protagonist info */}
          <FormSection ref={protagonistRef}>
            <OptionTitle>Votre heros</OptionTitle>

            <InputGroup>
              <InputField>
                <ValidatedInput
                  label="Prenom du heros/heroine *"
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
                  label="Age *"
                  value={formData.protagonistAge || ''}
                  onChange={(value) => handleInputChange('protagonistAge', value)}
                  required={true}
                  error={errors.protagonistAge}
                />
              </InputField>
            </InputGroup>

            <FormSection>
              <OptionTitle>Sexe *</OptionTitle>
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

          {/* Eye color */}
          <FormSection ref={eyeColorRef}>
            <OptionTitle>Couleur des yeux *</OptionTitle>
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

          {/* Hair color */}
          <FormSection ref={hairColorRef}>
            <OptionTitle>Couleur des cheveux *</OptionTitle>
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

          {/* Photo upload (prominent) */}
          <FormSection ref={photoRef}>
            <OptionTitle>Photo de votre enfant</OptionTitle>
            <ProminentPhotoUpload
              $hasPhoto={!!formData.photo}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoIcon>{formData.photo ? '\u2705' : '\uD83D\uDCF7'}</PhotoIcon>
              <PhotoMainText>
                {formData.photo ? formData.photo.name : 'Ajoutez une photo pour que le personnage lui ressemble'}
              </PhotoMainText>
              <PhotoSubText>
                {formData.photo
                  ? 'Cliquez pour changer la photo'
                  : 'Notre IA adaptera le personnage du conte pour qu\'il ressemble a votre enfant (optionnel)'
                }
              </PhotoSubText>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </ProminentPhotoUpload>
          </FormSection>

          {/* CTA: Generate cover */}
          <GenerateCTA
            $isReady={phase1Ready}
            disabled={!phase1Ready || isCoverGenerating}
            onClick={handleGenerateCover}
          >
            {isCoverGenerating
              ? '\uD83C\uDFA8 Creation en cours...'
              : '\u2728 Decouvrir mon conte'
            }
          </GenerateCTA>
          {!phase1Ready && (
            <CTASubtext>Completez tous les champs ci-dessus pour decouvrir votre conte</CTASubtext>
          )}
        </PhaseCard>
      </Phase>

      {/* ═══════════════════════════════════════════
          PHASE 2 : Votre conte prend vie
          ═══════════════════════════════════════════ */}
      <Phase $isVisible={showPhase2} ref={phase2Ref}>
        <PhaseCard>
          <PhaseTitle>Votre conte prend vie</PhaseTitle>
          <PhaseSubtitle>
            {coverImageUrl
              ? 'Voici la couverture de votre conte personnalise !'
              : 'Notre IA cree votre couverture...'
            }
          </PhaseSubtitle>

          {/* Cover Preview */}
          <CoverRevealSection>
            <BookCoverPreview
              coverImageUrl={coverImageUrl}
              isGenerating={isCoverGenerating}
              error={coverError}
              onRegenerate={regenerateCover}
            />
          </CoverRevealSection>

          {/* Regenerate notice if fields changed */}
          {coverHasChanged && coverImageUrl && !isCoverGenerating && (
            <RegenerateNotice>
              Des champs ont ete modifies depuis la derniere generation
              <RegenerateBtn onClick={regenerateCover}>
                Regenerer
              </RegenerateBtn>
            </RegenerateNotice>
          )}

          {/* Customization accordion (optional fields) */}
          <CustomizationToggle
            $isOpen={showCustomization}
            onClick={() => setShowCustomization(!showCustomization)}
          >
            Personnalisez davantage votre conte
            <ChevronIcon $isOpen={showCustomization}>{'\u25BC'}</ChevronIcon>
          </CustomizationToggle>

          <CustomizationContent $isOpen={showCustomization}>
            {/* Message central */}
            <FormSection>
              <OptionTitle>Quel message transmettre ?</OptionTitle>
              <SelectionGrid>
                {CENTRAL_MESSAGES.map((message) => (
                  <ImageMessageCard
                    key={message.value}
                    value={message.value}
                    label={message.label}
                    imagePath={message.imagePath}
                    isSelected={formData.centralMessage === message.value}
                    onClick={(value) => handleInputChange('centralMessage', value)}
                  />
                ))}
                <CustomMessageCard
                  value="custom"
                  label="Message personnalise"
                  imagePath="/image/messages/personnalise.png"
                  isSelected={formData.centralMessage === 'custom'}
                  onClick={(value) => handleInputChange('centralMessage', value)}
                />
              </SelectionGrid>
              {formData.centralMessage === 'custom' && (
                <CustomInput
                  type="text"
                  placeholder="Message central personnalise"
                  value={formData.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                />
              )}
            </FormSection>

            {/* Langue */}
            <FormSection>
              <OptionTitle>Langue du conte</OptionTitle>
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

            {/* Infos supplementaires */}
            <FormSection>
              <OptionTitle>Infos supplementaires</OptionTitle>

              <InputField style={{ marginBottom: theme.spacing.lg }}>
                <Label>Loisirs / Centres d'interet</Label>
                <TextArea
                  placeholder="Ex. : dessin, velo, lecture..."
                  value={formData.hobbies || ''}
                  onChange={(e) => handleInputChange('hobbies', e.target.value)}
                />
              </InputField>

              <InputField style={{ marginBottom: theme.spacing.lg }}>
                <Label>Plat prefere</Label>
                <CustomInput
                  type="text"
                  placeholder="Ex. : pizza, glace, pates..."
                  value={formData.favoriteDish || ''}
                  onChange={(e) => handleInputChange('favoriteDish', e.target.value)}
                />
              </InputField>

              <InputField style={{ marginBottom: theme.spacing.lg }}>
                <Label>Evenements particuliers a inclure</Label>
                <TextArea
                  placeholder="Decrivez des evenements speciaux a integrer dans l'histoire..."
                  value={formData.specialEvents || ''}
                  onChange={(e) => handleInputChange('specialEvents', e.target.value)}
                />
              </InputField>
            </FormSection>

            {/* Religion */}
            <FormSection>
              <OptionTitle>Dimension religieuse (optionnel)</OptionTitle>
              <ToggleButton
                $isActive={showReligionSection}
                onClick={() => {
                  setShowReligionSection(!showReligionSection);
                  if (showReligionSection) {
                    onUpdate({ religion: undefined, customReligion: undefined });
                  }
                }}
              >
                Definir une religion au personnage principal
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
                      placeholder="Precisez la religion..."
                      value={formData.customReligion || ''}
                      onChange={(e) => handleInputChange('customReligion', e.target.value)}
                    />
                  )}
                </>
              )}
            </FormSection>

            {/* Secondary characters */}
            <SecondaryCharactersSection
              secondaryCharacters={formData.secondaryCharacters || []}
              onChange={(characters) => onUpdate({ secondaryCharacters: characters })}
            />

            {/* Creator name */}
            <FormSection style={{ marginTop: theme.spacing.xl }}>
              <OptionTitle>Createur du livre (optionnel)</OptionTitle>
              <InputField>
                <ValidatedInput
                  label="Nom ou signature du createur"
                  value={formData.creatorName || ''}
                  onChange={(value) => handleInputChange('creatorName', value)}
                  placeholder="Ex: Cree par Papa et Maman..."
                  required={false}
                />
              </InputField>
            </FormSection>
          </CustomizationContent>

          {/* Continue to payment */}
          {coverImageUrl && !isCoverGenerating && (
            <ContinueButton onClick={handleContinueToPayment}>
              Continuer vers le paiement
            </ContinueButton>
          )}
        </PhaseCard>
      </Phase>

      {/* ═══════════════════════════════════════════
          PHASE 3 : Paiement
          ═══════════════════════════════════════════ */}
      <Phase $isVisible={showPhase3} ref={phase3Ref}>
        <PhaseCard>
          <PhaseTitle>Finalisez votre commande</PhaseTitle>
          <PhaseSubtitle>Plus qu'une etape pour offrir un conte unique</PhaseSubtitle>

          <FormSection>
            <OptionTitle style={{ textAlign: 'center' }}>Choisissez votre format</OptionTitle>

            {/* Club with available credit */}
            {isClub && clubCredit?.canSubmit && (
              <div style={{ marginBottom: theme.spacing.xl }}>
                <ClubFreeCard
                  $isSelected={formData.purchaseType === 'club'}
                  onClick={() => handleProductSelection('club')}
                >
                  <ClubBadge>Membre Club</ClubBadge>
                  <div style={{ fontSize: theme.fontSizes['2xl'], marginBottom: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                    {'\uD83C\uDF81'}
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

            {/* Club exhausted */}
            {isClub && clubCredit && !clubCredit.canSubmit && (
              <ClubExhaustedMsg>
                Votre credit hebdomadaire est epuise (0/1). Choisissez un format payant ci-dessous.
              </ClubExhaustedMsg>
            )}

            <PricingGrid>
              <PricingCard
                title="eBook Numerique"
                price="4,99\u20AC"
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
                  price="12,99\u20AC/mois"
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

          <OrderInfoSection ref={paymentRef}>
            <OptionTitle>Informations de commande</OptionTitle>

            {isAuthenticated && currentUser && (
              <ConnectedBanner>
                Connecte en tant que <strong>{currentUser.email}</strong>
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
                  label="Prenom"
                  value={formData.firstName || ''}
                  onChange={(value) => handleNameChange('firstName', value)}
                  placeholder="Votre prenom"
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
              Tout est pret
            </ReadyMessage>

            {globalError && (
              <ErrorMessage>{globalError}</ErrorMessage>
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
              <p style={{ marginTop: theme.spacing.md, fontSize: theme.fontSizes.xs, color: theme.colors.text.light }}>
                Paiement securise par Stripe
              </p>
            )}

            <TrustBadgesRow>
              <TrustBadge>
                <span className="trust-icon">{'\uD83D\uDD12'}</span>
                Paiement 100% securise
              </TrustBadge>
              <TrustBadge>
                <span className="trust-icon">{'\u2705'}</span>
                Satisfait ou rembourse
              </TrustBadge>
              <TrustBadge>
                <span className="trust-icon">{'\u26A1'}</span>
                Livraison instantanee
              </TrustBadge>
            </TrustBadgesRow>
          </PaymentSection>
        </PhaseCard>
      </Phase>
    </FormContainer>
  );
};
