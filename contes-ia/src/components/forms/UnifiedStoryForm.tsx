import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { SelectionCard } from '../ui/SelectionCard';
import { ImageSelectionCard } from '../ui/ImageSelectionCard';
import { ImageAgeCard } from '../ui/ImageAgeCard';
import { ImageThemeCard } from '../ui/ImageThemeCard';
import { ImageOccasionCard } from '../ui/ImageOccasionCard';
import { ImageMessageCard } from '../ui/ImageMessageCard';
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
  SKIN_COLORS,
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

/* ── Splits: visible + hidden ── */
const TOP_LANGUAGES = LANGUAGES.slice(0, 3);
const OTHER_LANGUAGES = LANGUAGES.slice(3);

const VISIBLE_STYLES = ILLUSTRATION_STYLES.slice(0, 6);
const HIDDEN_STYLES = ILLUSTRATION_STYLES.slice(6);

const VISIBLE_MESSAGES = CENTRAL_MESSAGES.slice(0, 2);
const HIDDEN_MESSAGES = CENTRAL_MESSAGES.slice(2);

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
  background: var(--bg-card);
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.xl};
    background: var(--bg-secondary);
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
  color: var(--text-secondary);
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
  color: var(--text-primary);
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
  border: 2px solid var(--border-input);
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

  &::placeholder { color: var(--text-light); }

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
  border: 2px solid ${props => props.$isSelected ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  background-color: ${props => props.$isSelected ? theme.colors.accent.creamyYellow : 'var(--bg-card)'};

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
  color: var(--text-primary);
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
    : `linear-gradient(135deg, var(--bg-secondary), ${theme.colors.accent.creamyYellow}20)`
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
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.xs};
`;

const PhotoSubText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

/* ──────────────────────────────────────────────
   Optional Section Divider
   ────────────────────────────────────────────── */

const OptionalDivider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin: ${theme.spacing['2xl']} 0 ${theme.spacing.xl};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}30, ${theme.colors.accent.lightCoral}08);
  border-radius: ${theme.borderRadius.lg};
  border: 1px dashed ${theme.colors.accent.lightCoral}60;
`;

const OptionalDividerIcon = styled.span`
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const OptionalDividerText = styled.div`
  flex: 1;
`;

const OptionalDividerTitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const OptionalDividerSub = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  margin: 0;
`;

/* ──────────────────────────────────────────────
   ShowMore + ExpandableSection (shared)
   ────────────────────────────────────────────── */

const ShowMoreCard = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md};
  border: 2px dashed var(--border-input);
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  background: transparent;
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: var(--text-secondary);

  &:hover {
    border-color: ${theme.colors.accent.coral};
    color: ${theme.colors.accent.coral};
  }
`;

const ExpandableSection = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '800px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
  margin-top: ${props => props.$isOpen ? theme.spacing.md : '0'};
`;

const CollapseLink = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  width: 100%;
  padding: ${theme.spacing.sm} 0;
  margin-top: ${theme.spacing.sm};
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${theme.colors.accent.coral};
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.7; }
`;

/* ──────────────────────────────────────────────
   Collapsible Pill (religion + characters)
   ────────────────────────────────────────────── */

const CollapsiblePill = styled.button<{ $isOpen: boolean }>`
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
  color: ${props => props.$isOpen ? theme.colors.accent.coral : 'var(--text-secondary)'};
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

const StyledIconCircle = styled.span<{ $gradient: string }>`
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

const CollapsibleChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const CollapsibleContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '5000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
  margin-top: ${props => props.$isOpen ? theme.spacing.md : '0'};
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
  color: var(--text-light);
  margin-top: ${theme.spacing.sm};
`;

/* ──────────────────────────────────────────────
   Phase 2: Cover + Payment (merged)
   ────────────────────────────────────────────── */

const CoverRevealSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const PaymentDivider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin: ${theme.spacing['2xl']} 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.accent.lightCoral}60, transparent);
  }
`;

const PaymentDividerLabel = styled.span`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid var(--border-input);
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

  &::placeholder { color: var(--text-light); }

  @media (max-width: 480px) { font-size: 16px; }
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.fontSizes.xs};
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
  color: var(--text-primary);
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
    : 'var(--bg-card)'
  };
  border: 2px solid ${props => props.$isSelected ? theme.colors.accent.coral : 'var(--border-input)'};
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
  background: var(--bg-secondary);
  border: 1px solid var(--border-input);
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
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
      case 'info': return `var(--bg-secondary)`;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'free': return '#2d6a4f';
      case 'paid': return 'var(--text-primary)';
      case 'info': return 'var(--text-secondary)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'free': return '#a8e6cf';
      case 'paid': return `${theme.colors.accent.lightCoral}30`;
      case 'info': return 'var(--border-input)';
    }
  }};
