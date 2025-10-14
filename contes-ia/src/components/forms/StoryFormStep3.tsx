import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { PricingCard } from '../ui/PricingCard';
import { ValidatedInput } from '../ui/ValidatedInput';
import { StoryFormData } from '../../types/FormTypes';
import { validateEmail, validateAddress, validateCity, validatePostalCode, validateRequired } from '../../utils/validation';

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

const SummarySection = styled.div`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.xl};
  }
`;

const SummaryTitle = styled.h4`
  color: ${theme.colors.text.primary};
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
  background-color: ${theme.colors.background.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
  }
`;

const SummaryLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  color: ${theme.colors.text.primary};
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

  const handleProductSelection = (productType: 'ebook' | 'printed') => {
    setGlobalError(''); // Nettoyer l'erreur globale lors du changement de format
    onUpdate({ productType });
  };

  const handleShippingChange = (field: string, value: string) => {
    setGlobalError(''); // Nettoyer l'erreur globale lors de la saisie
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    // Pour les champs d'adresse, ne valider que si le livre relié est sélectionné
    const isAddressField = ['address', 'city', 'postalCode'].includes(field);
    if (isAddressField && formData.productType !== 'printed') {
      // Effacer l'erreur si elle existe et ne pas valider
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

  const needsShipping = formData.productType === 'printed';

  // Validation complète avant soumission
  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    // Validation email (obligatoire pour tous)
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

    // Validation prénom et nom (obligatoires pour tous)
    if (!formData.shippingAddress?.firstName) {
      newErrors.firstName = 'Le prénom est obligatoire';
      isValid = false;
    }

    if (!formData.shippingAddress?.lastName) {
      newErrors.lastName = 'Le nom est obligatoire';
      isValid = false;
    }

    // Validation adresse (obligatoire uniquement pour livre relié)
    if (formData.productType === 'printed') {
      if (!formData.shippingAddress?.address) {
        newErrors.address = 'L\'adresse est obligatoire';
        isValid = false;
      } else {
        const addressValidation = validateAddress(formData.shippingAddress.address);
        if (!addressValidation.isValid) {
          newErrors.address = addressValidation.error || 'Adresse invalide';
          isValid = false;
        }
      }

      if (!formData.shippingAddress?.city) {
        newErrors.city = 'La ville est obligatoire';
        isValid = false;
      } else {
        const cityValidation = validateCity(formData.shippingAddress.city);
        if (!cityValidation.isValid) {
          newErrors.city = cityValidation.error || 'Ville invalide';
          isValid = false;
        }
      }

      if (!formData.shippingAddress?.postalCode) {
        newErrors.postalCode = 'Le code postal est obligatoire';
        isValid = false;
      } else {
        const postalValidation = validatePostalCode(formData.shippingAddress.postalCode);
        if (!postalValidation.isValid) {
          newErrors.postalCode = postalValidation.error || 'Code postal invalide';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = () => {
    setGlobalError(''); // Réinitialiser l'erreur globale
    if (validateForm()) {
      onSubmit();
    } else {
      // Définir un message d'erreur global selon le format
      if (formData.productType === 'printed') {
        setGlobalError('Veuillez remplir tous les champs obligatoires (Email, Prénom, Nom, Adresse, Ville, Code postal)');
      } else {
        setGlobalError('Veuillez remplir tous les champs obligatoires (Email, Prénom, Nom)');
      }
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
          {formData.secondaryCharacterName && (
            <SummaryItem>
              <SummaryLabel>Personnage secondaire</SummaryLabel>
              <SummaryValue>{formData.secondaryCharacterName}</SummaryValue>
            </SummaryItem>
          )}
        </SummaryGrid>
      </SummarySection>

      <PricingSection>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary, textAlign: 'center' }}>
          Choisissez votre format
        </h4>
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
            price="19,99€"
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
      </PricingSection>

      {/* Section informations obligatoires pour tous */}
      <ShippingSection $show={true}>
        <h4 style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.primary }}>
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
          
          {/* Champs d'adresse uniquement pour le livre relié */}
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
          {formData.productType === 'ebook' ? 'Payer 4,99€' : 
           formData.productType === 'printed' ? 'Payer 19,99€' : 
           'Choisir un format'}
        </Button>
        <p style={{ 
          marginTop: theme.spacing.md, 
          fontSize: theme.fontSizes.xs, 
          color: theme.colors.text.light 
        }}>
          🔒 Paiement sécurisé par Stripe
        </p>
      </ActionSection>
    </StepContainer>
  );
};
