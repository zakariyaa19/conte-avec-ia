"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Authentification admin
router.post('/login', adminController_1.AdminController.login);
// Routes protégées avec authentification
router.get('/dashboard/stats', auth_1.authenticateAdmin, auth_1.requireAdmin, adminController_1.AdminController.getDashboardStats);
router.get('/orders', auth_1.authenticateAdmin, auth_1.requireAdmin, adminController_1.AdminController.getOrders);
router.get('/orders/:id', auth_1.authenticateAdmin, auth_1.requireAdmin, adminController_1.AdminController.getOrderDetails);
router.patch('/orders/:id', auth_1.authenticateAdmin, auth_1.requireAdmin, adminController_1.AdminController.updateOrder);
exports.default = router;
//# sourceMappingURL=admin.js.map