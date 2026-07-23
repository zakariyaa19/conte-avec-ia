import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatStoryCreator } from '../components/chat-creator/ChatStoryCreator';
import { ApiService } from '../config/api';
import { StoryFormData } from '../types/FormTypes';
import { identifyUser, trackInitiateCheckout, trackViewContent } from '../utils/tiktokPixel';
import { metaTrackViewContent, metaTrackInitiateCheckout, metaTrackLead } from '../utils/metaPixel';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { trackFunnelStep } from '../utils/funnelTracker';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';

export const StoryFormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user, isAuthenticated, isClub, setTokenAndUser } = useAuth();
  const location = useLocation();
  const referralCode = useMemo(() => {
    const ref = new URLSearchParams(location.search).get('ref');
    if (ref) safeLocalStorage.setItem('referralCode', ref);
    return ref || safeLocalStorage.getItem('referralCode') || '';
  }, [location.search]);
  const [clubCredit, setClubCredit] = useState<{ canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null>(null);

  // Chapitres gratuits pour tous les non-Club (max 3). Club = livres complets.
  const viewContentPrice = isClub ? 0 : 0; // Tracking: tous les chapitres sont gratuits

  // Track ViewContent au chargement de la page
  useEffect(() => {
    trackFunnelStep('page_view');
    trackViewContent(
      'product_story_creation',
      'Création de conte personnalisé',
      viewContentPrice,
      'EUR'
    );
    metaTrackViewContent(
      'Création de conte personnalisé',
      'Livre personnalisé enfant',
      viewContentPrice,
      'EUR'
    );
  }, [viewContentPrice]);

  // ── PRELOAD des images du wizard — critique pour la conversion mobile ──
  // Charge toutes les images WebP des étapes suivantes pendant que l'utilisateur
  // est sur l'étape "âge", pour qu'elles soient instantanées aux étapes suivantes.
  useEffect(() => {
    const imagesToPreload = [
      // Thèmes (étape 2)
      '/image/themes/educatif.webp',
      '/image/themes/contes-de-fees.webp',
      '/image/themes/activites.webp',
      '/image/themes/histoires.webp',
      '/image/themes/fetes.webp',
      '/image/themes/famille.webp',
      '/image/themes/personnalise.webp',
      // Âges (étape 1 — première vue)
      '/image/ageenfant/age-0-2.webp',
      '/image/ageenfant/age-3-5.webp',
      '/image/ageenfant/age-6-9.webp',
      '/image/ageenfant/age-10-plus.webp',
      // Occasions (étape 3)
      '/image/occasions/anniversaire.webp',
      '/image/occasions/noel.webp',
      '/image/occasions/paques.webp',
      '/image/occasions/aid.webp',
      // Messages (étape 4)
      '/image/messages/amour.webp',
      '/image/messages/courage.webp',
      '/image/messages/amitie.webp',
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
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
      const token = safeLocalStorage.getItem('userToken');
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
    illustrationStyle: '3d-animation',
    protagonistName: '',
    protagonistAge: '',
    protagonistGender: undefined,
    appearanceMode: undefined,
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

  const handleSubmit = async (overrideData?: Partial<StoryFormData>) => {
    setSubmitError(null);
    // Merge any last-minute data (e.g., cover image from wizard)
    const submitData = overrideData ? { ...formData, ...overrideData } : { ...formData };
    // Inject referral code if present
    if (referralCode) submitData.referralCode = referralCode;

    // Trim email pour éviter les espaces accidentels
    if (submitData.userEmail) submitData.userEmail = submitData.userEmail.trim().toLowerCase();

    if (!submitData.userEmail || !submitData.productType) {
      console.error('Données manquantes pour la soumission');
      setIsSubmitting(false);
      return;
    }

    // Also update the state for consistency
    if (overrideData) setFormData(prev => ({ ...prev, ...overrideData }));

    setIsSubmitting(true);

    try {
      // Fire-and-forget : le tracking ne doit JAMAIS bloquer le paiement
      try {
        trackFunnelStep('form_submitted');
        metaTrackLead(viewContentPrice);
        trackInitiateCheckout(submitData.productType, submitData.userEmail, viewContentPrice);
        metaTrackInitiateCheckout(submitData.productType, viewContentPrice);
        identifyUser(submitData.userEmail);
      } catch { /* tracking failure must never block payment */ }

      const authToken = safeLocalStorage.getItem('userToken') || undefined;

      const orderResponse = await ApiService.createOrder({
        userEmail: submitData.userEmail,
        formData: submitData,
        authToken
      });

      if (!orderResponse.success) {
        if (orderResponse.limitReached) {
          window.location.href = '/club/checkout';
          return;
        }
        throw new Error(orderResponse.message || 'Erreur lors de la création de la commande');
      }

      if (orderResponse.token && orderResponse.user) {
        // Sauvegarder le token AVANT la redirection (synchrone)
        safeLocalStorage.setItem('userToken', orderResponse.token);
        // Double-écriture pour garantir la persistance sur mobile Safari
        try { safeSessionStorage.setItem('userToken_backup', orderResponse.token); } catch {}
        setTokenAndUser(orderResponse.token, orderResponse.user);
      }

      // Club gratuit ou premier livre gratuit : redirection directe vers le livre
      if (orderResponse.isClubFreeOrder || orderResponse.isFirstBookFree) {
        // Meta Pixel: tracker Lead + Purchase pour le livre gratuit
        try {
          metaTrackLead(0, 'EUR');
          // Purchase avec value 0€ pour nourrir l'algorithme Meta Ads
          const { metaTrackPurchase } = await import('../utils/metaPixel');
          await metaTrackPurchase(
            orderResponse.isClubFreeOrder ? 'club' : 'ebook',
            orderResponse.data.id,
            0,
            'EUR'
          );
        } catch { /* tracking failure must never block redirect */ }
        // Délai 500ms pour garantir localStorage persisté sur mobile Safari
        setTimeout(() => {
          window.location.href = `/dashboard/story/${orderResponse.data.id}?new=true`;
        }, 500);
        return;
      }

      // Stripe URL returned inline (single round trip — fast path)
      if (orderResponse.stripeUrl) {
        // Attempt redirect — add a safety net for WebViews that may block it
        window.location.href = orderResponse.stripeUrl;
        // If still here after 3s, the redirect may have failed (WebView issue)
        setTimeout(() => {
          if (document.hasFocus()) {
            // User is still on this page — redirect didn't work
            // Show the URL as a clickable fallback
            const retry = window.confirm(
              'La redirection vers le paiement n\'a pas fonctionné.\n\n' +
              'Appuyez sur OK pour réessayer.'
            );
            if (retry) {
              window.location.replace(orderResponse.stripeUrl!);
            } else {
              setIsSubmitting(false);
            }
          }
        }, 3000);
        return;
      }

      // Si pas de stripeUrl et pas de redirection gratuite,
      // c'est que le backend a créé la commande avec un prix > 0
      // mais la session Stripe inline a échoué → fallback
      if (!orderResponse.stripeUrl && !orderResponse.isFirstBookFree && !orderResponse.isClubFreeOrder) {
        // Commande payante sans Stripe URL : essayer le fallback
        if (formData.purchaseType === 'club' && !orderResponse.clubCreditExhausted) {
          const token = safeLocalStorage.getItem('userToken');
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
        return;
      }

      // Fallback: separate API call (legacy path)
      if (formData.purchaseType === 'club' && !orderResponse.clubCreditExhausted) {
        const token = safeLocalStorage.getItem('userToken');
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
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      try {
        const msg = error?.message || '';
        if (msg.includes('timeout') || msg.includes('AbortError')) {
          errorMessage = 'La requête a pris trop de temps. Vérifiez votre connexion internet et réessayez.';
        } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
          errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez.';
        } else if (msg) {
          errorMessage = msg;
        }
      } catch { /* safety net */ }
      trackFunnelStep('form_submit_error');
      // Remplace l'ancien alert() natif : c'etait le pire endroit possible pour
      // decouvrir une erreur (apres avoir deja decrit l'histoire, attendu
      // l'apercu, donne son email) — desormais affiche inline dans le flow,
      // et on garde le brouillon (cf. ChatStoryCreator.doSubmit) pour reessayer
      // sans tout retaper.
      setSubmitError(errorMessage);
      setIsSubmitting(false);
      throw error;
    }
  };

  /* The wizard is full-screen (position: fixed, inset: 0).
     No site Header/Footer needed — the wizard has its own fixed header. */
  return (
    <>
      <SEOHead
        title="Créer un Livre Personnalisé pour Enfant | Conte sur Mesure avec IA"
        description="Créez facilement un conte personnalisé pour votre enfant en 3 étapes simples. 1er chapitre gratuit, prêt en 5 minutes."
        noindex={true}
      />
      <ChatStoryCreator
        formData={formData}
        onUpdate={handleFormUpdate}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isAuthenticated={isAuthenticated}
        isClub={isClub}
        currentUser={user}
        clubCredit={clubCredit}
        submitError={submitError}
      />
    </>
  );
};
