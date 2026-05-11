import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ApiService } from '../../config/api';
import { getImageUrl } from '../../config/constants';
import { trackPaywallEvent } from '../../utils/paywallTracking';

/**
 * 6.1 devbook — Stripe Elements inline (pas de redirection)
 * L'utilisateur paie 2,99€ sans quitter le reader.
 * Apple Pay / Google Pay / CB gerees par PaymentElement (automatic_payment_methods cote backend).
 */

interface InlineCheckoutProps {
  orderId: string;
  protagonistName: string;
  coverImageUrl?: string | null;
  onSuccess: () => void;
  onClose: () => void;
}

// Singleton Stripe (charge une fois, reutilise)
let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('[InlineCheckout] REACT_APP_STRIPE_PUBLISHABLE_KEY manquante');
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
}

/* ═══════════ STYLES ═══════════ */
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 11000;
  background: rgba(10, 8, 30, 0.92);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.25s ease;
`;

const Card = styled.div`
  width: 100%; max-width: 420px; max-height: 92vh; overflow-y: auto;
  background: linear-gradient(145deg, #1a1040, #2d1b69);
  border-radius: 22px; padding: 24px 22px; color: white;
  box-shadow: 0 24px 80px rgba(0,0,0,0.55);
  animation: ${slideUp} 0.3s ease both;
`;

const CloseBtn = styled.button`
  position: absolute; top: 14px; right: 14px;
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.35); color: rgba(255,255,255,0.8);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  &:active { transform: scale(0.92); }
`;

const Recap = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 14px; margin: 0 0 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
`;
const RecapCover = styled.img`
  width: 52px; height: 70px; object-fit: cover; border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  flex-shrink: 0;
`;
const RecapText = styled.div`
  flex: 1; min-width: 0;
  & .title { font-size: 13px; font-weight: 700; margin: 0 0 4px; line-height: 1.3; }
  & .subtitle { font-size: 11px; color: rgba(255,255,255,0.55); margin: 0; line-height: 1.4; }
`;
const RecapPrice = styled.div`
  font-size: 20px; font-weight: 800; color: white;
  white-space: nowrap;
`;

const PayBtn = styled.button<{ $disabled?: boolean }>`
  width: 100%; padding: 16px 20px; border-radius: 14px; border: none;
  background: ${p => p.$disabled
    ? 'rgba(255,107,107,0.35)'
    : 'linear-gradient(135deg, #FF6B6B, #FF8E53)'};
  color: white; font-size: 16px; font-weight: 800; cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  margin-top: 14px;
  transition: transform 0.15s;
  &:active { transform: ${p => p.$disabled ? 'none' : 'scale(0.97)'}; }
`;

const ErrorMsg = styled.p`
  color: #fca5a5; font-size: 13px; margin: 10px 0 0; text-align: center;
`;

const TrustRow = styled.div`
  display: flex; gap: 10px; justify-content: center;
  margin-top: 14px; font-size: 10px; color: rgba(255,255,255,0.5);
  & > span { display: inline-flex; align-items: center; gap: 4px; }
`;

const Loader = styled.div`
  min-height: 180px; display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.6); font-size: 13px;
`;

/* ═══════════ INNER FORM (needs to be inside <Elements>) ═══════════ */
const PaymentForm: React.FC<{
  protagonistName: string;
  orderId: string;
  onSuccess: () => void;
}> = ({ protagonistName, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    // return_url est requis par Stripe mais on intercepte avant redirection
    // via redirect: 'if_required' — la majorite des CB passent sans 3DS
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href, // fallback 3DS
      },
    });

    if (result.error) {
      setError(result.error.message || 'Le paiement a echoue. Reessayez.');
      setSubmitting(false);
      return;
    }
    // Succes (pas de 3DS) ou redirection effectuee par Stripe (3DS)
    if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      trackPaywallEvent('paywall_payment_success', {
        orderId,
        variant: 'inline',
        protagonistName,
      });
      onSuccess();
    }
    // Note : si 3DS, la page redirige vers return_url et on revient avec ?payment_intent=... ;
    // StoryDetailPage detecte deja ?completed=true via l'autre flow — ici on pourrait ajouter
    // un check au mount, mais le webhook backend traitera l'order independamment.
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      <PayBtn type="submit" $disabled={!stripe || submitting}>
        {submitting ? 'Paiement en cours...' : `Offrir la suite a ${protagonistName} — 2,99€`}
      </PayBtn>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <TrustRow>
        <span>&#10003; Stripe securise</span>
        <span>&#10003; Satisfait ou rembourse</span>
        <span>&#10003; Instantane</span>
      </TrustRow>
    </form>
  );
};

