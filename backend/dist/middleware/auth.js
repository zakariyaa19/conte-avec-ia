"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireSuperAdmin = exports.requireRole = exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../utils/database");
// Middleware d'authentification JWT pour les admins
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification requis'
            });
        }
        const token = authHeader.substring(7); // Enlever "Bearer "
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET non configuré');
        }
        // Vérifier le token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Récupérer l'admin depuis la base de données
        const admin = await database_1.prisma.adminUser.findUnique({
            where: { id: decoded.adminId }
        });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur administrateur non trouvé'
            });
        }
        // Ajouter les infos admin à la requête
        req.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role
        };
        next();
    }
    catch (error) {
        console.error('Erreur authentification:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Erreur d\'authentification'
        });
    }
};
exports.authenticateAdmin = authenticateAdmin;
// Middleware pour vérifier les rôles admin
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise'
            });
        }
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'Permissions insuffisantes'
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
// Middleware pour vérifier si l'utilisateur est super admin
exports.requireSuperAdmin = (0, exports.requireRole)(['SUPER_ADMIN']);
// Middleware pour vérifier si l'utilisateur est admin ou super admin
exports.requireAdmin = (0, exports.requireRole)(['ADMIN', 'SUPER_ADMIN']);
//# sourceMappingURL=auth.js.map