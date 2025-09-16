// Logique de calcul des prix

export const PRODUCT_PRICES = {
  EBOOK: 14.99,
  PRINTED: 29.99,
  PACK: 49.99
} as const;

export function calculatePrice(productType: keyof typeof PRODUCT_PRICES): number {
  return PRODUCT_PRICES[productType];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

export function convertToStripeAmount(price: number): number {
  // Stripe utilise les centimes
  return Math.round(price * 100);
}
