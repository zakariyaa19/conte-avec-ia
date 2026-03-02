import React, { useState, useEffect } from 'react';
import { StoryWizard } from '../components/wizard/StoryWizard';
import { ApiService } from '../config/api';
import { StoryFormData } from '../types/FormTypes';
import { identifyUser, trackInitiateCheckout, trackViewContent } from '../utils/tiktokPixel';
import { metaTrackViewContent, metaTrackInitiateCheckout } from '../utils/metaPixel';
import { useAuth } from '../contexts/AuthContext';

export const StoryFormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    metaTrackViewContent(
      'Création de conte personnalisé',
      'Livre personnalisé enfant',
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
    ageRange: '',
    generalTheme: '',
    customTheme: '',
    specificSubject: '',
    customSubject: '',
    centralMessage: '',
    customMessage: '',
    illustrationStyle: '',
    protagonistName: '',
    protagonistAge: '',
    protagonistGender: undefined,
    eyeColor: '',
    hairColor: '',
    skinColor: '',
    language: 'french',
    hobbies: '',
    favoriteDish: '',
    specialEvents: '',
    religion: '',
    customReligion: '',
    secondaryCharacters: [],
    secondaryCharacterName: '',
    secondaryCharacterAge: '',
    creatorName: '',
    userEmail: '',
    productType: 'ebook',
    firstName: '',
    lastName: ''
  });

  // SEO
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

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'créer un livre personnalisé, histoire personnalisée pour enfant, conte sur mesure pour enfant, livre enfant sur mesure, conte personnalisé avec IA, créer une histoire personnalisée, comment créer un livre personnalisé pour mon enfant, livre personnalisé avec photo');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);

  const handleFormUpdate = (newData: Partial<StoryFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    if (!formData.userEmail || !formData.productType) {
      console.error('Données manquantes pour la soumission');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Fire-and-forget : le tracking ne doit pas bloquer le paiement
      trackInitiateCheckout(formData.productType, formData.userEmail);
      metaTrackInitiateCheckout(formData.productType);
      identifyUser(formData.userEmail);

      const authToken = localStorage.getItem('userToken') || undefined;

      // Extraire le cover base64 (2-4 MB) pour ne pas l'envoyer dans le chemin critique
      const { coverImageBase64, ...formDataWithoutCover } = formData;

      const orderResponse = await ApiService.createOrder({
        userEmail: formData.userEmail,
        formData: formDataWithoutCover,
        authToken
      });

      // Sauvegarder le cover en background (fire-and-forget, ne bloque pas Stripe)
      if (coverImageBase64 && orderResponse.success) {
        ApiService.saveCoverImage(orderResponse.data.id, coverImageBase64, formData.coverTitle).catch(() => {});
      }

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Erreur lors de la création de la commande');
      }

      if (orderResponse.token && orderResponse.user) {
        setTokenAndUser(orderResponse.token, orderResponse.user);
      }

      // Club gratuit : pas de Stripe, redirection directe
      if (orderResponse.isClubFreeOrder) {
        window.location.href = `/success?order_id=${orderResponse.data.id}&club_free=true`;
        return;
      }

      // Stripe URL returned inline (single round trip — fast path)
      if (orderResponse.stripeUrl) {
        window.location.href = orderResponse.stripeUrl;
        return;
      }

      // Fallback: separate API call (should not happen normally)
      if (formData.purchaseType === 'club' && !orderResponse.clubCreditExhausted) {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token d\'authentification manquant pour l\'abonnement Club');
        }
        const subResponse = await ApiService.createSubscriptionSession(token, orderResponse.data.id);
        if (subResponse.url) {
          window.location.href = subResponse.url;
        } else {
          throw new Error('URL abonnement non recue');
        }
      } else {
        const paymentResponse = await ApiService.createPaymentSession(orderResponse.data.id);
        if (paymentResponse.url) {
          window.location.href = paymentResponse.url;
        } else {
          throw new Error('URL de paiement non recue');
        }
      }

    } catch (error: any) {
      console.error('Erreur soumission:', error);
      let errorMessage = 'Une erreur est survenue lors de la soumission.';
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        errorMessage = 'La requête a pris trop de temps. Veuillez réessayer dans quelques instants.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  /* The wizard is full-screen (position: fixed, inset: 0).
     No site Header/Footer needed — the wizard has its own fixed header. */
  return (
    <StoryWizard
      formData={formData}
      onUpdate={handleFormUpdate}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isAuthenticated={isAuthenticated}
      isClub={isClub}
      currentUser={user}
      clubCredit={clubCredit}
    />
  );
};
