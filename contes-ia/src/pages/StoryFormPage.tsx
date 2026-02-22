import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { UnifiedStoryForm } from '../components/forms/UnifiedStoryForm';
import { ApiService } from '../config/api';
import { StoryFormData } from '../types/FormTypes';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { identifyUser, trackInitiateCheckout, trackViewContent } from '../utils/tiktokPixel';
import { useAuth } from '../contexts/AuthContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
    padding: ${theme.spacing.lg} 0;
  }
`;

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const FormTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['5xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const FormSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const FormContent = styled.div`
  background-color: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.card};
  padding: ${theme.spacing['3xl']} 0;
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.6s ease-out 0.15s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} 0;
    margin-bottom: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.xl};
  }
`;

export const StoryFormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formHeaderRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isClub, setTokenAndUser } = useAuth();
  const [clubCredit, setClubCredit] = useState<{ canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null>(null);
  
  // Track ViewContent au chargement de la page
  useEffect(() => {
    trackViewContent(
      'product_story_creation',
      'Création de conte personnalisé',
      4.99,
      'EUR'
    );
  }, []);

  // Pre-remplir les donnees si l'utilisateur est connecte
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        userEmail: user.email || prev.userEmail,
        firstName: user.firstName || prev.firstName || '',
        lastName: user.lastName || prev.lastName || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Charger le credit Club si l'utilisateur est Club
  useEffect(() => {
    if (isClub) {
      const token = localStorage.getItem('userToken');
      if (token) {
        ApiService.getClubCredit(token)
          .then(res => {
            if (res.success) setClubCredit(res.data);
          })
          .catch(() => {});
      }
    }
  }, [isClub]);
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
    firstName: '',
    lastName: ''
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
      id: 'creation',
      title: 'Creation',
      isCompleted: isChoicesComplete && isProtagonistComplete,
      isActive: !(isChoicesComplete && isProtagonistComplete)
    },
    {
      id: 'preview',
      title: 'Apercu',
      isCompleted: false,
      isActive: isChoicesComplete && isProtagonistComplete
    },
    {
      id: 'payment',
      title: 'Paiement',
      isCompleted: isPaymentComplete,
      isActive: false
    }
  ];

  const handleFormUpdate = (newData: Partial<StoryFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };


  const handleSubmit = async () => {
    if (!formData.userEmail || !formData.productType) {
      console.error('Donnees manquantes pour la soumission');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Track InitiateCheckout
      await trackInitiateCheckout(formData.productType, formData.userEmail);
      await identifyUser(formData.userEmail);

      // Passer le token si connecte
      const authToken = localStorage.getItem('userToken') || undefined;

      const orderResponse = await ApiService.createOrder({
        userEmail: formData.userEmail,
        formData: formData,
        authToken
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Erreur lors de la creation de la commande');
      }

      // Store token if returned (user account created)
      if (orderResponse.token && orderResponse.user) {
        setTokenAndUser(orderResponse.token, orderResponse.user);
      }

      // --- Club gratuit : pas de Stripe, redirection directe ---
      if (orderResponse.isClubFreeOrder) {
        window.location.href = `/success?order_id=${orderResponse.data.id}&club_free=true`;
        return;
      }

      // --- Checkout Club (nouvel abonnement OU membre Club sans credit) ---
      // clubCreditExhausted = true → membre Club actif, credit epuise → paiement unique
      // purchaseType = 'club' sans clubCreditExhausted → nouvel abonnement → checkout subscription
      if (formData.purchaseType === 'club' && !orderResponse.clubCreditExhausted) {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token d\'authentification manquant pour l\'abonnement Club');
        }
        const subResponse = await ApiService.createSubscriptionSession(token, orderResponse.data.id);
        if (subResponse.url) {
          setTimeout(() => { window.location.href = subResponse.url; }, 200);
        } else {
          throw new Error('URL abonnement non recue');
        }
      } else {
        // Paiement unique (eBook ou Club credit epuise)
        const paymentResponse = await ApiService.createPaymentSession(orderResponse.data.id);
        if (paymentResponse.url) {
          setTimeout(() => { window.location.href = paymentResponse.url; }, 200);
        } else {
          throw new Error('URL de paiement non recue');
        }
      }

    } catch (error: any) {
      console.error('Erreur soumission:', error);
      let errorMessage = 'Une erreur est survenue lors de la soumission';
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        errorMessage = 'La requete a pris trop de temps. Veuillez reessayer dans quelques instants.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Probleme de connexion. Verifiez votre connexion internet et reessayez.';
      } else if (error.message) {
        errorMessage = error.message;
      }
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
          <FormTitle>Creez un conte unique pour votre enfant</FormTitle>
          <FormSubtitle>
            Quelques choix simples et decouvrez la couverture personnalisee de votre histoire
          </FormSubtitle>
        </FormHeader>

        <ProgressIndicator steps={progressSteps} />

        <FormContent>
          <UnifiedStoryForm
            formData={formData}
            onUpdate={handleFormUpdate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
            isClub={isClub}
            currentUser={user}
            clubCredit={clubCredit}
          />
        </FormContent>
      </FormContainer>
    </MainContent>
    <Footer />
    </PageContainer>
  );
};
