"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = __importDefault(require("./orders"));
const payments_1 = __importDefault(require("./payments"));
const admin_1 = __importDefault(require("./admin"));
const router = (0, express_1.Router)();
// Routes principales
router.use('/orders', orders_1.default);
router.use('/payments', payments_1.default);
router.use('/admin', admin_1.default);
// Route de santé
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Contes d\'IA fonctionne correctement',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map