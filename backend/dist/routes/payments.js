"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
// Créer un Payment Intent
router.post('/create-intent', paymentController_1.PaymentController.createPaymentIntent);
// Webhook Stripe (raw body nécessaire)
router.post('/webhook', paymentController_1.PaymentController.handleWebhook);
// Vérifier le statut d'un paiement
router.get('/status/:orderId', paymentController_1.PaymentController.getPaymentStatus);
exports.default = router;
//# sourceMappingURL=payments.js.map