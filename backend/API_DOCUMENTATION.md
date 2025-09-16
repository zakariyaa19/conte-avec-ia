# API Documentation - Contes d'IA Backend

## Base URL
```
http://localhost:5000
```

## Endpoints

### Health Check

#### GET /health
Vérifier l'état du serveur

**Response:**
```json
{
  "status": "OK",
  "message": "API Contes d'IA fonctionne correctement",
  "timestamp": "2025-09-10T08:25:00.000Z",
  "version": "1.0.0"
}
```

#### GET /api/health
Vérifier l'état de l'API

**Response:**
```json
{
  "status": "OK",
  "message": "API Contes d'IA fonctionne correctement",
  "timestamp": "2025-09-10T08:25:00.000Z"
}
```

### Database Test

#### GET /api/test-db
Tester la connexion à la base de données et obtenir les statistiques

**Response:**
```json
{
  "success": true,
  "data": {
    "users": 2,
    "orders": 3,
    "admins": 1,
    "database": "Connexion réussie"
  }
}
```

### Orders

#### POST /api/orders
Créer une nouvelle commande

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "formData": {
    "ageRange": "3-5",
    "generalTheme": "fairy-tales",
    "specificSubject": "unicorns",
    "centralMessage": "friendship",
    "illustrationStyle": "watercolor",
    "protagonistName": "Luna",
    "protagonistAge": "4 ans",
    "eyeColor": "blue",
    "hairColor": "blonde",
    "secondaryCharacterName": "Sparkle",
    "secondaryCharacterAge": "licorne",
    "productType": "EBOOK",
    "shippingFirstName": "Marie",
    "shippingLastName": "Dupont",
    "shippingAddress": "123 Rue de la Paix",
    "shippingCity": "Paris",
    "shippingPostalCode": "75001",
    "shippingCountry": "France"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "userId": "clxxx...",
    "status": "PENDING",
    "ageRange": "3-5",
    "generalTheme": "fairy-tales",
    "specificSubject": "unicorns",
    "centralMessage": "friendship",
    "illustrationStyle": "watercolor",
    "protagonistName": "Luna",
    "protagonistAge": "4 ans",
    "eyeColor": "blue",
    "hairColor": "blonde",
    "productType": "EBOOK",
    "price": 14.99,
    "createdAt": "2025-09-10T08:25:00.000Z",
    "updatedAt": "2025-09-10T08:25:00.000Z",
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "firstName": "Luna",
      "lastName": "Test"
    }
  },
  "message": "Commande créée avec succès"
}
```

#### GET /api/orders
Récupérer toutes les commandes (limité à 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "userId": "clxxx...",
      "status": "PAID",
      "protagonistName": "Léa",
      "productType": "EBOOK",
      "price": 14.99,
      "createdAt": "2025-09-10T08:25:00.000Z",
      "user": {
        "email": "sophie.martin@example.com",
        "firstName": "Sophie",
        "lastName": "Martin"
      }
    }
  ]
}
```

#### GET /api/orders/:id
Récupérer une commande spécifique par ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "userId": "clxxx...",
    "status": "PAID",
    "ageRange": "3-5",
    "generalTheme": "fairy-tales",
    "protagonistName": "Léa",
    "productType": "EBOOK",
    "price": 14.99,
    "createdAt": "2025-09-10T08:25:00.000Z",
    "user": {
      "email": "sophie.martin@example.com",
      "firstName": "Sophie",
      "lastName": "Martin"
    }
  }
}
```

## Data Models

### Order Status
- `PENDING` - En attente de paiement
- `PAID` - Payé
- `PROCESSING` - En cours de traitement
- `COMPLETED` - Terminé
- `CANCELLED` - Annulé

### Product Types
- `EBOOK` - eBook numérique (14.99€)
- `PRINTED` - Livre relié (29.99€)
- `PACK` - Pack famille (49.99€)

### Age Ranges
- `0-2` - 0-2 ans
- `3-5` - 3-5 ans
- `6-9` - 6-9 ans
- `10+` - 10 ans et plus

### General Themes
- `fairy-tales` - Contes de fées
- `adventure` - Aventure
- `educational` - Éducatif
- `family` - Famille
- `friendship` - Amitié

### Illustration Styles
- `watercolor` - Aquarelle
- `cartoon` - Cartoon
- `realistic` - Réaliste
- `kawaii` - Kawaii
- `3d-animation` - Animation 3D

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Données manquantes ou invalides"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Commande non trouvée"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Erreur interne du serveur"
}
```

## Features

### Email Integration
- Email de confirmation automatique lors de la création d'une commande
- Service d'email configuré avec Nodemailer
- Templates HTML pour les emails

### Database
- SQLite pour le développement local
- Prisma ORM pour la gestion des données
- Données de test pré-chargées (seed)

### Security
- Helmet pour la sécurité des headers
- CORS configuré pour le frontend
- Middleware d'authentification JWT (pour les futures fonctionnalités admin)

## Development

### Start Server
```bash
npm run dev
```

### Database Operations
```bash
# Générer le client Prisma
npm run db:generate

# Créer une migration
npm run db:migrate

# Peupler la base avec des données de test
npm run db:seed

# Ouvrir Prisma Studio
npm run db:studio
```

### Environment Variables
Copier `.env.example` vers `.env` et configurer:
- `JWT_SECRET` - Secret pour les tokens JWT
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` - Configuration SMTP
- `FRONTEND_URL` - URL du frontend pour CORS
