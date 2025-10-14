import React, { useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { SelectionCard } from '../ui/SelectionCard';
import { 
  AGE_RANGES, 
  GENERAL_THEMES, 
  SPECIFIC_SUBJECTS, 
  CENTRAL_MESSAGES, 
  ILLUSTRATION_STYLES,
  StoryFormData 
} from '../../types/FormTypes';

interface StoryFormStep1Props {
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
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const SelectionGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 3}, 1fr);
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${theme.spacing.sm};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${theme.spacing.xs};
  }
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing['3xl']};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xl};
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

export const StoryFormStep1: React.FC<StoryFormStep1Props> = ({ formData, onUpdate }) => {
  const themeRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);

  const scrollToNext = (nextRef: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      nextRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 300);
  };

  const handleSelection = (field: keyof StoryFormData, value: string) => {
    onUpdate({ [field]: value });
    
    // Ne pas faire d'auto-scroll si on sélectionne "custom" car un champ d'input va apparaître
    if (value === 'custom') {
      return;
    }
    
    // Auto-scroll vers le prochain champ seulement si ce n'est pas une option personnalisée
    switch (field) {
      case 'ageRange':
        scrollToNext(themeRef);
        break;
      case 'generalTheme':
        scrollToNext(subjectRef);
        break;
      case 'specificSubject':
        scrollToNext(messageRef);
        break;
      case 'centralMessage':
        scrollToNext(styleRef);
        break;
    }
  };

  return (
    <StepContainer>
      <SectionTitle>Personnalisez votre conte ✨</SectionTitle>
      <SectionDescription>
        Choisissez les éléments qui rendront cette histoire unique et parfaitement adaptée à votre enfant.
      </SectionDescription>

      <FormSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🧒 Pour quel âge ?
        </h4>
        <SelectionGrid $columns={2}>
          {AGE_RANGES.map((range) => (
            <SelectionCard
              key={range.value}
              value={range.value}
              label={range.label}
              description={range.description}
              isSelected={formData.ageRange === range.value}
              onClick={(value) => handleSelection('ageRange', value)}
              size="lg"
            />
          ))}
        </SelectionGrid>
      </FormSection>

      <FormSection ref={themeRef}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🌈 Quel thème général ?
        </h4>
        <SelectionGrid>
          {GENERAL_THEMES.map((theme_item) => (
            <SelectionCard
              key={theme_item.value}
              value={theme_item.value}
              label={theme_item.label}
              icon={theme_item.icon}
              isSelected={formData.generalTheme === theme_item.value}
              onClick={(value) => handleSelection('generalTheme', value)}
            />
          ))}
          <SelectionCard
            value="custom"
            label="Personnalisé"
            icon="✏️"
            isSelected={formData.generalTheme === 'custom'}
            onClick={(value) => handleSelection('generalTheme', value)}
          />
        </SelectionGrid>
        {formData.generalTheme === 'custom' && (
          <CustomInput
            type="text"
            placeholder="Entrez le thème que vous souhaitez"
            value={formData.customTheme || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ customTheme: e.target.value })}
          />
        )}
      </FormSection>

      <FormSection ref={subjectRef}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🪅 Sujet
        </h4>
        <SelectionGrid>
          {SPECIFIC_SUBJECTS.map((subject) => (
            <SelectionCard
              key={subject.value}
              value={subject.value}
              label={subject.label}
              icon={subject.icon}
              isSelected={formData.specificSubject === subject.value}
              onClick={(value) => handleSelection('specificSubject', value)}
            />
          ))}
          <SelectionCard
            value="custom"
            label="Sujet personnalisé"
            icon="✏️"
            isSelected={formData.specificSubject === 'custom'}
            onClick={(value) => handleSelection('specificSubject', value)}
          />
        </SelectionGrid>
        {formData.specificSubject === 'custom' && (
          <CustomInput
            type="text"
            placeholder="Entrez votre sujet souhaité"
            value={formData.customSubject || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ customSubject: e.target.value })}
          />
        )}
      </FormSection>

      <FormSection ref={messageRef}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          💬 Message central
        </h4>
        <SelectionGrid>
          {CENTRAL_MESSAGES.map((message) => (
            <SelectionCard
              key={message.value}
              value={message.value}
              label={message.label}
              icon={message.icon}
              isSelected={formData.centralMessage === message.value}
              onClick={(value) => handleSelection('centralMessage', value)}
            />
          ))}
          <SelectionCard
            value="custom"
            label="Message personnalisé"
            icon="✏️"
            isSelected={formData.centralMessage === 'custom'}
            onClick={(value) => handleSelection('centralMessage', value)}
          />
        </SelectionGrid>
        {formData.centralMessage === 'custom' && (
          <CustomInput
            type="text"
            placeholder="Message central personnalisé"
            value={formData.customMessage || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ customMessage: e.target.value })}
          />
        )}
      </FormSection>

      <FormSection ref={styleRef}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
          🎨 Style d'illustration
        </h4>
        <SelectionGrid>
          {ILLUSTRATION_STYLES.map((style) => (
            <SelectionCard
              key={style.value}
              value={style.value}
              label={style.label}
              icon={style.icon}
              isSelected={formData.illustrationStyle === style.value}
              onClick={(value) => handleSelection('illustrationStyle', value)}
            />
          ))}
        </SelectionGrid>
      </FormSection>
    </StepContainer>
  );
};
