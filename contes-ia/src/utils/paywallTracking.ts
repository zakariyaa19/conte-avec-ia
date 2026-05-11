// Tracking du funnel paywall (cliffhanger -> paiement 2,99€)
// Fire les memes evenements vers Meta Pixel, Clarity et TikTok pour cross-validation.
//
// Funnel attendu :
//   paywall_view       -> l'utilisateur voit l'ecran "Offrir la suite"
//   paywall_click      -> il clique sur le CTA principal
//   paywall_checkout_open -> le modal Stripe Elements (ou la redirection) s'ouvre
//   paywall_payment_success -> Stripe a confirme le paiement
//
// Chaque event est aussi declenche UNE SEULE FOIS par orderId pour eviter le double-comptage.

import { safeSessionStorage } from './safeStorage';

type PaywallEvent =
  | 'paywall_view'
  | 'paywall_click'
  | 'paywall_checkout_open'
  | 'paywall_payment_success';

interface PaywallEventPayload {
  orderId: string;
  variant?: string;        // 'inline' | 'control' (A/B test)
  value?: number;          // montant en EUR (2.99 par defaut)
  protagonistName?: string;
}

const DEFAULT_VALUE = 2.99;
const CURRENCY = 'EUR';

function dedupeKey(event: PaywallEvent, orderId: string): string {
  return `paywall_evt_${event}_${orderId}`;
}

function alreadyFired(event: PaywallEvent, orderId: string): boolean {
  const key = dedupeKey(event, orderId);
  if (safeSessionStorage.getItem(key)) return true;
  safeSessionStorage.setItem(key, '1');
  return false;
}

export function trackPaywallEvent(event: PaywallEvent, payload: PaywallEventPayload): void {
  if (typeof window === 'undefined') return;
  if (alreadyFired(event, payload.orderId)) return;

  const value = payload.value ?? DEFAULT_VALUE;
  const meta = {
    event,
    order_id: payload.orderId,
    variant: payload.variant || 'unknown',
    value,
    currency: CURRENCY,
    content_name: 'Completion 2,99€',
    content_type: 'product',
    content_ids: ['ebook_completion_299'],
  };

  const w: any = window;

  // Microsoft Clarity — custom event + set tag pour segmenter les sessions
  try {
    if (w.clarity) {
      w.clarity('event', event);
      w.clarity('set', 'paywall_funnel', event);
      if (payload.variant) w.clarity('set', 'paywall_variant', payload.variant);
    }
  } catch { /* never break UI */ }

  // Meta Pixel — mapping sur les standard events Meta + custom
  try {
    if (w.fbq) {
      switch (event) {
        case 'paywall_view':
          w.fbq('track', 'ViewContent', {
            content_name: meta.content_name,
            content_ids: meta.content_ids,
            content_type: meta.content_type,
            value,
            currency: CURRENCY,
          });
          break;
        case 'paywall_click':
          w.fbq('track', 'AddToCart', {
            content_name: meta.content_name,
            content_ids: meta.content_ids,
            content_type: meta.content_type,
            value,
            currency: CURRENCY,
          });
          break;
        case 'paywall_checkout_open':
          w.fbq('track', 'InitiateCheckout', {
            content_name: meta.content_name,
            content_ids: meta.content_ids,
            content_type: meta.content_type,
            value,
            currency: CURRENCY,
            num_items: 1,
          });
          break;
        case 'paywall_payment_success':
          w.fbq('track', 'Purchase', {
            content_name: meta.content_name,
            content_ids: meta.content_ids,
            content_type: meta.content_type,
            value,
            currency: CURRENCY,
            order_id: payload.orderId,
          });
          break;
      }
      // Custom event pour conserver le funnel detaille
      w.fbq('trackCustom', event, meta);
    }
  } catch { /* never break UI */ }

  // TikTok Pixel
  try {
    if (w.ttq && typeof w.ttq.track === 'function') {
      const ttkEventMap: Record<PaywallEvent, string> = {
        paywall_view: 'ViewContent',
        paywall_click: 'AddToCart',
        paywall_checkout_open: 'InitiateCheckout',
        paywall_payment_success: 'CompletePayment',
      };
      w.ttq.track(ttkEventMap[event], {
        content_id: meta.content_ids[0],
        content_name: meta.content_name,
        content_type: meta.content_type,
        value,
        currency: CURRENCY,
        ...(event === 'paywall_payment_success' ? { order_id: payload.orderId } : {}),
      });
    }
  } catch { /* never break UI */ }

  // Log console pour debug local (visible dans la console navigateur)
  if (typeof console !== 'undefined') {
    console.log(`[Paywall] ${event}`, meta);
  }
}
