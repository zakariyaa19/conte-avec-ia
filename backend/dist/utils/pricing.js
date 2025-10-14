"use strict";
// Logique de calcul des prix
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_PRICES = void 0;
exports.calculatePrice = calculatePrice;
exports.formatPrice = formatPrice;
exports.convertToStripeAmount = convertToStripeAmount;
exports.PRODUCT_PRICES = {
    EBOOK: 4.99,
    PRINTED: 19.99
};
function calculatePrice(productType) {
    return exports.PRODUCT_PRICES[productType];
}
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}
function convertToStripeAmount(price) {
    // Stripe utilise les centimes
    return Math.round(price * 100);
}
//# sourceMappingURL=pricing.js.map