/* ═══════════ WRAPPER COMPONENT ═══════════ */
export const InlineCheckout: React.FC<InlineCheckoutProps> = ({
  orderId, protagonistName, coverImageUrl, onSuccess, onClose,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const stripe = useMemo(() => getStripePromise(), []);

  // Fire paywall_checkout_open des l'ouverture du modal
  useEffect(() => {
    trackPaywallEvent('paywall_checkout_open', {
      orderId,
      variant: 'inline',
      protagonistName,
    });
  }, [orderId, protagonistName]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ApiService.createCompletionIntent(orderId);
        if (cancelled) return;
        if (res.success && res.clientSecret) {
          setClientSecret(res.clientSecret);
        } else {
          // Erreur métier (400) — fallback vers l'ancien flow Checkout redirect
          console.warn('[InlineCheckout] Intent failed, falling back to Checkout Session:', res.message);
          try {
            const fallback = await ApiService.createCompletionSession(orderId);
            if (fallback.url) { window.location.href = fallback.url; return; }
          } catch { /* ignore fallback failure */ }
          setLoadError(res.message || 'Impossible d\'initialiser le paiement.');
        }
      } catch (err: any) {
        if (cancelled) return;
        console.warn('[InlineCheckout] Intent error, falling back to Checkout Session:', err?.message);
        // Fallback automatique vers l'ancien flow (redirect Checkout)
        try {
          const fallback = await ApiService.createCompletionSession(orderId);
          if (fallback.url) { window.location.href = fallback.url; return; }
        } catch { /* ignore */ }
        // Si même le fallback échoue, afficher l'erreur
        const msg = err?.message || '';
        if (msg && !msg.includes('Failed to fetch') && !msg.includes('NetworkError')) {
          setLoadError(msg);
        } else {
          setLoadError('Erreur de connexion au serveur de paiement. Vérifiez votre connexion internet.');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [orderId]);

  const resolvedCover = coverImageUrl
    ? (coverImageUrl.startsWith('http') ? coverImageUrl : getImageUrl(coverImageUrl))
    : '';

  return (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Card style={{ position: 'relative' }}>
        <CloseBtn onClick={onClose} aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseBtn>

        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 14px', paddingRight: 24, lineHeight: 1.3 }}>
          Finir l'histoire de {protagonistName}
        </h2>

        <Recap>
          {resolvedCover && <RecapCover src={resolvedCover} alt="" />}
          <RecapText>
            <p className="title">Suite complete (20 pages)</p>
            <p className="subtitle">Illustrations + PDF telechargeable</p>
          </RecapText>
          <RecapPrice>2,99€</RecapPrice>
        </Recap>

        {loadError && <ErrorMsg>{loadError}</ErrorMsg>}

        {!loadError && !clientSecret && (
          <Loader>Initialisation du paiement securise...</Loader>
        )}

        {clientSecret && (
          <Elements
            stripe={stripe}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#FF6B6B',
                  colorBackground: '#1a1040',
                  colorText: '#ffffff',
                  colorDanger: '#fca5a5',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  borderRadius: '10px',
                  spacingUnit: '4px',
                },
              },
            }}
          >
            <PaymentForm protagonistName={protagonistName} orderId={orderId} onSuccess={onSuccess} />
          </Elements>
        )}
      </Card>
    </Overlay>
  );
};
