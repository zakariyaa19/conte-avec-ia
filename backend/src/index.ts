import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './utils/database';

// Import des routes
import apiRouter from './routes';
import stripeRoutes from './routes/stripe';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS: gérer plusieurs origines autorisées (FRONTEND_URL + CORS_ALLOWED_ORIGINS séparées par des virgules)
const DEFAULT_ORIGINS = ['http://localhost:3000'];
const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
if (process.env.FRONTEND_URL) configuredOrigins.push(process.env.FRONTEND_URL);
const allowedOrigins = Array.from(new Set([...DEFAULT_ORIGINS, ...configuredOrigins]));

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // requêtes internes/outils
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware de logging
app.use(morgan('combined'));

// Routes Stripe (avant express.json pour le webhook)
app.use('/api/stripe', stripeRoutes);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static('uploads'));

// Servir les fichiers PDF des exemples
app.use('/pdfs', express.static('pdfs'));

// Servir les images de couverture avec headers CORS
app.use('/images', (req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('images'));

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('/api', apiRouter);

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie');
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erreur de démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
