# Contes d'IA - Application de Contes Personnalisés

Une application web complète pour créer et commander des contes personnalisés pour enfants, générés par intelligence artificielle.

## 🎯 Fonctionnalités

### Frontend (React + TypeScript)
- ✅ **Interface utilisateur moderne** avec design pastel et doux
- ✅ **Formulaire multi-étapes** (3 étapes) pour personnaliser le conte
- ✅ **Navigation responsive** avec header et footer
- ✅ **Page d'accueil complète** avec sections héro, avantages, tarifs, FAQ
- ✅ **Système de validation** des formulaires
- ✅ **Intégration API** avec le backend

### Backend (Node.js + Express + TypeScript)
- ✅ **API REST complète** avec endpoints pour les commandes
- ✅ **Base de données SQLite** avec Prisma ORM
- ✅ **Système d'emails** automatisé (Nodemailer)
- ✅ **Authentification JWT** pour l'administration
- ✅ **Middleware de sécurité** (Helmet, CORS)
- ✅ **Documentation API** complète

### Système d'emails
- ✅ **Email de confirmation** de commande
- ✅ **Email de livraison** (eBook prêt)
- ✅ **Email d'expédition** (livre physique)
- ✅ **Email d'erreur** de paiement
- ✅ **Templates HTML** personnalisés

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v16+)
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd conte-ia
```

2. **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npm run db:migrate
npm run db:seed
npm run dev
```

3. **Frontend**
```bash
cd contes-ia
npm install
npm start
```

### URLs d'accès
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Health check**: http://localhost:5000/health
- **Documentation API**: Voir `backend/API_DOCUMENTATION.md`

## 📋 Structure du projet

```
conte-ia/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── routes/         # Routes Express
│   │   ├── middleware/     # Middleware (auth, etc.)
│   │   ├── utils/          # Utilitaires (DB, emails, etc.)
│   │   └── types/          # Types TypeScript
│   ├── prisma/             # Schéma et migrations DB
│   └── API_DOCUMENTATION.md
├── contes-ia/              # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages de l'application
│   │   ├── styles/         # Thème et styles globaux
│   │   ├── config/         # Configuration API
│   │   └── types/          # Types TypeScript
│   └── public/
├── devbook.md              # Journal de développement
├── cdc.md                  # Cahier des charges
└── README.md
```

## 🎨 Design et UX

### Palette de couleurs
- **Rose corail** (#FF9999) - Couleur principale
- **Bleu pastel** (#87CEEB) - Couleur secondaire
- **Jaune pâle** (#FFFACD) - Accent
- **Rose doux** (#FFB6C1) - Accent
- **Vert tendre** (#98FB98) - Accent

### Typographie
- **Baloo 2** - Titres (police douce et arrondie)
- **Poppins** - Texte courant (moderne et lisible)

## 📊 Fonctionnalités du formulaire

### Étape 1 : Choix du thème
- Tranche d'âge (0-2, 3-5, 6-9, 10+ ans)
- Thème général (éducatif, contes de fées, activités, etc.)
- Sujet spécifique (licornes, chevaliers, école de sorciers, etc.)
- Message central (amitié, courage, respect, etc.)
- Style d'illustration (aquarelle, 3D, kawaii, etc.)

### Étape 2 : Détails du protagoniste
- Nom et âge du protagoniste
- Couleur des yeux et cheveux
- Personnage secondaire optionnel
- Upload de photo (optionnel)

### Étape 3 : Commande et livraison
- Choix du produit (eBook 4.99€, Livre relié 29.99€)
- Informations de livraison (pour produits physiques)
- Récapitulatif et validation

## 🛠 Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Styled Components** pour le styling
- **React Router** pour la navigation
- **Fetch API** pour les appels backend

### Backend
- **Node.js** avec Express et TypeScript
- **Prisma** ORM avec SQLite (développement)
- **Nodemailer** pour les emails
- **JWT** pour l'authentification
- **Helmet** et **CORS** pour la sécurité

### Base de données
- **SQLite** (développement local)
- **Prisma** pour les migrations et requêtes
- **Seed data** pour les tests

## 📧 Configuration des emails

Pour activer l'envoi d'emails, configurer dans `.env` :
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Contes d'IA <contact@contedia.fr>
```

## 🔐 Variables d'environnement

### Backend (.env)
```env
# Base de données
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Contes d'IA <contact@contedia.fr>

# URLs
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:5000

# Serveur
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📈 État d'avancement

### ✅ Phases terminées
- **Phase 1** : Setup et structure de base
- **Phase 2** : Frontend navigation et layout
- **Phase 3** : Formulaire de commande complet
- **Phase 4** : Backend et intégrations

### 🚧 Phases en cours / À venir
- **Phase 5** : Panneau d'administration
- **Phase 6** : Tests et optimisation
- **Phase 7** : Déploiement

## 🧪 Tests

### Tester l'API
```bash
# Health check
curl http://localhost:5000/health

# Test base de données
curl http://localhost:5000/api/test-db

# Créer une commande
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "test@example.com", "formData": {...}}'
```

### Données de test
Le système inclut des données de test :
- 1 administrateur : `contact@contedia.fr` / `admin123`
- 2 utilisateurs de test
- 3 commandes d'exemple

## 📝 Prochaines étapes

1. **Intégration Stripe** pour les paiements réels
2. **Panneau d'administration** pour gérer les commandes
3. **Génération IA** des contes (intégration OpenAI/Claude)
4. **Tests unitaires** et d'intégration
5. **Déploiement** en production

## 🤝 Contribution

Le projet suit une architecture modulaire et utilise des bonnes pratiques :
- Code TypeScript strict
- Composants React réutilisables
- API REST bien structurée
- Documentation complète

## 📄 Licence

Projet de démonstration - Contes d'IA

---

**Développé avec ❤️ pour créer des histoires magiques pour les enfants**
