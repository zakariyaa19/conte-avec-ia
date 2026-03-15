// Logique de calcul des prix

export const PRODUCT_PRICES = {
  EBOOK: 6.99,
  EBOOK_FIRST: 1.99,
  EBOOK_FREE: 0
} as const;

export const FREE_BOOK_LIMIT = 3;

export const CLUB_PRICES = {
  CLUB_MONTHLY: 9.99,
  CLUB_ANNUAL: 79.99,
  CLUB_FREE_STORY: 0
} as const;

export function calculatePrice(productType: keyof typeof PRODUCT_PRICES): number {
  return PRODUCT_PRICES[productType];
}

// Vérifie si un utilisateur est éligible au prix tripwire (premier achat)
export async function isFirstPurchase(userEmail: string, prisma: any): Promise<boolean> {
  const paidOrderCount = await prisma.order.count({
    where: {
      user: { email: userEmail },
      status: { in: ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'] }
    }
  });
  return paidOrderCount === 0;
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
