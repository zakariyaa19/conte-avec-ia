import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { StepIndicator } from '../components/ui/StepIndicator';
import { StoryFormStep1 } from '../components/forms/StoryFormStep1';
import { StoryFormStep2 } from '../components/forms/StoryFormStep2';
import { StoryFormStep3 } from '../components/forms/StoryFormStep3';
import { ApiService } from '../config/api';
import { Button } from '../components/ui/Button';
import { StoryFormData, FormStep } from '../types/FormTypes';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing['2xl']} 0;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} 0;
  }
`;

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['3xl']};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.xl};
  }
`;

const FormTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const FormSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

const StepContent = styled.div`
  background-color: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing['3xl']} 0;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} 0;
    margin-bottom: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.lg};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.coral});
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
`;

const SuccessTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
`;

const SuccessMessage = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 1.125rem;
  margin-bottom: ${theme.spacing.lg};
`;

const OrderDetails = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  margin: ${theme.spacing.lg} 0;
  text-align: left;
  
  p {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.text.primary};
  }
`;

export const StoryFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const formHeaderRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<StoryFormData>>({
    // Étape 1 - Personnalisez votre conte
    ageRange: '',
    generalTheme: '',
    customTheme: '',
    specificSubject: '',
    customSubject: '',
    centralMessage: '',
    customMessage: '',
    illustrationStyle: '',
    
    // Étape 2 - Créons le héros de l'histoire
    protagonistName: '',
    protagonistAge: '',
    protagonistGender: undefined,
    eyeColor: '',
    hairColor: '',
    
    // Langue du conte
    language: '',
    
    // Informations supplémentaires (facultatif)
    hobbies: '',
    favoriteDish: '',
    specialEvents: '',
    
    // Option religieuse (facultatif)
    religion: '',
    customReligion: '',
    
    // Personnage secondaire (optionnel)
    secondaryCharacterName: '',
    secondaryCharacterAge: '',
    
    // Détails personnels
    creatorName: '',
    
    // Étape 3 - Paiement et informations
    userEmail: '',
    productType: 'ebook',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: ''
    }
  });

  const steps: FormStep[] = [
    {
      id: 1,
      title: 'Choix du thème',
      description: 'Personnalisez votre conte',
      isCompleted: currentStep > 1,
      isActive: currentStep === 1
    },
    {
      id: 2,
      title: 'Détails du protagoniste',
      description: 'Créez votre héros',
      isCompleted: currentStep > 2,
      isActive: currentStep === 2
    },
    {
      id: 3,
      title: 'Paiement',
      description: 'Finalisez votre commande',
      isCompleted: false,
      isActive: currentStep === 3
    }
  ];

  const handleFormUpdate = (newData: Partial<StoryFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      // Scroll vers le haut du formulaire
      setTimeout(() => {
        formHeaderRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Scroll vers le haut du formulaire
      setTimeout(() => {
        formHeaderRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!formData.productType) {
      setSubmitError('Veuillez sélectionner un format');
      return;
    }

    // Validation des champs obligatoires
    if (!formData.userEmail) {
      setSubmitError('Veuillez renseigner votre email');
      return;
    }

    // Validation de l'adresse seulement pour les livres physiques
    if (formData.productType === 'printed') {
      if (!formData.shippingAddress?.firstName || !formData.shippingAddress?.lastName) {
        setSubmitError('Veuillez renseigner votre prénom et nom');
        return;
      }

      if (!formData.shippingAddress?.address || !formData.shippingAddress?.city || !formData.shippingAddress?.postalCode) {
        setSubmitError('Veuillez renseigner votre adresse complète');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Créer la commande
      console.log('🔄 Création de la commande avec les données:', formData);
      const orderResponse = await ApiService.createOrder({
        userEmail: formData.userEmail,
        formData: formData
      });

      console.log('✅ Réponse création commande:', orderResponse);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Erreur lors de la création de la commande');
      }

      // 2. Créer la session de paiement Stripe
      console.log('🔄 Création session Stripe pour commande ID:', orderResponse.data.id);
      const paymentResponse = await ApiService.createPaymentSession(orderResponse.data.id);
      
      console.log('✅ Réponse session Stripe:', paymentResponse);
      
      // 3. Rediriger vers Stripe Checkout
      if (paymentResponse.url) {
        console.log('🔄 Redirection vers:', paymentResponse.url);
        window.location.href = paymentResponse.url;
      } else {
        console.error('❌ Pas d\'URL dans la réponse:', paymentResponse);
        throw new Error('URL de paiement non reçue');
      }

    } catch (error: any) {
      console.error('❌ Erreur soumission:', error);
      setSubmitError(error.message || 'Une erreur est survenue lors de la soumission');
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.ageRange && 
               formData.generalTheme && 
               formData.specificSubject && 
               formData.centralMessage && 
               formData.illustrationStyle;
      case 2:
        return formData.protagonistName && 
               formData.protagonistAge && 
               formData.eyeColor && 
               formData.hairColor;
      case 3:
        // Pour l'eBook, seuls l'email et le type de produit sont requis
        if (formData.productType === 'ebook') {
          return formData.productType && formData.userEmail;
        }
        // Pour le livre physique, l'adresse complète est requise
        return formData.productType &&
               formData.userEmail &&
               formData.shippingAddress?.firstName &&
               formData.shippingAddress?.lastName &&
               formData.shippingAddress?.address &&
               formData.shippingAddress?.city &&
               formData.shippingAddress?.postalCode;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StoryFormStep1 
            formData={formData} 
            onUpdate={handleFormUpdate} 
          />
        );
      case 2:
        return (
          <StoryFormStep2 
            formData={formData} 
            onUpdate={handleFormUpdate} 
          />
        );
      case 3:
        return (
          <>
            {!orderSuccess && (
              <StoryFormStep3
                formData={formData}
                onUpdate={handleFormUpdate}
                onSubmit={handleSubmit}
              />
            )}

            {orderSuccess && (
              <SuccessContainer>
                <SuccessIcon>🎉</SuccessIcon>
                <SuccessTitle>Commande créée avec succès !</SuccessTitle>
                <SuccessMessage>
                  Votre conte personnalisé pour <strong>{orderSuccess.protagonistName}</strong> est en cours de préparation.
                </SuccessMessage>
                <OrderDetails>
                  <p><strong>Numéro de commande :</strong> {orderSuccess.id}</p>
                  <p><strong>Produit :</strong> {orderSuccess.productType === 'EBOOK' ? 'eBook numérique' : 'Livre relié'}</p>
                  <p><strong>Prix :</strong> {orderSuccess.price}€</p>
                  <p><strong>Statut :</strong> {orderSuccess.status}</p>
                </OrderDetails>
                <p>Un email de confirmation vous a été envoyé avec tous les détails.</p>
              </SuccessContainer>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
      <FormContainer>
        <FormHeader ref={formHeaderRef}>
          <FormTitle>Créez votre conte personnalisé ✨</FormTitle>
          <FormSubtitle>
            En quelques étapes simples, créez une histoire unique qui fera briller les yeux de votre enfant
          </FormSubtitle>
        </FormHeader>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <StepContent>
          {renderCurrentStep()}
        </StepContent>

        <NavigationButtons>
          <div>
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handlePrevious}
              >
                ← Étape précédente
              </Button>
            )}
          </div>

          <ButtonGroup>
            {currentStep < 3 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Étape suivante →
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={!isStepValid()}
              >
                Finaliser la commande
              </Button>
            )}
          </ButtonGroup>
        </NavigationButtons>
      </FormContainer>
    </MainContent>
    <Footer />
    </PageContainer>
  );
};
