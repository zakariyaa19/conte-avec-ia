"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./utils/database");
// Import des routes
const routes_1 = __importDefault(require("./routes"));
const stripe_1 = __importDefault(require("./routes/stripe"));
// Configuration
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware de sécurité
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false
}));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));
// Middleware de logging
app.use((0, morgan_1.default)('combined'));
// Routes Stripe (avant express.json pour le webhook)
app.use('/api/stripe', stripe_1.default);
// Middleware de parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express_1.default.static('uploads'));
// Servir les fichiers PDF des exemples
app.use('/pdfs', express_1.default.static('pdfs'));
// Servir les images de couverture avec headers CORS
app.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}, express_1.default.static('images'));
// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
app.use('/api', routes_1.default);
// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur interne du serveur',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});
// Démarrage du serveur
async function startServer() {
    try {
        // Test de connexion à la base de données
        await database_1.prisma.$connect();
        console.log('✅ Connexion à la base de données établie');
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Erreur de démarrage du serveur:', error);
        process.exit(1);
    }
}
// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await database_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await database_1.prisma.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map