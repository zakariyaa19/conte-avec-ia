import React, { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../../styles/theme';
import { ValidatedInput } from '../ui/ValidatedInput';
import { AgeSelector } from '../ui/AgeSelector';

import { SecondaryCharactersSection } from '../forms/SecondaryCharactersSection';
import { useCoverPreview } from '../../hooks/useCoverPreview';
import { useStoryPreview } from '../../hooks/useStoryPreview';
import { useFirstIllustration } from '../../hooks/useFirstIllustration';
import { validateEmail, validateRequired } from '../../utils/validation';
import { metaTrackAddToCart, metaTrackLead } from '../../utils/metaPixel';
import { ApiService } from '../../config/api';
import { ILLUSTRATION_STYLES, LANGUAGES, StoryFormData } from '../../types/FormTypes';
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
  PricingDivider,
  OrderInfoSection, OrderInfoGrid, FullWidthField,
  PayButton, TrustBadgesRow, TrustBadge, ErrorMessage, ConnectedBanner,
  ClubFreeCard, ClubBadge,
  PreviewLoadingContainer, PreviewLoadingBook, PreviewLoadingSparkle,
  PreviewLoadingText, PreviewLoadingDots, PreviewLoadingStages, PreviewLoadingStage,
  BookPreviewWrapper, BookPageFrame, BookCoverImage, MagicParticle,
  BookStoryLayout, BookTextHalf, BookImageHalf, BookCreatorTag, BookPageBadge,
  BookLockedOverlay, BookLockedContent, BookLockedIcon, BookLockedTitle, BookLockedSubtitle, BookLockedFeatures,
  PricingSelectedCheck,
  PreviewTimerBar, PreviewTimerDigits,
  PricingGrid, PricingCard, PricingCardBadge, PricingCardName, PricingCardPrice,
  PricingCardSub, PricingCardFeaturesList, PricingCardFeatureItem, PricingCardCTA,
  PreviewSectionTitle,
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

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

  useEffect(() => { wantsExtrasRef.current = wantsExtras; }, [wantsExtras]);

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

  const handleFormSubmit = () => { setGlobalError(''); if (validatePaymentForm()) onSubmit(); };

  const isHeroComplete = !!(formData.protagonistName && formData.protagonistAge && formData.protagonistGender);
  const isAppearanceComplete = formData.appearanceMode === 'photo'
    ? !!formData.photo
    : !!(formData.eyeColor && formData.hairColor && formData.skinColor);
  const isPaymentInfoComplete = !!(formData.productType && formData.userEmail && formData.firstName && formData.lastName);

  /* ══════════════════════════════════════════════
     RENDER STEPS
     ══════════════════════════════════════════════ */

  const renderStep = (stepIndex: number) => {
    const stepId = ALL_STEPS[stepIndex] as StepId;

    switch (stepId) {

      case 'age':
        return (
          <>
            <StepTitle>Pour quel âge ?</StepTitle>
            <CardGrid $columns={4}>
              {AGE_OPTIONS.map((o, i) => (
                <ImageCard key={o.value} $isSelected={formData.ageRange === o.value} $delay={i}
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
              {THEME_OPTIONS.map((o, i) => (
                <ImageCard key={o.value} $isSelected={formData.generalTheme === o.value} $delay={i}
                  onClick={() => o.value === 'custom' ? onUpdate({ generalTheme: 'custom' }) : handleCardSelect('generalTheme', o.value)}>
                  <CardImg $src={o.imagePath} />
                  <CardImgLabel>{o.label}</CardImgLabel>
                </ImageCard>
              ))}
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
            <CardGrid $columns={4} $compact>
              {OCCASION_OPTIONS.map((o, i) => (
                <ImageCard key={o.value} $isSelected={formData.specificSubject === o.value} $delay={i}
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
            <CardGrid $columns={5} $compact>
              {ILLUSTRATION_STYLES.map((s, i) => (
                <ImageCard key={s.value} $isSelected={formData.illustrationStyle === s.value} $delay={i}
                  onClick={() => handleCardSelect('illustrationStyle', s.value)}>
                  <CardImg $src={s.imagePath} />
                  <CardImgLabel>{s.label}</CardImgLabel>
                </ImageCard>
              ))}
            </CardGrid>
          </>
        );

      case 'hero':
        return (
          <>
            <StepTitle>Votre héros</StepTitle>
            <StepSubtitle>Qui sera le personnage principal ?</StepSubtitle>
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
            <CardGrid $columns={2}>
              {GENDER_OPTIONS.map((o, i) => (
                <TextCard key={o.value} $isSelected={formData.protagonistGender === o.value} $delay={i}
                  onClick={() => onUpdate({ protagonistGender: o.value as 'boy' | 'girl' })}>
                  {o.label}
                </TextCard>
              ))}
            </CardGrid>
            <ContinueButton $isReady={isHeroComplete} disabled={!isHeroComplete} onClick={goNext}>
              Continuer
            </ContinueButton>
          </>
        );

      case 'appearance':
        return (
          <>
            <StepTitle>Son apparence</StepTitle>

            {/* ---- Mode choice ---- */}
            {!formData.appearanceMode && (
              <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: 520, justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Photo card */}
                <button onClick={() => onUpdate({ appearanceMode: 'photo', eyeColor: '', hairColor: '', skinColor: '' })} style={{
                  flex: '1 1 220px', maxWidth: 250, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '20px 16px 18px', border: '2px solid transparent', borderRadius: 20,
                  cursor: 'pointer', transition: 'all 0.3s ease', WebkitTapHighlightColor: 'transparent',
                  background: `linear-gradient(145deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`,
                  boxShadow: `0 8px 28px ${theme.colors.accent.coral}35`,
                }}>
                  <div style={{ width: 72, height: 72, marginBottom: 10, position: 'relative' }}>
                    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
                      <circle cx="40" cy="40" r="36" fill="rgba(255,255,255,0.2)" />
                      <rect x="22" y="26" width="36" height="28" rx="4" fill="white" opacity="0.9">
                        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
                      </rect>
                      <circle cx="40" cy="38" r="8" fill="none" stroke={theme.colors.accent.coral} strokeWidth="2.5">
                        <animate attributeName="r" values="8;9;8" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="40" cy="38" r="4" fill={theme.colors.accent.coral} opacity="0.6" />
                      <rect x="50" y="29" width="5" height="3" rx="1" fill={theme.colors.accent.coral} opacity="0.7" />
                      <circle cx="40" cy="62" r="5" fill="rgba(255,255,255,0.25)">
                        <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <path d="M38 61 L42 61 L40 64 Z" fill="rgba(255,255,255,0.4)" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 700, color: 'white', textAlign: 'center', lineHeight: 1.2 }}>
                    Importer une photo
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 4, lineHeight: 1.3 }}>
                    Le personnage ressemblera a votre enfant
                  </span>
                </button>

                {/* Manual card */}
                <button onClick={() => onUpdate({ appearanceMode: 'manual', photo: undefined })} style={{
                  flex: '1 1 220px', maxWidth: 250, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '20px 16px 18px', border: '2px solid rgba(0,0,0,0.08)', borderRadius: 20,
                  cursor: 'pointer', transition: 'all 0.3s ease', WebkitTapHighlightColor: 'transparent',
                  background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ width: 72, height: 72, marginBottom: 10, position: 'relative' }}>
                    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
                      <circle cx="40" cy="40" r="36" fill={`${theme.colors.accent.coral}12`} />
                      {/* Eye */}
                      <ellipse cx="29" cy="32" rx="8" ry="6" fill="#E8D5C4" stroke="#CCC" strokeWidth="1" />
                      <circle cx="29" cy="32" r="4" fill="#4169E1">
                        <animate attributeName="r" values="4;3.5;4" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="28" cy="31" r="1.2" fill="white" />
                      {/* Hair swatch */}
                      <circle cx="53" cy="28" r="8" fill="#FFD700">
                        <animate attributeName="fill" values="#FFD700;#8B4513;#1a1a1a;#D35400;#FFD700" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <path d="M48 24 Q53 18, 58 24" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
                      <path d="M49 28 Q53 22, 57 28" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
                      {/* Skin swatches */}
                      <circle cx="28" cy="54" r="6" fill="#FDDCB5">
                        <animate attributeName="fill" values="#FDDCB5;#E8B88A;#C8915E;#8D5524;#FDDCB5" dur="5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="44" cy="54" r="6" fill="#E8B88A">
                        <animate attributeName="fill" values="#E8B88A;#C8915E;#8D5524;#FDDCB5;#E8B88A" dur="5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="60" cy="54" r="6" fill="#C8915E">
                        <animate attributeName="fill" values="#C8915E;#8D5524;#FDDCB5;#E8B88A;#C8915E" dur="5s" repeatCount="indefinite" />
                      </circle>
                      {/* Palette icon */}
                      <path d="M20 54 Q16 46, 20 40" stroke={theme.colors.accent.coral} strokeWidth="1.5" fill="none" opacity="0.3" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 700, color: theme.colors.text.primary, textAlign: 'center', lineHeight: 1.2 }}>
                    Personnaliser
                  </span>
                  <span style={{ fontSize: 12, color: theme.colors.text.secondary, textAlign: 'center', marginTop: 4, lineHeight: 1.3 }}>
                    Choisir yeux, cheveux et peau
                  </span>
                </button>
              </div>
            )}

            {/* ---- Photo mode ---- */}
            {formData.appearanceMode === 'photo' && (
              <>
                <PhotoUploadZone $hasPhoto={!!formData.photo} onClick={() => fileInputRef.current?.click()}>
                  <PhotoIcon>{formData.photo ? '✓' : '📷'}</PhotoIcon>
                  <PhotoMainText>{formData.photo ? (formData.photo as File).name : 'Cliquez pour ajouter une photo'}</PhotoMainText>
                  <PhotoSubText>{formData.photo ? 'Cliquez pour changer' : 'Photo de face, bien eclairee'}</PhotoSubText>
                  <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} />
                </PhotoUploadZone>
                <SkipLink onClick={() => onUpdate({ appearanceMode: undefined, photo: undefined })}>
                  Changer de methode
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
                  Changer de methode
                </SkipLink>
              </>
            )}

            {formData.appearanceMode && (
              <ContinueButton $isReady={isAppearanceComplete} disabled={!isAppearanceComplete} onClick={goNext}>
                Continuer
              </ContinueButton>
            )}
          </>
        );

      case 'choice':
        return (
          <>
            <StepTitle>Votre histoire est prête !</StepTitle>
            <StepSubtitle>Que souhaitez-vous faire ?</StepSubtitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, width: '100%', alignItems: 'center' }}>
              <ChoiceCard $variant="primary" onClick={() => {
                setWantsExtras(false); wantsExtrasRef.current = false; goToStep(9); // skip to 'cover'
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
          </>
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
              <CardGrid $columns={2} $compact>
                {LANG_TOP.map((o, i) => (
                  <TextCard key={o.value} $isSelected={formData.language === o.value} $delay={i}
                    onClick={() => handleInputChange('language', o.value)}>
                    {o.label}
                  </TextCard>
                ))}
                <TextCard $isSelected={false} $delay={3}
                  onClick={() => setShowAllLanguages(!showAllLanguages)}>
                  {showAllLanguages ? 'Masquer ▲' : 'Autre langue ▼'}
                </TextCard>
              </CardGrid>
              {showAllLanguages && (
                <CardGrid $columns={2} $compact style={{ marginTop: theme.spacing.sm }}>
                  {LANG_OTHER.map((o, i) => (
                    <TextCard key={o.value} $isSelected={formData.language === o.value} $delay={i}
                      onClick={() => handleInputChange('language', o.value)}>
                      {o.label}
                    </TextCard>
                  ))}
                </CardGrid>
              )}
            </ExtrasSection>

            <ContinueButton $isReady={true} onClick={goNext}>Continuer</ContinueButton>
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
              <CollapsiblePill $isOpen={showReligion} onClick={() => {
                setShowReligion(!showReligion);
                if (showReligion) onUpdate({ religion: undefined, customReligion: undefined });
              }}>
                Dimension religieuse
                <CollapsibleChevron $isOpen={showReligion}>▼</CollapsibleChevron>
              </CollapsiblePill>
              <CollapsibleContent $isOpen={showReligion}>
                <CardGrid $columns={3} $compact>
                  {RELIGION_OPTIONS.map((o, i) => (
                    <TextCard key={o.value} $isSelected={formData.religion === o.value} $delay={i}
                      onClick={() => handleInputChange('religion', o.value)}>
                      {o.label}
                    </TextCard>
                  ))}
                </CardGrid>
                {formData.religion === 'other' && (
                  <CustomInput type="text" placeholder="Précisez..." value={formData.customReligion || ''}
                    onChange={(e) => handleInputChange('customReligion', e.target.value)} />
                )}
              </CollapsibleContent>
            </ExtrasSection>

            <ExtrasSection>
              <CollapsiblePill $isOpen={showSecondaryChars} onClick={() => setShowSecondaryChars(!showSecondaryChars)}>
                Personnages secondaires
                <CollapsibleChevron $isOpen={showSecondaryChars}>▼</CollapsibleChevron>
              </CollapsiblePill>
              <CollapsibleContent $isOpen={showSecondaryChars}>
                <SecondaryCharactersSection
                  secondaryCharacters={formData.secondaryCharacters || []}
                  onChange={(chars) => onUpdate({ secondaryCharacters: chars })} />
              </CollapsibleContent>
            </ExtrasSection>

            <ExtrasSection>
              <SectionTitle>Créateur du livre</SectionTitle>
              <InputField>
                <ValidatedInput label="" value={formData.creatorName || ''}
                  onChange={(v) => handleInputChange('creatorName', v)} placeholder="Ex : Créé par Papa et Maman..." required={false} />
              </InputField>
            </ExtrasSection>

            <DiscoverCTA onClick={goNext}>Découvrir mon conte</DiscoverCTA>
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

        // All content ready = show the book reveal
        const allReady = coverImageUrl && !isCoverGenerating && previewParagraphs && illustrationBase64;

        // Loading stages: 0=cover, 1=text, 2=illustration
        let loadingStage = 0;
        if (coverImageUrl && !isCoverGenerating) loadingStage = 1;
        if (coverImageUrl && !isCoverGenerating && previewParagraphs) loadingStage = 2;

        const loadingTexts = [
          `Création de la couverture de ${heroName}`,
          `Rédaction de l'histoire`,
          `Illustration de la première page`,
        ];

        if (!allReady) {
          return (
            <>
              <StepTitle style={{ fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.md }}>
                Votre histoire prend vie...
              </StepTitle>
              <PreviewLoadingContainer>
                <PreviewLoadingSparkle $delay={0} $left="15%" $size={5} />
                <PreviewLoadingSparkle $delay={0.8} $left="30%" $size={7} />
                <PreviewLoadingSparkle $delay={1.6} $left="50%" $size={4} />
                <PreviewLoadingSparkle $delay={0.4} $left="68%" $size={6} />
                <PreviewLoadingSparkle $delay={1.2} $left="82%" $size={5} />
                <PreviewLoadingSparkle $delay={2.0} $left="40%" $size={3} />
                <PreviewLoadingBook />
                <PreviewLoadingText>
                  {loadingTexts[loadingStage]}
                  <PreviewLoadingDots><span /><span /><span /></PreviewLoadingDots>
                </PreviewLoadingText>
                <PreviewLoadingStages>
                  <PreviewLoadingStage $active={loadingStage === 0} $done={loadingStage > 0} />
                  <PreviewLoadingStage $active={loadingStage === 1} $done={loadingStage > 1} />
                  <PreviewLoadingStage $active={loadingStage === 2} $done={false} />
                </PreviewLoadingStages>
              </PreviewLoadingContainer>
            </>
          );
        }

        return (
          <>
            <StepTitle style={{ fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.md }}>
              Le conte de {heroName} est prêt !
            </StepTitle>

            {/* ── Book preview: cover + story page + locked page ── */}
            <BookPreviewWrapper>
              {/* Magic particles — very subtle floating sparkles */}
              <MagicParticle $delay={0} $left="8%" $size={3} />
              <MagicParticle $delay={1.5} $left="22%" $size={5} />
              <MagicParticle $delay={3} $left="42%" $size={3} />
              <MagicParticle $delay={0.8} $left="65%" $size={4} />
              <MagicParticle $delay={2.2} $left="80%" $size={3} />
              <MagicParticle $delay={4} $left="92%" $size={4} />

              {/* Cover — portrait */}
              <BookPageFrame $portrait>
                <BookCoverImage>
                  <img src={coverImageUrl} alt="Couverture" />
                </BookCoverImage>
              </BookPageFrame>

              {/* Story page — text left, illustration right */}
              <BookPageFrame>
                <BookStoryLayout>
                  <BookTextHalf>
                    {creatorName && <BookCreatorTag>{creatorName}</BookCreatorTag>}
                    <p>{previewParagraphs[0]}</p>
                    <BookPageBadge>1</BookPageBadge>
                  </BookTextHalf>
                  <BookImageHalf>
                    <img src={`data:image/png;base64,${illustrationBase64}`} alt="Illustration" />
                  </BookImageHalf>
                </BookStoryLayout>
              </BookPageFrame>

              {/* Locked page — compact, clickable → scroll to pricing */}
              <BookPageFrame $compact>
                <BookLockedOverlay onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                  <BookLockedContent>
                    <BookLockedIcon>&#x1F512;</BookLockedIcon>
                    <BookLockedTitle>L'aventure de {heroName} continue...</BookLockedTitle>
                    <BookLockedSubtitle>La suite de l'histoire est prête...</BookLockedSubtitle>
                  </BookLockedContent>
                </BookLockedOverlay>
              </BookPageFrame>
            </BookPreviewWrapper>

            {/* ── Timer bar ── */}
            <PreviewTimerBar style={{ marginTop: theme.spacing.md }}>
              <span>Votre histoire est prête et sera conservée pendant</span>
              <PreviewTimerDigits>{timerDisplay}</PreviewTimerDigits>
            </PreviewTimerBar>

            {/* ── Pricing section ── */}
            <div ref={pricingRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PreviewSectionTitle style={{ marginTop: theme.spacing.md }}>
                Recevez l'histoire complète de {heroName}
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
                  <PricingCard $isSelected={selectedOffer === 'single'} onClick={() => handlePreviewSelect('single')}>
                    {selectedOffer === 'single' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <PricingCardName>Offre Unique</PricingCardName>
                    <PricingCardPrice>6,99 EUR</PricingCardPrice>
                    <PricingCardSub>Paiement unique</PricingCardSub>
                    <PricingDivider />
                    <PricingCardFeaturesList>
                      <PricingCardFeatureItem>1 conte personnalisé</PricingCardFeatureItem>
                      <PricingCardFeatureItem>6 illustrations HD</PricingCardFeatureItem>
                      <PricingCardFeatureItem>PDF téléchargeable</PricingCardFeatureItem>
                    </PricingCardFeaturesList>
                    <PricingCardCTA $primary={selectedOffer === 'single'}>{selectedOffer === 'single' ? 'Sélectionné' : 'Choisir'}</PricingCardCTA>
                  </PricingCard>

                  <PricingCard $isSelected={selectedOffer === 'club_monthly'} $featured onClick={() => handlePreviewSelect('club', 'monthly')}>
                    <PricingCardBadge>Populaire</PricingCardBadge>
                    {selectedOffer === 'club_monthly' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <PricingCardName>Club Mensuel</PricingCardName>
                    <PricingCardPrice>9,99 EUR</PricingCardPrice>
                    <PricingCardSub>/ mois — sans engagement</PricingCardSub>
                    <PricingDivider />
                    <PricingCardFeaturesList>
                      <PricingCardFeatureItem $highlight>Ce conte est inclus</PricingCardFeatureItem>
                      <PricingCardFeatureItem $highlight>3 contes / mois</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Bibliothèque illimitée</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Annulable à tout moment</PricingCardFeatureItem>
                    </PricingCardFeaturesList>
                    <PricingCardCTA $primary>{selectedOffer === 'club_monthly' ? 'Sélectionné' : 'Choisir'}</PricingCardCTA>
                  </PricingCard>

                  <PricingCard $isSelected={selectedOffer === 'club_annual'} onClick={() => handlePreviewSelect('club', 'annual')}>
                    {selectedOffer === 'club_annual' && <PricingSelectedCheck>&#x2713;</PricingSelectedCheck>}
                    <PricingCardName>Club Annuel</PricingCardName>
                    <PricingCardPrice>79,99 EUR</PricingCardPrice>
                    <PricingCardSub>/ an — soit 6,67 EUR/mois</PricingCardSub>
                    <PricingDivider />
                    <PricingCardFeaturesList>
                      <PricingCardFeatureItem $highlight>Ce conte est inclus</PricingCardFeatureItem>
                      <PricingCardFeatureItem $highlight>3 contes / mois</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Économisez 40 EUR/an</PricingCardFeatureItem>
                      <PricingCardFeatureItem>Bibliothèque illimitée</PricingCardFeatureItem>
                    </PricingCardFeaturesList>
                    <PricingCardCTA $primary={selectedOffer === 'club_annual'}>{selectedOffer === 'club_annual' ? 'Sélectionné' : 'Choisir'}</PricingCardCTA>
                  </PricingCard>
                </PricingGrid>
              )}
            </div>

            {/* ── Order form (appears when offer selected) ── */}
            {formData.productType && (
              <div ref={orderFormRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <OrderInfoSection>
                  <SectionTitle>Informations de commande</SectionTitle>
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
                      : 'Recevoir mon conte →'}
                </PayButton>

                {!(formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) && (
                  <p style={{ marginTop: theme.spacing.sm, fontSize: '10px', color: theme.colors.text.light, textAlign: 'center' }}>
                    Paiement sécurisé par Stripe
                  </p>
                )}

                <TrustBadgesRow>
                  <TrustBadge>Sécurisé</TrustBadge>
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

  return (
    <WizardOverlay>
      <WizardHeader>
        <BackArrow $visible={currentStep > 0} onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </BackArrow>
        <WizardTitle>Créez votre conte</WizardTitle>
        <ProgressTrack><ProgressFill $progress={progress} /></ProgressTrack>
      </WizardHeader>

      <WizardViewport ref={viewportRef}>
        {prevStep !== null && isAnimating && renderStepInContainer(prevStep, 'exiting')}
        {renderStepInContainer(currentStep, isAnimating ? 'entering' : 'active')}
      </WizardViewport>
    </WizardOverlay>
  );
};
