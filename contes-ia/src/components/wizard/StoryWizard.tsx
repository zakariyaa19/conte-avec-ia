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
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { isInAppBrowser } from '../../utils/safeStorage';
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
  TripwireHeroCard, TripwireHeroBadge, TripwireHeroPrice, TripwireHeroOldPrice, TripwireHeroCTA,
  ClubAlternativeSection, ClubAlternativeDivider, ClubMiniCard, ClubMiniInfo, ClubMiniName, ClubMiniDetail, ClubMiniPrice,
  ClubShowcaseCard, ClubShowcaseBadge, ClubShowcaseHeader, ClubShowcaseTitle, ClubShowcaseSubtitle,
  ClubShowcasePrice, ClubShowcasePriceValue, ClubShowcasePriceUnit,
  ClubShowcaseFeatures, ClubShowcaseFeature, ClubFeatureIcon, ClubShowcaseCTA, ClubShowcaseFreeTag,
  SingleFallbackCard, SingleFallbackInfo, SingleFallbackName, SingleFallbackDetail, SingleFallbackPrice,
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

// Mapping age range → protagonist age par défaut (milieu de tranche)
const AGE_RANGE_TO_PROTAGONIST_AGE: Record<string, string> = {
  '0-2': '1', '3-5': '4', '6-9': '7', '10+': '11',
};

// Étapes à skip en mode simplifié (non-Club) : occasion, style, appearance, choice, extras1, extras2
const SIMPLIFIED_SKIP_STEPS = new Set([2, 3, 5, 6, 7, 8]);

interface StoryWizardProps {
  formData: Partial<StoryFormData>;
  onUpdate: (data: Partial<StoryFormData>) => void;
  onSubmit: (overrideData?: Partial<StoryFormData>) => void;
  isSubmitting: boolean;
  isAuthenticated?: boolean;
  isClub?: boolean;
  currentUser?: { id: string; email: string; firstName?: string; lastName?: string; role: string; isFirstPurchase?: boolean } | null;
  clubCredit?: { canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null;
  isAdMode?: boolean;
}

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */

export const StoryWizard: React.FC<StoryWizardProps> = ({
  formData, onUpdate, onSubmit, isSubmitting,
  isAuthenticated = false, isClub = false, currentUser = null, clubCredit = null,
  isAdMode = false,
}) => {

  // Mode simplifié = tout utilisateur NON-Club (qu'il vienne d'une pub ou pas)
  // Les abonnés Club actifs voient le formulaire complet avec toutes les options
  const isSimplifiedMode = !isClub;
  const isSimplifiedRef = useRef(isSimplifiedMode);
  useEffect(() => { isSimplifiedRef.current = isSimplifiedMode; }, [isSimplifiedMode]);

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
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean; isFirstPurchase?: boolean } | null>(null);

  // Premier livre GRATUIT — logique complète :
  // 1. Non connecté + email inconnu → gratuit (nouveau visiteur)
  // 2. Non connecté + email connu + backend dit isFirstPurchase=true → gratuit
  // 3. Non connecté + email connu + backend dit isFirstPurchase=false/undefined → payant
  // 4. Connecté → selon user.isFirstPurchase du backend
  const isFirstPurchase = (() => {
    if (isAuthenticated) return currentUser?.isFirstPurchase !== false;
    if (!emailStatus?.exists) return true; // email inconnu = nouveau = gratuit
    // email connu : utiliser isFirstPurchase du backend (false si déjà utilisé)
    return emailStatus.isFirstPurchase === true;
  })();
  const isClubWithCredit = isClub && clubCredit?.canSubmit;
  const singlePrice = isFirstPurchase || isClubWithCredit ? 0 : 3.99;
  const singlePriceLabel = isFirstPurchase || isClubWithCredit ? 'GRATUIT' : '3,99€';

  const { load: loadDraft, clear: clearDraft, autoSave, hasDraft } = useWizardPersistence();

  const { coverImageUrl, coverTitle, rawBase64, isGenerating: isCoverGenerating, error: coverError, generate: generateCover } = useCoverPreview(formData);
  const { previewTitle, previewParagraphs, isGenerating: isStoryPreviewGenerating, error: storyPreviewError, generate: generateStoryPreview } = useStoryPreview(formData);
  const { illustrationUrl, illustrationBase64, isGenerating: isIllustrationGenerating, generate: generateIllustration } = useFirstIllustration(formData);
  const illustrationTriggeredRef = useRef(false);
  const previewStartRef = useRef<number | null>(null);

