import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './utils/database';
import stripeRoutes from './routes/stripe';
import testRoutes from './routes/test';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware (Stripe webhook doit être avant express.json)
app.use('/api/stripe', stripeRoutes);
app.use('/api/test', testRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Contes d\'IA fonctionne correctement',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes API de base
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Contes d\'IA fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Route pour tester la base de données
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const adminCount = await prisma.adminUser.count();
    
    res.json({
      success: true,
      data: {
        users: userCount,
        orders: orderCount,
        admins: adminCount,
        database: 'Connexion réussie'
      }
    });
  } catch (error) {
    console.error('Erreur base de données:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données'
    });
  }
});


// Route pour créer une commande simple
app.post('/api/orders', async (req, res) => {
  try {
    const { userEmail, formData } = req.body;
    
    // Créer ou récupérer l'utilisateur
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName: formData.protagonistName || 'Utilisateur',
          lastName: 'Test'
        }
      });
    }
    
    // Calculer le prix basique
    let price = 14.99; // eBook par défaut
    if (formData.productType === 'PRINTED') price = 29.99;
    if (formData.productType === 'PACK') price = 49.99;
    
    // Créer la commande
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        ageRange: formData.ageRange || '3-5',
        generalTheme: formData.generalTheme || 'fairy-tales',
        specificSubject: formData.specificSubject || 'adventure',
        centralMessage: formData.centralMessage || 'friendship',
        illustrationStyle: formData.illustrationStyle || 'watercolor',
        protagonistName: formData.protagonistName || 'Héros',
        protagonistAge: formData.protagonistAge,
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        secondaryCharacterName: formData.secondaryCharacterName,
        secondaryCharacterAge: formData.secondaryCharacterAge,
        productType: formData.productType || 'EBOOK',
        price: price,
        shippingFirstName: formData.shippingAddress?.firstName,
        shippingLastName: formData.shippingAddress?.lastName,
        shippingAddress: formData.shippingAddress?.address,
        shippingCity: formData.shippingAddress?.city,
        shippingPostalCode: formData.shippingAddress?.postalCode,
      },
      include: { user: true }
    });
    
    // Note: L'email sera envoyé après confirmation du paiement Stripe
    console.log('✅ Commande créée, en attente de paiement');
    
    res.json({
      success: true,
      data: order,
      message: 'Commande créée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  }
});

// Route pour récupérer les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    res.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    });
  }
});

// Route pour récupérer une commande par ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
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
    
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
});

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
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});

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
