import React, { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../../styles/theme';
import { ValidatedInput } from '../ui/ValidatedInput';
import { AgeSelector } from '../ui/AgeSelector';
import { PricingCard } from '../ui/PricingCard';
import { BookCoverPreview } from '../ui/BookCoverPreview';
import { SecondaryCharactersSection } from '../forms/SecondaryCharactersSection';
import { useCoverPreview } from '../../hooks/useCoverPreview';
import { validateEmail, validateRequired } from '../../utils/validation';
import { ApiService } from '../../config/api';
import { ILLUSTRATION_STYLES, LANGUAGES, StoryFormData } from '../../types/FormTypes';
import {
  WizardOverlay, WizardHeader, BackArrow, WizardTitle, ProgressTrack, ProgressFill,
  WizardViewport, StepContainerCentered, StepContainerTop,
  StepTitle, StepSubtitle,
  CardGrid, LivingCard, CardEmoji, CardLabel,
  ColorCardGrid, ColorCard, ColorBubble, ColorLabel, ColorSectionLabel,
  StyleCard, StyleImage, StyleLabel,
  InputRow, InputField, CustomInput, TextArea,
  PhotoUploadZone, PhotoIcon, PhotoMainText, PhotoSubText, HiddenFileInput,
  ContinueButton, SkipLink,
  ChoiceCard, ChoiceEmoji, ChoiceTitle, ChoiceDesc,
  DiscoverCTA,
  ExtrasSection, SectionTitle,
  CollapsiblePill, CollapsibleChevron, CollapsibleContent,
  PricingGrid, OrderInfoSection, OrderInfoGrid, FullWidthField, OrderCostSummary,
  PayButton, TrustBadgesRow, TrustBadge, ErrorMessage, ConnectedBanner,
  ClubFreeCard, ClubBadge, ClubExhaustedMsg,
} from './WizardSharedStyles';

/* ══════════════════════════════════════════════
   CARD DATA — Emoji + animated gradient cards
   ══════════════════════════════════════════════ */

const AGE_OPTIONS = [
  { value: '0-2',  label: '0-2 ans',  emoji: '\uD83D\uDC76', gradient: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)' },
  { value: '3-5',  label: '3-5 ans',  emoji: '\uD83E\uDDD2', gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
  { value: '6-9',  label: '6-9 ans',  emoji: '\uD83E\uDDB8', gradient: 'linear-gradient(135deg, #D5F5E3 0%, #ABEBC6 100%)' },
  { value: '10+',  label: '10+ ans',  emoji: '\uD83D\uDCDA', gradient: 'linear-gradient(135deg, #F5EEF8 0%, #D7BDE2 100%)' },
];

const THEME_OPTIONS = [
  { value: 'educational',  label: '\u00C9ducatif',       emoji: '\uD83C\uDF93', gradient: 'linear-gradient(135deg, #D4EFDF 0%, #A9DFBF 100%)' },
  { value: 'fairy-tales',  label: 'Contes de f\u00E9es', emoji: '\uD83C\uDFF0', gradient: 'linear-gradient(135deg, #F5EEF8 0%, #D7BDE2 100%)' },
  { value: 'activities',   label: 'Activit\u00E9s',      emoji: '\u26BD',        gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
  { value: 'stories',      label: 'Histoires',           emoji: '\uD83D\uDCD6', gradient: 'linear-gradient(135deg, #FDEBD0 0%, #F9E79F 100%)' },
  { value: 'celebrations', label: 'F\u00EAtes',          emoji: '\uD83C\uDF89', gradient: 'linear-gradient(135deg, #FDEDEC 0%, #F5B7B1 100%)' },
  { value: 'family',       label: 'Famille',             emoji: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67', gradient: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)' },
  { value: 'custom',       label: 'Personnalis\u00E9',   emoji: '\u270F\uFE0F', gradient: 'linear-gradient(135deg, #F2F3F4 0%, #E5E7E9 100%)' },
];

const OCCASION_OPTIONS = [
  { value: 'birthday',     label: 'Anniversaire',         emoji: '\uD83C\uDF82', gradient: 'linear-gradient(135deg, #FDEDEC 0%, #F5B7B1 100%)' },
  { value: 'christmas',    label: 'No\u00EBl',            emoji: '\uD83C\uDF84', gradient: 'linear-gradient(135deg, #D5F5E3 0%, #82E0AA 100%)' },
  { value: 'new-year',     label: 'Nouvel An',            emoji: '\uD83C\uDF86', gradient: 'linear-gradient(135deg, #D4E6F1 0%, #85C1E9 100%)' },
  { value: 'easter',       label: 'P\u00E2ques',          emoji: '\uD83D\uDC23', gradient: 'linear-gradient(135deg, #FDEBD0 0%, #F9E79F 100%)' },
  { value: 'eid',          label: 'A\u00EFd el-Fitr',     emoji: '\uD83C\uDF19', gradient: 'linear-gradient(135deg, #E8DAEF 0%, #D2B4DE 100%)' },
  { value: 'mothers-day',  label: 'F\u00EAte des m\u00E8res', emoji: '\uD83D\uDC90', gradient: 'linear-gradient(135deg, #FADBD8 0%, #F1948A 100%)' },
  { value: 'fathers-day',  label: 'F\u00EAte des p\u00E8res', emoji: '\uD83D\uDC54', gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
  { value: 'custom',       label: 'Autre',                emoji: '\u270F\uFE0F', gradient: 'linear-gradient(135deg, #F2F3F4 0%, #E5E7E9 100%)' },
];

const GENDER_OPTIONS = [
  { value: 'girl', label: 'Fille',   emoji: '\uD83D\uDC67', gradient: 'linear-gradient(135deg, #FADBD8 0%, #F5B7B1 100%)' },
  { value: 'boy',  label: 'Gar\u00E7on', emoji: '\uD83D\uDC66', gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
];

const EYE_OPTIONS = [
  { value: 'brown', label: 'Marron',   color: '#8B4513' },
  { value: 'blue',  label: 'Bleu',     color: '#4169E1' },
  { value: 'green', label: 'Vert',     color: '#228B22' },
  { value: 'hazel', label: 'Noisette', color: '#CD853F' },
];

const HAIR_OPTIONS = [
  { value: 'brown',  label: 'Ch\u00E2tain', color: '#8B4513' },
  { value: 'blonde', label: 'Blond',        color: '#FFD700' },
  { value: 'black',  label: 'Noir',         color: '#1a1a1a' },
  { value: 'red',    label: 'Roux',         color: '#D35400' },
];

const MESSAGE_OPTIONS = [
  { value: 'friendship',   label: 'Amiti\u00E9',       emoji: '\uD83E\uDD1D', gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
  { value: 'courage',      label: 'Courage',            emoji: '\uD83E\uDD81', gradient: 'linear-gradient(135deg, #FDEBD0 0%, #F9E79F 100%)' },
  { value: 'love',         label: 'Amour',              emoji: '\u2764\uFE0F', gradient: 'linear-gradient(135deg, #FADBD8 0%, #F5B7B1 100%)' },
  { value: 'perseverance', label: 'Pers\u00E9v\u00E9rance', emoji: '\uD83C\uDFD4\uFE0F', gradient: 'linear-gradient(135deg, #D5F5E3 0%, #ABEBC6 100%)' },
  { value: 'sharing',      label: 'Partage',            emoji: '\uD83C\uDF81', gradient: 'linear-gradient(135deg, #E8DAEF 0%, #D2B4DE 100%)' },
  { value: 'honesty',      label: 'Honn\u00EAtet\u00E9', emoji: '\uD83D\uDC8E', gradient: 'linear-gradient(135deg, #D4E6F1 0%, #85C1E9 100%)' },
  { value: 'respect',      label: 'Respect',            emoji: '\uD83D\uDE4F', gradient: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)' },
  { value: 'custom',       label: 'Autre',              emoji: '\u270F\uFE0F', gradient: 'linear-gradient(135deg, #F2F3F4 0%, #E5E7E9 100%)' },
];

const LANG_TOP = [
  { value: 'french',  label: 'Fran\u00E7ais', emoji: '\uD83C\uDDEB\uD83C\uDDF7', gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
  { value: 'english', label: 'Anglais',        emoji: '\uD83C\uDDEC\uD83C\uDDE7', gradient: 'linear-gradient(135deg, #FADBD8 0%, #F5B7B1 100%)' },
  { value: 'spanish', label: 'Espagnol',       emoji: '\uD83C\uDDEA\uD83C\uDDF8', gradient: 'linear-gradient(135deg, #FDEBD0 0%, #F9E79F 100%)' },
];

const LANG_OTHER = LANGUAGES.slice(3).map(l => ({
  value: l.value, label: l.label, emoji: l.flag, gradient: 'linear-gradient(135deg, #F2F3F4 0%, #E5E7E9 100%)'
}));

const RELIGION_OPTIONS = [
  { value: 'christian', label: 'Chr\u00E9tien',   emoji: '\u271D\uFE0F', gradient: 'linear-gradient(135deg, #D4E6F1 0%, #85C1E9 100%)' },
  { value: 'jewish',    label: 'Juif',             emoji: '\u2721\uFE0F', gradient: 'linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)' },
  { value: 'muslim',    label: 'Musulman',         emoji: '\u262A\uFE0F', gradient: 'linear-gradient(135deg, #D5F5E3 0%, #82E0AA 100%)' },
  { value: 'buddhist',  label: 'Bouddhiste',       emoji: '\uD83D\uDD49\uFE0F', gradient: 'linear-gradient(135deg, #FDEBD0 0%, #F9E79F 100%)' },
  { value: 'other',     label: 'Autre',            emoji: '\u270F\uFE0F', gradient: 'linear-gradient(135deg, #F2F3F4 0%, #E5E7E9 100%)' },
];

/* ══════════════════════════════════════════════
   STEP IDS
   ══════════════════════════════════════════════ */

const ALL_STEPS = ['age','theme','occasion','style','hero','appearance','photo','choice','extras1','extras2','cover','payment'] as const;
type StepId = (typeof ALL_STEPS)[number];

/* ══════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════ */

interface StoryWizardProps {
  formData: Partial<StoryFormData>;
  onUpdate: (data: Partial<StoryFormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isAuthenticated?: boolean;
  isClub?: boolean;
  currentUser?: { id: string; email: string; firstName?: string; lastName?: string; role: string } | null;
  clubCredit?: { canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null;
}

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */

export const StoryWizard: React.FC<StoryWizardProps> = ({
  formData,
  onUpdate,
  onSubmit,
  isSubmitting,
  isAuthenticated = false,
  isClub = false,
  currentUser = null,
  clubCredit = null,
}) => {
  /* ── Navigation ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [wantsExtras, setWantsExtras] = useState(false);
  const wantsExtrasRef = useRef(false);

  /* ── Extras toggles ── */
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showReligion, setShowReligion] = useState(false);
  const [showSecondaryChars, setShowSecondaryChars] = useState(false);

  /* ── Form state ── */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

  /* ── Cover ── */
  const { coverImageUrl, isGenerating: isCoverGenerating, error: coverError, generate: generateCover } = useCoverPreview(formData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => { wantsExtrasRef.current = wantsExtras; }, [wantsExtras]);

  /* ── Progress ── */
  const totalSteps = wantsExtras ? 12 : 10;
  const visiblePos = (!wantsExtras && currentStep > 7) ? currentStep - 2 : currentStep;
  const progress = Math.min(((visiblePos + 1) / totalSteps) * 100, 100);

  /* ── Scroll reset on step change ── */
  useEffect(() => {
    requestAnimationFrame(() => {
      viewportRef.current?.querySelectorAll('[data-wizard-step]').forEach(el => {
        (el as HTMLElement).scrollTop = 0;
      });
    });
  }, [currentStep]);

  /* ── Navigation functions ── */
  const goToStep = useCallback((target: number) => {
    if (isAnimating || target < 0 || target >= ALL_STEPS.length) return;
    setDirection(target > currentStep ? 'forward' : 'backward');
    setPrevStep(currentStep);
    setCurrentStep(target);
    setIsAnimating(true);
    setTimeout(() => { setPrevStep(null); setIsAnimating(false); }, 400);
  }, [currentStep, isAnimating]);

  const goNext = useCallback(() => {
    let next = currentStep + 1;
    if (!wantsExtrasRef.current && next === 8) next = 10;
    goToStep(next);
  }, [currentStep, goToStep]);

  const goBack = useCallback(() => {
    let prev = currentStep - 1;
    if (!wantsExtrasRef.current && prev === 9) prev = 7;
    goToStep(prev);
  }, [currentStep, goToStep]);

  /* ── Auto-advance on card select ── */
  const handleCardSelect = useCallback((field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (value === 'custom' || value === 'other') return;
    setTimeout(() => goNext(), 400);
  }, [onUpdate, goNext]);

  /* ── Cover generation on cover step ── */
  useEffect(() => {
    if (ALL_STEPS[currentStep] === 'cover' && !coverImageUrl && !isCoverGenerating) {
      generateCover();
    }
  }, [currentStep]); // eslint-disable-line

  /* ── Form helpers ── */
  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ photo: file });
      setTimeout(() => goNext(), 500);
    }
  };

  const handleProductSelection = (purchaseType: 'single' | 'club') => {
    setGlobalError('');
    onUpdate({ productType: 'ebook', purchaseType });
  };

  const handleEmailBlurCheck = async () => {
    if (!formData.userEmail) return;
    const ev = validateEmail(formData.userEmail);
    if (!ev.isValid) return;
    try {
      const res = await ApiService.checkEmail(formData.userEmail);
      if (res.success) setEmailStatus({ exists: res.exists, hasPassword: !!res.hasPassword });
    } catch { /* silent */ }
  };

  const validateField = (field: string, value: string, type?: 'email') => {
    const v = type === 'email' ? validateEmail(value) : validateRequired(value, field);
    if (!v.isValid) { setErrors(prev => ({ ...prev, [field]: v.error || '' })); return false; }
    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const validatePaymentForm = () => {
    let ok = true;
    const e: Record<string, string> = {};
    if (!formData.userEmail) { e.userEmail = "L'email est obligatoire"; ok = false; }
    else { const ev = validateEmail(formData.userEmail); if (!ev.isValid) { e.userEmail = ev.error || 'Email invalide'; ok = false; } }
    if (!formData.firstName) { e.firstName = 'Le pr\u00E9nom est obligatoire'; ok = false; }
    if (!formData.lastName) { e.lastName = 'Le nom est obligatoire'; ok = false; }
    setErrors(e);
    if (!ok) setGlobalError('Veuillez remplir tous les champs obligatoires');
    return ok;
  };

  const handleFormSubmit = () => {
    setGlobalError('');
    if (validatePaymentForm()) onSubmit();
  };

  /* ── Step completions ── */
  const isHeroComplete = !!(formData.protagonistName && formData.protagonistAge && formData.protagonistGender);
  const isAppearanceComplete = !!(formData.eyeColor && formData.hairColor);
  const isPaymentInfoComplete = !!(formData.productType && formData.userEmail && formData.firstName && formData.lastName);

  /* ══════════════════════════════════════════════
     RENDER STEPS
     ══════════════════════════════════════════════ */

  const renderStep = (stepIndex: number) => {
    const stepId = ALL_STEPS[stepIndex] as StepId;

    switch (stepId) {

      /* ═══ AGE ═══ */
      case 'age':
        return (
          <>
            <StepTitle>Pour quel \u00E2ge ?</StepTitle>
            <CardGrid $columns={2}>
              {AGE_OPTIONS.map((o, i) => (
                <LivingCard key={o.value} $isSelected={formData.ageRange === o.value} $gradient={o.gradient} $delay={i}
                  onClick={() => handleCardSelect('ageRange', o.value)}>
                  <CardEmoji>{o.emoji}</CardEmoji>
                  <CardLabel>{o.label}</CardLabel>
                </LivingCard>
              ))}
            </CardGrid>
          </>
        );

      /* ═══ THEME ═══ */
      case 'theme':
        return (
          <>
            <StepTitle>Quel univers ?</StepTitle>
            <CardGrid $columns={4} $compact>
              {THEME_OPTIONS.map((o, i) => (
                <LivingCard key={o.value} $isSelected={formData.generalTheme === o.value} $gradient={o.gradient} $delay={i}
                  onClick={() => o.value === 'custom' ? onUpdate({ generalTheme: 'custom' }) : handleCardSelect('generalTheme', o.value)}>
                  <CardEmoji $size="1.4rem">{o.emoji}</CardEmoji>
                  <CardLabel $small>{o.label}</CardLabel>
                </LivingCard>
              ))}
            </CardGrid>
            {formData.generalTheme === 'custom' && (
              <>
                <CustomInput type="text" placeholder="D\u00E9crivez votre th\u00E8me..." value={formData.customTheme || ''}
                  onChange={(e) => handleInputChange('customTheme', e.target.value)} autoFocus />
                <ContinueButton $isReady={!!(formData.customTheme?.trim())} disabled={!formData.customTheme?.trim()} onClick={goNext}>
                  Continuer
                </ContinueButton>
              </>
            )}
          </>
        );

      /* ═══ OCCASION ═══ */
      case 'occasion':
        return (
          <>
            <StepTitle>Quelle occasion ?</StepTitle>
            <CardGrid $columns={4} $compact>
              {OCCASION_OPTIONS.map((o, i) => (
                <LivingCard key={o.value} $isSelected={formData.specificSubject === o.value} $gradient={o.gradient} $delay={i}
                  onClick={() => o.value === 'custom' ? onUpdate({ specificSubject: 'custom' }) : handleCardSelect('specificSubject', o.value)}>
                  <CardEmoji $size="1.4rem">{o.emoji}</CardEmoji>
                  <CardLabel $small>{o.label}</CardLabel>
                </LivingCard>
              ))}
            </CardGrid>
            {formData.specificSubject === 'custom' && (
              <>
                <CustomInput type="text" placeholder="D\u00E9crivez votre occasion..." value={formData.customSubject || ''}
                  onChange={(e) => handleInputChange('customSubject', e.target.value)} autoFocus />
                <ContinueButton $isReady={!!(formData.customSubject?.trim())} disabled={!formData.customSubject?.trim()} onClick={goNext}>
                  Continuer
                </ContinueButton>
              </>
            )}
          </>
        );

      /* ═══ ILLUSTRATION STYLE ═══ */
      case 'style':
        return (
          <>
            <StepTitle>Quel style ?</StepTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '100%', maxWidth: '360px' }}>
              {ILLUSTRATION_STYLES.map((s) => (
                <StyleCard key={s.value} $isSelected={formData.illustrationStyle === s.value}
                  onClick={() => handleCardSelect('illustrationStyle', s.value)}>
                  <StyleImage $src={s.imagePath} />
                  <StyleLabel>{s.label}</StyleLabel>
                </StyleCard>
              ))}
            </div>
          </>
        );

      /* ═══ HERO IDENTITY ═══ */
      case 'hero':
        return (
          <>
            <StepTitle>Votre h\u00E9ros</StepTitle>
            <StepSubtitle>Qui sera le personnage principal ?</StepSubtitle>
            <InputRow>
              <InputField>
                <ValidatedInput label="Pr\u00E9nom *" value={formData.protagonistName || ''}
                  onChange={(v) => handleInputChange('protagonistName', v)} placeholder="Ex : Emma, Lucas..." required error={errors.protagonistName} />
              </InputField>
              <InputField>
                <AgeSelector label="\u00C2ge *" value={formData.protagonistAge || ''}
                  onChange={(v) => handleInputChange('protagonistAge', v)} required error={errors.protagonistAge} />
              </InputField>
            </InputRow>
            <CardGrid $columns={2}>
              {GENDER_OPTIONS.map((o, i) => (
                <LivingCard key={o.value} $isSelected={formData.protagonistGender === o.value} $gradient={o.gradient} $delay={i}
                  onClick={() => onUpdate({ protagonistGender: o.value as 'boy' | 'girl' })}>
                  <CardEmoji>{o.emoji}</CardEmoji>
                  <CardLabel>{o.label}</CardLabel>
                </LivingCard>
              ))}
            </CardGrid>
            <ContinueButton $isReady={isHeroComplete} disabled={!isHeroComplete} onClick={goNext}>
              Continuer
            </ContinueButton>
          </>
        );

      /* ═══ APPEARANCE ═══ */
      case 'appearance':
        return (
          <>
            <StepTitle>Son apparence</StepTitle>
            <ColorSectionLabel>Couleur des yeux</ColorSectionLabel>
            <ColorCardGrid>
              {EYE_OPTIONS.map((o) => (
                <ColorCard key={o.value} $isSelected={formData.eyeColor === o.value} $color={o.color}
                  onClick={() => onUpdate({ eyeColor: o.value })}>
                  <ColorBubble $color={o.color} $isSelected={formData.eyeColor === o.value} />
                  <ColorLabel>{o.label}</ColorLabel>
                </ColorCard>
              ))}
            </ColorCardGrid>
            <div style={{ height: theme.spacing.lg }} />
            <ColorSectionLabel>Couleur des cheveux</ColorSectionLabel>
            <ColorCardGrid>
              {HAIR_OPTIONS.map((o) => (
                <ColorCard key={o.value} $isSelected={formData.hairColor === o.value} $color={o.color}
                  onClick={() => onUpdate({ hairColor: o.value })}>
                  <ColorBubble $color={o.color} $isSelected={formData.hairColor === o.value} />
                  <ColorLabel>{o.label}</ColorLabel>
                </ColorCard>
              ))}
            </ColorCardGrid>
            <ContinueButton $isReady={isAppearanceComplete} disabled={!isAppearanceComplete} onClick={goNext}>
              Continuer
            </ContinueButton>
          </>
        );

      /* ═══ PHOTO ═══ */
      case 'photo':
        return (
          <>
            <StepTitle>Ajoutez sa photo</StepTitle>
            <StepSubtitle>Le personnage du conte ressemblera \u00E0 votre enfant</StepSubtitle>
            <PhotoUploadZone $hasPhoto={!!formData.photo} onClick={() => fileInputRef.current?.click()}>
              <PhotoIcon>{formData.photo ? '\u2705' : '\uD83D\uDCF7'}</PhotoIcon>
              <PhotoMainText>{formData.photo ? (formData.photo as File).name : 'Cliquez pour ajouter une photo'}</PhotoMainText>
              <PhotoSubText>{formData.photo ? 'Cliquez pour changer' : 'Optionnel \u2014 am\u00E9liore la personnalisation'}</PhotoSubText>
              <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} />
            </PhotoUploadZone>
            <SkipLink onClick={goNext}>Passer cette \u00E9tape \u2192</SkipLink>
          </>
        );

      /* ═══ CHOICE — Discover vs Personalize ═══ */
      case 'choice':
        return (
          <>
            <StepTitle>Votre histoire est pr\u00EAte !</StepTitle>
            <StepSubtitle>Que souhaitez-vous faire ?</StepSubtitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, width: '100%', alignItems: 'center' }}>
              <ChoiceCard $variant="primary" onClick={() => {
                setWantsExtras(false);
                wantsExtrasRef.current = false;
                goToStep(10); // → cover
              }}>
                <ChoiceEmoji>{'\u2728'}</ChoiceEmoji>
                <ChoiceTitle $variant="primary">D\u00E9couvrir mon conte</ChoiceTitle>
                <ChoiceDesc $variant="primary">G\u00E9n\u00E9rer la couverture maintenant</ChoiceDesc>
              </ChoiceCard>
              <ChoiceCard $variant="secondary" onClick={() => {
                setWantsExtras(true);
                wantsExtrasRef.current = true;
                goToStep(8); // → extras1
              }}>
                <ChoiceEmoji>{'\uD83C\uDFA8'}</ChoiceEmoji>
                <ChoiceTitle $variant="secondary">Personnaliser davantage</ChoiceTitle>
                <ChoiceDesc $variant="secondary">Message, langue, d\u00E9tails, personnages...</ChoiceDesc>
              </ChoiceCard>
            </div>
          </>
        );

      /* ═══ EXTRAS 1 — Message + Language ═══ */
      case 'extras1':
        return (
          <>
            <StepTitle>Personnalisez votre conte</StepTitle>

            <ExtrasSection>
              <SectionTitle>Quel message transmettre ?</SectionTitle>
              <CardGrid $columns={4} $compact>
                {MESSAGE_OPTIONS.map((o, i) => (
                  <LivingCard key={o.value} $isSelected={formData.centralMessage === o.value} $gradient={o.gradient} $delay={i}
                    onClick={() => o.value === 'custom' ? handleInputChange('centralMessage', 'custom') : handleInputChange('centralMessage', o.value)}>
                    <CardEmoji $size="1.2rem">{o.emoji}</CardEmoji>
                    <CardLabel $small>{o.label}</CardLabel>
                  </LivingCard>
                ))}
              </CardGrid>
              {formData.centralMessage === 'custom' && (
                <CustomInput type="text" placeholder="Votre message personnalis\u00E9..." value={formData.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)} />
              )}
            </ExtrasSection>

            <ExtrasSection>
              <SectionTitle>Langue du conte</SectionTitle>
              <CardGrid $columns={2} $compact>
                {LANG_TOP.map((o, i) => (
                  <LivingCard key={o.value} $isSelected={formData.language === o.value} $gradient={o.gradient} $delay={i}
                    onClick={() => handleInputChange('language', o.value)}>
                    <CardEmoji $size="1.2rem">{o.emoji}</CardEmoji>
                    <CardLabel $small>{o.label}</CardLabel>
                  </LivingCard>
                ))}
                <LivingCard $isSelected={false} $gradient="linear-gradient(135deg, #F2F3F4 0%, #E5E7E9 100%)" $delay={3}
                  onClick={() => setShowAllLanguages(!showAllLanguages)}>
                  <CardEmoji $size="1.2rem">{'\uD83C\uDF10'}</CardEmoji>
                  <CardLabel $small>Autre {showAllLanguages ? '\u25B2' : '\u25BC'}</CardLabel>
                </LivingCard>
              </CardGrid>
              {showAllLanguages && (
                <CardGrid $columns={2} $compact style={{ marginTop: theme.spacing.sm }}>
                  {LANG_OTHER.map((o, i) => (
                    <LivingCard key={o.value} $isSelected={formData.language === o.value} $gradient={o.gradient} $delay={i}
                      onClick={() => handleInputChange('language', o.value)}>
                      <CardEmoji $size="1.2rem">{o.emoji}</CardEmoji>
                      <CardLabel $small>{o.label}</CardLabel>
                    </LivingCard>
                  ))}
                </CardGrid>
              )}
            </ExtrasSection>

            <ContinueButton $isReady={true} onClick={goNext}>Continuer</ContinueButton>
          </>
        );

      /* ═══ EXTRAS 2 — Details + Religion + Secondary + Creator ═══ */
      case 'extras2':
        return (
          <>
            <StepTitle>Derni\u00E8res touches</StepTitle>

            <ExtrasSection>
              <SectionTitle>D\u00E9tails \u00E0 int\u00E9grer</SectionTitle>
              <TextArea placeholder="D\u00E9crivez des d\u00E9tails ou \u00E9v\u00E9nements sp\u00E9ciaux..."
                value={formData.specialEvents || ''} onChange={(e) => handleInputChange('specialEvents', e.target.value)} />
            </ExtrasSection>

            <ExtrasSection>
              <CollapsiblePill $isOpen={showReligion} onClick={() => {
                setShowReligion(!showReligion);
                if (showReligion) onUpdate({ religion: undefined, customReligion: undefined });
              }}>
                {'\u271A'} Dimension religieuse
                <CollapsibleChevron $isOpen={showReligion}>{'\u25BC'}</CollapsibleChevron>
              </CollapsiblePill>
              <CollapsibleContent $isOpen={showReligion}>
                <CardGrid $columns={3} $compact>
                  {RELIGION_OPTIONS.map((o, i) => (
                    <LivingCard key={o.value} $isSelected={formData.religion === o.value} $gradient={o.gradient} $delay={i}
                      onClick={() => handleInputChange('religion', o.value)}>
                      <CardEmoji $size="1.2rem">{o.emoji}</CardEmoji>
                      <CardLabel $small>{o.label}</CardLabel>
                    </LivingCard>
                  ))}
                </CardGrid>
                {formData.religion === 'other' && (
                  <CustomInput type="text" placeholder="Pr\u00E9cisez..." value={formData.customReligion || ''}
                    onChange={(e) => handleInputChange('customReligion', e.target.value)} />
                )}
              </CollapsibleContent>
            </ExtrasSection>

            <ExtrasSection>
              <CollapsiblePill $isOpen={showSecondaryChars} onClick={() => setShowSecondaryChars(!showSecondaryChars)}>
                {'\uD83E\uDDF8'} Personnages secondaires
                <CollapsibleChevron $isOpen={showSecondaryChars}>{'\u25BC'}</CollapsibleChevron>
              </CollapsiblePill>
              <CollapsibleContent $isOpen={showSecondaryChars}>
                <SecondaryCharactersSection
                  secondaryCharacters={formData.secondaryCharacters || []}
                  onChange={(chars) => onUpdate({ secondaryCharacters: chars })} />
              </CollapsibleContent>
            </ExtrasSection>

            <ExtrasSection>
              <SectionTitle>Cr\u00E9ateur du livre</SectionTitle>
              <InputField>
                <ValidatedInput label="" value={formData.creatorName || ''}
                  onChange={(v) => handleInputChange('creatorName', v)} placeholder="Ex : Cr\u00E9\u00E9 par Papa et Maman..." required={false} />
              </InputField>
            </ExtrasSection>

            <DiscoverCTA onClick={goNext}>
              {'\u2728'} D\u00E9couvrir mon conte
            </DiscoverCTA>
          </>
        );

      /* ═══ COVER REVEAL ═══ */
      case 'cover':
        return (
          <>
            <StepTitle>
              {coverImageUrl && !isCoverGenerating
                ? 'Votre conte est pr\u00EAt \u2728'
                : 'Cr\u00E9ation en cours...'}
            </StepTitle>
            {coverImageUrl && !isCoverGenerating && (
              <StepSubtitle>Voici la couverture de votre conte personnalis\u00E9</StepSubtitle>
            )}
            <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
              <BookCoverPreview coverImageUrl={coverImageUrl} isGenerating={isCoverGenerating} error={coverError} onClick={goNext} />
            </div>
            {coverImageUrl && !isCoverGenerating && (
              <DiscoverCTA onClick={goNext} style={{ marginTop: theme.spacing.xl }}>
                D\u00E9bloquez-le maintenant {'\u2192'}
              </DiscoverCTA>
            )}
          </>
        );

      /* ═══ PAYMENT ═══ */
      case 'payment':
        return (
          <>
            <StepTitle>Recevez votre conte</StepTitle>
            <StepSubtitle>Plus qu'une \u00E9tape pour offrir cette histoire unique</StepSubtitle>

            {isClub && clubCredit?.canSubmit && (
              <ClubFreeCard $isSelected={formData.purchaseType === 'club'} onClick={() => handleProductSelection('club')}>
                <ClubBadge>Membre Club</ClubBadge>
                <div style={{ fontSize: '1.5rem', margin: `${theme.spacing.sm} 0` }}>{'\uD83C\uDF81'}</div>
                <h3 style={{ fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.lg, margin: `0 0 4px` }}>Utiliser mon eBook gratuit</h3>
                <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.accent.coral, fontWeight: 700, margin: `0 0 4px` }}>0,00 \u20AC</p>
                <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.secondary, margin: 0 }}>
                  Il vous reste {clubCredit.remaining} eBook(s) gratuit(s)
                </p>
              </ClubFreeCard>
            )}

            {isClub && clubCredit && !clubCredit.canSubmit && (
              <ClubExhaustedMsg>Cr\u00E9dit hebdomadaire \u00E9puis\u00E9. Choisissez un format payant.</ClubExhaustedMsg>
            )}

            <PricingGrid>
              <PricingCard title="eBook Num\u00E9rique" price="4,99 \u20AC"
                features={["Conte de 20-30 pages", "Illustrations HD", "Format PDF", "T\u00E9l\u00E9chargement imm\u00E9diat"]}
                isPopular={formData.purchaseType === 'single'} ctaText="Recevoir mon conte"
                onSelect={() => handleProductSelection('single')} />
              {!isClub && (
                <PricingCard title="Club des Histoires" price="12,99 \u20AC / mois"
                  features={["Cet eBook inclus", "1 eBook gratuit / semaine", "Annulable \u00E0 tout moment"]}
                  isPopular={formData.purchaseType === 'club' || !formData.purchaseType}
                  ctaText="Rejoindre le Club" badge="Meilleure offre" subtitle="~3,25 \u20AC / conte"
                  onSelect={() => handleProductSelection('club')} />
              )}
            </PricingGrid>

            {formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit && (
              <OrderCostSummary $variant="free">Commande gratuite (cr\u00E9dit Club)</OrderCostSummary>
            )}
            {formData.purchaseType === 'club' && !isClub && (
              <OrderCostSummary $variant="info">Abonnement Club : 12,99 \u20AC / mois \u2014 Cet eBook est inclus</OrderCostSummary>
            )}
            {formData.purchaseType === 'single' && (
              <OrderCostSummary $variant="paid">Total : 4,99 \u20AC</OrderCostSummary>
            )}

            <OrderInfoSection>
              <SectionTitle>Informations de commande</SectionTitle>
              {isAuthenticated && currentUser && (
                <ConnectedBanner>Connect\u00E9 en tant que <strong>{currentUser.email}</strong></ConnectedBanner>
              )}
              <OrderInfoGrid>
                {isAuthenticated ? (
                  <FullWidthField>
                    <ValidatedInput type="email" label="Email" value={formData.userEmail || ''} onChange={() => {}} placeholder="" required disabled />
                  </FullWidthField>
                ) : (
                  <>
                    <FullWidthField>
                      <ValidatedInput type="email" label="Email" value={formData.userEmail || ''}
                        onChange={(v) => { setGlobalError(''); onUpdate({ userEmail: v }); if (errors.userEmail) setErrors(p => ({ ...p, userEmail: '' })); }}
                        placeholder="votre@email.com" required error={errors.userEmail}
                        onBlur={() => { validateField('userEmail', formData.userEmail || '', 'email'); handleEmailBlurCheck(); }} />
                      {emailStatus?.exists && emailStatus?.hasPassword && (
                        <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.accent.coral, marginTop: '4px' }}>
                          Ce compte existe. <span style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                            onClick={() => window.location.href = '/login'}>Connectez-vous</span>
                        </p>
                      )}
                    </FullWidthField>
                    <FullWidthField>
                      <ValidatedInput type="password" label="Mot de passe" value={formData.password || ''}
                        onChange={(v) => { onUpdate({ password: v }); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                        placeholder="Min. 8 caract\u00E8res" required={false} error={errors.password} />
                      <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.light, marginTop: '4px' }}>
                        Cr\u00E9ez un compte pour retrouver vos contes
                      </p>
                    </FullWidthField>
                  </>
                )}
                <InputField>
                  <ValidatedInput label="Pr\u00E9nom" value={formData.firstName || ''}
                    onChange={(v) => { setGlobalError(''); onUpdate({ firstName: v }); if (errors.firstName) setErrors(p => ({ ...p, firstName: '' })); }}
                    placeholder="Votre pr\u00E9nom" required error={errors.firstName}
                    onBlur={() => validateField('firstName', formData.firstName || '')} />
                </InputField>
                <InputField>
                  <ValidatedInput label="Nom" value={formData.lastName || ''}
                    onChange={(v) => { setGlobalError(''); onUpdate({ lastName: v }); if (errors.lastName) setErrors(p => ({ ...p, lastName: '' })); }}
                    placeholder="Votre nom" required error={errors.lastName}
                    onBlur={() => validateField('lastName', formData.lastName || '')} />
                </InputField>
              </OrderInfoGrid>
            </OrderInfoSection>

            {globalError && <ErrorMessage>{globalError}</ErrorMessage>}

            <PayButton $isReady={isPaymentInfoComplete} disabled={!formData.productType || isSubmitting} onClick={handleFormSubmit}>
              {isSubmitting
                ? '\u23F3 Traitement en cours...'
                : formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit
                  ? '\u2728 Recevoir mon eBook gratuit'
                  : '\u2728 Recevoir mon conte'}
            </PayButton>

            {!(formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) && (
              <p style={{ marginTop: theme.spacing.sm, fontSize: theme.fontSizes.xs, color: theme.colors.text.light, textAlign: 'center' }}>
                Paiement s\u00E9curis\u00E9 par Stripe
              </p>
            )}

            <TrustBadgesRow>
              <TrustBadge><span className="trust-icon">{'\uD83D\uDD12'}</span>S\u00E9curis\u00E9</TrustBadge>
              <TrustBadge><span className="trust-icon">{'\u2705'}</span>Satisfait ou rembours\u00E9</TrustBadge>
              <TrustBadge><span className="trust-icon">{'\u26A1'}</span>Livraison instantan\u00E9e</TrustBadge>
            </TrustBadgesRow>
          </>
        );

      default:
        return null;
    }
  };

  /* ══════════════════════════════════════════════
     STEP CONTAINER — Scrollable vs Centered
     ══════════════════════════════════════════════ */

  const isScrollableStep = (step: number) => {
    const id = ALL_STEPS[step];
    return id === 'extras1' || id === 'extras2' || id === 'payment';
  };

  const renderStepInContainer = (step: number, state: 'entering' | 'active' | 'exiting') => {
    const Container = isScrollableStep(step) ? StepContainerTop : StepContainerCentered;
    return (
      <Container key={`step-${step}-${state}`} $state={state} $direction={direction}
        data-wizard-step data-step={state}>
        {renderStep(step)}
      </Container>
    );
  };

  /* ══════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════ */

  return (
    <WizardOverlay>
      <WizardHeader>
        <BackArrow $visible={currentStep > 0} onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BackArrow>
        <WizardTitle>Cr\u00E9ez votre conte</WizardTitle>
        <ProgressTrack><ProgressFill $progress={progress} /></ProgressTrack>
      </WizardHeader>

      <WizardViewport ref={viewportRef}>
        {prevStep !== null && isAnimating && renderStepInContainer(prevStep, 'exiting')}
        {renderStepInContainer(currentStep, isAnimating ? 'entering' : 'active')}
      </WizardViewport>
    </WizardOverlay>
  );
};
