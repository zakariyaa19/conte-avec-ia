import React, { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../../styles/theme';
import { SelectionCard } from '../ui/SelectionCard';
import { ImageSelectionCard } from '../ui/ImageSelectionCard';
import { ImageAgeCard } from '../ui/ImageAgeCard';
import { ImageThemeCard } from '../ui/ImageThemeCard';
import { ImageOccasionCard } from '../ui/ImageOccasionCard';
import { ImageMessageCard } from '../ui/ImageMessageCard';
import { ValidatedInput } from '../ui/ValidatedInput';
import { AgeSelector } from '../ui/AgeSelector';
import { PricingCard } from '../ui/PricingCard';
import { BookCoverPreview } from '../ui/BookCoverPreview';
import { SecondaryCharactersSection } from '../forms/SecondaryCharactersSection';
import { useCoverPreview, isPhase1Complete } from '../../hooks/useCoverPreview';
import { validateEmail, validateRequired } from '../../utils/validation';
import { ApiService } from '../../config/api';
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
import {
  WizardOverlay,
  WizardHeader,
  BackArrow,
  WizardTitle,
  ProgressTrack,
  ProgressFill,
  WizardViewport,
  StepContainerCentered,
  StepContainerTop,
  StepTitle,
  StepSubtitle,
  CardGrid,
  ColorSectionLabel,
  ColorGrid,
  ColorOption,
  ColorCircle,
  ColorLabel,
  InputRow,
  InputField,
  CustomInput,
  TextArea,
  PhotoUploadZone,
  PhotoIcon,
  PhotoMainText,
  PhotoSubText,
  HiddenFileInput,
  ContinueButton,
  SkipLink,
  DiscoverCTA,
  CollapsiblePill,
  CollapsibleChevron,
  CollapsibleContent,
  ExtrasSection,
  SectionTitle,
  PricingGrid,
  OrderInfoSection,
  OrderInfoGrid,
  FullWidthField,
  OrderCostSummary,
  PayButton,
  TrustBadgesRow,
  TrustBadge,
  ErrorMessage,
  ConnectedBanner,
  ClubFreeCard,
  ClubBadge,
  ClubExhaustedMsg,
  StyledIconCircle,
} from './WizardSharedStyles';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

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

const TOTAL_STEPS = 10;

const TOP_LANGUAGES = LANGUAGES.slice(0, 3);
const OTHER_LANGUAGES = LANGUAGES.slice(3);

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export const StoryWizard: React.FC<StoryWizardProps> = ({
  formData,
  onUpdate,
  onSubmit,
  isSubmitting,
  isAuthenticated = false,
  isClub = false,
  currentUser = null,
  clubCredit = null
}) => {
  /* ── Navigation state ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);

  /* ── Extras step toggles ── */
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showReligion, setShowReligion] = useState(!!formData.religion);
  const [showSecondaryChars, setShowSecondaryChars] = useState(
    (formData.secondaryCharacters?.length || 0) > 0
  );

  /* ── Form state ── */
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ exists: boolean; hasPassword: boolean } | null>(null);

  /* ── Cover preview ── */
  const {
    coverImageUrl,
    coverTitle,
    isGenerating: isCoverGenerating,
    error: coverError,
    generate: generateCover,
  } = useCoverPreview(formData);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Progress ── */
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  /* ──────────────────────────────────────────────
     Navigation
     ────────────────────────────────────────────── */

  const goToStep = useCallback((target: number) => {
    if (isAnimating || target < 0 || target >= TOTAL_STEPS) return;
    setDirection(target > currentStep ? 'forward' : 'backward');
    setPrevStep(currentStep);
    setCurrentStep(target);
    setIsAnimating(true);
    setTimeout(() => {
      setPrevStep(null);
      setIsAnimating(false);
    }, 420);
  }, [currentStep, isAnimating]);

  const goNext = useCallback(() => goToStep(currentStep + 1), [goToStep, currentStep]);
  const goBack = useCallback(() => goToStep(currentStep - 1), [goToStep, currentStep]);

  /* ── Auto-advance helper for card selections ── */
  const handleCardSelect = useCallback((field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (value === 'custom' || value === 'other') return;
    setTimeout(() => goNext(), 350);
  }, [onUpdate, goNext]);

  /* ── Cover generation on step 8 (index 8 = coverReveal) ── */
  useEffect(() => {
    if (currentStep === 8 && !coverImageUrl && !isCoverGenerating) {
      generateCover();
    }
  }, [currentStep]);

  /* ──────────────────────────────────────────────
     Form Helpers
     ────────────────────────────────────────────── */

  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    const emailValidation = validateEmail(formData.userEmail);
    if (!emailValidation.isValid) return;
    try {
      const response = await ApiService.checkEmail(formData.userEmail);
      if (response.success) {
        setEmailStatus({ exists: response.exists, hasPassword: !!response.hasPassword });
      }
    } catch { /* silent */ }
  };

  const validateField = (field: string, value: string, validationType?: 'email') => {
    const validation = validationType === 'email' ? validateEmail(value) : validateRequired(value, field);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field]: validation.error || '' }));
      return false;
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const validatePaymentForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};
    if (!formData.userEmail) { newErrors.userEmail = 'L\'email est obligatoire'; isValid = false; }
    else {
      const ev = validateEmail(formData.userEmail);
      if (!ev.isValid) { newErrors.userEmail = ev.error || 'Email invalide'; isValid = false; }
    }
    if (!formData.firstName) { newErrors.firstName = 'Le prénom est obligatoire'; isValid = false; }
    if (!formData.lastName) { newErrors.lastName = 'Le nom est obligatoire'; isValid = false; }
    setErrors(newErrors);
    if (!isValid) setGlobalError('Veuillez remplir tous les champs obligatoires');
    return isValid;
  };

  const handleFormSubmit = () => {
    setGlobalError('');
    if (validatePaymentForm()) onSubmit();
  };

  /* ── Step completion checks ── */
  const isHeroComplete = !!(formData.protagonistName && formData.protagonistAge && formData.protagonistGender);
  const isAppearanceComplete = !!(formData.eyeColor && formData.hairColor);
  const isPaymentInfoComplete = !!(formData.productType && formData.userEmail && formData.firstName && formData.lastName);

  /* ──────────────────────────────────────────────
     Step Rendering
     ────────────────────────────────────────────── */

  const renderStep = (step: number) => {
    switch (step) {
      /* ═══ Step 0: Age Range ═══ */
      case 0:
        return (
          <>
            <StepTitle>Pour quel âge ?</StepTitle>
            <CardGrid $columns={4}>
              {AGE_RANGES.map((range) => (
                <ImageAgeCard
                  key={range.value}
                  value={range.value}
                  label={range.label}
                  description={range.description}
                  imagePath={range.imagePath}
                  isSelected={formData.ageRange === range.value}
                  onClick={(value) => handleCardSelect('ageRange', value)}
                />
              ))}
            </CardGrid>
          </>
        );

      /* ═══ Step 1: Theme ═══ */
      case 1:
        return (
          <>
            <StepTitle>Quel univers ?</StepTitle>
            <CardGrid $columns={4}>
              {GENERAL_THEMES.map((t) => (
                <ImageThemeCard
                  key={t.value}
                  value={t.value}
                  label={t.label}
                  imagePath={t.imagePath}
                  isSelected={formData.generalTheme === t.value}
                  onClick={(value) => handleCardSelect('generalTheme', value)}
                />
              ))}
              <ImageThemeCard
                value="custom"
                label="Personnalisé"
                imagePath="/image/themes/personnalise.png"
                isSelected={formData.generalTheme === 'custom'}
                onClick={(value) => {
                  onUpdate({ generalTheme: value });
                }}
              />
            </CardGrid>
            {formData.generalTheme === 'custom' && (
              <>
                <CustomInput
                  type="text"
                  placeholder="Entrez le thème que vous souhaitez"
                  value={formData.customTheme || ''}
                  onChange={(e) => handleInputChange('customTheme', e.target.value)}
                  autoFocus
                />
                <ContinueButton
                  $isReady={!!(formData.customTheme && formData.customTheme.trim())}
                  disabled={!(formData.customTheme && formData.customTheme.trim())}
                  onClick={goNext}
                >
                  Continuer
                </ContinueButton>
              </>
            )}
          </>
        );

      /* ═══ Step 2: Occasion ═══ */
      case 2:
        return (
          <>
            <StepTitle>Quelle occasion ?</StepTitle>
            <CardGrid $columns={4}>
              {SPECIFIC_SUBJECTS.map((subject) => (
                <ImageOccasionCard
                  key={subject.value}
                  value={subject.value}
                  label={subject.label}
                  imagePath={subject.imagePath}
                  isSelected={formData.specificSubject === subject.value}
                  onClick={(value) => handleCardSelect('specificSubject', value)}
                />
              ))}
              <ImageOccasionCard
                value="custom"
                label="Personnalisée"
                imagePath="/image/occasions/personnalise.png"
                isSelected={formData.specificSubject === 'custom'}
                onClick={(value) => {
                  onUpdate({ specificSubject: value });
                }}
              />
            </CardGrid>
            {formData.specificSubject === 'custom' && (
              <>
                <CustomInput
                  type="text"
                  placeholder="Entrez votre occasion"
                  value={formData.customSubject || ''}
                  onChange={(e) => handleInputChange('customSubject', e.target.value)}
                  autoFocus
                />
                <ContinueButton
                  $isReady={!!(formData.customSubject && formData.customSubject.trim())}
                  disabled={!(formData.customSubject && formData.customSubject.trim())}
                  onClick={goNext}
                >
                  Continuer
                </ContinueButton>
              </>
            )}
          </>
        );

      /* ═══ Step 3: Illustration Style ═══ */
      case 3:
        return (
          <>
            <StepTitle>Quel style d'illustration ?</StepTitle>
            <CardGrid $columns={3}>
              {ILLUSTRATION_STYLES.map((style) => (
                <ImageSelectionCard
                  key={style.value}
                  value={style.value}
                  label={style.label}
                  imagePath={style.imagePath}
                  isSelected={formData.illustrationStyle === style.value}
                  onClick={(value) => handleCardSelect('illustrationStyle', value)}
                />
              ))}
            </CardGrid>
          </>
        );

      /* ═══ Step 4: Hero Identity ═══ */
      case 4:
        return (
          <>
            <StepTitle>Votre héros</StepTitle>
            <StepSubtitle>Qui sera le personnage principal de cette histoire ?</StepSubtitle>
            <InputRow>
              <InputField>
                <ValidatedInput
                  label="Prénom du héros / de l'héroïne *"
                  value={formData.protagonistName || ''}
                  onChange={(value) => handleInputChange('protagonistName', value)}
                  placeholder="Ex : Emma, Lucas..."
                  required={true}
                  error={errors.protagonistName}
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
            </InputRow>
            <CardGrid $columns={2}>
              {GENDERS.map((gender) => (
                <SelectionCard
                  key={gender.value}
                  value={gender.value}
                  label={gender.label}
                  icon={gender.icon}
                  isSelected={formData.protagonistGender === gender.value}
                  onClick={(value) => onUpdate({ protagonistGender: value as 'boy' | 'girl' })}
                />
              ))}
            </CardGrid>
            <ContinueButton
              $isReady={isHeroComplete}
              disabled={!isHeroComplete}
              onClick={goNext}
            >
              Continuer
            </ContinueButton>
          </>
        );

      /* ═══ Step 5: Appearance (eye + hair color) ═══ */
      case 5:
        return (
          <>
            <StepTitle>Son apparence</StepTitle>
            <ColorSectionLabel>Couleur des yeux *</ColorSectionLabel>
            <ColorGrid>
              {EYE_COLORS.map((ec) => (
                <ColorOption
                  key={ec.value}
                  color={ec.color}
                  $isSelected={formData.eyeColor === ec.value}
                  onClick={() => onUpdate({ eyeColor: ec.value })}
                >
                  <ColorCircle color={ec.color} />
                  <ColorLabel>{ec.label}</ColorLabel>
                </ColorOption>
              ))}
            </ColorGrid>
            <ColorSectionLabel>Couleur des cheveux *</ColorSectionLabel>
            <ColorGrid>
              {HAIR_COLORS.map((hc) => (
                <ColorOption
                  key={hc.value}
                  color={hc.color}
                  $isSelected={formData.hairColor === hc.value}
                  onClick={() => onUpdate({ hairColor: hc.value })}
                >
                  <ColorCircle color={hc.color} />
                  <ColorLabel>{hc.label}</ColorLabel>
                </ColorOption>
              ))}
            </ColorGrid>
            <ContinueButton
              $isReady={isAppearanceComplete}
              disabled={!isAppearanceComplete}
              onClick={goNext}
            >
              Continuer
            </ContinueButton>
          </>
        );

      /* ═══ Step 6: Photo ═══ */
      case 6:
        return (
          <>
            <StepTitle>Ajoutez sa photo</StepTitle>
            <StepSubtitle>Notre IA adaptera le personnage pour qu'il ressemble à votre enfant</StepSubtitle>
            <PhotoUploadZone
              $hasPhoto={!!formData.photo}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoIcon>{formData.photo ? '\u2705' : '\uD83D\uDCF7'}</PhotoIcon>
              <PhotoMainText>
                {formData.photo ? formData.photo.name : 'Cliquez pour ajouter une photo'}
              </PhotoMainText>
              <PhotoSubText>
                {formData.photo
                  ? 'Cliquez pour changer la photo'
                  : 'Le personnage du conte ressemblera à votre enfant (optionnel)'
                }
              </PhotoSubText>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </PhotoUploadZone>
            <SkipLink onClick={goNext}>
              Passer cette étape {'\u2192'}
            </SkipLink>
          </>
        );

      /* ═══ Step 7: Optional Extras ═══ */
      case 7:
        return (
          <>
            <StepTitle>Personnalisez davantage</StepTitle>
            <StepSubtitle>Ces options sont facultatives mais enrichissent votre conte</StepSubtitle>

            <DiscoverCTA onClick={goNext}>
              {'\u2728'} Découvrir mon conte
            </DiscoverCTA>
            <SkipLink onClick={goNext} style={{ marginBottom: theme.spacing['2xl'] }}>
              Passer les options
            </SkipLink>

            {/* Message */}
            <ExtrasSection>
              <SectionTitle>Quel message transmettre ?</SectionTitle>
              <CardGrid $columns={4}>
                {CENTRAL_MESSAGES.map((msg) => (
                  <ImageMessageCard
                    key={msg.value}
                    value={msg.value}
                    label={msg.label}
                    imagePath={msg.imagePath}
                    isSelected={formData.centralMessage === msg.value}
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
              </CardGrid>
              {formData.centralMessage === 'custom' && (
                <CustomInput
                  type="text"
                  placeholder="Message central personnalisé"
                  value={formData.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                />
              )}
            </ExtrasSection>

            {/* Language */}
            <ExtrasSection>
              <SectionTitle>Langue du conte</SectionTitle>
              <CardGrid $columns={4}>
                {TOP_LANGUAGES.map((lang) => (
                  <SelectionCard
                    key={lang.value}
                    value={lang.value}
                    label={lang.label}
                    icon={lang.flag}
                    isSelected={formData.language === lang.value}
                    onClick={(value) => handleInputChange('language', value)}
                  />
                ))}
                <div
                  style={{
                    display: showAllLanguages ? 'none' : 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    padding: theme.spacing.md,
                    border: '2px dashed #E5E5E5', borderRadius: theme.borderRadius.md,
                    cursor: 'pointer', fontSize: theme.fontSizes.sm, fontWeight: 600,
                    color: theme.colors.text.secondary,
                  }}
                  onClick={() => setShowAllLanguages(true)}
                >
                  Autre langue {'\u25BC'}
                </div>
              </CardGrid>
              {showAllLanguages && (
                <CardGrid $columns={4} style={{ marginTop: theme.spacing.md }}>
                  {OTHER_LANGUAGES.map((lang) => (
                    <SelectionCard
                      key={lang.value}
                      value={lang.value}
                      label={lang.label}
                      icon={lang.flag}
                      isSelected={formData.language === lang.value}
                      onClick={(value) => handleInputChange('language', value)}
                    />
                  ))}
                </CardGrid>
              )}
            </ExtrasSection>

            {/* Details */}
            <ExtrasSection>
              <SectionTitle>Détails à intégrer</SectionTitle>
              <TextArea
                placeholder="Décrivez des détails, événements ou éléments spéciaux à intégrer dans l'histoire..."
                value={formData.specialEvents || ''}
                onChange={(e) => handleInputChange('specialEvents', e.target.value)}
              />
            </ExtrasSection>

            {/* Religion */}
            <ExtrasSection>
              <CollapsiblePill
                $isOpen={showReligion}
                onClick={() => {
                  setShowReligion(!showReligion);
                  if (showReligion) onUpdate({ religion: undefined, customReligion: undefined });
                }}
              >
                <StyledIconCircle $gradient={`linear-gradient(135deg, ${theme.colors.accent.softPink}, ${theme.colors.accent.coral}40)`}>
                  {'\u271A'}
                </StyledIconCircle>
                Ajouter une dimension religieuse
                <CollapsibleChevron $isOpen={showReligion}>{'\u25BC'}</CollapsibleChevron>
              </CollapsiblePill>
              <CollapsibleContent $isOpen={showReligion}>
                <CardGrid $columns={4}>
                  {RELIGIONS.map((rel) => (
                    <SelectionCard
                      key={rel.value}
                      value={rel.value}
                      label={rel.label}
                      icon={rel.icon}
                      isSelected={formData.religion === rel.value}
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
                </CardGrid>
                {formData.religion === 'other' && (
                  <CustomInput
                    type="text"
                    placeholder="Précisez la religion..."
                    value={formData.customReligion || ''}
                    onChange={(e) => handleInputChange('customReligion', e.target.value)}
                  />
                )}
              </CollapsibleContent>
            </ExtrasSection>

            {/* Secondary Characters */}
            <ExtrasSection>
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
            </ExtrasSection>

            {/* Creator */}
            <ExtrasSection>
              <SectionTitle>Créateur du livre (optionnel)</SectionTitle>
              <InputField>
                <ValidatedInput
                  label="Nom ou signature du créateur"
                  value={formData.creatorName || ''}
                  onChange={(value) => handleInputChange('creatorName', value)}
                  placeholder="Ex : Créé par Papa et Maman..."
                  required={false}
                />
              </InputField>
            </ExtrasSection>

            <DiscoverCTA onClick={goNext} style={{ marginTop: theme.spacing.xl }}>
              {'\u2728'} Découvrir mon conte
            </DiscoverCTA>
          </>
        );

      /* ═══ Step 8: Cover Reveal ═══ */
      case 8:
        return (
          <>
            <StepTitle>
              {coverImageUrl && !isCoverGenerating
                ? 'Votre conte prend vie !'
                : 'Création en cours...'
              }
            </StepTitle>
            {coverImageUrl && !isCoverGenerating && (
              <StepSubtitle>Voici la couverture de votre conte personnalisé</StepSubtitle>
            )}
            <div style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
              <BookCoverPreview
                coverImageUrl={coverImageUrl}
                isGenerating={isCoverGenerating}
                error={coverError}
                onClick={goNext}
              />
            </div>
            {coverImageUrl && !isCoverGenerating && (
              <DiscoverCTA onClick={goNext} style={{ marginTop: theme.spacing['2xl'] }}>
                Recevoir mon conte {'\u2192'}
              </DiscoverCTA>
            )}
          </>
        );

      /* ═══ Step 9: Payment ═══ */
      case 9:
        return (
          <>
            <StepTitle>Recevez votre conte</StepTitle>
            <StepSubtitle>Plus qu'une étape pour offrir cette histoire unique</StepSubtitle>

            {/* Club free card */}
            {isClub && clubCredit?.canSubmit && (
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
                <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.secondary, margin: 0 }}>
                  Il vous reste {clubCredit.remaining} eBook(s) gratuit(s) cette semaine
                </p>
              </ClubFreeCard>
            )}

            {isClub && clubCredit && !clubCredit.canSubmit && (
              <ClubExhaustedMsg>
                Votre crédit hebdomadaire est épuisé (0/1). Choisissez un format payant ci-dessous.
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
                  price="12,99 € / mois"
                  features={[
                    "Cet eBook est inclus immédiatement",
                    "1 eBook gratuit chaque semaine",
                    "Bibliothèque illimitée",
                    "Annulable à tout moment"
                  ]}
                  isPopular={formData.purchaseType === 'club' || !formData.purchaseType}
                  ctaText="Recevoir cet eBook + rejoindre le Club"
                  badge="Meilleure offre"
                  subtitle="Soit ~3,25 € par conte"
                  onSelect={() => handleProductSelection('club')}
                />
              )}
            </PricingGrid>

            {/* Cost summary */}
            {formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit && (
              <OrderCostSummary $variant="free">
                Cette commande sera gratuite (crédit Club)
              </OrderCostSummary>
            )}
            {formData.purchaseType === 'club' && !isClub && (
              <OrderCostSummary $variant="info">
                Abonnement Club : 12,99 € / mois — Cet eBook est inclus
              </OrderCostSummary>
            )}
            {formData.purchaseType === 'single' && (
              <OrderCostSummary $variant="paid">
                Cette commande sera payante : 4,99 €
              </OrderCostSummary>
            )}

            {/* Order info */}
            <OrderInfoSection>
              <SectionTitle>Informations de commande</SectionTitle>
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
                        onChange={(value) => { setGlobalError(''); onUpdate({ userEmail: value }); if (errors.userEmail) setErrors(prev => ({ ...prev, userEmail: '' })); }}
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
                    </FullWidthField>
                    <FullWidthField>
                      <ValidatedInput
                        type="password"
                        label="Mot de passe (créez votre compte)"
                        value={formData.password || ''}
                        onChange={(value) => { onUpdate({ password: value }); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }}
                        placeholder="Min. 8 caractères"
                        required={false}
                        error={errors.password}
                      />
                      <p style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.light, marginTop: theme.spacing.xs }}>
                        Créez un compte pour retrouver vos contes
                      </p>
                    </FullWidthField>
                  </>
                )}
                <InputField>
                  <ValidatedInput
                    label="Prénom"
                    value={formData.firstName || ''}
                    onChange={(value) => { setGlobalError(''); onUpdate({ firstName: value }); if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' })); }}
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
                    onChange={(value) => { setGlobalError(''); onUpdate({ lastName: value }); if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' })); }}
                    placeholder="Votre nom"
                    required={true}
                    error={errors.lastName}
                    onBlur={() => validateField('lastName', formData.lastName || '')}
                  />
                </InputField>
              </OrderInfoGrid>
            </OrderInfoSection>

            {globalError && <ErrorMessage>{globalError}</ErrorMessage>}

            <PayButton
              $isReady={isPaymentInfoComplete}
              disabled={!formData.productType || isSubmitting}
              onClick={handleFormSubmit}
            >
              {isSubmitting
                ? '\u23F3 Traitement en cours...'
                : formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit
                  ? '\u2728 Recevoir mon eBook gratuit'
                  : '\u2728 Recevoir mon conte'
              }
            </PayButton>

            {!(formData.purchaseType === 'club' && isClub && clubCredit?.canSubmit) && (
              <p style={{ marginTop: theme.spacing.md, fontSize: theme.fontSizes.xs, color: theme.colors.text.light, textAlign: 'center' }}>
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
          </>
        );

      default:
        return null;
    }
  };

  /* ──────────────────────────────────────────────
     Determine step container type
     ────────────────────────────────────────────── */

  const isScrollableStep = (step: number) => step === 7 || step === 9;

  const renderStepInContainer = (step: number, state: 'entering' | 'active' | 'exiting') => {
    const Container = isScrollableStep(step) ? StepContainerTop : StepContainerCentered;
    return (
      <Container
        key={`step-${step}-${state}`}
        $state={state}
        $direction={direction}
        onAnimationEnd={() => {
          if (state === 'exiting') setPrevStep(null);
        }}
      >
        {renderStep(step)}
      </Container>
    );
  };

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */

  return (
    <WizardOverlay>
      {/* Header */}
      <WizardHeader>
        <BackArrow $visible={currentStep > 0} onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BackArrow>
        <WizardTitle>Créez votre conte</WizardTitle>
        <ProgressTrack>
          <ProgressFill $progress={progress} />
        </ProgressTrack>
      </WizardHeader>

      {/* Step viewport */}
      <WizardViewport>
        {/* Exiting step */}
        {prevStep !== null && isAnimating && renderStepInContainer(prevStep, 'exiting')}

        {/* Active step */}
        {renderStepInContainer(currentStep, isAnimating ? 'entering' : 'active')}
      </WizardViewport>
    </WizardOverlay>
  );
};
