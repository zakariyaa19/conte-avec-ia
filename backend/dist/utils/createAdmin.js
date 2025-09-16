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
exports.createAdmin = createAdmin;
const bcrypt = __importStar(require("bcryptjs"));
const database_1 = require("./database");
// Script pour créer un utilisateur administrateur
async function createAdmin() {
    try {
        const email = 'admin@contes-ia.com';
        const password = 'admin123'; // À changer en production
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await database_1.prisma.adminUser.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'Contes IA',
                role: 'SUPER_ADMIN',
                isActive: true
            }
        });
        console.log('✅ Administrateur créé avec succès:');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Mot de passe: ${password}`);
        console.log(`👤 Rôle: ${admin.role}`);
        console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
    }
    catch (error) {
        console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    }
    finally {
        await database_1.prisma.$disconnect();
    }
}
// Exécuter le script si appelé directement
if (require.main === module) {
    createAdmin();
}
//# sourceMappingURL=createAdmin.js.map