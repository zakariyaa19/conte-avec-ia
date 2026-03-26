import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { PricingCard } from '../ui/PricingCard';
import { ValidatedInput } from '../ui/ValidatedInput';
import { StoryFormData } from '../../types/FormTypes';
import { validateEmail, validateRequired } from '../../utils/validation';

interface StoryFormStep3Props {
  formData: Partial<StoryFormData>;
  onUpdate: (data: Partial<StoryFormData>) => void;
  onSubmit: () => void;
}

const StepContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.md};
  }
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const SummarySection = styled.div`
  background-color: var(--bg-secondary);
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.xl};
  }
`;

const SummaryTitle = styled.h4`
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.lg};
  font-family: ${theme.fonts.heading};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.fontSizes.base};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${theme.spacing.sm};
  }
`;

const SummaryItem = styled.div`
  background-color: var(--bg-card);
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
  }
`;

const SummaryLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  color: var(--text-primary);
  font-weight: 500;
`;

const PricingSection = styled.div`
  margin-bottom: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xl};
  }
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
  background-color: var(--bg-secondary);
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

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
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
    color: var(--text-light);
  }
`;

const FullWidthField = styled(InputField)`
  grid-column: 1 / -1;
`;

const ActionSection = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
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

const getDisplayValue = (key: string, value: string) => {
  const displayMap: { [key: string]: { [value: string]: string } } = {
    ageRange: {
      '0-2': '0-2 ans',
      '3-5': '3-5 ans',
      '6-9': '6-9 ans',
      '10+': '10+ ans'
    },
    generalTheme: {
      'educational': 'Éducatif',
      'fairy-tales': 'Contes de fées',
      'activities': 'Activités',
      'stories': 'Histoires',
      'celebrations': 'Fêtes',
      'family': 'Famille'
    },
    eyeColor: {
      'brown': 'Marron',
      'blue': 'Bleu',
      'green': 'Vert',
      'hazel': 'Noisette',
      'gray': 'Gris',
      'amber': 'Ambre'
    },
    hairColor: {
      'brown': 'Châtain',
      'blonde': 'Blond',
      'black': 'Noir',
      'red': 'Roux',
      'auburn': 'Auburn',
      'gray': 'Gris'
    },
    skinColor: {
      'light': 'Clair',
      'medium': 'Moyen',
      'olive': 'Mat',
      'dark': 'Foncé'
    }
  };
  
  return displayMap[key]?.[value] || value;
};

export const StoryFormStep3: React.FC<StoryFormStep3Props> = ({ formData, onUpdate, onSubmit }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string>('');

  // S'assurer que l'eBook est sélectionné par défaut
  React.useEffect(() => {
    if (!formData.productType) {
      onUpdate({ productType: 'ebook' });
    }
  }, [formData.productType, onUpdate]);

  // Nettoyer les erreurs d'adresse quand on passe à l'eBook
  React.useEffect(() => {
    if (formData.productType === 'ebook') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.address;
        delete newErrors.city;
        delete newErrors.postalCode;
        return newErrors;
      });
    }
  }, [formData.productType]);

  const handleProductSelection = () => {
    setGlobalError('');
    onUpdate({ productType: 'ebook' });
  };

  const handleEmailChange = (value: string) => {
    setGlobalError(''); // Nettoyer l'erreur globale lors de la saisie
    onUpdate({ userEmail: value });
    // Clear error when user starts typing
    if (errors.userEmail) {
      setErrors(prev => ({ ...prev, userEmail: '' }));
    }
  };

  const validateField = (field: string, value: string, validationType?: 'email' | 'address' | 'city' | 'postalCode') => {
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

  // Validation complète avant soumission
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

    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est obligatoire';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est obligatoire';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = () => {
    setGlobalError(''); // Réinitialiser l'erreur globale
    if (validateForm()) {
      onSubmit();
    } else {
      setGlobalError('Veuillez remplir tous les champs obligatoires (Email, Prénom, Nom)');
    }
  };

  return (
    <StepContainer>
      <SectionTitle>Récapitulatif et commande 📦</SectionTitle>
      <SectionDescription>
        Vérifiez les détails de votre conte personnalisé et choisissez votre format préféré.
      </SectionDescription>

      <SummarySection>
        <SummaryTitle>Votre conte personnalisé</SummaryTitle>
        <SummaryGrid>
          {formData.ageRange && (
            <SummaryItem>
              <SummaryLabel>Tranche d'âge</SummaryLabel>
              <SummaryValue>{getDisplayValue('ageRange', formData.ageRange)}</SummaryValue>
            </SummaryItem>
          )}
          {formData.generalTheme && (
            <SummaryItem>
              <SummaryLabel>Thème</SummaryLabel>
              <SummaryValue>{getDisplayValue('generalTheme', formData.generalTheme)}</SummaryValue>
            </SummaryItem>
          )}
          {formData.protagonistName && (
            <SummaryItem>
              <SummaryLabel>Héros/Héroïne</SummaryLabel>
              <SummaryValue>{formData.protagonistName}</SummaryValue>
            </SummaryItem>
          )}
          {formData.protagonistAge && (
            <SummaryItem>
              <SummaryLabel>Âge du protagoniste</SummaryLabel>
              <SummaryValue>{formData.protagonistAge}</SummaryValue>
            </SummaryItem>
          )}
          {formData.eyeColor && (
            <SummaryItem>
              <SummaryLabel>Couleur des yeux</SummaryLabel>
              <SummaryValue>{getDisplayValue('eyeColor', formData.eyeColor)}</SummaryValue>
            </SummaryItem>
          )}
          {formData.hairColor && (
            <SummaryItem>
              <SummaryLabel>Couleur des cheveux</SummaryLabel>
              <SummaryValue>{getDisplayValue('hairColor', formData.hairColor)}</SummaryValue>
            </SummaryItem>
          )}
          {formData.skinColor && (
            <SummaryItem>
              <SummaryLabel>Couleur de la peau</SummaryLabel>
              <SummaryValue>{getDisplayValue('skinColor', formData.skinColor)}</SummaryValue>
            </SummaryItem>
          )}
          {formData.secondaryCharacterName && (
            <SummaryItem>
              <SummaryLabel>Personnage secondaire</SummaryLabel>
              <SummaryValue>{formData.secondaryCharacterName}</SummaryValue>
            </SummaryItem>
          )}
        </SummaryGrid>
      </SummarySection>

      <PricingSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: 'var(--text-primary)', textAlign: 'center' }}>
          Choisissez votre format
        </h4>
        <PricingGrid>
          <PricingCard
            title="eBook Numerique"
            price="4,99€"
            features={[
              "Conte personnalise de 20-30 pages",
              "Illustrations haute qualité",
              "Format PDF optimisé",
              "Téléchargement immédiat",
              "Compatible tous appareils"
            ]}
            isPopular={formData.productType === 'ebook'}
            ctaText="Choisir l'eBook"
            onSelect={() => handleProductSelection()}
          />
        </PricingGrid>
      </PricingSection>

      {/* Section informations obligatoires pour tous */}
      <ShippingSection $show={true}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: 'var(--text-primary)' }}>
          Informations de commande
        </h4>
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
              value={formData.firstName || ''}
              onChange={(value) => { onUpdate({ firstName: value }); if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' })); }}
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
              onChange={(value) => { onUpdate({ lastName: value }); if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' })); }}
              placeholder="Votre nom"
              required={true}
              error={errors.lastName}
              onBlur={() => validateField('lastName', formData.lastName || '')}
            />
          </InputField>
        </ShippingGrid>
      </ShippingSection>

      <ActionSection>
        {globalError && (
          <ErrorMessage>
            {globalError}
          </ErrorMessage>
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={handleFormSubmit}
          disabled={!formData.productType}
        >
          {formData.productType === 'ebook' ? 'Payer 4,99€' : 'Choisir un format'}
        </Button>
        <p style={{ 
          marginTop: theme.spacing.md, 
          fontSize: theme.fontSizes.xs, 
          color: 'var(--text-light)' 
        }}>
          🔒 Paiement sécurisé par Stripe
        </p>
      </ActionSection>
    </StepContainer>
  );
};
