// Meta Pixel — désactivé 2026-05-11
//
// Le compte publicitaire Meta de Contedia a été banni. Continuer à envoyer
// des conversions à un compte fermé est inutile + envoie un signal suspect.
// Le script Pixel a été retiré de public/index.html.
//
// Ce module est conservé en no-op pour ne pas casser les imports existants
// dans HomePage / StoryFormPage / LoginPage / ClubCheckoutPage / SuccessPage /
// UpgradePage / paywallTracking / StoryWizard / useExperiment / ScrollToTop.
//
// Pour réactiver : restaurer le script <script>fbq(...)</script> dans
// public/index.html + revert ce fichier (git log).

// Type stub pour ne pas casser les usages legacy de window.fbq
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export async function metaTrackViewContent(
  _contentName: string,
  _contentCategory: string,
  _value: number,
  _currency: string = 'EUR'
): Promise<void> { /* no-op */ }

export async function metaTrackInitiateCheckout(
  _productType: string,
  _value: number = 3.99,
  _currency: string = 'EUR'
): Promise<void> { /* no-op */ }

export function metaTrackAddToCart(
  _purchaseType: 'single' | 'club',
  _singlePrice: number = 3.99,
  _currency: string = 'EUR'
): void { /* no-op */ }

export function metaTrackLead(
  _singlePrice: number = 3.99,
  _currency: string = 'EUR'
): void { /* no-op */ }

export function metaTrackCompleteRegistration(
  _method: 'email' | 'google',
  _plan: 'basic' | 'club' = 'basic'
): void { /* no-op */ }

export function metaTrackSubscribe(): void { /* no-op */ }

export async function metaTrackPurchase(
  _productType: string,
  _orderId: string,
  _value: number = 3.99,
  _currency: string = 'EUR'
): Promise<void> { /* no-op */ }