`;

const OrderInfoSection = styled.div`
  background-color: var(--bg-secondary);
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
  background-color: rgba(197, 48, 48, 0.08);
  border: 1px solid rgba(197, 48, 48, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  color: #E53E3E;
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
  color: var(--text-secondary);
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
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

  // Phase visibility (2 phases only)
  const [showPhase2, setShowPhase2] = useState(false);

  // Optional section toggles
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showReligion, setShowReligion] = useState(!!formData.religion);
  const [showSecondaryChars, setShowSecondaryChars] = useState(
    (formData.secondaryCharacters?.length || 0) > 0
  );

  // Cover preview hook (button-triggered, no regenerate)
  const {
    coverImageUrl,
    coverTitle,
    isGenerating: isCoverGenerating,
    error: coverError,
    generate: generateCover,
  } = useCoverPreview(formData);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for scroll
  const themeRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const protagonistRef = useRef<HTMLDivElement>(null);
  const eyeColorRef = useRef<HTMLDivElement>(null);
  const hairColorRef = useRef<HTMLDivElement>(null);
  const skinColorRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
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

  // Auto-expand hidden sections if a hidden option is already selected
  useEffect(() => {
    if (formData.illustrationStyle && HIDDEN_STYLES.some(s => s.value === formData.illustrationStyle)) {
      setShowAllStyles(true);
    }
  }, [formData.illustrationStyle]);

  useEffect(() => {
    if (formData.centralMessage && HIDDEN_MESSAGES.some(m => m.value === formData.centralMessage)) {
      setShowAllMessages(true);
    }
  }, [formData.centralMessage]);

  useEffect(() => {
    if (formData.language && OTHER_LANGUAGES.some(l => l.value === formData.language)) {
      setShowAllLanguages(true);
    }
  }, [formData.language]);

  // Phase 1 completion check
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
        scrollToSection(skinColorRef);
        break;
      case 'skinColor':
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

    if (!formData.firstName) { newErrors.firstName = 'Le prénom est obligatoire'; isValid = false; }
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

  return (
    <FormContainer>
      {/* ═══════════════════════════════════════════
          PHASE 1 : Formulaire (no redundant title)
          ═══════════════════════════════════════════ */}
      <Phase $isVisible={true}>
        <PhaseCard>
          {/* Age */}
          <FormSection>
            <OptionTitle>Pour quel âge ?</OptionTitle>
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
              <ImageThemeCard
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
              <ImageOccasionCard
                value="custom"
                label="Personnalisée"
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

          {/* Style d'illustration: 6 visible + "Voir plus" */}
          <FormSection ref={styleRef}>
            <OptionTitle>Quel style d'illustration ?</OptionTitle>
            <SelectionGrid $columns={3}>
              {VISIBLE_STYLES.map((style) => (
                <ImageSelectionCard
                  key={style.value}
                  value={style.value}
                  label={style.label}
                  imagePath={style.imagePath}
                  isSelected={formData.illustrationStyle === style.value}
                  onClick={(value) => handleSelection('illustrationStyle', value)}
                />
              ))}
              {HIDDEN_STYLES.length > 0 && (
                <ShowMoreCard
                  $isOpen={showAllStyles}
                  onClick={() => setShowAllStyles(!showAllStyles)}
                >
                  {showAllStyles ? 'Masquer' : 'Voir plus'} {showAllStyles ? '\u25B2' : '\u25BC'}
                </ShowMoreCard>
              )}
            </SelectionGrid>
            <ExpandableSection $isOpen={showAllStyles}>
              <SelectionGrid $columns={3}>
                {HIDDEN_STYLES.map((style) => (
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
              <CollapseLink onClick={() => setShowAllStyles(false)}>
                Masquer {'\u25B2'}
              </CollapseLink>
            </ExpandableSection>
          </FormSection>

          {/* Heros */}
          <FormSection ref={protagonistRef}>
            <OptionTitle>Votre héros</OptionTitle>

            <InputGroup>
              <InputField>
                <ValidatedInput
                  label="Prénom du héros / de l'héroïne *"
                  value={formData.protagonistName || ''}
                  onChange={(value) => handleInputChange('protagonistName', value)}
                  placeholder="Ex : Emma, Lucas..."
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

          {/* Couleur des yeux */}
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

          {/* Couleur des cheveux */}
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

          {/* Couleur de la peau */}
          <FormSection ref={skinColorRef}>
            <OptionTitle>Couleur de la peau *</OptionTitle>
            <ColorGrid>
              {SKIN_COLORS.map((skinColor) => (
                <ColorOption
                  key={skinColor.value}
                  color={skinColor.color}
                  $isSelected={formData.skinColor === skinColor.value}
                  onClick={() => handleSelection('skinColor', skinColor.value)}
                >
                  <ColorCircle color={skinColor.color} />
                  <ColorLabel>{skinColor.label}</ColorLabel>
                </ColorOption>
              ))}
            </ColorGrid>
          </FormSection>

          {/* Photo */}
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
                  : 'Notre IA adaptera le personnage du conte pour qu\'il ressemble à votre enfant (optionnel)'
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

          {/* -- Separateur optionnel -- */}
          <OptionalDivider>
            <OptionalDividerIcon>{'\u2728'}</OptionalDividerIcon>
            <OptionalDividerText>
              <OptionalDividerTitle>Personnalisez davantage (facultatif)</OptionalDividerTitle>
              <OptionalDividerSub>Ces options enrichissent votre conte mais ne sont pas obligatoires</OptionalDividerSub>
            </OptionalDividerText>
          </OptionalDivider>

          {/* Message central: 2 visible + Personnalise + "Voir plus" */}
          <FormSection>
            <OptionTitle>Quel message transmettre ?</OptionTitle>
            <SelectionGrid>
              {VISIBLE_MESSAGES.map((message) => (
                <ImageMessageCard
                  key={message.value}
                  value={message.value}
                  label={message.label}
                  imagePath={message.imagePath}
                  isSelected={formData.centralMessage === message.value}
                  onClick={(value) => handleInputChange('centralMessage', value)}
                />
              ))}
              <ImageMessageCard
                value="custom"
                label="Personnalisé"
                imagePath="/image/messages/personnalise.png"
                isSelected={formData.centralMessage === 'custom'}
                onClick={(value) => handleInputChange('centralMessage', value)}
              />
              {HIDDEN_MESSAGES.length > 0 && (
                <ShowMoreCard
                  $isOpen={showAllMessages}
                  onClick={() => setShowAllMessages(!showAllMessages)}
                >
                  {showAllMessages ? 'Masquer' : 'Voir plus'} {showAllMessages ? '\u25B2' : '\u25BC'}
                </ShowMoreCard>
              )}
            </SelectionGrid>
            <ExpandableSection $isOpen={showAllMessages}>
              <SelectionGrid>
                {HIDDEN_MESSAGES.map((message) => (
                  <ImageMessageCard
                    key={message.value}
                    value={message.value}
                    label={message.label}
                    imagePath={message.imagePath}
                    isSelected={formData.centralMessage === message.value}
                    onClick={(value) => handleInputChange('centralMessage', value)}
                  />
                ))}
              </SelectionGrid>
              <CollapseLink onClick={() => setShowAllMessages(false)}>
                Masquer {'\u25B2'}
              </CollapseLink>
            </ExpandableSection>
            {formData.centralMessage === 'custom' && (
              <CustomInput
                type="text"
                placeholder="Message central personnalisé"
                value={formData.customMessage || ''}
                onChange={(e) => handleInputChange('customMessage', e.target.value)}
              />
            )}
          </FormSection>

          {/* Langue: top 3 + "Autre langue" */}
          <FormSection>
            <OptionTitle>Langue du conte</OptionTitle>
            <SelectionGrid>
              {TOP_LANGUAGES.map((language) => (
                <SelectionCard
                  key={language.value}
                  value={language.value}
                  label={language.label}
                  icon={language.flag}
                  isSelected={formData.language === language.value}
                  onClick={(value) => handleInputChange('language', value)}
                />
              ))}
              <ShowMoreCard
                $isOpen={showAllLanguages}
                onClick={() => setShowAllLanguages(!showAllLanguages)}
              >
                {showAllLanguages ? 'Masquer' : 'Autre langue'} {showAllLanguages ? '\u25B2' : '\u25BC'}
              </ShowMoreCard>
            </SelectionGrid>
            <ExpandableSection $isOpen={showAllLanguages}>
              <SelectionGrid>
                {OTHER_LANGUAGES.map((language) => (
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
              <CollapseLink onClick={() => setShowAllLanguages(false)}>
                Masquer {'\u25B2'}
              </CollapseLink>
            </ExpandableSection>
          </FormSection>

          {/* Details a integrer */}
          <FormSection>
            <OptionTitle>Détails à intégrer dans l'histoire</OptionTitle>
            <InputField>
              <TextArea
                placeholder="Décrivez des détails, événements ou éléments spéciaux à intégrer dans l'histoire..."
                value={formData.specialEvents || ''}
                onChange={(e) => handleInputChange('specialEvents', e.target.value)}
              />
            </InputField>
          </FormSection>

          {/* Religion (collapsible pill with styled icon) */}
          <FormSection>
            <CollapsiblePill
              $isOpen={showReligion}
              onClick={() => {
                setShowReligion(!showReligion);
                if (showReligion) {
                  onUpdate({ religion: undefined, customReligion: undefined });
                }
              }}
            >
              <StyledIconCircle $gradient={`linear-gradient(135deg, ${theme.colors.accent.softPink}, ${theme.colors.accent.coral}40)`}>
                {'\u271A'}
              </StyledIconCircle>
              Ajouter une dimension religieuse
              <CollapsibleChevron $isOpen={showReligion}>{'\u25BC'}</CollapsibleChevron>
            </CollapsiblePill>
            <CollapsibleContent $isOpen={showReligion}>
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
                  icon={'\u270F\uFE0F'}
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
            </CollapsibleContent>
          </FormSection>

          {/* Secondary characters (collapsible pill with styled icon) */}
          <FormSection>
            <CollapsiblePill
              $isOpen={showSecondaryChars}
              onClick={() => setShowSecondaryChars(!showSecondaryChars)}
            >
              <StyledIconCircle $gradient={`linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.lightCoral}30)`}>
                {'\uD83E\uDDF8'}
              </StyledIconCircle>
              Ajouter des personnages secondaires
              <CollapsibleChevron $isOpen={showSecondaryChars}>{'\u25BC'}</CollapsibleChevron>
            </CollapsiblePill>
            <CollapsibleContent $isOpen={showSecondaryChars}>
              <SecondaryCharactersSection
                secondaryCharacters={formData.secondaryCharacters || []}
                onChange={(characters) => onUpdate({ secondaryCharacters: characters })}
              />
            </CollapsibleContent>
          </FormSection>

          {/* Createur */}
          <FormSection>
            <OptionTitle>Créateur du livre (optionnel)</OptionTitle>
            <InputField>
              <ValidatedInput
                label="Nom ou signature du créateur"
                value={formData.creatorName || ''}
                onChange={(value) => handleInputChange('creatorName', value)}
                placeholder="Ex : Créé par Papa et Maman..."
                required={false}
              />
            </InputField>
          </FormSection>

          {/* CTA : Decouvrir mon conte */}
          <GenerateCTA
            $isReady={phase1Ready}
            disabled={!phase1Ready || isCoverGenerating}
            onClick={handleGenerateCover}
          >
            {isCoverGenerating
              ? '\uD83C\uDFA8 Création en cours...'
              : '\u2728 Découvrir mon conte'
            }
          </GenerateCTA>
          {!phase1Ready && (
            <CTASubtext>Complétez tous les champs obligatoires ci-dessus pour découvrir votre conte</CTASubtext>
          )}
        </PhaseCard>
      </Phase>

      {/* ═══════════════════════════════════════════
          PHASE 2 : Votre conte prend vie + Paiement
          ═══════════════════════════════════════════ */}
      <Phase $isVisible={showPhase2} ref={phase2Ref}>
        <PhaseCard>
          <PhaseTitle>Votre conte prend vie</PhaseTitle>
          <PhaseSubtitle>
            {coverImageUrl
              ? 'Voici la couverture de votre conte personnalisé !'
              : 'Notre IA crée votre couverture...'
            }
          </PhaseSubtitle>

          {/* Cover Preview — click scrolls to payment */}
          <CoverRevealSection>
            <BookCoverPreview
              coverImageUrl={coverImageUrl}
              isGenerating={isCoverGenerating}
              error={coverError}
              onClick={() => scrollToSection(paymentRef, 150)}
            />
          </CoverRevealSection>

          {/* -- Payment section (appears when cover is ready) -- */}
          {coverImageUrl && !isCoverGenerating && (
            <>
              <PaymentDivider>
                <PaymentDividerLabel>Recevez votre conte</PaymentDividerLabel>
              </PaymentDivider>

              <PhaseSubtitle>
                Plus qu'une étape pour offrir cette histoire unique
              </PhaseSubtitle>

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
                        0,00 € — Inclus dans votre abonnement Club
                      </p>
                      <p style={{ fontSize: theme.fontSizes.sm, color: 'var(--text-secondary)', margin: 0 }}>
                        {clubCredit.remaining} conte{clubCredit.remaining > 1 ? 's' : ''} gratuit{clubCredit.remaining > 1 ? 's' : ''} disponible{clubCredit.remaining > 1 ? 's' : ''}
                      </p>
                    </ClubFreeCard>
                  </div>
                )}

                {/* Club exhausted */}
                {isClub && clubCredit && !clubCredit.canSubmit && (
                  <ClubExhaustedMsg>
                    Vos crédits mensuels sont utilisés. Prochains crédits bientôt ! Choisissez un format payant ci-dessous.
                  </ClubExhaustedMsg>
                )}

                <PricingGrid>
                  <PricingCard
                    title="eBook Numérique"
                    price="4,99 €"
                    features={[
                      "Conte personnalisé de 20-30 pages",
                      "Illustrations haute qualité",
                      "Format PDF optimisé",
                      "Téléchargement immédiat",
                      "Compatible tous appareils"
                    ]}
                    isPopular={formData.purchaseType === 'single'}
                    ctaText="Recevoir mon conte maintenant"
                    onSelect={() => handleProductSelection('single')}
                  />

                  {!isClub && (
                    <PricingCard
                      title="Club des Histoires"
                      price="9,99 € / mois"
                      features={[
                        "Cet eBook est inclus immédiatement",
                        "4 livres avec 2x plus de pages par mois",
                        "Bibliothèque illimitée",
                        "Annulable à tout moment"
                      ]}
                      isPopular={formData.purchaseType === 'club' || !formData.purchaseType}
                      ctaText="Recevoir cet eBook + rejoindre le Club"
                      badge="Meilleure offre"
                      subtitle="Soit ~2,50 € par conte"
                      onSelect={() => handleProductSelection('club')}
                    />
                  )}
                </PricingGrid>

                {/* Order cost summary */}
                {formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit && (
                  <OrderCostSummary $variant="free">
                    Cette commande sera gratuite (crédit Club)
                  </OrderCostSummary>
                )}
                {formData.purchaseType === 'club' && !isClub && (
                  <OrderCostSummary $variant="info">
                    Abonnement Club : 9,99 € / mois — Cet eBook est inclus, sans frais supplémentaires
                  </OrderCostSummary>
                )}
                {formData.purchaseType === 'single' && (
                  <OrderCostSummary $variant="paid">
                    Cette commande sera payante : 4,99 €
                  </OrderCostSummary>
                )}
              </FormSection>

              <OrderInfoSection ref={paymentRef}>
                <OptionTitle>Informations de commande</OptionTitle>

                {isAuthenticated && currentUser && (
                  <ConnectedBanner>
                    Connecté en tant que <strong>{currentUser.email}</strong>
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
                            Ce compte existe déjà. <span style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }} onClick={() => window.location.href = '/login'}>Connectez-vous</span>
                          </p>
                        )}
                        {emailStatus?.exists && !emailStatus?.hasPassword && (
                          <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.status.warning, marginTop: theme.spacing.xs }}>
                            Ce compte existe mais n'a pas de mot de passe. Créez-en un ci-dessous pour sécuriser votre compte.
                          </p>
                        )}
                      </FullWidthField>

                      <FullWidthField>
                        <ValidatedInput
                          type="password"
                          label="Mot de passe (créez votre compte)"
                          value={formData.password || ''}
                          onChange={handlePasswordChange}
                          placeholder="Min. 8 caractères"
                          required={false}
                          error={errors.password}
                        />
                        <p style={{ fontSize: theme.fontSizes.xs, color: 'var(--text-light)', marginTop: theme.spacing.xs }}>
                          Créez un compte pour retrouver vos contes dans votre bibliothèque personnelle
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
                  Tout est prêt !
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
                      ? '\u2728 Recevoir mon eBook gratuit'
                      : '\u2728 Recevoir mon conte'
                  }
                </PayButton>

                {!(formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) && (
                  <p style={{ marginTop: theme.spacing.md, fontSize: theme.fontSizes.xs, color: 'var(--text-light)' }}>
                    Paiement sécurisé par Stripe
                  </p>
                )}

                <TrustBadgesRow>
                  <TrustBadge>
                    <span className="trust-icon">{'\uD83D\uDD12'}</span>
                    Paiement 100% sécurisé
                  </TrustBadge>
                  <TrustBadge>
                    <span className="trust-icon">{'\u2705'}</span>
                    Satisfait ou remboursé
                  </TrustBadge>
                  <TrustBadge>
                    <span className="trust-icon">{'\u26A1'}</span>
                    Livraison instantanée
                  </TrustBadge>
                </TrustBadgesRow>
              </PaymentSection>
            </>
          )}
        </PhaseCard>
      </Phase>
    </FormContainer>
  );
};
