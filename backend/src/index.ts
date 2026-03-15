import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './utils/database';
import { KeepAliveService } from './utils/keepAlive';
import { processEmailSequence } from './jobs/emailSequence';

// Import des routes
import apiRouter from './routes';
import stripeRoutes from './routes/stripe';
import filesRoutes from './routes/files';

// Configuration
dotenv.config();

const app = express();
app.set('trust proxy', 1); // Render reverse proxy
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

// Middleware de logging (short en production pour reduire l'overhead)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'combined'));

// Routes Stripe (avant express.json pour le webhook)
app.use('/api/stripe', stripeRoutes);

// Middleware de parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Bloquer l'acces statique aux PDFs (securises via /api/client/stories/:id/pdf)
app.use('/uploads/pdfs', (req, res) => {
  res.status(403).json({ error: 'Acces interdit. Utilisez l\'API pour telecharger les PDFs.' });
});

// Servir les fichiers statiques (images uploadees, sauf PDFs)
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

// Endpoint de warm-up pour éviter le cold start
app.get('/warmup', async (req, res) => {
  try {
    // Test rapide de la base de données
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'WARM', 
      timestamp: new Date().toISOString(),
      message: 'Serveur réchauffé avec succès'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      message: 'Erreur lors du warm-up'
    });
  }
});

app.use('/api', apiRouter);
app.use('/files', filesRoutes);

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? (err.message || 'Erreur interne du serveur') : 'Erreur interne du serveur',
    ...(isDev && { stack: err.stack })
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
      
      // Démarrer le service keep-alive en production
      if (process.env.NODE_ENV === 'production') {
        KeepAliveService.start();

        // Cron interne : séquence emails relance Club toutes les heures
        setInterval(() => {
          processEmailSequence().catch(err =>
            console.error('[Cron] Email sequence error:', err)
          );
        }, 60 * 60 * 1000); // 1h
        console.log('📧 Cron email sequence démarré (toutes les heures)');
      }
    });
  } catch (error) {
    console.error('❌ Erreur de démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  KeepAliveService.stop();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  KeepAliveService.stop();
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
