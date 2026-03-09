import React, { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../../styles/theme';
import { ValidatedInput } from '../ui/ValidatedInput';
import { AgeSelector } from '../ui/AgeSelector';

import { SecondaryCharactersSection } from '../forms/SecondaryCharactersSection';
import { useCoverPreview } from '../../hooks/useCoverPreview';
import { useStoryPreview } from '../../hooks/useStoryPreview';
import { useFirstIllustration } from '../../hooks/useFirstIllustration';
import { useWizardPersistence } from '../../hooks/useWizardPersistence';
import { validateEmail, validateRequired } from '../../utils/validation';
import { metaTrackAddToCart, metaTrackLead } from '../../utils/metaPixel';
import { ApiService } from '../../config/api';
import { ILLUSTRATION_STYLES, LANGUAGES, StoryFormData } from '../../types/FormTypes';
import { STEP_CONFIG, AGE_THEME_RECOMMENDATIONS, POPULAR_STYLES } from './choice-visuals';
import {
  WizardOverlay, WizardHeader, BackArrow, WizardTitle, ProgressTrack, ProgressFill,
  WizardViewport, StepContainerCentered,
  StepTitle, StepSubtitle,
  CardGrid, ImageCard, CardImg, CardImgLabel,
  TextCard,
  ColorCardGrid, ColorCard, ColorBubble, ColorLabel, ColorSectionLabel,
  InputRow, InputField, CustomInput, TextArea,
  PhotoUploadZone, PhotoIcon, PhotoMainText, PhotoSubText, HiddenFileInput,
  ContinueButton, SkipLink,
  ChoiceCard, ChoiceTitle, ChoiceDesc,
  DiscoverCTA,
  ExtrasSection, SectionTitle,
  CollapsiblePill, CollapsibleChevron, CollapsibleContent,
  OrderInfoSection, OrderInfoGrid, FullWidthField,
  PayButton, TrustBadgesRow, TrustBadge, ErrorMessage, ConnectedBanner,
  ClubFreeCard, ClubBadge,
  PreviewLoadingContainer, PreviewLoadingBook, PreviewLoadingSparkle,
  PreviewLoadingText, PreviewLoadingDots, PreviewLoadingStages, PreviewLoadingStage,
  BookPreviewWrapper, BookPageFrame, BookCoverImage, MagicParticle,
  BookStoryLayout, BookTextHalf, BookImageHalf, BookCreatorTag, BookPageBadge,
  BookLockedOverlay, BookLockedContent, BookLockedIcon, BookLockedTitle, BookLockedSubtitle,
  PricingSelectedCheck,
  PreviewTimerBar, PreviewTimerDigits,
  ValueBlock, ValueBlockTitle, ValueBlockItem,
  PricingGrid, PricingCard, PricingCardBadge, PricingCardName, PricingCardPrice, PricingFreeLabel,
  PricingCardSub, PricingPerStory, PricingCardFeaturesList, PricingCardFeatureItem, PricingCardCTA,
  PreviewSectionTitle, SocialProofLine,
  MaterializeImage, MaterializeText,
  GenerationCanvas, CanvasLayer, CanvasGradientBg,
  FloatingPage, CanvasSplash, CanvasSparkle,
  CanvasCenterContent, CanvasBookIcon, CanvasBookSpine, CanvasBookCover, CanvasBookStar, CanvasBookGlow,
  CanvasTextOverlay, CanvasTitle, CanvasMessagesContainer, CanvasMessage,
  CanvasProgressContainer, CanvasProgressTrack, CanvasProgressFill, CanvasProgressSteps, CanvasProgressStep,
  // V2 new components
  WizardHeaderNew, HeaderTopRow, HeaderTitle, HeaderBadge, HeaderStepLabel,
  SegmentedProgressBar, ProgressSegment,
  StickyBottomBar, StickyBackButton, StickyContinueButton,
  NewChoiceCardGrid, NewChoiceCard, NewCardLabel, NewCardDescription, CardBadgePill,
  SummaryChipsRow, SummaryChip,
  GenderCard, GenderCardIcon, GenderCardLabel,
  RewardWrapper, RewardSparkle, RewardTitle,
  DetailChipGroup, DetailChip,
  AccordionHeader, AccordionChevron, AccordionBody,
  DraftBanner, DraftBannerText, DraftBannerButton, DraftBannerDismiss,
  BookPreviewBanner, BookPreviewCover, BookPreviewText,
  StepMicroText, ProgressHintText,
} from './WizardSharedStyles';

/* ══════════════════════════════════════════════
   CARD DATA — Images from existing assets
   ══════════════════════════════════════════════ */

const AGE_OPTIONS = [
  { value: '0-2', label: '0-2 ans', imagePath: '/image/ageenfant/age-0-2.png' },
  { value: '3-5', label: '3-5 ans', imagePath: '/image/ageenfant/age-3-5.png' },
  { value: '6-9', label: '6-9 ans', imagePath: '/image/ageenfant/age-6-9.png' },
  { value: '10+', label: '10+ ans', imagePath: '/image/ageenfant/age-10-plus.png' },
];

const THEME_OPTIONS = [
  { value: 'educational',  label: 'Éducatif',       imagePath: '/image/themes/educatif.png' },
  { value: 'fairy-tales',  label: 'Contes de fées', imagePath: '/image/themes/contes-de-fees.png' },
  { value: 'activities',   label: 'Activités',      imagePath: '/image/themes/activites.png' },
  { value: 'stories',      label: 'Histoires',      imagePath: '/image/themes/histoires.png' },
  { value: 'celebrations', label: 'Fêtes',          imagePath: '/image/themes/fetes.png' },
  { value: 'family',       label: 'Famille',        imagePath: '/image/themes/famille.png' },
  { value: 'custom',       label: 'Personnalisé',   imagePath: '/image/themes/personnalise.png' },
];

const OCCASION_OPTIONS = [
  { value: 'birthday',    label: 'Anniversaire',      imagePath: '/image/occasions/anniversaire.png' },
  { value: 'christmas',   label: 'Noël',              imagePath: '/image/occasions/noel.png' },
  { value: 'new-year',    label: 'Nouvel An',         imagePath: '/image/occasions/nouvel-an.png' },
  { value: 'easter',      label: 'Pâques',            imagePath: '/image/occasions/paques.png' },
  { value: 'eid',         label: 'Aïd el-Fitr',      imagePath: '/image/occasions/aid.png' },
  { value: 'mothers-day', label: 'Fête des mères',    imagePath: '/image/occasions/fete-meres.png' },
  { value: 'fathers-day', label: 'Fête des pères',    imagePath: '/image/occasions/fete-peres.png' },
  { value: 'custom',      label: 'Autre',             imagePath: '/image/occasions/personnalise.png' },
];

const MESSAGE_OPTIONS = [
  { value: 'friendship',   label: 'Amitié',        imagePath: '/image/messages/amitie.png' },
  { value: 'courage',      label: 'Courage',       imagePath: '/image/messages/courage.png' },
  { value: 'love',         label: 'Amour',         imagePath: '/image/messages/amour.png' },
  { value: 'perseverance', label: 'Persévérance',  imagePath: '/image/messages/perseverance.png' },
  { value: 'sharing',      label: 'Partage',       imagePath: '/image/messages/partage.png' },
  { value: 'honesty',      label: 'Honnêteté',     imagePath: '/image/messages/honnetete.png' },
  { value: 'respect',      label: 'Respect',       imagePath: '/image/messages/respect.png' },
  { value: 'custom',       label: 'Autre',         imagePath: '/image/messages/personnalise.png' },
];

const GENDER_OPTIONS = [
  { value: 'girl', label: 'Fille' },
  { value: 'boy',  label: 'Garçon' },
];

const EYE_OPTIONS = [
  { value: 'brown', label: 'Marron',   color: '#8B4513' },
  { value: 'blue',  label: 'Bleu',     color: '#4169E1' },
  { value: 'green', label: 'Vert',     color: '#228B22' },
  { value: 'hazel', label: 'Noisette', color: '#CD853F' },
];

const HAIR_OPTIONS = [
  { value: 'brown',  label: 'Châtain', color: '#8B4513' },
  { value: 'blonde', label: 'Blond',   color: '#FFD700' },
  { value: 'black',  label: 'Noir',    color: '#1a1a1a' },
  { value: 'red',    label: 'Roux',    color: '#D35400' },
];

const SKIN_OPTIONS = [
  { value: 'light',  label: 'Clair',  color: '#FDDCB5' },
  { value: 'medium', label: 'Moyen',  color: '#E8B88A' },
  { value: 'olive',  label: 'Mat',    color: '#C8915E' },
  { value: 'dark',   label: 'Foncé',  color: '#8D5524' },
];

const LANG_TOP = [
  { value: 'french',  label: 'Français' },
  { value: 'english', label: 'Anglais' },
  { value: 'spanish', label: 'Espagnol' },
];
const LANG_OTHER = LANGUAGES.slice(3).map(l => ({ value: l.value, label: l.label }));

const RELIGION_OPTIONS = [
  { value: 'christian', label: 'Chrétien' },
  { value: 'jewish',    label: 'Juif' },
  { value: 'muslim',    label: 'Musulman' },
  { value: 'buddhist',  label: 'Bouddhiste' },
  { value: 'other',     label: 'Autre' },
];

/* ══════════════════════════════════════════════ */

const ALL_STEPS = ['age','theme','occasion','style','hero','appearance','choice','extras1','extras2','preview'] as const;
type StepId = (typeof ALL_STEPS)[number];

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
  formData, onUpdate, onSubmit, isSubmitting,
  isAuthenticated = false, isClub = false, currentUser = null, clubCredit = null,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [wantsExtras, setWantsExtras] = useState(false);
  const wantsExtrasRef = useRef(false);

  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showReligion, setShowReligion] = useState(false);
  const [showSecondaryChars, setShowSecondaryChars] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

  const { load: loadDraft, clear: clearDraft, autoSave, hasDraft } = useWizardPersistence();

  const { coverImageUrl, coverTitle, rawBase64, isGenerating: isCoverGenerating, error: coverError, generate: generateCover } = useCoverPreview(formData);
  const { previewTitle, previewParagraphs, isGenerating: isStoryPreviewGenerating, error: storyPreviewError, generate: generateStoryPreview } = useStoryPreview(formData);
  const { illustrationUrl, illustrationBase64, isGenerating: isIllustrationGenerating, generate: generateIllustration } = useFirstIllustration(formData);
  const illustrationTriggeredRef = useRef(false);

  // Countdown timer for preview step
  const [countdown, setCountdown] = useState(1200); // 20 minutes in seconds
  const [selectedOffer, setSelectedOffer] = useState<'single' | 'club_monthly' | 'club_annual' | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const orderFormRef = useRef<HTMLDivElement>(null);
  const storyPageRef = useRef<HTMLDivElement>(null);
  const lockedPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { wantsExtrasRef.current = wantsExtras; }, [wantsExtras]);

  // Draft resume on mount
  useEffect(() => {
    if (hasDraft()) setShowDraftBanner(true);
  }, []); // eslint-disable-line

  const handleResumeDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      onUpdate(draft.formData as Partial<StoryFormData>);
      setCurrentStep(draft.currentStep);
    }
    setShowDraftBanner(false);
  }, [loadDraft, onUpdate]);

  // Auto-save on step/formData change (skip preview)
  useEffect(() => {
    if (currentStep < 9) {
      autoSave(formData as Record<string, unknown>, currentStep);
    }
  }, [currentStep, formData, autoSave]);

  const totalSteps = wantsExtras ? 12 : 10;
  const visiblePos = (!wantsExtras && currentStep > 6) ? currentStep - 2 : currentStep;
  const progress = Math.min(((visiblePos + 1) / totalSteps) * 100, 100);

  // Scroll reset
  useEffect(() => {
    requestAnimationFrame(() => {
      viewportRef.current?.querySelectorAll('[data-wizard-step]').forEach(el => {
        (el as HTMLElement).scrollTop = 0;
      });
    });
  }, [currentStep]);

  // Navigation
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
    if (!wantsExtrasRef.current && next === 7) next = 9;
    goToStep(next);
  }, [currentStep, goToStep]);

  const goBack = useCallback(() => {
    let prev = currentStep - 1;
    if (!wantsExtrasRef.current && prev === 8) prev = 6;
    goToStep(prev);
  }, [currentStep, goToStep]);

  const handleCardSelect = useCallback((field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (value === 'custom' || value === 'other') return;
    setTimeout(() => goNext(), 400);
  }, [onUpdate, goNext]);

  // Cover + story preview generation (parallel) — triggered when entering preview step
  useEffect(() => {
    if (ALL_STEPS[currentStep] === 'preview') {
      if (!coverImageUrl && !isCoverGenerating) generateCover();
      if (!previewParagraphs && !isStoryPreviewGenerating) generateStoryPreview();
    }
  }, [currentStep]); // eslint-disable-line

  // Trigger first illustration when cover + text preview are both ready
  useEffect(() => {
    if (illustrationTriggeredRef.current) return;
    if (previewParagraphs && previewParagraphs.length > 0 && rawBase64 && !isIllustrationGenerating && !illustrationUrl) {
      illustrationTriggeredRef.current = true;
      generateIllustration(previewParagraphs[0], rawBase64);
    }
  }, [previewParagraphs, rawBase64, isIllustrationGenerating, illustrationUrl]); // eslint-disable-line

  // Recovery: re-trigger generation when user returns to page (tab switch, phone lock, etc.)
  useEffect(() => {
    if (ALL_STEPS[currentStep] !== 'preview') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      // Small delay to let browser restore network connections
      setTimeout(() => {
        if (!coverImageUrl && !isCoverGenerating) generateCover();
        if (!previewParagraphs && !isStoryPreviewGenerating) generateStoryPreview();
        // Reset illustration guard so it can re-trigger if needed
        if (!illustrationBase64 && !isIllustrationGenerating) {
          illustrationTriggeredRef.current = false;
        }
      }, 500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentStep, coverImageUrl, isCoverGenerating, previewParagraphs, isStoryPreviewGenerating, illustrationBase64, isIllustrationGenerating, generateCover, generateStoryPreview]); // eslint-disable-line

  // Countdown timer for preview step
  useEffect(() => {
    if (ALL_STEPS[currentStep] === 'preview') {
      setCountdown(1200);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) return 1200; // restart silently
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    };
  }, [currentStep]);

  // Helpers
  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { onUpdate({ photo: file, appearanceMode: 'photo', eyeColor: '', hairColor: '', skinColor: '' }); }
  };

  const handleEmailBlurCheck = async () => {
    if (!formData.userEmail) return;
    const ev = validateEmail(formData.userEmail);
    if (!ev.isValid) return;
    metaTrackLead();
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
    if (!formData.firstName) { e.firstName = 'Le prénom est obligatoire'; ok = false; }
    if (!formData.lastName) { e.lastName = 'Le nom est obligatoire'; ok = false; }
    setErrors(e);
    if (!ok) setGlobalError('Veuillez remplir tous les champs obligatoires');
    return ok;
  };

  const handleFormSubmit = () => { setGlobalError(''); if (validatePaymentForm()) { clearDraft(); onSubmit(); } };

  const isHeroComplete = !!(formData.protagonistName && formData.protagonistAge && formData.protagonistGender);
  const isAppearanceComplete = formData.appearanceMode === 'photo'
    ? !!formData.photo
    : !!(formData.eyeColor && formData.hairColor && formData.skinColor);
  const isPaymentInfoComplete = !!(formData.productType && formData.userEmail && formData.firstName && formData.lastName);

  // Summary chips data (shown from step 3+)
  const summaryChips: { label: string; value: string }[] = [];
  if (formData.ageRange) {
    const age = AGE_OPTIONS.find(o => o.value === formData.ageRange);
    if (age) summaryChips.push({ label: 'Âge', value: age.label });
  }
  if (formData.generalTheme) {
    const th = THEME_OPTIONS.find(o => o.value === formData.generalTheme);
    if (th) summaryChips.push({ label: 'Univers', value: th.label });
  }
  if (formData.specificSubject) {
    const occ = OCCASION_OPTIONS.find(o => o.value === formData.specificSubject);
    if (occ) summaryChips.push({ label: 'Occasion', value: occ.label });
  }
  if (formData.illustrationStyle) {
    const st = ILLUSTRATION_STYLES.find(o => o.value === formData.illustrationStyle);
    if (st) summaryChips.push({ label: 'Style', value: st.label });
  }

  const stepId = ALL_STEPS[currentStep];
  const showSummary = currentStep >= 3 && currentStep < 9 && summaryChips.length > 0;
  const isAutoAdvanceStep = ['age', 'theme', 'occasion', 'style'].includes(stepId);
  // Show sticky bar for all steps except preview and step 0 (no back needed)
  const showStickyBar = currentStep < 9 && stepId !== 'choice';
  const showStickyContinue = !isAutoAdvanceStep; // auto-advance steps only show back

  // Recommended themes based on age
  const recommendedThemes = formData.ageRange
    ? AGE_THEME_RECOMMENDATIONS[formData.ageRange] || []
    : [];

  /* ══════════════════════════════════════════════
     RENDER STEPS
     ══════════════════════════════════════════════ */

  const renderStep = (stepIndex: number) => {
    const stepId = ALL_STEPS[stepIndex] as StepId;

    switch (stepId) {

      case 'age':
        return (
          <>
            <BookPreviewBanner>
              <BookPreviewCover $src="/image/themes/contes-de-fees.png" />
              <BookPreviewText>Ton enfant devient le héros de son propre livre 📚</BookPreviewText>
            </BookPreviewBanner>
            <StepTitle>Pour quel âge ?</StepTitle>
            <StepMicroText>Choisis l'âge pour commencer à créer son histoire</StepMicroText>
            <CardGrid $columns={4}>
              {AGE_OPTIONS.map((o, i) => (
                <ImageCard key={o.value} $isSelected={formData.ageRange === o.value} $delay={i}
                  aria-label={o.label}
                  onClick={() => handleCardSelect('ageRange', o.value)}>
                  <CardImg $src={o.imagePath} />
                  <CardImgLabel>{o.label}</CardImgLabel>
                </ImageCard>
              ))}
            </CardGrid>
          </>
        );

      case 'theme':
        return (
          <>
            <StepTitle>Quel univers ?</StepTitle>
            <CardGrid $columns={4} $compact>
              {THEME_OPTIONS.map((o, i) => {
                const isRecommended = recommendedThemes.includes(o.value);
                return (
                  <ImageCard key={o.value} $isSelected={formData.generalTheme === o.value} $delay={i}
                    aria-label={o.label} style={{ position: 'relative' }}
                    onClick={() => o.value === 'custom' ? onUpdate({ generalTheme: 'custom' }) : handleCardSelect('generalTheme', o.value)}>
                    {isRecommended && <CardBadgePill $variant="recommended">Recommandé</CardBadgePill>}
                    <CardImg $src={o.imagePath} />
                    <CardImgLabel>{o.label}</CardImgLabel>
                  </ImageCard>
                );
              })}
            </CardGrid>
            {formData.generalTheme === 'custom' && (
              <>
                <CustomInput type="text" placeholder="Décrivez votre thème..." value={formData.customTheme || ''}
                  onChange={(e) => handleInputChange('customTheme', e.target.value)} autoFocus />
                <ContinueButton $isReady={!!(formData.customTheme?.trim())} disabled={!formData.customTheme?.trim()} onClick={goNext}>
                  Continuer
                </ContinueButton>
              </>
            )}
          </>
        );

      case 'occasion':
        return (
          <>
            <StepTitle>Quelle occasion ?</StepTitle>
            {showSummary && (
              <SummaryChipsRow>
                {summaryChips.map((c, i) => (
                  <SummaryChip key={c.label} $delay={i}>{c.label}: {c.value}</SummaryChip>
                ))}
              </SummaryChipsRow>
            )}
            <CardGrid $columns={4} $compact>
              {OCCASION_OPTIONS.map((o, i) => (
                <ImageCard key={o.value} $isSelected={formData.specificSubject === o.value} $delay={i}
                  aria-label={o.label}
                  onClick={() => o.value === 'custom' ? onUpdate({ specificSubject: 'custom' }) : handleCardSelect('specificSubject', o.value)}>
                  <CardImg $src={o.imagePath} />
                  <CardImgLabel>{o.label}</CardImgLabel>
                </ImageCard>
              ))}
            </CardGrid>
            {formData.specificSubject === 'custom' && (
              <>
                <CustomInput type="text" placeholder="Décrivez votre occasion..." value={formData.customSubject || ''}
                  onChange={(e) => handleInputChange('customSubject', e.target.value)} autoFocus />
                <ContinueButton $isReady={!!(formData.customSubject?.trim())} disabled={!formData.customSubject?.trim()} onClick={goNext}>
                  Continuer
                </ContinueButton>
              </>
            )}
          </>
        );

      case 'style':
        return (
          <>
            <StepTitle>Quel style d'illustration ?</StepTitle>
            {showSummary && (
              <SummaryChipsRow>
                {summaryChips.map((c, i) => (
                  <SummaryChip key={c.label} $delay={i}>{c.label}: {c.value}</SummaryChip>
                ))}
              </SummaryChipsRow>
            )}
            <CardGrid $columns={3}>
              {ILLUSTRATION_STYLES.map((s, i) => {
                const isPopular = POPULAR_STYLES.includes(s.value);
                return (
                  <ImageCard key={s.value} $isSelected={formData.illustrationStyle === s.value} $delay={i}
                    aria-label={s.label} style={{ position: 'relative' }}
                    onClick={() => handleCardSelect('illustrationStyle', s.value)}>
                    {isPopular && <CardBadgePill $variant="popular">Populaire</CardBadgePill>}
                    <CardImg $src={s.imagePath} style={{ aspectRatio: '1.1' }} />
                    <CardImgLabel>{s.label}</CardImgLabel>
                  </ImageCard>
                );
              })}
            </CardGrid>
          </>
        );

      case 'hero':
        return (
          <>
            <StepTitle>Votre héros</StepTitle>
            <StepSubtitle>Qui sera le personnage principal ?</StepSubtitle>
            {showSummary && (
              <SummaryChipsRow>
                {summaryChips.map((c, i) => (
                  <SummaryChip key={c.label} $delay={i}>{c.label}: {c.value}</SummaryChip>
                ))}
              </SummaryChipsRow>
            )}
            <InputRow>
              <InputField>
                <ValidatedInput label="Prénom *" value={formData.protagonistName || ''}
                  onChange={(v) => handleInputChange('protagonistName', v)} placeholder="Ex : Emma, Lucas..." required error={errors.protagonistName} />
              </InputField>
              <InputField>
                <AgeSelector label="Âge *" value={formData.protagonistAge || ''}
                  onChange={(v) => handleInputChange('protagonistAge', v)} required error={errors.protagonistAge} />
              </InputField>
            </InputRow>
            <CardGrid $columns={2} style={{ maxWidth: 320 }}>
              {GENDER_OPTIONS.map((o, i) => (
                <GenderCard key={o.value} $isSelected={formData.protagonistGender === o.value} $delay={i}
                  aria-label={`Genre: ${o.label}`}
                  onClick={() => onUpdate({ protagonistGender: o.value as 'boy' | 'girl' })}>
                  <GenderCardIcon>
                    {o.value === 'girl' ? (
                      <svg viewBox="0 0 80 80" fill="none" width="52" height="52">
                        <circle cx="40" cy="32" r="18" fill="#FFE0EC" stroke={theme.colors.accent.coral} strokeWidth="2.5" />
                        <circle cx="34" cy="29" r="2.5" fill={theme.colors.text.primary} />
                        <circle cx="46" cy="29" r="2.5" fill={theme.colors.text.primary} />
                        <path d="M35 36 Q40 41 45 36" fill="none" stroke={theme.colors.text.primary} strokeWidth="2" strokeLinecap="round" />
                        <path d="M24 22 Q28 10 40 12 Q52 10 56 22" fill="none" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" />
                        <path d="M22 24 Q20 34 24 38" fill="none" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M58 24 Q60 34 56 38" fill="none" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M40 50 L40 62" stroke={theme.colors.accent.coral} strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M32 62 L48 62" stroke={theme.colors.accent.coral} strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="40" cy="56" r="6" fill="none" stroke={theme.colors.accent.coral} strokeWidth="2.5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 80 80" fill="none" width="52" height="52">
                        <circle cx="40" cy="34" r="18" fill="#E0F0FF" stroke="#7CB9D0" strokeWidth="2.5" />
                        <circle cx="34" cy="31" r="2.5" fill={theme.colors.text.primary} />
                        <circle cx="46" cy="31" r="2.5" fill={theme.colors.text.primary} />
                        <path d="M35 38 Q40 43 45 38" fill="none" stroke={theme.colors.text.primary} strokeWidth="2" strokeLinecap="round" />
                        <path d="M24 26 Q30 14 40 16 Q50 14 56 26" fill="none" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
                        <path d="M26 26 L24 20" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M54 26 L56 20" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M40 52 L52 64" stroke="#7CB9D0" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M47 58 L57 58 M52 53 L52 63" stroke="#7CB9D0" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </GenderCardIcon>
                  <GenderCardLabel $isSelected={formData.protagonistGender === o.value}>{o.label}</GenderCardLabel>
                </GenderCard>
              ))}
            </CardGrid>
          </>
        );

      case 'appearance':
        return (
          <>
            <StepTitle>Son apparence</StepTitle>
            <StepSubtitle>Comment ressemble votre personnage ?</StepSubtitle>

            {/* ---- Mode choice ---- */}
            {!formData.appearanceMode && (
              <NewChoiceCardGrid style={{ maxWidth: 400 }}>
                <NewChoiceCard $isSelected={false} $delay={0}
                  onClick={() => onUpdate({ appearanceMode: 'photo', eyeColor: '', hairColor: '', skinColor: '' })}
                  style={{ padding: '24px 16px', background: `linear-gradient(145deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})` }}>
                  <svg viewBox="0 0 80 80" fill="none" width="56" height="56" aria-hidden="true">
                    <circle cx="40" cy="40" r="36" fill="rgba(255,255,255,0.2)" />
                    <rect x="22" y="26" width="36" height="28" rx="4" fill="white" opacity="0.9" />
                    <circle cx="40" cy="38" r="8" fill="none" stroke="white" strokeWidth="2.5" />
                    <circle cx="40" cy="38" r="4" fill="white" opacity="0.6" />
                  </svg>
                  <NewCardLabel style={{ color: 'white' }}>Importer une photo</NewCardLabel>
                  <NewCardDescription style={{ color: 'rgba(255,255,255,0.85)' }}>Le personnage ressemblera à votre enfant</NewCardDescription>
                </NewChoiceCard>

                <NewChoiceCard $isSelected={false} $delay={1}
                  onClick={() => onUpdate({ appearanceMode: 'manual', photo: undefined })}>
                  <svg viewBox="0 0 80 80" fill="none" width="56" height="56" aria-hidden="true">
                    <circle cx="40" cy="40" r="36" fill={`${theme.colors.accent.coral}12`} />
                    <circle cx="25" cy="35" r="7" fill="#4169E1" opacity="0.8" />
                    <circle cx="50" cy="28" r="7" fill="#FFD700" />
                    <circle cx="28" cy="54" r="6" fill="#FDDCB5" />
                    <circle cx="44" cy="54" r="6" fill="#E8B88A" />
                    <circle cx="60" cy="54" r="6" fill="#8D5524" />
                  </svg>
                  <NewCardLabel>Personnaliser</NewCardLabel>
                  <NewCardDescription>Choisir yeux, cheveux et peau</NewCardDescription>
                </NewChoiceCard>
              </NewChoiceCardGrid>
            )}

            {/* ---- Photo mode ---- */}
            {formData.appearanceMode === 'photo' && (
              <>
                <PhotoUploadZone $hasPhoto={!!formData.photo} onClick={() => fileInputRef.current?.click()}>
                  <PhotoIcon>{formData.photo ? '✓' : '📷'}</PhotoIcon>
                  <PhotoMainText>{formData.photo ? (formData.photo as File).name : 'Cliquez pour ajouter une photo'}</PhotoMainText>
                  <PhotoSubText>{formData.photo ? 'Cliquez pour changer' : 'Photo de face, bien éclairée'}</PhotoSubText>
                  <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} />
                </PhotoUploadZone>
                <SkipLink onClick={() => onUpdate({ appearanceMode: undefined, photo: undefined })}>
                  Changer de méthode
                </SkipLink>
              </>
            )}

            {/* ---- Manual mode ---- */}
            {formData.appearanceMode === 'manual' && (
              <>
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
                <div style={{ height: theme.spacing.lg }} />
                <ColorSectionLabel>Couleur de la peau</ColorSectionLabel>
                <ColorCardGrid>
                  {SKIN_OPTIONS.map((o) => (
                    <ColorCard key={o.value} $isSelected={formData.skinColor === o.value} $color={o.color}
                      onClick={() => onUpdate({ skinColor: o.value })}>
                      <ColorBubble $color={o.color} $isSelected={formData.skinColor === o.value} />
                      <ColorLabel>{o.label}</ColorLabel>
                    </ColorCard>
                  ))}
                </ColorCardGrid>
                <SkipLink onClick={() => onUpdate({ appearanceMode: undefined, eyeColor: '', hairColor: '', skinColor: '' })}>
                  Changer de méthode
                </SkipLink>
              </>
            )}
          </>
        );

      case 'choice':
        return (
          <RewardWrapper>
            <RewardSparkle $delay={0} $left="15%" $size={5} />
            <RewardSparkle $delay={0.8} $left="35%" $size={7} />
            <RewardSparkle $delay={1.6} $left="55%" $size={4} />
            <RewardSparkle $delay={0.4} $left="75%" $size={6} />
            <RewardSparkle $delay={1.2} $left="90%" $size={5} />
            <RewardTitle>Votre histoire est prête !</RewardTitle>
            <StepSubtitle>Que souhaitez-vous faire ?</StepSubtitle>
            {showSummary && (
              <SummaryChipsRow>
                {summaryChips.map((c, i) => (
                  <SummaryChip key={c.label} $delay={i}>{c.label}: {c.value}</SummaryChip>
                ))}
              </SummaryChipsRow>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, width: '100%', alignItems: 'center' }}>
              <ChoiceCard $variant="primary" onClick={() => {
                setWantsExtras(false); wantsExtrasRef.current = false; goToStep(9);
              }}>
                <ChoiceTitle $variant="primary">Découvrir mon conte</ChoiceTitle>
                <ChoiceDesc $variant="primary">Générer la couverture maintenant</ChoiceDesc>
              </ChoiceCard>
              <ChoiceCard $variant="secondary" onClick={() => {
                setWantsExtras(true); wantsExtrasRef.current = true; goToStep(7);
              }}>
                <ChoiceTitle $variant="secondary">Personnaliser davantage</ChoiceTitle>
                <ChoiceDesc $variant="secondary">Message, langue, détails, personnages...</ChoiceDesc>
              </ChoiceCard>
            </div>
          </RewardWrapper>
        );

      case 'extras1':
        return (
          <>
            <StepTitle>Personnalisez votre conte</StepTitle>
            <ExtrasSection>
              <SectionTitle>Quel message transmettre ?</SectionTitle>
              <CardGrid $columns={4} $compact>
                {MESSAGE_OPTIONS.map((o, i) => (
                  <ImageCard key={o.value} $isSelected={formData.centralMessage === o.value} $delay={i}
                    aria-label={o.label}
                    onClick={() => handleInputChange('centralMessage', o.value)}>
                    <CardImg $src={o.imagePath} />
                    <CardImgLabel>{o.label}</CardImgLabel>
                  </ImageCard>
                ))}
              </CardGrid>
              {formData.centralMessage === 'custom' && (
                <CustomInput type="text" placeholder="Votre message personnalisé..." value={formData.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)} />
              )}
            </ExtrasSection>

            <ExtrasSection>
              <SectionTitle>Langue du conte</SectionTitle>
              <DetailChipGroup>
                {LANG_TOP.map((o) => (
                  <DetailChip key={o.value} $isSelected={formData.language === o.value}
                    onClick={() => handleInputChange('language', o.value)}>
                    {o.label}
                  </DetailChip>
                ))}
                <DetailChip $isSelected={false}
                  onClick={() => setShowAllLanguages(!showAllLanguages)}>
                  {showAllLanguages ? 'Masquer ▲' : 'Autre ▼'}
                </DetailChip>
              </DetailChipGroup>
              {showAllLanguages && (
                <DetailChipGroup>
                  {LANG_OTHER.map((o) => (
                    <DetailChip key={o.value} $isSelected={formData.language === o.value}
                      onClick={() => handleInputChange('language', o.value)}>
                      {o.label}
                    </DetailChip>
                  ))}
                </DetailChipGroup>
              )}
            </ExtrasSection>
          </>
        );

      case 'extras2':
        return (
          <>
            <StepTitle>Dernières touches</StepTitle>
            <ExtrasSection>
              <SectionTitle>Détails à intégrer</SectionTitle>
              <TextArea placeholder="Décrivez des détails ou événements spéciaux..."
                value={formData.specialEvents || ''} onChange={(e) => handleInputChange('specialEvents', e.target.value)} />
            </ExtrasSection>

            <ExtrasSection>
              <AccordionHeader $isOpen={showReligion} onClick={() => {
                setShowReligion(!showReligion);
                if (showReligion) onUpdate({ religion: undefined, customReligion: undefined });
              }}>
                <span>Dimension religieuse</span>
                <AccordionChevron $isOpen={showReligion}>▼</AccordionChevron>
              </AccordionHeader>
              <AccordionBody $isOpen={showReligion}>
                <DetailChipGroup>
                  {RELIGION_OPTIONS.map((o) => (
                    <DetailChip key={o.value} $isSelected={formData.religion === o.value}
                      onClick={() => handleInputChange('religion', o.value)}>
                      {o.label}
                    </DetailChip>
                  ))}
                </DetailChipGroup>
                {formData.religion === 'other' && (
                  <CustomInput type="text" placeholder="Précisez..." value={formData.customReligion || ''}
                    onChange={(e) => handleInputChange('customReligion', e.target.value)} />
                )}
              </AccordionBody>
            </ExtrasSection>

            <ExtrasSection>
              <AccordionHeader $isOpen={showSecondaryChars} onClick={() => setShowSecondaryChars(!showSecondaryChars)}>
                <span>Personnages secondaires</span>
                <AccordionChevron $isOpen={showSecondaryChars}>▼</AccordionChevron>
              </AccordionHeader>
              <AccordionBody $isOpen={showSecondaryChars}>
                <SecondaryCharactersSection
                  secondaryCharacters={formData.secondaryCharacters || []}
                  onChange={(chars) => onUpdate({ secondaryCharacters: chars })} />
              </AccordionBody>
            </ExtrasSection>

            <ExtrasSection>
              <SectionTitle>Créateur du livre</SectionTitle>
              <InputField>
                <ValidatedInput label="" value={formData.creatorName || ''}
                  onChange={(v) => handleInputChange('creatorName', v)} placeholder="Ex : Créé par Papa et Maman..." required={false} />
              </InputField>
            </ExtrasSection>
          </>
        );

      case 'preview': {
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const heroName = formData.protagonistName || 'votre enfant';
        const creatorName = formData.creatorName || '';
        const storyTitle = coverTitle || previewTitle || `Le conte de ${heroName}`;

        const handlePreviewSelect = (type: 'single' | 'club', billing?: 'monthly' | 'annual') => {
          setSelectedOffer(billing === 'annual' ? 'club_annual' : type === 'club' ? 'club_monthly' : 'single');
          const previewUpdate: Partial<StoryFormData> = {
            productType: 'ebook',
            purchaseType: type,
            billingPeriod: billing || undefined,
          };
          if (rawBase64) {
            previewUpdate.coverImageBase64 = rawBase64;
            previewUpdate.coverTitle = coverTitle || undefined;
          }
          if (illustrationUrl) {
            previewUpdate.firstIllustrationUrl = illustrationUrl;
          }
          if (previewParagraphs) {
            previewUpdate.storyPreviewTextJson = JSON.stringify(previewParagraphs);
          }
          onUpdate(previewUpdate);
          metaTrackAddToCart(type);
          // Scroll to order form
          setTimeout(() => {
            orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        };

        // All content ready
        const allReady = !!(coverImageUrl && !isCoverGenerating && previewParagraphs && illustrationBase64);
        const hasError = !!(coverError || storyPreviewError);
        const isStuck = !allReady && !isCoverGenerating && !isStoryPreviewGenerating && !isIllustrationGenerating && !allReady;

        const handleRetryGeneration = () => {
          if (!coverImageUrl) generateCover();
          if (!previewParagraphs) generateStoryPreview();
          if (!illustrationBase64) {
            illustrationTriggeredRef.current = false;
          }
        };

        // ── LOADING STATE: single immersive fullscreen canvas ──
        if (!allReady) {
          // Progress stage for messages
          let stage = 0;
          if (coverImageUrl && !isCoverGenerating) stage = 1;
          if (coverImageUrl && !isCoverGenerating && previewParagraphs) stage = 2;

          const stageMessages = [
            [
              `Création de la couverture de ${heroName}...`,
              'Notre IA imagine votre histoire...',
              'Les couleurs prennent forme...',
              'Votre conte se dessine...',
            ],
            [
              `Rédaction de l'histoire de ${heroName}...`,
              'Les personnages prennent vie...',
              'Votre conte se construit page par page...',
              'Les mots s\'assemblent avec soin...',
            ],
            [
              'Les illustrations prennent vie...',
              'Les détails apparaissent...',
              'Encore quelques instants magiques...',
              'Votre livre est presque prêt...',
            ],
          ];
          const messages = stageMessages[stage];

          return (
            <GenerationCanvas>
              {/* Background animated layers */}
              <CanvasLayer $z={0}>
                <CanvasGradientBg />
              </CanvasLayer>

              {/* Floating book pages */}
              <CanvasLayer $z={1}>
                <FloatingPage $delay={0} $left="8%" $top="15%" $rotate={-12} $size={60} />
                <FloatingPage $delay={1.5} $left="78%" $top="10%" $rotate={8} $size={50} />
                <FloatingPage $delay={3} $left="15%" $top="65%" $rotate={-6} $size={45} />
                <FloatingPage $delay={2.2} $left="72%" $top="60%" $rotate={15} $size={55} />
                <FloatingPage $delay={4} $left="45%" $top="8%" $rotate={-3} $size={40} />
              </CanvasLayer>

              {/* Paint splashes */}
              <CanvasLayer $z={2}>
                <CanvasSplash $delay={0} $left="20%" $top="25%" $color="rgba(255, 180, 120, 0.12)" $size={120} />
                <CanvasSplash $delay={1.8} $left="65%" $top="40%" $color="rgba(200, 160, 220, 0.10)" $size={140} />
                <CanvasSplash $delay={3.5} $left="35%" $top="60%" $color="rgba(150, 200, 255, 0.08)" $size={100} />
                <CanvasSplash $delay={0.9} $left="75%" $top="70%" $color="rgba(255, 215, 140, 0.10)" $size={110} />
              </CanvasLayer>

              {/* Sparkle particles */}
              <CanvasLayer $z={3}>
                <CanvasSparkle $delay={0} $left="12%" $top="20%" />
                <CanvasSparkle $delay={0.8} $left="35%" $top="12%" />
                <CanvasSparkle $delay={1.6} $left="55%" $top="25%" />
                <CanvasSparkle $delay={2.4} $left="80%" $top="18%" />
                <CanvasSparkle $delay={0.4} $left="25%" $top="75%" />
                <CanvasSparkle $delay={1.2} $left="60%" $top="70%" />
                <CanvasSparkle $delay={2.0} $left="88%" $top="55%" />
                <CanvasSparkle $delay={3.2} $left="42%" $top="82%" />
              </CanvasLayer>

              {/* Central book icon */}
              <CanvasLayer $z={4}>
                <CanvasCenterContent>
                  <CanvasBookIcon>
                    <CanvasBookSpine />
                    <CanvasBookCover>
                      <CanvasBookStar>&#x2728;</CanvasBookStar>
                    </CanvasBookCover>
                    <CanvasBookGlow />
                  </CanvasBookIcon>
                </CanvasCenterContent>
              </CanvasLayer>

              {/* Text overlay */}
              <CanvasLayer $z={5}>
                <CanvasTextOverlay>
                  <CanvasTitle>{messages[0]}</CanvasTitle>
                  <CanvasMessagesContainer>
                    {messages.slice(1).map((msg, i) => (
                      <CanvasMessage key={`${stage}-${i}`} $index={i} $total={messages.length - 1}>{msg}</CanvasMessage>
                    ))}
                  </CanvasMessagesContainer>
                </CanvasTextOverlay>
              </CanvasLayer>

              {/* Progress bar */}
              <CanvasProgressContainer>
                <CanvasProgressTrack>
                  <CanvasProgressFill $stage={stage} />
                </CanvasProgressTrack>
                <CanvasProgressSteps>
                  <CanvasProgressStep $done={stage > 0} $active={stage === 0}>Couverture</CanvasProgressStep>
                  <CanvasProgressStep $done={stage > 1} $active={stage === 1}>Histoire</CanvasProgressStep>
                  <CanvasProgressStep $done={false} $active={stage === 2}>Illustrations</CanvasProgressStep>
                </CanvasProgressSteps>
              </CanvasProgressContainer>

              {/* Retry button when generation is stuck or errored */}
              {(hasError || isStuck) && (
                <div style={{
                  position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
                  zIndex: 10, textAlign: 'center',
                }}>
                  <button
                    onClick={handleRetryGeneration}
                    style={{
                      background: theme.colors.accent.coral,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}
                  >
                    Relancer la création
                  </button>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '8px' }}>
                    La connexion a été interrompue
                  </p>
                </div>
              )}
            </GenerationCanvas>
          );
        }

        // ── ALL READY: show the real preview ──
        return (
          <>
            <StepTitle style={{ fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.md }}>
              Le conte de {heroName} est prêt !
            </StepTitle>

            {/* ── Book preview: cover + story page + locked page ── */}
            <BookPreviewWrapper>
              <MagicParticle $delay={0} $left="8%" $size={3} />
              <MagicParticle $delay={1.5} $left="22%" $size={5} />
              <MagicParticle $delay={3} $left="42%" $size={3} />
              <MagicParticle $delay={0.8} $left="65%" $size={4} />
              <MagicParticle $delay={2.2} $left="80%" $size={3} />
              <MagicParticle $delay={4} $left="92%" $size={4} />

              {/* Cover */}
              <BookPageFrame $portrait style={{ cursor: 'pointer' }}
                onClick={() => storyPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <BookCoverImage>
                  <MaterializeImage $ready>
                    <img src={coverImageUrl} alt="Couverture" />
                  </MaterializeImage>
                </BookCoverImage>
              </BookPageFrame>

              {/* Story page */}
              <BookPageFrame ref={storyPageRef} style={{ cursor: 'pointer' }}
                onClick={() => lockedPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <BookStoryLayout>
                  <BookTextHalf>
                    {creatorName && <BookCreatorTag>{creatorName}</BookCreatorTag>}
                    <MaterializeText $ready $delay={0.2}>
                      <p>{previewParagraphs![0]}</p>
                    </MaterializeText>
                    <BookPageBadge>1</BookPageBadge>
                  </BookTextHalf>
                  <BookImageHalf>
                    <MaterializeImage $ready>
                      <img src={`data:image/png;base64,${illustrationBase64}`} alt="Illustration" />
                    </MaterializeImage>
                  </BookImageHalf>
                </BookStoryLayout>
              </BookPageFrame>

              {/* Locked page */}
              <BookPageFrame $compact ref={lockedPageRef}>
                <BookLockedOverlay onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                  <BookLockedContent>
                    <BookLockedIcon>&#x1F512;</BookLockedIcon>
                    <BookLockedTitle>L'aventure de {heroName} continue...</BookLockedTitle>
                    <BookLockedSubtitle>La suite de l'histoire est prête...</BookLockedSubtitle>
                  </BookLockedContent>
                </BookLockedOverlay>
              </BookPageFrame>
            </BookPreviewWrapper>

            {/* ── Timer ── */}
            <PreviewTimerBar>
              <span>Votre conte est réservé pendant encore</span>
              <PreviewTimerDigits>{timerDisplay}</PreviewTimerDigits>
            </PreviewTimerBar>

            {/* ── Value proposition ── */}
            <ValueBlock>
              <ValueBlockTitle>Votre conte personnalisé comprend</ValueBlockTitle>
              <ValueBlockItem>7 illustrations HD uniques</ValueBlockItem>
              <ValueBlockItem>Une histoire avec le prénom de votre enfant</ValueBlockItem>
              <ValueBlockItem>PDF téléchargeable et imprimable</ValueBlockItem>
              <ValueBlockItem>Lecture illimitée à vie</ValueBlockItem>
            </ValueBlock>

            {/* ── Pricing section ── */}
            <div ref={pricingRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PreviewSectionTitle>
                {heroName} est prêt pour la suite de son aventure
              </PreviewSectionTitle>

              {isClub && clubCredit?.canSubmit ? (
                <ClubFreeCard $isSelected={formData.purchaseType === 'club'} onClick={() => handlePreviewSelect('club')}>
                  <ClubBadge>Membre Club</ClubBadge>
                  <h3 style={{ fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.lg, margin: `${theme.spacing.sm} 0 4px` }}>
                    Utiliser mon eBook gratuit
                  </h3>
                  <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.accent.coral, fontWeight: 700, margin: '0 0 4px' }}>0,00 EUR</p>
                  <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.secondary, margin: 0 }}>
                    Il vous reste {clubCredit.remaining} eBook(s) gratuit(s)
                  </p>
                </ClubFreeCard>
              ) : (
                <PricingGrid>
                  {/* Single — last on mobile */}
                  <PricingCard $isSelected={selectedOffer === 'single'} $mobileOrder={2} onClick={() => handlePreviewSelect('single')}>
                    {selectedOffer === 'single' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <PricingCardName>Offre Unique</PricingCardName>
                    <PricingCardPrice>6,99€</PricingCardPrice>
                    <PricingCardSub>Paiement unique</PricingCardSub>
                    <PricingCardFeaturesList>
                      <PricingCardFeatureItem>1 conte personnalisé</PricingCardFeatureItem>
                      <PricingCardFeatureItem>7 illustrations HD</PricingCardFeatureItem>
                      <PricingCardFeatureItem>PDF téléchargeable</PricingCardFeatureItem>
                    </PricingCardFeaturesList>
                    <PricingCardCTA $primary={selectedOffer === 'single'}>{selectedOffer === 'single' ? 'Sélectionné !' : 'Choisir cette offre'}</PricingCardCTA>
                  </PricingCard>

                  {/* Club Mensuel — FIRST on mobile, center on desktop */}
                  <PricingCard $isSelected={selectedOffer === 'club_monthly'} $featured $mobileOrder={0} onClick={() => handlePreviewSelect('club', 'monthly')}>
                    <PricingCardBadge>Populaire</PricingCardBadge>
                    {selectedOffer === 'club_monthly' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <PricingCardName>Club Mensuel</PricingCardName>
                    <PricingFreeLabel>Ce conte est gratuit</PricingFreeLabel>
                    <PricingCardPrice $small>9,99€ / mois</PricingCardPrice>
                    <PricingCardSub>sans engagement</PricingCardSub>
                    <PricingCardFeaturesList>
                      <PricingCardFeatureItem $highlight>Ce conte est inclus immediatement</PricingCardFeatureItem>
                      <PricingCardFeatureItem $highlight>1 conte par semaine</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Bibliothèque illimitée</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Annulable à tout moment</PricingCardFeatureItem>
                    </PricingCardFeaturesList>
                    <PricingCardCTA $primary>{selectedOffer === 'club_monthly' ? 'Sélectionné !' : 'Débloquer l\'histoire'}</PricingCardCTA>
                  </PricingCard>

                  {/* Club Annuel — second on mobile */}
                  <PricingCard $isSelected={selectedOffer === 'club_annual'} $mobileOrder={1} onClick={() => handlePreviewSelect('club', 'annual')}>
                    {selectedOffer === 'club_annual' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <PricingCardName>Club Annuel</PricingCardName>
                    <PricingFreeLabel>Ce conte est gratuit</PricingFreeLabel>
                    <PricingCardPrice $small>79,99€ / an — soit 6,67€/mois</PricingCardPrice>
                    <PricingPerStory>Economisez 40€+/an</PricingPerStory>
                    <PricingCardFeaturesList>
                      <PricingCardFeatureItem $highlight>Ce conte est inclus immediatement</PricingCardFeatureItem>
                      <PricingCardFeatureItem $highlight>1 conte par semaine</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Bibliothèque illimitée</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Annulable à tout moment</PricingCardFeatureItem>
                    </PricingCardFeaturesList>
                    <PricingCardCTA $primary={selectedOffer === 'club_annual'}>{selectedOffer === 'club_annual' ? 'Sélectionné !' : 'Choisir cette offre'}</PricingCardCTA>
                  </PricingCard>
                </PricingGrid>
              )}

              <SocialProofLine>
                <span>&#x2B50;</span> Déjà +500 parents ont créé une histoire pour leur enfant
              </SocialProofLine>
            </div>

            {/* ── Order form (appears when offer selected) ── */}
            {formData.productType && (
              <div ref={orderFormRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <OrderInfoSection>
                  <SectionTitle>Finalisez votre commande</SectionTitle>
                  {isAuthenticated && currentUser && (
                    <ConnectedBanner>Connecté en tant que <strong>{currentUser.email}</strong></ConnectedBanner>
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
                            placeholder="Min. 8 caractères" required={false} error={errors.password} />
                          <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.light, marginTop: '4px' }}>
                            Créez un compte pour retrouver vos contes
                          </p>
                        </FullWidthField>
                      </>
                    )}
                    <InputField>
                      <ValidatedInput label="Prénom" value={formData.firstName || ''}
                        onChange={(v) => { setGlobalError(''); onUpdate({ firstName: v }); if (errors.firstName) setErrors(p => ({ ...p, firstName: '' })); }}
                        placeholder="Votre prénom" required error={errors.firstName}
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
                    ? 'Traitement en cours...'
                    : formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit
                      ? 'Recevoir mon eBook gratuit'
                      : 'Débloquer l\'histoire complète'}
                </PayButton>

                {!(formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) && (
                  <p style={{ marginTop: theme.spacing.sm, fontSize: '10px', color: theme.colors.text.light, textAlign: 'center' }}>
                    Paiement 100% sécurisé par Stripe
                  </p>
                )}

                <TrustBadgesRow>
                  <TrustBadge>Paiement sécurisé</TrustBadge>
                  <TrustBadge>Satisfait ou remboursé</TrustBadge>
                  <TrustBadge>Livraison instantanée</TrustBadge>
                </TrustBadgesRow>
              </div>
            )}
          </>
        );
      }

      default:
        return null;
    }
  };

  const renderStepInContainer = (step: number, state: 'entering' | 'active' | 'exiting') => (
    <StepContainerCentered key={`step-${step}`} $state={state} $direction={direction} data-wizard-step>
      {renderStep(step)}
    </StepContainerCentered>
  );

  const isPreviewStep = ALL_STEPS[currentStep] === 'preview';
  const stepLabels = Object.entries(STEP_CONFIG);

  // Determine which steps to show and their status
  const getSegmentStatus = (idx: number): 'done' | 'current' | 'future' | 'skipped' => {
    if (idx < currentStep) return 'done';
    if (idx === currentStep) return 'current';
    // If !wantsExtras, steps 7 & 8 are skipped
    if (!wantsExtras && (idx === 7 || idx === 8) && currentStep > 6) return 'skipped';
    return 'future';
  };

  // For sticky bar: determine readiness
  const isStickyReady = (() => {
    switch (stepId) {
      case 'hero': return isHeroComplete;
      case 'appearance': return isAppearanceComplete;
      case 'extras1': return true;
      case 'extras2': return true;
      default: return false;
    }
  })();

  // Sticky bar action
  const handleStickyNext = () => {
    if (stepId === 'extras2') {
      // Go to preview
      goToStep(9);
    } else {
      goNext();
    }
  };

  return (
    <WizardOverlay>
      {/* ── Header: New for steps 0-8, Old for preview ── */}
      {isPreviewStep ? (
        <WizardHeader>
          <BackArrow $visible={currentStep > 0} onClick={goBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </BackArrow>
          <WizardTitle>Créez votre conte</WizardTitle>
          <ProgressTrack><ProgressFill $progress={progress} /></ProgressTrack>
        </WizardHeader>
      ) : (
        <WizardHeaderNew>
          <HeaderTopRow>
            <BackArrow $visible={currentStep > 0} onClick={goBack} style={{ position: 'relative', left: 0 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </BackArrow>
            <HeaderTitle>Créer votre conte</HeaderTitle>
            <HeaderBadge>~1 min</HeaderBadge>
          </HeaderTopRow>
          <HeaderStepLabel aria-current="step">
            {STEP_CONFIG[stepId]?.label || ''}
          </HeaderStepLabel>
          <SegmentedProgressBar role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={9}>
            {ALL_STEPS.slice(0, 9).map((s, i) => (
              <ProgressSegment key={s} $status={getSegmentStatus(i)} />
            ))}
          </SegmentedProgressBar>
          <ProgressHintText>Création du conte (~1 minute)</ProgressHintText>
        </WizardHeaderNew>
      )}

      {/* ── Draft resume banner ── */}
      {showDraftBanner && currentStep === 0 && (
        <DraftBanner>
          <DraftBannerText>Reprendre ma création ?</DraftBannerText>
          <div style={{ display: 'flex', gap: 6 }}>
            <DraftBannerButton onClick={handleResumeDraft}>Reprendre</DraftBannerButton>
            <DraftBannerDismiss onClick={() => { setShowDraftBanner(false); clearDraft(); }} aria-label="Fermer">✕</DraftBannerDismiss>
          </div>
        </DraftBanner>
      )}

      <WizardViewport ref={viewportRef}>
        {prevStep !== null && isAnimating && renderStepInContainer(prevStep, 'exiting')}
        {renderStepInContainer(currentStep, isAnimating ? 'entering' : 'active')}
      </WizardViewport>

      {/* ── Sticky bar: back for all steps, continue for non-auto-advance ── */}
      {showStickyBar && currentStep > 0 && (
        <StickyBottomBar>
          <StickyBackButton onClick={goBack}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retour
          </StickyBackButton>
          {showStickyContinue && (
            <StickyContinueButton $isReady={isStickyReady} disabled={!isStickyReady} onClick={handleStickyNext}>
              {stepId === 'extras2' ? 'Découvrir mon conte' : 'Continuer'}
            </StickyContinueButton>
          )}
        </StickyBottomBar>
      )}
    </WizardOverlay>
  );
};
