"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// Routes pour les commandes
router.post('/', upload_1.upload.single('photo'), orderController_1.OrderController.createOrder);
router.get('/:id', orderController_1.OrderController.getOrder);
router.put('/:id', orderController_1.OrderController.updateOrder);
router.get('/', orderController_1.OrderController.getOrders);
exports.default = router;
//# sourceMappingURL=orders.js.map