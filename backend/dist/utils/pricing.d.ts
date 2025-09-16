export declare const PRODUCT_PRICES: {
    readonly EBOOK: 14.99;
    readonly PRINTED: 29.99;
    readonly PACK: 49.99;
};
export declare function calculatePrice(productType: keyof typeof PRODUCT_PRICES): number;
export declare function formatPrice(price: number): string;
export declare function convertToStripeAmount(price: number): number;
//# sourceMappingURL=pricing.d.ts.map