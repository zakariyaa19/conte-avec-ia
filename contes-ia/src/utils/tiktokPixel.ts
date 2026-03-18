// Utilitaire pour TikTok Pixel tracking

import { safeSessionStorage } from './safeStorage';

// Attendre que le pixel TikTok soit chargé (polling jusqu'à 5s max)
function waitForTTQ(maxWaitMs: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = 100; // Vérifier toutes les 100ms
    
    const checkTTQ = () => {
      if (typeof window !== 'undefined' && window.ttq) {
        console.log('✅ TikTok Pixel chargé après', Date.now() - startTime, 'ms');
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime >= maxWaitMs) {
        console.warn('⚠️ TikTok Pixel non chargé après', maxWaitMs, 'ms');
        resolve(false);
        return;
      }
      
      setTimeout(checkTTQ, checkInterval);
    };
    
    checkTTQ();
  });
}

// Fonction pour hasher une chaîne en SHA-256
async function sha256Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Générer un event_id unique
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Récupérer un cookie par nom
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Récupérer les paramètres TikTok (ttclid, ttp)
function getTikTokParams(): { ttclid?: string; ttp?: string } {
  const params: { ttclid?: string; ttp?: string } = {};
  
  // Récupérer ttclid (TikTok Click ID)
  const ttclid = getCookie('ttclid');
  if (ttclid) params.ttclid = ttclid;
  
  // Récupérer ttp (TikTok Pixel)
  const ttp = getCookie('_ttp');
  if (ttp) params.ttp = ttp;
  
  return params;
}

