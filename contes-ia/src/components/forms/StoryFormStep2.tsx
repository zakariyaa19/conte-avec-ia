import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { SelectionCard } from '../ui/SelectionCard';
import { Button } from '../ui/Button';
import { ValidatedInput } from '../ui/ValidatedInput';
import { AgeSelector } from '../ui/AgeSelector';
import { EYE_COLORS, HAIR_COLORS, LANGUAGES, RELIGIONS, GENDERS, StoryFormData } from '../../types/FormTypes';
import { validateRequired } from '../../utils/validation';

interface StoryFormStep2Props {
  formData: Partial<StoryFormData>;
  onUpdate: (data: Partial<StoryFormData>) => void;
}

const StepContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.md};
  }
`;

const SectionDescription = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xl};
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

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid #E5E5E5;
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: ${theme.colors.accent.coral};
    outline: none;
  }
  
  &::placeholder {
    color: ${theme.colors.text.light};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.sm};
  }
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

const SecondaryCharacterSection = styled.div`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.xl};
`;

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.md};
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

export const StoryFormStep2: React.FC<StoryFormStep2Props> = ({ formData, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showReligionSection, setShowReligionSection] = useState<boolean>(!!formData.religion);
  
  // Références pour l'auto-scroll
  const genderRef = useRef<HTMLDivElement>(null);
  const eyeColorRef = useRef<HTMLDivElement>(null);
  const hairColorRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const scrollToNext = (nextRef: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      nextRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 300);
  };

  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: keyof StoryFormData, value: string, isRequired = false) => {
    if (isRequired) {
      const validation = validateRequired(value, field as string);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: validation.error || '' }));
        return false;
      }
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const handleColorSelection = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    
    // Auto-scroll vers le prochain champ
    switch (field) {
      case 'protagonistGender':
        scrollToNext(eyeColorRef);
        break;
      case 'eyeColor':
        scrollToNext(hairColorRef);
        break;
      case 'hairColor':
        scrollToNext(languageRef);
        break;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdate({ photo: file });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <StepContainer>
      <SectionTitle>Créons le héros de l'histoire 👦👧</SectionTitle>
      <SectionDescription>
        Donnez vie au personnage principal en nous parlant de lui. Plus vous nous en direz, plus l'histoire sera personnalisée !
      </SectionDescription>

      <FormSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🧍 Informations du protagoniste
        </h4>
        
        <InputGroup>
          <InputField>
            <ValidatedInput
              label="Prénom du héros/héroïne *"
              value={formData.protagonistName || ''}
              onChange={(value) => handleInputChange('protagonistName', value)}
              placeholder="Ex: Emma, Lucas..."
              required={true}
              error={errors.protagonistName}
              onBlur={() => validateField('protagonistName', formData.protagonistName || '', true)}
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
          <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
            Sexe *
          </h4>
          <SelectionGrid>
            {GENDERS.map((gender) => (
              <SelectionCard
                key={gender.value}
                value={gender.value}
                label={gender.label}
                icon={gender.icon}
                isSelected={formData.protagonistGender === gender.value}
                onClick={(value) => handleColorSelection('protagonistGender', value)}
              />
            ))}
          </SelectionGrid>
        </FormSection>
      </FormSection>

      <FormSection ref={eyeColorRef}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          Couleur des yeux *
        </h4>
        <ColorGrid>
          {EYE_COLORS.map((eyeColor) => (
            <ColorOption
              key={eyeColor.value}
              color={eyeColor.color}
              $isSelected={formData.eyeColor === eyeColor.value}
              onClick={() => handleColorSelection('eyeColor', eyeColor.value)}
            >
              <ColorCircle color={eyeColor.color} />
              <ColorLabel>{eyeColor.label}</ColorLabel>
            </ColorOption>
          ))}
        </ColorGrid>
      </FormSection>

      <FormSection ref={hairColorRef}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          Couleur des cheveux *
        </h4>
        <ColorGrid>
          {HAIR_COLORS.map((hairColor) => (
            <ColorOption
              key={hairColor.value}
              color={hairColor.color}
              $isSelected={formData.hairColor === hairColor.value}
              onClick={() => handleColorSelection('hairColor', hairColor.value)}
            >
              <ColorCircle color={hairColor.color} />
              <ColorLabel>{hairColor.label}</ColorLabel>
            </ColorOption>
          ))}
        </ColorGrid>
      </FormSection>

      <FormSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          Photo du protagoniste (optionnel)
        </h4>
        <PhotoUploadSection>
          <PhotoUploadText>
            📸 Ajoutez une photo pour que notre IA puisse créer des illustrations encore plus ressemblantes !
          </PhotoUploadText>
          <Button variant="outline" onClick={triggerFileUpload}>
            {formData.photo ? `Photo sélectionnée: ${formData.photo.name}` : 'Choisir une photo'}
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
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🌍 Langue du conte
        </h4>
        <p style={{ color: theme.colors.text.light, marginBottom: theme.spacing.lg, fontSize: theme.fontSizes.sm }}>
          Dans quelle langue le livre doit-il être écrit ?
        </p>
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

      <FormSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          💡 Informations supplémentaires sur le personnage principal (facultatif)
        </h4>
        
        <InputField style={{ marginBottom: theme.spacing.lg }}>
          <Label>Loisirs / Centres d'intérêt</Label>
          <TextArea
            placeholder="Ex. : dessin, vélo, lecture..."
            value={formData.hobbies || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('hobbies', e.target.value)}
          />
        </InputField>

        <InputField style={{ marginBottom: theme.spacing.lg }}>
          <Label>Plat préféré</Label>
          <CustomInput
            type="text"
            placeholder="Ex. : pizza, glace, pâtes..."
            value={formData.favoriteDish || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('favoriteDish', e.target.value)}
          />
        </InputField>

        <InputField style={{ marginBottom: theme.spacing.lg }}>
          <Label>Événements particuliers à inclure</Label>
          <TextArea
            placeholder="Décrivez des événements spéciaux à intégrer dans l'histoire..."
            value={formData.specialEvents || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('specialEvents', e.target.value)}
          />
        </InputField>
      </FormSection>

      <FormSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🕊️ Option additionnelle : dimension religieuse (non obligatoire)
        </h4>
        
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customReligion', e.target.value)}
              />
            )}
          </>
        )}
      </FormSection>

      <SecondaryCharacterSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🧸 Personnage secondaire (optionnel)
        </h4>
        
        <InputGroup>
          <InputField>
            <ValidatedInput
              label="Prénom du personnage secondaire"
              value={formData.secondaryCharacterName || ''}
              onChange={(value) => handleInputChange('secondaryCharacterName', value)}
              placeholder="Ex: Max, Luna, Minou..."
              required={false}
            />
          </InputField>
          
          <InputField>
            <ValidatedInput
              label="Âge ou type (ex : 6 ans, chat, chien…)"
              value={formData.secondaryCharacterAge || ''}
              onChange={(value) => handleInputChange('secondaryCharacterAge', value)}
              placeholder="Ex: 6 ans, chat, chien..."
              required={false}
            />
          </InputField>
        </InputGroup>
      </SecondaryCharacterSection>

      <FormSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🧑‍🎨 Vos détails personnels
        </h4>
        <p style={{ color: theme.colors.text.light, marginBottom: theme.spacing.lg, fontSize: theme.fontSizes.sm }}>
          Ajoutez une touche unique en mentionnant le créateur du livre.
        </p>
        
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
    </StepContainer>
  );
};
