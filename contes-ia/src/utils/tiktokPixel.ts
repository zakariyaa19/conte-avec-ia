// Utilitaire pour TikTok Pixel tracking

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
    const apiUrl = process.env.REACT_APP_API_URL || 'https://conte-avec-ia-1.onrender.com';
    
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
export function trackViewContent(contentId: string, contentName: string, value: number, currency: string = 'EUR') {
  if (typeof window !== 'undefined' && window.ttq) {
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
}

// Track InitiateCheckout (début du paiement) - UNE SEULE FOIS par session
export async function trackInitiateCheckout(productType: 'ebook' | 'printed', userEmail?: string) {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      // Vérifier si déjà déclenché dans cette session
      const sessionKey = 'tiktok_initiate_checkout_fired';
      if (sessionStorage.getItem(sessionKey)) {
        console.log('⚠️ TikTok Pixel: InitiateCheckout déjà déclenché dans cette session');
        return;
      }

      const isEbook = productType === 'ebook';
      const contentId = isEbook ? 'ebook_499' : 'livre_2999';
      const contentName = isEbook ? 'Ebook conte personnalisé' : 'Livre conte personnalisé';
      const value = isEbook ? 4.99 : 29.99;
      
      // Générer un event_id unique
      const eventId = generateEventId();
      
      // Structure avec content_id à la racine (pas dans contents[])
      window.ttq.track('InitiateCheckout', {
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
      });
      
      // Marquer comme déclenché
      sessionStorage.setItem(sessionKey, 'true');
      console.log(`✅ TikTok Pixel: InitiateCheckout tracked - ${contentName} (${value} EUR)`);
    } catch (error) {
      console.error('❌ TikTok Pixel InitiateCheckout error:', error);
    }
  }
}

// Track Purchase (achat confirmé) - UNE SEULE FOIS par commande
export async function trackPurchase(productType: 'ebook' | 'printed', orderId: string, userEmail?: string) {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      // Vérifier si déjà déclenché pour cette commande
      const sessionKey = `tiktok_purchase_fired_${orderId}`;
      if (sessionStorage.getItem(sessionKey)) {
        console.log(`⚠️ TikTok Pixel: Purchase déjà déclenché pour la commande ${orderId}`);
        return;
      }

      const isEbook = productType === 'ebook';
      const contentId = isEbook ? 'ebook_499' : 'livre_2999';
      const contentName = isEbook ? 'Ebook conte personnalisé' : 'Livre conte personnalisé';
      const value = isEbook ? 4.99 : 29.99;
      
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
      sessionStorage.setItem(sessionKey, 'true');
      console.log(`✅ TikTok Pixel: Purchase tracked - Order ${orderId} - ${contentName} (${value} EUR)`);
    } catch (error) {
      console.error('❌ TikTok Pixel Purchase error:', error);
    }
  }
}
