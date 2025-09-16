"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const pricing_1 = require("../utils/pricing");
const database_1 = require("../utils/database");
class OrderController {
    // Créer une nouvelle commande
    static async createOrder(req, res) {
        try {
            const { formData, userEmail } = req.body;
            // Validation des données requises
            if (!formData.ageRange || !formData.generalTheme || !formData.protagonistName || !formData.productType) {
                return res.status(400).json({
                    success: false,
                    message: 'Données manquantes dans le formulaire'
                });
            }
            // Calcul du prix
            const price = (0, pricing_1.calculatePrice)(formData.productType?.toUpperCase()) || 14.99;
            // Créer l'utilisateur s'il n'existe pas
            let user = null;
            if (userEmail) {
                user = await database_1.prisma.user.upsert({
                    where: { email: userEmail },
                    update: {},
                    create: { email: userEmail }
                });
            }
            // Créer la commande
            const order = await database_1.prisma.order.create({
                data: {
                    userId: user?.id,
                    ageRange: formData.ageRange,
                    generalTheme: formData.generalTheme,
                    specificSubject: formData.specificSubject,
                    centralMessage: formData.centralMessage,
                    illustrationStyle: formData.illustrationStyle,
                    protagonistName: formData.protagonistName,
                    protagonistAge: formData.protagonistAge,
                    eyeColor: formData.eyeColor,
                    hairColor: formData.hairColor,
                    secondaryCharacterName: formData.secondaryCharacterName,
                    secondaryCharacterAge: formData.secondaryCharacterAge,
                    productType: formData.productType?.toUpperCase(),
                    price: price,
                    shippingFirstName: formData.shippingAddress?.firstName,
                    shippingLastName: formData.shippingAddress?.lastName,
                    shippingAddress: formData.shippingAddress?.address,
                    shippingCity: formData.shippingAddress?.city,
                    shippingPostalCode: formData.shippingAddress?.postalCode,
                    shippingCountry: formData.shippingAddress?.country || 'France'
                }
            });
            res.status(201).json({
                success: true,
                data: order,
                message: 'Commande créée avec succès'
            });
        }
        catch (error) {
            console.error('Erreur création commande:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création de la commande'
            });
        }
    }
    // Récupérer une commande par ID
    static async getOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await database_1.prisma.order.findUnique({
                where: { id },
                include: { user: true }
            });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Commande non trouvée'
                });
            }
            res.json({
                success: true,
                data: order
            });
        }
        catch (error) {
            console.error('Erreur récupération commande:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de la commande'
            });
        }
    }
    // Mettre à jour le statut d'une commande
    static async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await database_1.prisma.order.update({
                where: { id },
                data: { status }
            });
            res.json({
                success: true,
                data: order,
                message: 'Statut de la commande mis à jour'
            });
        }
        catch (error) {
            console.error('Erreur mise à jour commande:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la commande'
            });
        }
    }
    // Lister toutes les commandes (pour l'admin)
    static async getAllOrders(req, res) {
        try {
            const { page = 1, limit = 10, status, productType, search } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            // Construction des filtres
            const where = {};
            if (status)
                where.status = status;
            if (productType)
                where.productType = productType;
            if (search) {
                where.OR = [
                    { protagonistName: { contains: search, mode: 'insensitive' } },
                    { user: { email: { contains: search, mode: 'insensitive' } } }
                ];
            }
            const [orders, total] = await Promise.all([
                database_1.prisma.order.findMany({
                    where,
                    include: { user: true },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: Number(limit)
                }),
                database_1.prisma.order.count({ where })
            ]);
            res.json({
                success: true,
                data: orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        }
        catch (error) {
            console.error('Erreur liste commandes:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des commandes'
            });
        }
    }
    // Mettre à jour une commande
    static async updateOrder(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const order = await database_1.prisma.order.update({
                where: { id },
                data: updateData,
                include: { user: true }
            });
            res.json({
                success: true,
                data: order
            });
        }
        catch (error) {
            console.error('Erreur mise à jour commande:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la commande'
            });
        }
    }
    // Lister toutes les commandes avec filtres
    static async getOrders(req, res) {
        try {
            const { page = 1, limit = 10, status, productType } = req.query;
            const where = {};
            if (status)
                where.status = status;
            if (productType)
                where.productType = productType;
            const orders = await database_1.prisma.order.findMany({
                where,
                include: { user: true },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            });
            const total = await database_1.prisma.order.count({ where });
            res.json({
                success: true,
                data: orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        }
        catch (error) {
            console.error('Erreur liste commandes:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des commandes'
            });
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=orderController.js.map