  // Countdown timer for preview step
  const [countdown, setCountdown] = useState(1200); // 20 minutes in seconds
  const [selectedOffer, setSelectedOffer] = useState<'single' | 'club_monthly' | 'club_annual' | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const orderFormRef = useRef<HTMLDivElement>(null);
  const googleAutoSubmitRef = useRef(false);
  const storyPageRef = useRef<HTMLDivElement>(null);
  const lockedPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { wantsExtrasRef.current = wantsExtras; }, [wantsExtras]);

  // Mode simplifié : dériver automatiquement l'âge du héros depuis la tranche d'âge
  useEffect(() => {
    if (!isSimplifiedMode || !formData.ageRange) return;
    const derivedAge = AGE_RANGE_TO_PROTAGONIST_AGE[formData.ageRange];
    if (derivedAge && formData.protagonistAge !== derivedAge) {
      onUpdate({ protagonistAge: derivedAge });
    }
  }, [isSimplifiedMode, formData.ageRange]); // eslint-disable-line

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

  // Scroll reset + tracking micro-conversion à chaque changement d'étape
  useEffect(() => {
    requestAnimationFrame(() => {
      viewportRef.current?.querySelectorAll('[data-wizard-step]').forEach(el => {
        (el as HTMLElement).scrollTop = 0;
      });
    });

    // Meta Pixel : tracker chaque étape comme micro-conversion
    const stepName = ALL_STEPS[currentStep];
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'WizardStep', {
        step: currentStep,
        step_name: stepName,
        is_ad_mode: isAdMode,
      });
    }
    // TikTok Pixel : même tracking
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('ViewContent', {
        content_id: `wizard_step_${stepName}`,
        content_name: `Wizard - ${stepName}`,
        content_category: isAdMode ? 'ad_funnel' : 'organic_funnel',
      });
    }
  }, [currentStep]); // eslint-disable-line

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
    // Mode pub : sauter occasion(2)+style(3), choice(6)+extras(7,8)
    if (isSimplifiedRef.current) {
      while (next < ALL_STEPS.length && SIMPLIFIED_SKIP_STEPS.has(next)) next++;
    } else {
      if (!wantsExtrasRef.current && next === 7) next = 9;
    }
    goToStep(next);
  }, [currentStep, goToStep]);

  const goBack = useCallback(() => {
    let prev = currentStep - 1;
    // Mode pub : revenir en arrière en sautant les étapes skippées
    if (isSimplifiedRef.current) {
      while (prev >= 0 && SIMPLIFIED_SKIP_STEPS.has(prev)) prev--;
    } else {
      if (!wantsExtrasRef.current && prev === 8) prev = 6;
    }
    goToStep(prev);
  }, [currentStep, goToStep]);

  const lastAdvanceRef = useRef(0);
  const handleCardSelect = useCallback((field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (value === 'custom' || value === 'other') return;
    // Debounce: prevent double-tap from skipping steps
    const now = Date.now();
    if (now - lastAdvanceRef.current < 800) return;
    lastAdvanceRef.current = now;
    setTimeout(() => goNext(), 400);
  }, [onUpdate, goNext]);

  // Cover generation ONLY — triggered when entering preview step
  // Story text + illustrations are generated AFTER purchase (faster funnel)
  useEffect(() => {
    if (ALL_STEPS[currentStep] === 'preview') {
      if (!previewStartRef.current) previewStartRef.current = Date.now();
      // Delay cover generation slightly to let protagonistAge propagate (simplified mode derives it)
      const timer = setTimeout(() => {
        if (!coverImageUrl && !isCoverGenerating) generateCover();
      }, isSimplifiedMode ? 200 : 0);
      // Auto-select offer
      if (!selectedOffer) {
        if (isClub && clubCredit?.canSubmit) {
          // Club with credits: auto-select club free
          setSelectedOffer('single');
          onUpdate({ productType: 'ebook', purchaseType: 'club' });
        } else if (isSimplifiedMode) {
          // Non-club simplified: auto-select single
          setSelectedOffer('single');
          onUpdate({ productType: 'ebook', purchaseType: 'single' });
        }
      }
      return () => clearTimeout(timer);
    } else {
      previewStartRef.current = null;
    }
  }, [currentStep]); // eslint-disable-line

  // Recovery: re-trigger cover generation when user returns to page
  useEffect(() => {
    if (ALL_STEPS[currentStep] !== 'preview') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      setTimeout(() => {
        if (!coverImageUrl && !isCoverGenerating) generateCover();
      }, 500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentStep, coverImageUrl, isCoverGenerating, generateCover]); // eslint-disable-line

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
    metaTrackLead(isClub ? 3.99 : singlePrice);
    try {
      const res = await ApiService.checkEmail(formData.userEmail);
      if (res.success) setEmailStatus({ exists: res.exists, hasPassword: !!res.hasPassword, isFirstPurchase: res.isFirstPurchase });
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
    setErrors(e);
    if (!ok) setGlobalError('Veuillez remplir tous les champs obligatoires');
    return ok;
  };

  const handleFormSubmit = () => {
    setGlobalError('');
    if (validatePaymentForm()) {
      clearDraft();
      // Pass cover image directly in submit (no async state dependency)
      const coverOverride: Partial<StoryFormData> = {};
      if (rawBase64) {
        coverOverride.coverImageBase64 = rawBase64;
        coverOverride.coverTitle = coverTitle || undefined;
        console.log('[Wizard] Injecting cover base64 in submit:', rawBase64.length, 'chars');
      } else {
        console.warn('[Wizard] No rawBase64 available at submit time!');
      }
      onSubmit(Object.keys(coverOverride).length > 0 ? coverOverride : undefined);
    } else {
      // Scroll to error so user sees what's missing
      setTimeout(() => {
        orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const isHeroComplete = isSimplifiedMode
    ? !!(formData.protagonistName && formData.protagonistGender) // age auto-dérivé en mode simplifié
    : !!(formData.protagonistName && formData.protagonistAge && formData.protagonistGender);
  const isAppearanceComplete = formData.appearanceMode === 'photo'
    ? !!formData.photo
    : !!(formData.eyeColor && formData.hairColor && formData.skinColor);
  const isPaymentInfoComplete = !!(formData.productType && formData.userEmail && formData.firstName);

  // Auto-submit after Google auth — waits for formData to be updated
  useEffect(() => {
    if (googleAutoSubmitRef.current && formData.userEmail && formData.firstName) {
      googleAutoSubmitRef.current = false;
      clearDraft();
      // Pass cover image directly in submit
      const coverOverride: Partial<StoryFormData> = {};
      if (rawBase64 && !formData.coverImageBase64) {
        coverOverride.coverImageBase64 = rawBase64;
        coverOverride.coverTitle = coverTitle || undefined;
      }
      onSubmit(Object.keys(coverOverride).length > 0 ? coverOverride : undefined);
    }
  }, [formData.userEmail, formData.firstName]); // eslint-disable-line

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
            {isSimplifiedMode ? (
              <div style={{
                width: '100%', maxWidth: 440, textAlign: 'center',
                marginBottom: theme.spacing.xs, animation: 'fadeIn 0.5s ease both',
              }}>
                {isFirstPurchase && (
                  <div style={{
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white', borderRadius: '14px', padding: '10px 18px',
                    marginBottom: theme.spacing.sm, textAlign: 'center',
                  }}>
                    <p style={{ fontSize: theme.fontSizes.lg, fontWeight: 800, margin: '0 0 1px', letterSpacing: '-0.02em' }}>
                      Votre 1er livre est 100% GRATUIT
                    </p>
                    <p style={{ fontSize: '11px', margin: 0, opacity: 0.9 }}>
                      Aucune carte bancaire requise
                    </p>
                  </div>
                )}
                <p style={{
                  fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.sm,
                  color: theme.colors.accent.coral, margin: `0 0 ${theme.spacing.xs}`, fontWeight: 600,
                  fontStyle: 'italic', lineHeight: 1.3,
                }}>
                  Votre enfant devient le héros de son histoire &#x2728;
                </p>
              </div>
            ) : (
              <BookPreviewBanner>
                <BookPreviewCover $src="/image/themes/contes-de-fees.png" />
                <BookPreviewText>Ton enfant devient le héros de son propre livre</BookPreviewText>
              </BookPreviewBanner>
            )}
            <StepTitle style={{ marginBottom: '2px' }}>Pour quel âge ?</StepTitle>
            <StepMicroText style={{ marginBottom: theme.spacing.sm }}>{isSimplifiedMode ? 'Un clic pour commencer' : 'Choisis l\'âge pour commencer à créer son histoire'}</StepMicroText>
            <CardGrid $columns={4}>
              {AGE_OPTIONS.map((o, i) => (
                <ImageCard key={o.value} $isSelected={formData.ageRange === o.value} $delay={i}
                  $hero={isSimplifiedMode}
                  aria-label={o.label}
                  onClick={() => handleCardSelect('ageRange', o.value)}>
                  <CardImg $src={o.imagePath} />
                  <CardImgLabel $hero={isSimplifiedMode}>{o.label}</CardImgLabel>
                </ImageCard>
              ))}
            </CardGrid>
          </>
        );

      case 'theme': {
        const SIMPLIFIED_THEMES = ['fairy-tales', 'stories', 'family'] as const;
        const THEME_DESCRIPTIONS: Record<string, string> = {
          'fairy-tales': 'Magie et aventures',
          'stories': 'Des récits captivants',
          'family': 'Des moments remplis d\'amour',
        };
        const themeList = isSimplifiedMode
          ? THEME_OPTIONS.filter(o => (SIMPLIFIED_THEMES as readonly string[]).includes(o.value))
          : THEME_OPTIONS.filter(o => o.value !== 'custom');

        return (
          <>
            <StepTitle style={isSimplifiedMode ? { marginBottom: '2px' } : undefined}>Quel univers ?</StepTitle>
            <StepMicroText style={isSimplifiedMode ? { marginBottom: theme.spacing.sm } : undefined}>Choisissez l'aventure de votre enfant</StepMicroText>
            <CardGrid $columns={3} $compact>
              {themeList.map((o, i) => {
                const isRecommended = recommendedThemes.includes(o.value);
                return (
                  <ImageCard key={o.value} $isSelected={formData.generalTheme === o.value} $delay={i}
                    $hero={isSimplifiedMode}
                    aria-label={o.label} style={{ position: 'relative' }}
                    onClick={() => handleCardSelect('generalTheme', o.value)}>
                    {!isSimplifiedMode && isRecommended && <CardBadgePill $variant="recommended">Recommandé</CardBadgePill>}
                    <CardImg $src={o.imagePath} />
                    <CardImgLabel $hero={isSimplifiedMode}>{o.label}</CardImgLabel>
                    {isSimplifiedMode && THEME_DESCRIPTIONS[o.value] && (
                      <span style={{
                        display: 'block', fontSize: '9px', color: 'var(--text-light)',
                        textAlign: 'center', padding: '0 2px 6px', lineHeight: 1.2,
                        fontFamily: theme.fonts.body, marginTop: '-2px',
                      }}>
                        {THEME_DESCRIPTIONS[o.value]}
                      </span>
                    )}
                  </ImageCard>
                );
              })}
            </CardGrid>

            {/* Custom theme — full-width hero card with image */}
            {(() => {
              const isCustomSelected = formData.generalTheme === 'custom';
              return (
                <div
                  onClick={() => { if (!isCustomSelected) onUpdate({ generalTheme: 'custom' }); }}
                  style={{
                    width: '100%', maxWidth: isSimplifiedMode ? 560 : 480,
                    marginTop: isSimplifiedMode ? theme.spacing.sm : theme.spacing.md,
                    borderRadius: isSimplifiedMode ? '16px' : theme.borderRadius.xl,
                    border: `${isSimplifiedMode ? '3px' : '2px'} solid ${isCustomSelected
                      ? theme.colors.accent.coral
                      : isSimplifiedMode ? 'rgba(255,153,153,0.25)' : 'var(--border-color)'}`,
                    background: isCustomSelected
                      ? `linear-gradient(135deg, ${theme.colors.accent.coral}10, ${theme.colors.accent.softPink}15)`
                      : isSimplifiedMode
                        ? 'var(--bg-elevated)'
                        : 'var(--bg-card)',
                    cursor: isCustomSelected ? 'default' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    boxShadow: isSimplifiedMode
                      ? isCustomSelected
                        ? `0 0 0 4px ${theme.colors.accent.coral}35, 0 8px 32px ${theme.colors.accent.coral}25`
                        : '0 4px 20px rgba(255,153,153,0.12), 0 8px 32px rgba(0,0,0,0.08)'
                      : 'var(--shadow-card)',
                    transform: isCustomSelected ? 'scale(1.02)' : 'scale(1)',
                    overflow: isCustomSelected ? 'visible' : 'hidden',
                  }}
                >
                  {/* Image + text row — collapses when selected */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: isCustomSelected ? '10px 16px' : '12px 16px',
                    transition: 'padding 0.3s ease',
                  }}>
                    <div style={{
                      width: isCustomSelected ? '40px' : '56px',
                      height: isCustomSelected ? '40px' : '56px',
                      borderRadius: '12px',
                      backgroundImage: 'url(/image/themes/personnalise.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{
                        fontFamily: theme.fonts.heading,
                        fontSize: isCustomSelected ? theme.fontSizes.sm : theme.fontSizes.base,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        transition: 'font-size 0.3s ease',
                      }}>
                        {isSimplifiedMode ? 'Créer un univers personnalisé' : 'Inventez votre propre univers'}
                      </div>
                      {!isCustomSelected && (
                        <div style={{
                          fontSize: '11px', color: 'var(--text-light)', lineHeight: 1.4, marginTop: '2px',
                        }}>
                          {isSimplifiedMode
                            ? 'Ex : pirates, dinosaures, magie, espace...'
                            : 'Harry Potter, Star Wars, Pat\'Patrouille, Monde des dinosaures, Pirates...'}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Input field — appears inside the card when selected */}
                  {isCustomSelected && (
                    <div style={{ padding: '0 16px 12px' }}>
                      <CustomInput type="text" placeholder="Ex : Harry Potter, dinosaures, espace..." value={formData.customTheme || ''}
                        onChange={(e) => handleInputChange('customTheme', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        ref={(el) => { if (el) setTimeout(() => { el.focus(); }, 100); }}
                        style={{
                          maxWidth: '100%', marginTop: 0, width: '100%',
                          background: 'var(--bg-input)', color: 'var(--text-primary)',
                          fontSize: '16px', padding: '14px 16px',
                          border: '2px solid var(--border-input)',
                          borderRadius: '12px',
                        }} />
                      <ContinueButton $isReady={!!(formData.customTheme?.trim())} disabled={!formData.customTheme?.trim()}
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        style={{ marginTop: theme.spacing.sm, width: '100%' }}>
                        Continuer
                      </ContinueButton>
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        );
      }

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
                  onChange={(e) => handleInputChange('customSubject', e.target.value)}
                  ref={(el) => { if (el) setTimeout(() => { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100); }} />
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
            <StepTitle style={isSimplifiedMode ? { marginBottom: '4px' } : undefined}>
              {isSimplifiedMode ? 'Votre héros' : 'Votre héros'}
            </StepTitle>
            {isSimplifiedMode ? (
              <StepMicroText style={{ marginBottom: theme.spacing.md }}>Quelques infos pour personnaliser l'histoire</StepMicroText>
            ) : (
              <StepSubtitle>Qui sera le personnage principal ?</StepSubtitle>
            )}

            {/* Prénom — compact single field */}
            <InputRow style={isSimplifiedMode ? { marginBottom: theme.spacing.md, maxWidth: 380 } : undefined}>
              <InputField>
                <ValidatedInput label="Prénom de l'enfant" value={formData.protagonistName || ''}
                  onChange={(v) => handleInputChange('protagonistName', v)} placeholder="Ex : Emma, Lucas..." required error={errors.protagonistName} />
              </InputField>
              {!isSimplifiedMode && (
                <InputField>
                  <AgeSelector label="Âge *" value={formData.protagonistAge || ''}
                    onChange={(v) => handleInputChange('protagonistAge', v)} required error={errors.protagonistAge} />
                </InputField>
              )}
            </InputRow>

            {/* Gender — inline cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isSimplifiedMode ? '10px' : '12px',
              width: '100%', maxWidth: isSimplifiedMode ? 300 : 320,
              marginBottom: isSimplifiedMode ? theme.spacing.lg : theme.spacing.md,
            }}>
              {GENDER_OPTIONS.map((o, i) => (
                <GenderCard key={o.value} $isSelected={formData.protagonistGender === o.value} $delay={i}
                  aria-label={`Genre: ${o.label}`}
                  style={isSimplifiedMode ? { padding: '12px 8px', gap: '6px', borderRadius: '16px' } : undefined}
                  onClick={() => onUpdate({ protagonistGender: o.value as 'boy' | 'girl' })}>
                  <GenderCardIcon style={isSimplifiedMode ? { width: '52px', height: '52px' } : undefined}>
                    {o.value === 'girl' ? (
                      <svg viewBox="0 0 80 80" fill="none" width={isSimplifiedMode ? '48' : '64'} height={isSimplifiedMode ? '48' : '64'}>
                        <circle cx="40" cy="32" r="20" fill="#FF9999" fillOpacity="0.25" stroke={theme.colors.accent.coral} strokeWidth="3" />
                        <circle cx="34" cy="29" r="2.5" fill="var(--text-primary)" />
                        <circle cx="46" cy="29" r="2.5" fill="var(--text-primary)" />
                        <path d="M35 36 Q40 41 45 36" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M22 22 Q28 8 40 10 Q52 8 58 22" fill="none" stroke="#E8A87C" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M20 24 Q18 34 22 38" fill="none" stroke="#E8A87C" strokeWidth="3" strokeLinecap="round" />
                        <path d="M60 24 Q62 34 58 38" fill="none" stroke="#E8A87C" strokeWidth="3" strokeLinecap="round" />
                        <path d="M40 52 L40 64" stroke={theme.colors.accent.coral} strokeWidth="3" strokeLinecap="round" />
                        <path d="M32 64 L48 64" stroke={theme.colors.accent.coral} strokeWidth="3" strokeLinecap="round" />
                        <circle cx="40" cy="58" r="7" fill="none" stroke={theme.colors.accent.coral} strokeWidth="3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 80 80" fill="none" width={isSimplifiedMode ? '48' : '64'} height={isSimplifiedMode ? '48' : '64'}>
                        <circle cx="40" cy="34" r="20" fill="#A8D8EA" fillOpacity="0.3" stroke="#7CB9D0" strokeWidth="3" />
                        <circle cx="34" cy="31" r="2.5" fill="var(--text-primary)" />
                        <circle cx="46" cy="31" r="2.5" fill="var(--text-primary)" />
                        <path d="M35 38 Q40 43 45 38" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M22 26 Q30 12 40 14 Q50 12 58 26" fill="none" stroke="#C8A860" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M24 26 L22 18" stroke="#C8A860" strokeWidth="3" strokeLinecap="round" />
                        <path d="M56 26 L58 18" stroke="#C8A860" strokeWidth="3" strokeLinecap="round" />
                        <path d="M40 54 L54 66" stroke="#7CB9D0" strokeWidth="3" strokeLinecap="round" />
                        <path d="M48 60 L58 60 M53 55 L53 65" stroke="#7CB9D0" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </GenderCardIcon>
                  <GenderCardLabel $isSelected={formData.protagonistGender === o.value}>{o.label}</GenderCardLabel>
                </GenderCard>
              ))}
            </div>

            {/* ── Photo upload — clear, explicit, visual ── */}
            {isSimplifiedMode && (
              <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
                {/* Title */}
                <p style={{
                  fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.lg, fontWeight: 700,
                  color: 'var(--text-primary)', margin: `0 0 4px`,
                }}>
                  Ajoutez une photo de votre enfant
                </p>
                <p style={{
                  fontSize: theme.fontSizes.sm, color: 'var(--text-secondary)',
                  margin: `0 0 ${theme.spacing.md}`, lineHeight: 1.4,
                }}>
                  Les illustrations du livre ressembleront à votre enfant
                </p>

                {/* Upload zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '16px', overflow: 'hidden',
                    border: `2.5px ${formData.photo ? 'solid' : 'dashed'} ${formData.photo ? theme.colors.accent.coral : 'rgba(255,153,153,0.35)'}`,
                    background: formData.photo
                      ? `linear-gradient(135deg, ${theme.colors.accent.coral}0A, ${theme.colors.accent.softPink}15)`
                      : 'var(--bg-elevated)',
                    boxShadow: formData.photo
                      ? `0 0 0 4px ${theme.colors.accent.coral}30, 0 8px 32px ${theme.colors.accent.coral}20`
                      : '0 4px 20px rgba(255,153,153,0.10), 0 8px 32px rgba(0,0,0,0.06)',
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {formData.photo ? (
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden',
                      border: `2px solid ${theme.colors.accent.coral}`, flexShrink: 0,
                    }}>
                      <img src={URL.createObjectURL(formData.photo as File)} alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '12px',
                      background: `${theme.colors.accent.coral}10`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '24px' }}>&#x1F4F7;</span>
                    </div>
                  )}
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{
                      fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.sm, fontWeight: 700,
                      color: 'var(--text-primary)', margin: '0 0 2px',
                    }}>
                      {formData.photo ? 'Photo ajoutée !' : 'Importer une photo'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                      {formData.photo ? 'Cliquez pour changer' : 'Depuis votre galerie ou appareil photo'}
                    </p>
                  </div>
                  {!formData.photo && (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                      <path d="M12 5v14M5 12h14" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { onUpdate({ photo: file, appearanceMode: 'photo', eyeColor: '', hairColor: '', skinColor: '' }); }
                }} />

                {/* Optionnel — discret */}
                {!formData.photo && (
                  <p style={{
                    fontSize: '11px', color: 'var(--text-light)', marginTop: '8px',
                    fontFamily: theme.fonts.body,
                  }}>
                    Optionnel — vous pouvez continuer sans photo
                  </p>
                )}
              </div>
            )}

            {/* ── Compagnon secondaire (1 max en mode simplifié) ── */}
            {isSimplifiedMode && (
              <div style={{ width: '100%', maxWidth: 400, marginTop: theme.spacing.md }}>
                <p style={{
                  fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.sm,
                  fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center',
                  margin: `0 0 ${theme.spacing.sm}`,
                }}>
                  Ajouter un compagnon <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(optionnel)</span>
                </p>

                {/* Type toggle */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
                  {([
                    { type: 'human' as const, icon: '👦', label: 'Ami(e)' },
                    { type: 'animal' as const, icon: '🐕', label: 'Animal' },
                  ]).map(opt => {
                    const current = formData.secondaryCharacters?.[0];
                    const isActive = current?.kind === opt.type;
                    return (
                      <button key={opt.type} onClick={() => {
                        if (isActive) {
                          onUpdate({ secondaryCharacters: undefined });
                        } else {
                          onUpdate({ secondaryCharacters: [{ kind: opt.type, name: '', ageOrType: '' }] });
                        }
                      }} style={{
                        appearance: 'none', border: `2px solid ${isActive ? theme.colors.accent.coral : 'var(--border-color)'}`,
                        borderRadius: '12px', padding: '10px 18px', cursor: 'pointer',
                        background: isActive ? `${theme.colors.accent.coral}12` : 'var(--bg-elevated)',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                        transition: 'all 0.2s',
                      }}>
                        <span style={{ fontSize: '18px' }}>{opt.icon}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Name input — shows when type is selected */}
                {(() => {
                  const current = formData.secondaryCharacters?.[0];
                  if (!current) return null;

                  return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <ValidatedInput
                          label={current.kind === 'animal' ? "Nom de l'animal" : "Prénom de l'ami(e)"}
                          value={current.name || ''}
                          onChange={(v) => {
                            onUpdate({ secondaryCharacters: [{ ...current, name: v }] });
                          }}
                          placeholder={current.kind === 'animal' ? 'Ex : Rex, Luna...' : 'Ex : Léa, Hugo...'}
                        />
                      </div>
                      {current.kind === 'animal' && (
                        <div style={{ width: '120px' }}>
                          <ValidatedInput
                            label="Type"
                            value={current.ageOrType || ''}
                            onChange={(v) => {
                              onUpdate({ secondaryCharacters: [{ ...current, ageOrType: v }] });
                            }}
                            placeholder="Chien, chat..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        );

      case 'appearance':
        return (
          <>
            <StepTitle>{isSimplifiedMode ? 'Ajoutez sa photo' : 'Son apparence'}</StepTitle>
            <StepSubtitle>{isSimplifiedMode ? 'Le personnage lui ressemblera !' : 'Comment ressemble votre personnage ?'}</StepSubtitle>

            {/* ---- Mode simplifié : directement l'upload photo + passer ---- */}
            {isSimplifiedMode && (
              <>
                <PhotoUploadZone $hasPhoto={!!formData.photo} onClick={() => fileInputRef.current?.click()}>
                  <PhotoIcon>{formData.photo ? '✓' : '📷'}</PhotoIcon>
                  <PhotoMainText>{formData.photo ? (formData.photo as File).name : 'Importer une photo'}</PhotoMainText>
                  <PhotoSubText>{formData.photo ? 'Cliquez pour changer' : 'Le personnage ressemblera à votre enfant'}</PhotoSubText>
                  <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { onUpdate({ photo: file, appearanceMode: 'photo', eyeColor: '', hairColor: '', skinColor: '' }); }
                  }} />
                </PhotoUploadZone>
                <SkipLink onClick={() => {
                  onUpdate({ appearanceMode: 'manual', eyeColor: 'brown', hairColor: 'brown', skinColor: 'medium' });
                  setTimeout(() => goNext(), 100);
                }} style={{ marginTop: theme.spacing.md }}>
                  Passer cette étape
                </SkipLink>
              </>
            )}

            {/* ---- Mode complet (Club) : choix photo ou description manuelle ---- */}
            {!isSimplifiedMode && !formData.appearanceMode && (
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

            {/* ---- Photo mode (Club complet) ---- */}
            {!isSimplifiedMode && formData.appearanceMode === 'photo' && (
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

            {/* ---- Manual mode (Club only) ---- */}
            {!isSimplifiedMode && formData.appearanceMode === 'manual' && (
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
                <ChoiceTitle $variant="primary">Découvrir mon livre</ChoiceTitle>
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
            <StepTitle>Personnalisez votre livre</StepTitle>
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
              <SectionTitle>Langue du livre</SectionTitle>
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

            {/* Raconté par — Club only */}
            <ExtrasSection>
              <SectionTitle>Raconté par</SectionTitle>
              <p style={{ fontSize: theme.fontSizes.xs, color: 'var(--text-light)', margin: `-4px 0 ${theme.spacing.sm}` }}>
                Ce nom apparaîtra en signature à la fin du livre
              </p>
              <CustomInput type="text" placeholder="Ex : Papa, Maman, Mamie..."
                value={formData.narratedBy || ''}
                onChange={(e) => handleInputChange('narratedBy', e.target.value)}
                style={{ maxWidth: 360 }} />
            </ExtrasSection>

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
        const storyTitle = coverTitle || previewTitle || `Le livre de ${heroName}`;

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
          onUpdate(previewUpdate);
          metaTrackAddToCart(type, isClub ? 3.99 : singlePrice);
          // Scroll to order form
          setTimeout(() => {
            orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        };

        // Only cover needed — story text + illustrations generated after purchase
        const allReady = !!(coverImageUrl && !isCoverGenerating);
        const hasError = !!coverError;
        const previewElapsed = previewStartRef.current ? (Date.now() - previewStartRef.current) : 0;
        const isStuck = !allReady && !hasError && !isCoverGenerating && previewElapsed > 5000;

        const handleRetryGeneration = () => {
          if (!coverImageUrl) generateCover();
        };

        // ── PREVIEW STEP: show form immediately, cover loads in background ──
        return (
          <>
            <StepTitle style={{ fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.sm }}>
              {allReady ? `Le livre de ${heroName} est prêt !` : `Création du livre de ${heroName}...`}
            </StepTitle>
            {allReady && (
              <StepSubtitle style={{ marginBottom: theme.spacing.md }}>
                Montrez l'histoire de {heroName} à votre famille
              </StepSubtitle>
            )}

            {/* ══════ COMPACT FLOW ══════ */}
            {(isSimplifiedMode || isClubWithCredit) && formData.productType && (
              <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* ── CASE A: Club connecté avec crédits → juste un bouton ── */}
                {isClubWithCredit && isAuthenticated && (
                  <>
                    {/* Cover or animated loading */}
                    {coverImageUrl ? (
                      <div style={{
                        width: '160px', height: '220px', borderRadius: '6px 14px 14px 6px',
                        overflow: 'hidden', margin: '0 auto 14px',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,153,153,0.1)',
                      }}>
                        <img src={coverImageUrl} alt="Couverture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: '160px', height: '220px', borderRadius: '6px 14px 14px 6px',
                        margin: '0 auto 14px', position: 'relative', overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1a1428, #2E2850)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {/* Animated glow */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `radial-gradient(circle at 50% 50%, ${theme.colors.accent.coral}20 0%, transparent 70%)`,
                          animation: 'pulse 2s ease-in-out infinite',
                        }} />
                        {/* Sparkles */}
                        <div style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: '#FFD700', top: '20%', left: '25%', animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.6 }} />
                        <div style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', background: '#FF9999', top: '35%', right: '20%', animation: 'pulse 2s ease-in-out 0.5s infinite', opacity: 0.5 }} />
                        <div style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', background: '#A8D8EA', bottom: '25%', left: '30%', animation: 'pulse 1.8s ease-in-out 1s infinite', opacity: 0.4 }} />
                        {/* Book icon */}
                        <span style={{ fontSize: '36px', position: 'relative', zIndex: 1, animation: 'pulse 2s ease-in-out infinite' }}>✨</span>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                          Création en cours...
                        </p>
                      </div>
                    )}

                    <div ref={orderFormRef} />

                    {globalError && <ErrorMessage>{globalError}</ErrorMessage>}

                    <PayButton $isReady disabled={isSubmitting} onClick={handleFormSubmit}
                      style={{ width: '100%', borderRadius: '14px', padding: '16px', fontSize: theme.fontSizes.base }}>
                      {isSubmitting ? 'Génération en cours...' : `Générer le livre de ${heroName} →`}
                    </PayButton>

                    <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px', textAlign: 'center' }}>
                      ✅ Inclus dans votre Club · ⚡ Prêt en 5 min
                    </p>
                  </>
                )}

                {/* ── CASE B: Non connecté OU connecté gratuit (premier livre) ── */}
                {!isClubWithCredit && (
                  <>
                    {/* Cover or animated loading */}
                    {coverImageUrl ? (
                      <div style={{
                        width: '160px', height: '220px', borderRadius: '6px 14px 14px 6px',
                        overflow: 'hidden', margin: '0 auto 12px',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,153,153,0.1)',
                      }}>
                        <img src={coverImageUrl} alt="Couverture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: '160px', height: '220px', borderRadius: '6px 14px 14px 6px',
                        margin: '0 auto 12px', position: 'relative', overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1a1428, #2E2850)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `radial-gradient(circle at 50% 50%, ${theme.colors.accent.coral}20 0%, transparent 70%)`,
                          animation: 'pulse 2s ease-in-out infinite',
                        }} />
                        <div style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: '#FFD700', top: '20%', left: '25%', animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.6 }} />
                        <div style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', background: '#FF9999', top: '35%', right: '20%', animation: 'pulse 2s ease-in-out 0.5s infinite', opacity: 0.5 }} />
                        <div style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', background: '#A8D8EA', bottom: '25%', left: '30%', animation: 'pulse 1.8s ease-in-out 1s infinite', opacity: 0.4 }} />
                        <span style={{ fontSize: '36px', position: 'relative', zIndex: 1, animation: 'pulse 2s ease-in-out infinite' }}>✨</span>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                          Création en cours...
                        </p>
                      </div>
                    )}

                    <p style={{
                      fontFamily: theme.fonts.heading, fontSize: theme.fontSizes.sm,
                      fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center',
                      margin: '0 0 12px',
                    }}>
                      {isAuthenticated ? `Le livre de ${heroName} est prêt !` : `Recevez le livre de ${heroName} gratuitement`}
                    </p>

                    <div ref={orderFormRef} style={{ width: '100%' }}>
                      {/* Google (non connecté uniquement) */}
                      {!isAuthenticated && !isInAppBrowser() && (
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                              onSuccess={(credentialResponse: CredentialResponse) => {
                                if (credentialResponse.credential) {
                                  ApiService.googleAuth(credentialResponse.credential).then(res => {
                                    if (res.success && res.data) {
                                      if (res.data.token) localStorage.setItem('userToken', res.data.token);
                                      onUpdate({ userEmail: res.data.user?.email || '', firstName: res.data.user?.firstName || '' });
                                      googleAutoSubmitRef.current = true;
                                    }
                                  }).catch(() => {});
                                }
                              }}
                              onError={() => {}} text="continue_with" shape="rectangular" size="large"
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0 6px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                            <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>ou</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                          </div>
                        </div>
                      )}

                      {/* Connecté → juste le badge */}
                      {isAuthenticated && currentUser && (
                        <ConnectedBanner>Connecté : <strong>{currentUser.email}</strong></ConnectedBanner>
                      )}

                      {/* Email (non connecté) */}
                      {!isAuthenticated && (
                        <div style={{ marginBottom: '10px' }}>
                          <ValidatedInput type="email" label="Email" value={formData.userEmail || ''}
                            onChange={(v) => { setGlobalError(''); setEmailStatus(null); onUpdate({ userEmail: v }); if (errors.userEmail) setErrors(p => ({ ...p, userEmail: '' })); }}
                            placeholder="votre@email.com" required error={errors.userEmail}
                            onBlur={() => { validateField('userEmail', formData.userEmail || '', 'email'); handleEmailBlurCheck(); }} />
                        </div>
                      )}

                      {globalError && <ErrorMessage>{globalError}</ErrorMessage>}

                      {/* Email connu + gratuit utilisé */}
                      {!isAuthenticated && emailStatus?.exists && !isFirstPurchase && (
                        <div style={{
                          background: `${theme.colors.accent.coral}10`, border: `1px solid ${theme.colors.accent.coral}30`,
                          borderRadius: '10px', padding: '8px 12px', marginBottom: '8px', textAlign: 'center',
                        }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                            Livre gratuit déjà utilisé · Prochain : {singlePriceLabel}
                          </p>
                        </div>
                      )}

                      {/* CTA */}
                      <PayButton $isReady={isPaymentInfoComplete} disabled={!formData.productType || isSubmitting} onClick={handleFormSubmit}
                        style={{ width: '100%', borderRadius: '14px', padding: '14px' }}>
                        {isSubmitting ? 'Traitement...'
                          : isFirstPurchase ? 'Lire mon livre gratuitement →'
                          : `Payer ${singlePriceLabel} — Recevoir mon livre`}
                      </PayButton>

                      <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '6px', textAlign: 'center' }}>
                        {isFirstPurchase ? '✅ Gratuit · ⚡ Prêt en 5 min' : '🔒 Paiement Stripe · ⚡ Prêt en 5 min'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── FULL FLOW: for Club members WITHOUT credits (needs pricing selection) ── */}
            {!isSimplifiedMode && !isClubWithCredit && (
            <>
            <BookPreviewWrapper>
              <MagicParticle $delay={0} $left="8%" $size={3} />
              <MagicParticle $delay={1.5} $left="22%" $size={5} />
              <MagicParticle $delay={3} $left="42%" $size={3} />
              <MagicParticle $delay={0.8} $left="65%" $size={4} />
              <MagicParticle $delay={2.2} $left="80%" $size={3} />
              <MagicParticle $delay={4} $left="92%" $size={4} />

              <BookPageFrame $portrait style={{ cursor: 'pointer' }}
                onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {coverImageUrl ? (
                  <BookCoverImage>
                    <MaterializeImage $ready>
                      <img src={coverImageUrl} alt="Couverture" />
                    </MaterializeImage>
                  </BookCoverImage>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
                    <span style={{ fontSize: '48px', animation: 'pulse 1.5s ease-in-out infinite' }}>📖</span>
                  </div>
                )}
              </BookPageFrame>

              <BookPageFrame $compact ref={lockedPageRef}>
                <BookLockedOverlay onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                  <BookLockedContent>
                    <BookLockedIcon>&#x1F512;</BookLockedIcon>
                    <BookLockedTitle>L'aventure de {heroName} continue...</BookLockedTitle>
                    <BookLockedSubtitle>12 pages illustrées vous attendent</BookLockedSubtitle>
                  </BookLockedContent>
                </BookLockedOverlay>
              </BookPageFrame>
            </BookPreviewWrapper>

            <PreviewTimerBar>
              <span>Votre livre est réservé pendant encore</span>
              <PreviewTimerDigits>{timerDisplay}</PreviewTimerDigits>
            </PreviewTimerBar>
            </>
            )}

            {/* ── Pricing section — only for Club members WITHOUT credits ── */}
            {!isSimplifiedMode && !isClubWithCredit && (
            <div ref={pricingRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PreviewSectionTitle>
                {heroName} est prêt pour la suite de son aventure
              </PreviewSectionTitle>

              {isClub ? (
                /* ── CLUB MEMBER WITHOUT CREDIT: single purchase at full price (3.99€) ── */
                <TripwireHeroCard $isSelected={selectedOffer === 'single'} onClick={() => handlePreviewSelect('single')}>
                  <TripwireHeroBadge>Membre Club</TripwireHeroBadge>
                  {selectedOffer === 'single' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                  <PricingCardName>Livre supplémentaire</PricingCardName>
                  <TripwireHeroPrice>3,99€</TripwireHeroPrice>
                  <PricingCardSub>
                    {clubCredit?.nextCreditDate
                      ? `Prochains crédits le ${new Date(clubCredit.nextCreditDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                      : 'Vos crédits mensuels ont été utilisés'}
                  </PricingCardSub>
                  <PricingCardFeaturesList>
                    <PricingCardFeatureItem $highlight>1 livre personnalisé pour {heroName}</PricingCardFeatureItem>
                    <PricingCardFeatureItem>7 illustrations HD uniques</PricingCardFeatureItem>
                    <PricingCardFeatureItem>PDF telechargeable et imprimable</PricingCardFeatureItem>
                  </PricingCardFeaturesList>
                  <TripwireHeroCTA>{selectedOffer === 'single' ? 'Selectionne !' : 'Obtenir pour 3,99€'}</TripwireHeroCTA>
                </TripwireHeroCard>
              ) : isFirstPurchase ? (
                /* ── PREMIER LIVRE GRATUIT — pas de Club, juste le gratuit ── */
                <TripwireHeroCard $isSelected={selectedOffer === 'single'} onClick={() => handlePreviewSelect('single')}>
                  <TripwireHeroBadge>100% GRATUIT</TripwireHeroBadge>
                  {selectedOffer === 'single' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                  <PricingCardName>Votre Premier Livre</PricingCardName>
                  <TripwireHeroOldPrice>3,99€</TripwireHeroOldPrice>
                  <TripwireHeroPrice>GRATUIT</TripwireHeroPrice>
                  <PricingCardSub>Juste votre email — pas de carte bancaire</PricingCardSub>
                  <PricingCardFeaturesList>
                    <PricingCardFeatureItem $highlight>1 livre personnalise pour {heroName}</PricingCardFeatureItem>
                    <PricingCardFeatureItem>7 illustrations HD uniques</PricingCardFeatureItem>
                    <PricingCardFeatureItem>Bibliotheque en ligne pour lire et telecharger</PricingCardFeatureItem>
                    <PricingCardFeatureItem>Pret en 5 minutes par email</PricingCardFeatureItem>
                  </PricingCardFeaturesList>
                  <TripwireHeroCTA>{selectedOffer === 'single' ? 'Selectionne !' : 'Recevoir mon livre GRATUIT'}</TripwireHeroCTA>
                </TripwireHeroCard>
              ) : (
                /* ── RETURNING USER: Club hero + single fallback ── */
                <>
                  <ClubShowcaseCard $isSelected={selectedOffer === 'club_monthly'} $hero onClick={() => handlePreviewSelect('club', 'monthly')}>
                    <ClubShowcaseBadge>Recommandé</ClubShowcaseBadge>
                    {selectedOffer === 'club_monthly' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <ClubShowcaseHeader>
                      <ClubShowcaseFreeTag>Ce livre est inclus gratuitement</ClubShowcaseFreeTag>
                      <ClubShowcaseTitle>Club des Histoires</ClubShowcaseTitle>
                      <ClubShowcaseSubtitle>4 livres avec 2x plus de pages chaque mois</ClubShowcaseSubtitle>
                    </ClubShowcaseHeader>
                    <ClubShowcasePrice>
                      <ClubShowcasePriceValue>9,99€</ClubShowcasePriceValue>
                      <ClubShowcasePriceUnit>/mois · sans engagement</ClubShowcasePriceUnit>
                    </ClubShowcasePrice>
                    <ClubShowcaseFeatures>
                      <ClubShowcaseFeature $premium><ClubFeatureIcon>&#x1F4D6;</ClubFeatureIcon>4 livres/mois · 2x plus de pages</ClubShowcaseFeature>
                      <ClubShowcaseFeature $premium><ClubFeatureIcon>&#x1F464;</ClubFeatureIcon>5 personnages secondaires</ClubShowcaseFeature>
                      <ClubShowcaseFeature $premium><ClubFeatureIcon>&#x1F3A8;</ClubFeatureIcon>Styles d'illustration</ClubShowcaseFeature>
                      <ClubShowcaseFeature $premium><ClubFeatureIcon>&#x1F381;</ClubFeatureIcon>Thèmes et occasions</ClubShowcaseFeature>
                      <ClubShowcaseFeature><ClubFeatureIcon>&#x1F4DA;</ClubFeatureIcon>Bibliothèque en ligne</ClubShowcaseFeature>
                      <ClubShowcaseFeature><ClubFeatureIcon>&#x2B07;</ClubFeatureIcon>PDF illimités</ClubShowcaseFeature>
                      <ClubShowcaseFeature><ClubFeatureIcon>&#x1F4B3;</ClubFeatureIcon>Crédits cumulables</ClubShowcaseFeature>
                      <ClubShowcaseFeature><ClubFeatureIcon>&#x274C;</ClubFeatureIcon>Annulable à tout moment</ClubShowcaseFeature>
                    </ClubShowcaseFeatures>
                    <ClubShowcaseCTA $selected={selectedOffer === 'club_monthly'}>
                      {selectedOffer === 'club_monthly' ? 'Sélectionné !' : `Débloquer l'histoire de ${heroName}`}
                    </ClubShowcaseCTA>
                  </ClubShowcaseCard>

                  <ClubMiniCard $isSelected={selectedOffer === 'club_annual'} onClick={() => handlePreviewSelect('club', 'annual')} style={{ maxWidth: 440, marginTop: '10px' }}>
                    <ClubMiniInfo>
                      <ClubMiniName>Club Annuel — 6,67€/mois</ClubMiniName>
                      <ClubMiniDetail>Tout le Club + économisez 40€+/an</ClubMiniDetail>
                    </ClubMiniInfo>
                    <ClubMiniPrice>79,99€/an</ClubMiniPrice>
                  </ClubMiniCard>

                  <ClubAlternativeDivider style={{ maxWidth: 440, marginTop: '16px', marginBottom: '0' }}>ou sans abonnement</ClubAlternativeDivider>

                  <SingleFallbackCard $isSelected={selectedOffer === 'single'} onClick={() => handlePreviewSelect('single')}>
                    <SingleFallbackInfo>
                      <SingleFallbackName>Juste ce livre</SingleFallbackName>
                      <SingleFallbackDetail>1 livre · PDF téléchargeable · paiement unique</SingleFallbackDetail>
                    </SingleFallbackInfo>
                    <SingleFallbackPrice>{singlePriceLabel}</SingleFallbackPrice>
                  </SingleFallbackCard>
                </>
              )}

              <SocialProofLine>
                <span>&#x2B50;</span> Déjà +500 parents ont créé une histoire pour leur enfant
              </SocialProofLine>
            </div>
            )}

            {/* ── Order form — ONLY for full flow (Club without credits + returning paid users) ── */}
            {formData.productType && !isSimplifiedMode && !isClubWithCredit && (
              <div ref={orderFormRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <OrderInfoSection>
                  {!isFirstPurchase && !isClubWithCredit && <SectionTitle>Finalisez votre commande</SectionTitle>}
                  {isAuthenticated && currentUser && (
                    <ConnectedBanner>Connecté en tant que <strong>{currentUser.email}</strong></ConnectedBanner>
                  )}
                  <OrderInfoGrid>
                    {/* Google connect — EN PREMIER pour les non-connectés */}
                    {!isAuthenticated && !isInAppBrowser() && (
                      <FullWidthField>
                        <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                              onSuccess={(credentialResponse: CredentialResponse) => {
                                if (credentialResponse.credential) {
                                  ApiService.googleAuth(credentialResponse.credential).then(res => {
                                    if (res.success && res.data) {
                                      if (res.data.token) localStorage.setItem('userToken', res.data.token);
                                      const googleEmail = res.data.user?.email || '';
                                      const googleFirstName = res.data.user?.firstName || '';
                                      // Update both fields in one call
                                      onUpdate({ userEmail: googleEmail, firstName: googleFirstName });
                                      // Flag for auto-submit via useEffect
                                      googleAutoSubmitRef.current = true;
                                    }
                                  }).catch(() => {});
                                }
                              }}
                              onError={() => {}}
                              text="continue_with"
                              shape="rectangular"
                              size="large"
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0 4px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                            <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>ou</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                          </div>
                        </div>
                      </FullWidthField>
                    )}
                    <FullWidthField>
                      <ValidatedInput type="email" label="Email" value={formData.userEmail || ''}
                        onChange={isAuthenticated ? () => {} : (v) => { setGlobalError(''); setEmailStatus(null); onUpdate({ userEmail: v }); if (errors.userEmail) setErrors(p => ({ ...p, userEmail: '' })); }}
                        placeholder="votre@email.com" required error={errors.userEmail}
                        disabled={isAuthenticated}
                        onBlur={isAuthenticated ? undefined : () => { validateField('userEmail', formData.userEmail || '', 'email'); handleEmailBlurCheck(); }} />
                    </FullWidthField>
                    <FullWidthField>
                      <ValidatedInput label="Prénom" value={formData.firstName || ''}
                        onChange={(v) => { setGlobalError(''); onUpdate({ firstName: v }); if (errors.firstName) setErrors(p => ({ ...p, firstName: '' })); }}
                        placeholder="Votre prénom" required error={errors.firstName}
                        onBlur={() => validateField('firstName', formData.firstName || '')} />
                    </FullWidthField>
                  </OrderInfoGrid>
                </OrderInfoSection>

                {globalError && <ErrorMessage>{globalError}</ErrorMessage>}

                {/* Message quand email déjà connu + gratuit déjà utilisé */}
                {!isAuthenticated && emailStatus?.exists && !isFirstPurchase && (
                  <div style={{
                    background: `${theme.colors.accent.coral}10`,
                    border: `1px solid ${theme.colors.accent.coral}30`,
                    borderRadius: '12px', padding: '12px 16px',
                    marginBottom: '12px', textAlign: 'center', maxWidth: 440, width: '100%',
                  }}>
                    <p style={{
                      fontSize: theme.fontSizes.sm, fontWeight: 600,
                      color: 'var(--text-primary)', margin: '0 0 4px',
                    }}>
                      Un compte existe déjà avec cet email
                    </p>
                    <p style={{
                      fontSize: theme.fontSizes.xs, color: 'var(--text-secondary)',
                      margin: 0, lineHeight: 1.4,
                    }}>
                      Votre livre gratuit a déjà été utilisé. Le prochain livre coûte 3,99€.
                    </p>
                  </div>
                )}

                <PayButton $isReady={isPaymentInfoComplete} disabled={!formData.productType || isSubmitting} onClick={handleFormSubmit}>
                  {isSubmitting
                    ? 'Traitement en cours...'
                    : (formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) || (isFirstPurchase && !isClub && formData.purchaseType !== 'club')
                      ? 'Recevoir mon livre GRATUIT'
                        : `Payer ${isClub && !clubCredit?.canSubmit ? '3,99€' : singlePriceLabel} — Recevoir mon livre`}
                </PayButton>

                <TrustBadgesRow>
                  {(isFirstPurchase && !isClub) || isClubWithCredit ? (
                    <>
                      <TrustBadge>&#x2705; {isClubWithCredit ? 'Inclus dans votre Club' : '100% gratuit'}</TrustBadge>
                      <TrustBadge>&#x1F4E7; Recu par email</TrustBadge>
                      <TrustBadge>&#x26A1; Pret en 5 minutes</TrustBadge>
                    </>
                  ) : (
                    <>
                      <TrustBadge>&#x1F512; Paiement securise Stripe</TrustBadge>
                      <TrustBadge>&#x2705; Satisfait ou rembourse</TrustBadge>
                      <TrustBadge>&#x26A1; Pret en 5 minutes</TrustBadge>
                    </>
                  )}
                </TrustBadgesRow>

                <div style={{ marginTop: '12px', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', maxWidth: 440, width: '100%' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                    "Ma fille a adoré voir son prénom dans l'histoire ! Elle me demande de lui relire tous les soirs."
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '4px', marginBottom: 0 }}>
                    — Sarah, maman de Léa (4 ans)
                  </p>
                </div>
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

  // Étapes visibles dans la barre de progression (exclure les skippées en mode pub)
  const visibleStepIndices = isSimplifiedMode
    ? ALL_STEPS.slice(0, 9).map((_, i) => i).filter(i => !SIMPLIFIED_SKIP_STEPS.has(i))
    : ALL_STEPS.slice(0, 9).map((_, i) => i);

  // Determine which steps to show and their status
  const getSegmentStatus = (idx: number): 'done' | 'current' | 'future' | 'skipped' => {
    if (isSimplifiedMode && SIMPLIFIED_SKIP_STEPS.has(idx)) return 'skipped';
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
          <WizardTitle>Créez votre livre</WizardTitle>
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
            <HeaderTitle>Créer votre livre</HeaderTitle>
            <HeaderBadge style={{ background: isFirstPurchase ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #FF6B6B, #FF8E53)', color: 'white', fontWeight: 700 }}>
              {singlePriceLabel}
            </HeaderBadge>
          </HeaderTopRow>
          <HeaderStepLabel aria-current="step">
            {STEP_CONFIG[stepId]?.label || ''}
          </HeaderStepLabel>
          <SegmentedProgressBar role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={visibleStepIndices.length}>
            {visibleStepIndices.map((i) => (
              <ProgressSegment key={ALL_STEPS[i]} $status={getSegmentStatus(i)} />
            ))}
          </SegmentedProgressBar>
          <ProgressHintText>{isFirstPurchase || isClubWithCredit ? 'Votre livre personnalisé — GRATUIT' : `Votre livre personnalisé — ${singlePriceLabel}`}</ProgressHintText>
        </WizardHeaderNew>
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
              {stepId === 'extras2' ? 'Découvrir mon livre' : 'Continuer'}
            </StickyContinueButton>
          )}
        </StickyBottomBar>
      )}
    </WizardOverlay>
  );
};
