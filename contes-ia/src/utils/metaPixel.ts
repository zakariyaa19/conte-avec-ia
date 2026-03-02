// Utilitaire pour Meta Pixel tracking (Facebook)

// Déclarer le type pour fbq
declare global {
  interface Window {
    fbq: any;
  }
}

// Attendre que le pixel Meta soit chargé (polling jusqu'à 5s max)
function waitForFbq(maxWaitMs: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = 100;

    const checkFbq = () => {
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Meta Pixel chargé après', Date.now() - startTime, 'ms');
        resolve(true);
        return;
      }

      if (Date.now() - startTime >= maxWaitMs) {
        console.warn('Meta Pixel non chargé après', maxWaitMs, 'ms');
        resolve(false);
        return;
      }

      setTimeout(checkFbq, checkInterval);
    };

    checkFbq();
  });
}

// Track ViewContent (vue de produit)
export async function metaTrackViewContent(
  contentName: string,
  contentCategory: string,
  value: number,
  currency: string = 'EUR'
): Promise<void> {
  const fbqReady = await waitForFbq();

  if (!fbqReady) {
    console.error('Meta Pixel non disponible pour ViewContent');
    return;
  }

  try {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      content_type: 'product',
      value: value,
      currency: currency
    });
    console.log('Meta Pixel: ViewContent tracked');
  } catch (error) {
    console.error('Meta Pixel ViewContent error:', error);
  }
}

// Track InitiateCheckout - UNE SEULE FOIS par session
export async function metaTrackInitiateCheckout(
  productType: string,
  value: number = 4.99,
  currency: string = 'EUR'
): Promise<void> {
  const fbqReady = await waitForFbq();

  if (!fbqReady) {
    console.error('Meta Pixel non disponible pour InitiateCheckout');
    return;
  }

  try {
    const sessionKey = 'meta_initiate_checkout_fired';
    if (sessionStorage.getItem(sessionKey)) {
      console.log('Meta Pixel: InitiateCheckout déjà déclenché dans cette session');
      return;
    }

    const contentId = productType === 'club' ? 'club_1299' : 'ebook_499';
    const contentName = productType === 'club'
      ? 'Abonnement Club Contes d\'IA'
      : 'Ebook conte personnalisé';
    const checkoutValue = productType === 'club' ? 12.99 : value;

    window.fbq('track', 'InitiateCheckout', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: 'product',
      value: checkoutValue,
      currency: currency,
      num_items: 1
    });

    sessionStorage.setItem(sessionKey, 'true');
    console.log(`Meta Pixel: InitiateCheckout tracked - ${contentName} (${checkoutValue} ${currency})`);
  } catch (error) {
    console.error('Meta Pixel InitiateCheckout error:', error);
  }
}

// Track AddToCart - quand l'utilisateur sélectionne un produit (ebook ou club)
export function metaTrackAddToCart(
  purchaseType: 'single' | 'club',
  currency: string = 'EUR'
): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    const contentId = purchaseType === 'club' ? 'club_1299' : 'ebook_499';
    const contentName = purchaseType === 'club'
      ? 'Abonnement Club Contes d\'IA'
      : 'Ebook conte personnalisé';
    const value = purchaseType === 'club' ? 12.99 : 4.99;

    window.fbq('track', 'AddToCart', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: 'product',
      contents: [{ id: contentId, quantity: 1 }],
      value: value,
      currency: currency
    });
    console.log(`Meta Pixel: AddToCart tracked - ${contentName}`);
  } catch (error) {
    console.error('Meta Pixel AddToCart error:', error);
  }
}

// Track Lead - quand l'utilisateur fournit son email (signal fort pour Meta)
export function metaTrackLead(
  currency: string = 'EUR'
): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    const sessionKey = 'meta_lead_fired';
    if (sessionStorage.getItem(sessionKey)) return;

    window.fbq('track', 'Lead', {
      content_name: 'Conte personnalisé',
      content_category: 'Livre personnalisé enfant',
      currency: currency,
      value: 4.99
    });

    sessionStorage.setItem(sessionKey, 'true');
    console.log('Meta Pixel: Lead tracked');
  } catch (error) {
    console.error('Meta Pixel Lead error:', error);
  }
}

// Track CompleteRegistration - inscription réussie
export function metaTrackCompleteRegistration(
  method: 'email' | 'google',
  plan: 'basic' | 'club' = 'basic'
): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    window.fbq('track', 'CompleteRegistration', {
      content_name: plan === 'club' ? 'Club Registration' : 'Basic Registration',
      currency: 'EUR',
      value: plan === 'club' ? 12.99 : 0,
      status: true
    });
    console.log(`Meta Pixel: CompleteRegistration tracked - ${method} / ${plan}`);
  } catch (error) {
    console.error('Meta Pixel CompleteRegistration error:', error);
  }
}

// Track Subscribe - intention d'abonnement Club
export function metaTrackSubscribe(): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    const sessionKey = 'meta_subscribe_fired';
    if (sessionStorage.getItem(sessionKey)) return;

    window.fbq('track', 'Subscribe', {
      content_name: 'Club des Histoires',
      currency: 'EUR',
      value: 12.99,
      predicted_ltv: 77.94 // 6 mois de rétention estimée
    });

    sessionStorage.setItem(sessionKey, 'true');
    console.log('Meta Pixel: Subscribe tracked');
  } catch (error) {
    console.error('Meta Pixel Subscribe error:', error);
  }
}

// Track Purchase (achat confirmé) - UNE SEULE FOIS par commande
// C'est l'événement LE PLUS IMPORTANT pour le suivi des conversions Meta Ads
export async function metaTrackPurchase(
  productType: string,
  orderId: string,
  value: number = 4.99,
  currency: string = 'EUR'
): Promise<void> {
  const fbqReady = await waitForFbq();

  if (!fbqReady) {
    console.error('Meta Pixel non disponible pour Purchase');
    return;
  }

  try {
    const sessionKey = `meta_purchase_fired_${orderId}`;
    if (sessionStorage.getItem(sessionKey)) {
      console.log(`Meta Pixel: Purchase déjà déclenché pour la commande ${orderId}`);
      return;
    }

    const contentId = productType === 'club' ? 'club_1299' : 'ebook_499';
    const contentName = productType === 'club'
      ? 'Abonnement Club Contes d\'IA'
      : 'Ebook conte personnalisé';
    const purchaseValue = productType === 'club' ? 12.99 : value;

    window.fbq('track', 'Purchase', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: 'product',
      contents: [{ id: contentId, quantity: 1 }],
      value: purchaseValue,
      currency: currency,
      order_id: orderId
    });

    sessionStorage.setItem(sessionKey, 'true');
    console.log(`Meta Pixel: Purchase tracked - Order ${orderId} - ${contentName} (${purchaseValue} ${currency})`);
  } catch (error) {
    console.error('Meta Pixel Purchase error:', error);
  }
}
