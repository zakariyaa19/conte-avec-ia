"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripeController_1 = require("../controllers/stripeController");
const router = express_1.default.Router();
// Middleware pour parser le JSON sur les routes Stripe (sauf webhook)
router.use(express_1.default.json());
// Route pour créer une session de paiement
router.post('/create-payment-session', stripeController_1.createPaymentSession);
// Route pour vérifier le statut d'un paiement (alternative au webhook)
router.get('/check-payment-status', stripeController_1.checkPaymentStatus);
// Webhook Stripe (commenté temporairement - sera réactivé avec le webhook secret)
// router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
exports.default = router;
//# sourceMappingURL=stripe.js.map