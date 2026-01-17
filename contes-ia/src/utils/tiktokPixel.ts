// Utilitaire pour TikTok Pixel tracking

// Fonction pour hasher une chaîne en SHA-256
async function sha256Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
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
export function trackInitiateCheckout(productType: 'ebook' | 'printed') {
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
      
      // Structure avec content_id à la racine (pas dans contents[])
      window.ttq.track('InitiateCheckout', {
        content_id: contentId,
        content_name: contentName,
        content_type: 'product',
        value: value,
        currency: 'EUR'
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
export function trackPurchase(productType: 'ebook' | 'printed', orderId: string) {
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
      
      // Structure avec content_id à la racine (pas dans contents[])
      window.ttq.track('Purchase', {
        content_id: contentId,
        content_name: contentName,
        content_type: 'product',
        value: value,
        currency: 'EUR'
      });
      
      // Marquer comme déclenché pour cette commande
      sessionStorage.setItem(sessionKey, 'true');
      console.log(`✅ TikTok Pixel: Purchase tracked - Order ${orderId} - ${contentName} (${value} EUR)`);
    } catch (error) {
      console.error('❌ TikTok Pixel Purchase error:', error);
    }
  }
}
