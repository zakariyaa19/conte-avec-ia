import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
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
import { validateEmail, validateAddress, validateCity, validatePostalCode, validateRequired } from '../../utils/validation';

interface UnifiedStoryFormProps {
  formData: Partial<StoryFormData>;
  onUpdate: (data: Partial<StoryFormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const Section = styled.div<{ $isVisible: boolean; $isCompleted: boolean }>`
  opacity: ${props => props.$isVisible ? 1 : 0.3};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  margin-bottom: ${theme.spacing['3xl']};
  transition: all 0.4s ease;
  position: relative;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isVisible && !props.$isCompleted ? 
    `linear-gradient(135deg, ${theme.colors.accent.creamyYellow}15, ${theme.colors.accent.lightCoral}10)` : 
    'transparent'
  };
  border: ${props => props.$isVisible && !props.$isCompleted ? 
    `2px solid ${theme.colors.accent.coral}40` : 
    '2px solid transparent'
  };
  box-shadow: ${props => props.$isVisible && !props.$isCompleted ? 
    `0 0 30px ${theme.colors.accent.coral}20` : 
    'none'
  };
  width: 100%;
  max-width: 1100px;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
    padding: ${theme.spacing.sm};
    border: none;
    box-shadow: none;
    background: transparent;
  }
`;

const SectionHeader = styled.div<{ $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${props => props.$isCompleted ? theme.colors.accent.coral : theme.colors.background.secondary};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const SectionTitle = styled.h3<{ $isCompleted: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${props => props.$isCompleted ? theme.colors.accent.coral : theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
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
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.accent.coral};
    color: ${theme.colors.background.white};
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
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
    font-weight: 700;
  }
`;

const SelectionGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 4}, 1fr);
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${theme.spacing.sm};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${theme.spacing.xs};
  }
`;

const CustomInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  margin-top: ${theme.spacing.md};
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
  }
  
  &::placeholder {
    color: ${theme.colors.text.light};
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
  transition: all 0.2s ease;
  background-color: ${props => props.$isSelected ? theme.colors.accent.creamyYellow : theme.colors.background.white};
  
  &:hover {
    border-color: ${theme.colors.accent.coral};
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

const PhotoUploadSection = styled.div`
  border: 2px dashed #E5E5E5;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.accent.coral};
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
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
  }
  
  &::placeholder {
    color: ${theme.colors.text.light};
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
  transition: all 0.3s ease;
  margin-bottom: ${theme.spacing.lg};
  
  &:hover {
    border-color: ${theme.colors.accent.coral};
  }
`;

const SecondaryCharacterSection = styled.div`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.xl};
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ShippingSection = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'block' : 'none'};
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ShippingGrid = styled.div`
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
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.lightCoral});
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-weight: 600;
  animation: slideIn 0.5s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PayButton = styled(Button)<{ $isReady: boolean }>`
  position: relative;
  transition: all 0.3s ease;
  
  ${props => props.$isReady && `
    animation: pulse 1s ease;
    box-shadow: 0 0 20px ${theme.colors.accent.coral}40;
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `}
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  color: #c33;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

export const UnifiedStoryForm: React.FC<UnifiedStoryFormProps> = ({ 
  formData, 
  onUpdate, 
  onSubmit,
  isSubmitting 
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string>('');
  const [showReligionSection, setShowReligionSection] = useState<boolean>(!!formData.religion);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
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
    if (formData.productType === 'ebook') {
      return !!(
        formData.productType && 
        formData.userEmail &&
        formData.shippingAddress?.firstName &&
        formData.shippingAddress?.lastName
      );
    }
    return !!(
      formData.productType &&
      formData.userEmail &&
      formData.shippingAddress?.firstName &&
      formData.shippingAddress?.lastName &&
      formData.shippingAddress?.address &&
      formData.shippingAddress?.city &&
      formData.shippingAddress?.postalCode
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

  const handleProductSelection = (productType: 'ebook' | 'printed') => {
    setGlobalError('');
    onUpdate({ productType });
    scrollToSection(paymentRef, 150);
  };

  const handleShippingChange = (field: string, value: string) => {
    setGlobalError('');
    onUpdate({
      shippingAddress: {
        firstName: formData.shippingAddress?.firstName || '',
        lastName: formData.shippingAddress?.lastName || '',
        address: formData.shippingAddress?.address || '',
        city: formData.shippingAddress?.city || '',
        postalCode: formData.shippingAddress?.postalCode || '',
        ...formData.shippingAddress,
        [field]: value
      }
    });
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

  const validateField = (field: string, value: string, validationType?: 'email' | 'address' | 'city' | 'postalCode') => {
    const isAddressField = ['address', 'city', 'postalCode'].includes(field);
    if (isAddressField && formData.productType !== 'printed') {
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    }

    let validation: { isValid: boolean; error?: string };
    
    switch (validationType) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'address':
        validation = validateAddress(value);
        break;
      case 'city':
        validation = validateCity(value);
        break;
      case 'postalCode':
        validation = validatePostalCode(value);
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

    if (!formData.shippingAddress?.firstName) {
      newErrors.firstName = 'Le prénom est obligatoire';
      isValid = false;
    }

    if (!formData.shippingAddress?.lastName) {
      newErrors.lastName = 'Le nom est obligatoire';
      isValid = false;
    }

    if (formData.productType === 'printed') {
      if (!formData.shippingAddress?.address) {
        newErrors.address = 'L\'adresse est obligatoire';
        isValid = false;
      }
      if (!formData.shippingAddress?.city) {
        newErrors.city = 'La ville est obligatoire';
        isValid = false;
      }
      if (!formData.shippingAddress?.postalCode) {
        newErrors.postalCode = 'Le code postal est obligatoire';
        isValid = false;
      }
    }

    setErrors(newErrors);
    
    if (!isValid) {
      scrollToSection(paymentRef, 150);
      if (formData.productType === 'printed') {
        setGlobalError('Veuillez remplir tous les champs obligatoires (Email, Prénom, Nom, Adresse, Ville, Code postal)');
      } else {
        setGlobalError('Veuillez remplir tous les champs obligatoires (Email, Prénom, Nom)');
      }
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
          <PricingGrid>
            <PricingCard
              title="eBook Numérique"
              price="4,99€"
              features={[
                "Conte personnalisé de 20-30 pages",
                "Illustrations haute qualité",
                "Format PDF optimisé",
                "Téléchargement immédiat",
                "Compatible tous appareils"
              ]}
              isPopular={formData.productType === 'ebook'}
              ctaText="Choisir l'eBook"
              onSelect={() => handleProductSelection('ebook')}
            />
            
            <PricingCard
              title="Livre Relié Premium"
              price="29,99€"
              features={[
                "Conte personnalisé de 20 pages",
                "Illustrations premium",
                "Impression haute qualité",
                "Couverture rigide",
                "Livraison gratuite",
                "eBook inclus"
              ]}
              isPopular={formData.productType === 'printed'}
              ctaText="Choisir le livre"
              onSelect={() => handleProductSelection('printed')}
            />
          </PricingGrid>
        </FormSection>

        <ShippingSection $show={true} ref={paymentRef}>
          <OptionTitle>
            Informations de commande
          </OptionTitle>
          <ShippingGrid>
            <FullWidthField>
              <ValidatedInput
                type="email"
                label="Email"
                value={formData.userEmail || ''}
                onChange={handleEmailChange}
                placeholder="votre@email.com"
                required={true}
                error={errors.userEmail}
                onBlur={() => validateField('userEmail', formData.userEmail || '', 'email')}
              />
            </FullWidthField>
            
            <InputField>
              <ValidatedInput
                label="Prénom"
                value={formData.shippingAddress?.firstName || ''}
                onChange={(value) => handleShippingChange('firstName', value)}
                placeholder="Votre prénom"
                required={true}
                error={errors.firstName}
                onBlur={() => validateField('firstName', formData.shippingAddress?.firstName || '')}
              />
            </InputField>
            
            <InputField>
              <ValidatedInput
                label="Nom"
                value={formData.shippingAddress?.lastName || ''}
                onChange={(value) => handleShippingChange('lastName', value)}
                placeholder="Votre nom"
                required={true}
                error={errors.lastName}
                onBlur={() => validateField('lastName', formData.shippingAddress?.lastName || '')}
              />
            </InputField>
            
            {formData.productType === 'printed' && (
              <>
                <FullWidthField>
                  <ValidatedInput
                    label="Adresse"
                    value={formData.shippingAddress?.address || ''}
                    onChange={(value) => handleShippingChange('address', value)}
                    placeholder="Numéro et nom de rue"
                    required={true}
                    error={errors.address}
                    onBlur={() => validateField('address', formData.shippingAddress?.address || '', 'address')}
                  />
                </FullWidthField>
                
                <InputField>
                  <ValidatedInput
                    label="Ville"
                    value={formData.shippingAddress?.city || ''}
                    onChange={(value) => handleShippingChange('city', value)}
                    placeholder="Votre ville"
                    required={true}
                    error={errors.city}
                    onBlur={() => validateField('city', formData.shippingAddress?.city || '', 'city')}
                  />
                </InputField>
                
                <InputField>
                  <ValidatedInput
                    label="Code postal"
                    value={formData.shippingAddress?.postalCode || ''}
                    onChange={(value) => handleShippingChange('postalCode', value)}
                    placeholder="Code postal"
                    required={true}
                    error={errors.postalCode}
                    onBlur={() => validateField('postalCode', formData.shippingAddress?.postalCode || '', 'postalCode')}
                  />
                </InputField>
              </>
            )}
          </ShippingGrid>
        </ShippingSection>

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
            {isSubmitting ? '⏳ Traitement en cours...' : '✨ Créer le conte de mon enfant'}
          </PayButton>
          
          <p style={{ 
            marginTop: theme.spacing.md, 
            fontSize: theme.fontSizes.xs, 
            color: theme.colors.text.light 
          }}>
            🔒 Paiement sécurisé par Stripe
          </p>
        </PaymentSection>
      </Section>
    </FormContainer>
  );
};
