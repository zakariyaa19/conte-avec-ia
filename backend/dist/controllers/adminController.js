"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const database_1 = require("../utils/database");
class AdminController {
    // Connexion administrateur
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email et mot de passe requis'
                });
            }
            // Rechercher l'administrateur
            const admin = await database_1.prisma.adminUser.findUnique({
                where: { email }
            });
            if (!admin || !admin.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants invalides'
                });
            }
            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants invalides'
                });
            }
            // Générer le token JWT
            const token = jwt.sign({
                adminId: admin.id,
                email: admin.email,
                role: admin.role
            }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: admin.id,
                        email: admin.email,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        role: admin.role
                    }
                }
            });
        }
        catch (error) {
            console.error('Erreur connexion admin:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion'
            });
        }
    }
    // Statistiques du dashboard
    static async getDashboardStats(req, res) {
        try {
            const [totalOrders, paidOrders, pendingOrders, totalRevenue] = await Promise.all([
                database_1.prisma.order.count(),
                database_1.prisma.order.count({ where: { status: 'PAID' } }),
                database_1.prisma.order.count({ where: { status: 'PENDING' } }),
                database_1.prisma.order.aggregate({
                    where: { status: 'PAID' },
                    _sum: { price: true }
                })
            ]);
            res.json({
                success: true,
                data: {
                    totalOrders,
                    paidOrders,
                    pendingOrders,
                    totalRevenue: totalRevenue._sum.price || 0
                }
            });
        }
        catch (error) {
            console.error('Erreur stats dashboard:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des statistiques'
            });
        }
    }
    // Liste des commandes pour l'admin
    static async getOrders(req, res) {
        try {
            const { page = 1, limit = 20, status, productType, search } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            // Construction des filtres
            const where = {};
            if (status)
                where.status = status;
            if (productType)
                where.productType = productType;
            if (search) {
                where.OR = [
                    { protagonistName: { contains: search } },
                    { user: { email: { contains: search } } }
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
            console.error('Erreur liste commandes admin:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des commandes'
            });
        }
    }
    // Détails d'une commande
    static async getOrderDetails(req, res) {
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
            console.error('Erreur détails commande:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des détails'
            });
        }
    }
    // Mettre à jour une commande
    static async updateOrder(req, res) {
        try {
            console.log('🔄 Mise à jour commande:', { id: req.params.id, body: req.body });
            const { id } = req.params;
            const updates = req.body;
            // Vérifier que le body n'est pas vide ou undefined
            if (!updates || typeof updates !== 'object') {
                console.log('❌ Body de requête invalide:', updates);
                return res.status(400).json({
                    success: false,
                    message: 'Données de mise à jour manquantes ou invalides'
                });
            }
            // Vérifier que la commande existe
            const existingOrder = await database_1.prisma.order.findUnique({
                where: { id }
            });
            if (!existingOrder) {
                console.log('❌ Commande non trouvée:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Commande non trouvée'
                });
            }
            // Champs autorisés à la modification
            const allowedFields = ['status', 'ebookUrl', 'generatedAt'];
            const filteredUpdates = {};
            for (const field of allowedFields) {
                if (updates[field] !== undefined) {
                    filteredUpdates[field] = updates[field];
                }
            }
            // Vérifier qu'il y a au moins un champ à mettre à jour
            if (Object.keys(filteredUpdates).length === 0) {
                console.log('❌ Aucun champ valide à mettre à jour');
                return res.status(400).json({
                    success: false,
                    message: 'Aucun champ valide à mettre à jour'
                });
            }
            console.log('📝 Champs à mettre à jour:', filteredUpdates);
            // Ajouter la date de paiement si le statut passe à PAID
            if (filteredUpdates.status === 'PAID' && existingOrder.status !== 'PAID') {
                filteredUpdates.paidAt = new Date();
            }
            const order = await database_1.prisma.order.update({
                where: { id },
                data: filteredUpdates,
                include: { user: true }
            });
            console.log('✅ Commande mise à jour:', order.id, 'nouveau statut:', order.status);
            res.json({
                success: true,
                data: order,
                message: 'Commande mise à jour avec succès'
            });
        }
        catch (error) {
            console.error('❌ Erreur mise à jour commande:', error);
            // Log détaillé de l'erreur
            if (error instanceof Error) {
                console.error('Message d\'erreur:', error.message);
                console.error('Stack trace:', error.stack);
            }
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la commande',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map