// Envoyer un événement au backend TikTok Events API
async function sendTiktokServerEvent(payload: {
  event: string;
  event_id: string;
  event_time: number;
  url: string;
  properties: {
    content_id: string;
    content_name: string;
    content_type: string;
    value: number;
    currency: string;
  };
  context?: {
    user_agent?: string;
    ttclid?: string;
    ttp?: string;
  };
  user?: {
    email?: string;
    phone?: string;
    external_id?: string;
  };
}): Promise<void> {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://conte-avec-ia-backend.onrender.com';
    
    const response = await fetch(`${apiUrl}/api/tiktok/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ TikTok Server Event envoyé:', payload.event);
    } else {
      console.error('❌ TikTok Server Event erreur:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur envoi TikTok Server Event:', error);
  }
}

// Déclarer le type pour ttq
declare global {
  interface Window {
    ttq: any;
  }
}

// Identifier l'utilisateur avec son email
export async function identifyUser(email: string) {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      const hashedEmail = await sha256Hash(email.toLowerCase().trim());
      window.ttq.identify({
        email: hashedEmail
      });
      console.log('✅ TikTok Pixel: User identified');
    } catch (error) {
      console.error('❌ TikTok Pixel identify error:', error);
    }
  }
}

// Track ViewContent (vue de produit)
export async function trackViewContent(contentId: string, contentName: string, value: number, currency: string = 'EUR'): Promise<void> {
  const ttqReady = await waitForTTQ();
  
  if (!ttqReady) {
    console.error('❌ TikTok Pixel non disponible pour ViewContent');
    return;
  }
  
  try {
    window.ttq.track('ViewContent', {
      contents: [
        {
          content_id: contentId,
          content_type: 'product',
          content_name: contentName
        }
      ],
      value: value,
      currency: currency
    });
    console.log('✅ TikTok Pixel: ViewContent tracked');
  } catch (error) {
    console.error('❌ TikTok Pixel ViewContent error:', error);
  }
}

// Track InitiateCheckout (début du paiement) - UNE SEULE FOIS par session
// IMPORTANT: Retourne une Promise qui se résout après confirmation d'envoi
export async function trackInitiateCheckout(productType: string, userEmail?: string, singlePrice: number = 3.99): Promise<void> {
  return new Promise(async (resolve) => {
    const ttqReady = await waitForTTQ();
    
    if (!ttqReady) {
      console.error('❌ TikTok Pixel non disponible pour InitiateCheckout');
      resolve();
      return;
    }
    
    if (typeof window !== 'undefined' && window.ttq) {
      try {
        // Vérifier si déjà déclenché dans cette session
        const sessionKey = 'tiktok_initiate_checkout_fired';
        if (safeSessionStorage.getItem(sessionKey)) {
          console.log('⚠️ TikTok Pixel: InitiateCheckout déjà déclenché dans cette session');
          resolve();
          return;
        }

        const isSingle = productType === 'single' || productType === 'ebook';
        const value = productType === 'club_annual' ? 79.99
          : (productType === 'club' || productType === 'club_monthly') ? 9.99
          : singlePrice;
        const contentId = productType === 'club_annual' ? 'club_annual_7999'
          : (productType === 'club' || productType === 'club_monthly') ? 'club_999'
          : (singlePrice <= 1.99 ? 'ebook_199' : 'ebook_699');
        const contentName = productType === 'club_annual'
          ? 'Abonnement Club Annuel Contes d\'IA'
          : (productType === 'club' || productType === 'club_monthly')
            ? 'Abonnement Club Contes d\'IA'
            : 'Ebook conte personnalisé';

        // Générer un event_id unique
        const eventId = generateEventId();

        let callbackFired = false;

        // Structure avec content_id à la racine + event_callback
        window.ttq.track('InitiateCheckout', {
          content_id: contentId,
          content_name: contentName,
          content_type: 'product',
          value: value,
          currency: 'EUR',
          event_id: eventId
        }, {
          event_callback: () => {
            if (!callbackFired) {
              callbackFired = true;
              console.log('TikTok Pixel: InitiateCheckout callback confirmé');
              // Délai de sécurité de 300ms après callback
              setTimeout(() => resolve(), 300);
            }
          }
        });

        // Timeout de sécurité: résoudre après 1 seconde même sans callback
        setTimeout(() => {
          if (!callbackFired) {
            console.log('TikTok Pixel: InitiateCheckout timeout (pas de callback)');
            resolve();
          }
        }, 1000);

        // Envoyer aussi au backend (Server-Side) en parallèle
        const tiktokParams = getTikTokParams();
        sendTiktokServerEvent({
          event: 'InitiateCheckout',
          event_id: eventId,
          event_time: Math.floor(Date.now() / 1000),
          url: window.location.href,
          properties: {
            content_id: contentId,
            content_name: contentName,
            content_type: 'product',
            value: value,
            currency: 'EUR'
          },
          context: {
            user_agent: navigator.userAgent,
            ...tiktokParams
          },
          ...(userEmail && { user: { email: userEmail } })
        }).catch(err => console.error('❌ Server event error:', err));
        
        // Marquer comme déclenché
        safeSessionStorage.setItem(sessionKey, 'true');
        console.log(`✅ TikTok Pixel: InitiateCheckout tracked - ${contentName} (${value} EUR)`);
      } catch (error) {
        console.error('❌ TikTok Pixel InitiateCheckout error:', error);
        resolve();
      }
    }
  });
}

// Track Purchase (achat confirmé) - UNE SEULE FOIS par commande
export async function trackPurchase(productType: string, orderId: string, userEmail?: string, purchaseValue: number = 3.99) {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      // Vérifier si déjà déclenché pour cette commande
      const sessionKey = `tiktok_purchase_fired_${orderId}`;
      if (safeSessionStorage.getItem(sessionKey)) {
        console.log(`⚠️ TikTok Pixel: Purchase déjà déclenché pour la commande ${orderId}`);
        return;
      }

      const value = productType === 'club_annual' ? 79.99
        : (productType === 'club' || productType === 'club_monthly') ? 9.99
        : purchaseValue;
      const contentId = productType === 'club_annual' ? 'club_annual_7999'
        : (productType === 'club' || productType === 'club_monthly') ? 'club_999'
        : (value <= 1.99 ? 'ebook_199' : 'ebook_699');
      const contentName = productType === 'club_annual'
        ? 'Abonnement Club Annuel Contes d\'IA'
        : (productType === 'club' || productType === 'club_monthly')
          ? 'Abonnement Club Contes d\'IA'
          : 'Ebook conte personnalisé';

      // Générer un event_id unique
      const eventId = generateEventId();

      // Structure avec content_id à la racine (pas dans contents[])
      window.ttq.track('Purchase', {
        content_id: contentId,
        content_name: contentName,
        content_type: 'product',
        value: value,
        currency: 'EUR',
        event_id: eventId
      });

      // Envoyer aussi au backend (Server-Side)
      const tiktokParams = getTikTokParams();
      await sendTiktokServerEvent({
        event: 'Purchase',
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        url: window.location.href,
        properties: {
          content_id: contentId,
          content_name: contentName,
          content_type: 'product',
          value: value,
          currency: 'EUR'
        },
        context: {
          user_agent: navigator.userAgent,
          ...tiktokParams
        },
        ...(userEmail && { user: { email: userEmail } })
      });
      
      // Marquer comme déclenché pour cette commande
      safeSessionStorage.setItem(sessionKey, 'true');
      console.log(`✅ TikTok Pixel: Purchase tracked - Order ${orderId} - ${contentName} (${value} EUR)`);
    } catch (error) {
      console.error('❌ TikTok Pixel Purchase error:', error);
    }
  }
}
