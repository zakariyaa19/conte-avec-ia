import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { UnifiedStoryForm } from '../components/forms/UnifiedStoryForm';
import { ApiService } from '../config/api';
import { StoryFormData } from '../types/FormTypes';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { identifyUser, trackInitiateCheckout, trackViewContent } from '../utils/tiktokPixel';

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

const FormContent = styled.div`
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

export const StoryFormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formHeaderRef = useRef<HTMLDivElement>(null);
  
  // Track ViewContent au chargement de la page
  useEffect(() => {
    // trackViewContent utilise maintenant waitForTTQ en interne (polling jusqu'à 5s)
    trackViewContent(
      'product_story_creation',
      'Création de conte personnalisé',
      4.99, // Prix minimum (ebook)
      'EUR'
    );
  }, []);
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
    language: 'french',
    
    // Informations supplémentaires (facultatif)
    hobbies: '',
    favoriteDish: '',
    specialEvents: '',
    
    // Option religieuse (facultatif)
    religion: '',
    customReligion: '',
    
    // Personnages secondaires (jusqu'à 5)
    secondaryCharacters: [],
    
    // Anciens champs (rétrocompatibilité)
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

  // SEO optimisé pour la page de création de conte
  useEffect(() => {
    document.title = 'Créer un Livre Personnalisé pour Enfant | Conte sur Mesure avec IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Créez facilement un conte personnalisé pour votre enfant en 3 étapes simples. Choisissez le thème, personnalisez le héros avec photo et recevez votre livre unique généré par IA.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Créez facilement un conte personnalisé pour votre enfant en 3 étapes simples. Choisissez le thème, personnalisez le héros avec photo et recevez votre livre unique généré par IA.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés pour la création de conte
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'créer un livre personnalisé, histoire personnalisée pour enfant, conte sur mesure pour enfant, livre enfant sur mesure, conte personnalisé avec IA, créer une histoire personnalisée, comment créer un livre personnalisé pour mon enfant, livre personnalisé avec photo');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);

  // Déterminer les étapes complétées pour l'indicateur de progression
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

  const isPaymentComplete = false; // Jamais complété avant soumission

  const progressSteps = [
    {
      id: 'choices',
      title: 'Choix du conte',
      isCompleted: isChoicesComplete,
      isActive: !isChoicesComplete
    },
    {
      id: 'protagonist',
      title: 'Héros',
      isCompleted: isProtagonistComplete,
      isActive: isChoicesComplete && !isProtagonistComplete
    },
    {
      id: 'options',
      title: 'Options',
      isCompleted: isProtagonistComplete,
      isActive: isProtagonistComplete && !isPaymentComplete
    },
    {
      id: 'payment',
      title: 'Paiement',
      isCompleted: isPaymentComplete,
      isActive: isProtagonistComplete
    }
  ];

  const handleFormUpdate = (newData: Partial<StoryFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };


  const handleSubmit = async () => {
    // La validation est maintenant gérée dans UnifiedStoryForm
    // Vérification de sécurité finale
    if (!formData.userEmail || !formData.productType) {
      console.error('❌ Données manquantes pour la soumission');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Track InitiateCheckout AVANT toute requête (CRITIQUE pour production)
      console.log('🎯 TikTok: Déclenchement InitiateCheckout AVANT redirection...');
      await trackInitiateCheckout(formData.productType, formData.userEmail);
      console.log('✅ TikTok: InitiateCheckout envoyé avec succès');
      
      // 2. Identifier l'utilisateur avec TikTok Pixel
      await identifyUser(formData.userEmail);

      // 3. Créer la commande
      console.log('🔄 Création de la commande avec les données:', formData);
      const orderResponse = await ApiService.createOrder({
        userEmail: formData.userEmail,
        formData: formData
      });

      console.log('✅ Réponse création commande:', orderResponse);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Erreur lors de la création de la commande');
      }

      // 4. Créer la session de paiement Stripe
      console.log('🔄 Création session Stripe pour commande ID:', orderResponse.data.id);
      const paymentResponse = await ApiService.createPaymentSession(orderResponse.data.id);
      
      console.log('✅ Réponse session Stripe:', paymentResponse);

      // 5. Rediriger vers Stripe Checkout
      if (paymentResponse.url) {
        console.log('🔄 Redirection vers Stripe dans 200ms...');
        // Délai de sécurité supplémentaire pour garantir l'envoi
        setTimeout(() => {
          window.location.href = paymentResponse.url;
        }, 200);
      } else {
        console.error('❌ Pas d\'URL dans la réponse:', paymentResponse);
        throw new Error('URL de paiement non reçue');
      }

    } catch (error: any) {
      console.error('❌ Erreur soumission:', error);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Une erreur est survenue lors de la soumission';
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        errorMessage = 'La requête a pris trop de temps. Veuillez réessayer dans quelques instants.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Afficher l'erreur dans la console pour debug
      alert(errorMessage);
      setIsSubmitting(false);
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
            Créez une histoire unique en quelques clics - chaque choix débloque automatiquement la suite
          </FormSubtitle>
        </FormHeader>

        <ProgressIndicator steps={progressSteps} />

        <FormContent>
          <UnifiedStoryForm
            formData={formData}
            onUpdate={handleFormUpdate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </FormContent>
      </FormContainer>
    </MainContent>
    <Footer />
    </PageContainer>
  );
};
