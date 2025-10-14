"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const pricing_1 = require("../utils/pricing");
const database_1 = require("../utils/database");
class OrderController {
    // Créer une nouvelle commande
    static async createOrder(req, res) {
        try {
            console.log('📝 Création de commande reçue');
            console.log('📋 Body reçu:', JSON.stringify(req.body, null, 2));
            // Récupérer les données depuis le body (pour FormData, les données JSON sont dans req.body)
            let formData, userEmail;
            if (req.body.formData) {
                // Si les données viennent de FormData
                formData = typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData;
                userEmail = req.body.userEmail || formData.userEmail;
            }
            else {
                // Si les données viennent directement du JSON
                formData = req.body.formData || req.body;
                userEmail = req.body.userEmail || formData.userEmail;
            }
            console.log('📊 FormData parsé:', JSON.stringify(formData, null, 2));
            console.log('📧 UserEmail:', userEmail);
            // Validation des données requises (champs essentiels seulement)
            if (!formData.ageRange || !formData.generalTheme || !formData.protagonistName ||
                !formData.productType) {
                console.log('❌ Validation échouée:', {
                    ageRange: !!formData.ageRange,
                    generalTheme: !!formData.generalTheme,
                    protagonistName: !!formData.protagonistName,
                    productType: !!formData.productType
                });
                return res.status(400).json({
                    success: false,
                    message: 'Données obligatoires manquantes dans le formulaire'
                });
            }
            // Calcul du prix
            const price = (0, pricing_1.calculatePrice)(formData.productType?.toUpperCase()) || 4.99;
            // Créer l'utilisateur s'il n'existe pas
            let user = null;
            if (userEmail) {
                user = await database_1.prisma.user.upsert({
                    where: { email: userEmail },
                    update: {},
                    create: { email: userEmail }
                });
            }
            // Gestion de l'upload de photo
            let photoUrl = null;
            let photoPath = null;
            if (req.file) {
                // Construire l'URL de la photo uploadée
                photoUrl = `/uploads/${req.file.filename}`;
                photoPath = req.file.path; // Chemin complet pour l'email
                console.log('📸 Photo uploadée:', photoUrl, 'Chemin:', photoPath);
            }
            // Créer la commande avec tous les nouveaux champs
            const order = await database_1.prisma.order.create({
                data: {
                    userId: user?.id,
                    // Étape 1 - Données du conte
                    ageRange: formData.ageRange,
                    generalTheme: formData.generalTheme,
                    customTheme: formData.customTheme,
                    specificSubject: formData.specificSubject,
                    customSubject: formData.customSubject,
                    centralMessage: formData.centralMessage,
                    customMessage: formData.customMessage,
                    illustrationStyle: formData.illustrationStyle,
                    // Étape 2 - Données du protagoniste
                    protagonistName: formData.protagonistName,
                    protagonistAge: formData.protagonistAge,
                    protagonistGender: formData.protagonistGender,
                    eyeColor: formData.eyeColor,
                    hairColor: formData.hairColor,
                    photoUrl: photoUrl,
                    // Langue du conte
                    language: formData.language,
                    // Informations supplémentaires
                    hobbies: formData.hobbies,
                    favoriteDish: formData.favoriteDish,
                    specialEvents: formData.specialEvents,
                    // Option religieuse
                    religion: formData.religion,
                    customReligion: formData.customReligion,
                    // Personnage secondaire
                    secondaryCharacterName: formData.secondaryCharacterName,
                    secondaryCharacterAge: formData.secondaryCharacterAge,
                    // Détails personnels
                    creatorName: formData.creatorName,
                    // Produit et livraison
                    productType: formData.productType?.toUpperCase(),
                    price: price,
                    shippingFirstName: formData.shippingAddress?.firstName,
                    shippingLastName: formData.shippingAddress?.lastName,
                    shippingAddress: formData.shippingAddress?.address,
                    shippingCity: formData.shippingAddress?.city,
                    shippingPostalCode: formData.shippingAddress?.postalCode
                }
            });
            // NOTE: Les emails sont maintenant envoyés uniquement après confirmation du paiement
            // dans stripeController.ts pour éviter les doublons
            console.log('📝 Commande créée, emails seront envoyés après paiement confirmé');
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