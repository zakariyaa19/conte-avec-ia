# Guide d'Administration - Contes d'IA

## 🔐 Accès Administrateur

### Connexion
- **URL** : `http://localhost:3000/admin`
- **Email** : `admin@contes-ia.com`
- **Mot de passe** : `admin123`
- **Rôle** : SUPER_ADMIN

### Sécurité
- Authentification JWT avec expiration 24h
- Token stocké dans localStorage
- Redirection automatique si session expirée
- Routes protégées avec middleware d'authentification

## 📊 Dashboard Principal

### Statistiques Temps Réel
- **Commandes totales** : Nombre total de commandes
- **En attente** : Commandes avec statut PENDING
- **Payées** : Commandes avec statut PAID ou supérieur
- **Chiffre d'affaires** : Somme des commandes payées

### Liste des Commandes
- Affichage paginé (20 par page)
- Filtres par statut disponibles
- Colonnes : ID, Client, Protagoniste, Produit, Prix, Statut, Date
- Actions rapides pour chaque commande

## 🔄 Gestion des Statuts

### Workflow des Commandes
1. **PENDING** → Commande créée, en attente de paiement
2. **PAID** → Paiement confirmé
3. **PROCESSING** → En cours de traitement
4. **GENERATED** → Conte généré
5. **PRINTED** → Imprimé (uniquement pour livres physiques)
6. **SHIPPED** → Expédié
7. **DELIVERED** → Livré

### Actions Rapides Dashboard
- ✓ **Payé** : PENDING → PAID
- 🔄 **Traitement** : PAID → PROCESSING
- 📖 **Généré** : PROCESSING → GENERATED
- 🖨️ **Imprimé** : GENERATED → PRINTED (livres uniquement)
- 📦 **Expédié** / 📧 **Livré** : selon le type de produit
- ✅ **Livré** : SHIPPED → DELIVERED

## 📋 Détails des Commandes

### Accès aux Détails
- Cliquer sur l'ID d'une commande dans le dashboard
- URL : `/admin/order/{ID_COMMANDE}`

### Informations Affichées

#### Informations Générales
- Statut actuel avec badge coloré
- Email du client
- Type de produit (EBOOK, PRINTED, PACK)
- Prix
- Dates de création et paiement

#### Détails du Conte
- Tranche d'âge
- Thème général
- Sujet spécifique
- Message central
- Style d'illustration

#### Protagoniste
- Nom et âge
- Couleur des yeux et cheveux
- Personnage secondaire (si applicable)

#### Adresse de Livraison
- Nom complet
- Adresse complète
- Ville, code postal, pays
- (Affiché uniquement si renseigné)

### Actions Contextuelles
Boutons d'action adaptés au statut actuel de la commande avec progression logique du workflow.

## 🛠️ Fonctionnalités Techniques

### Gestion des Erreurs
- Messages d'erreur détaillés
- Gestion automatique des tokens expirés
- Redirection vers connexion si nécessaire
- Logs de débogage en mode développement

### Navigation
- Bouton retour depuis les détails
- URLs propres et bookmarkables
- Navigation cohérente

### Interface Utilisateur
- Design responsive
- Thème cohérent avec l'application
- Feedback visuel pour les actions
- États de chargement

## 🔧 Maintenance

### Logs Backend
Le serveur backend affiche des logs détaillés pour :
- Authentification admin
- Mise à jour des commandes
- Erreurs et exceptions
- Requêtes API

### Base de Données
- SQLite en développement
- Modèles Prisma pour la gestion des données
- Migrations automatiques

### Variables d'Environnement
```
JWT_SECRET=your-super-secret-jwt-key-for-admin-auth
FRONTEND_URL=http://localhost:3000
PORT=5001
```

## 🚨 Dépannage

### Problèmes Courants

#### Session Expirée
- **Symptôme** : Erreur 401 ou redirection vers connexion
- **Solution** : Se reconnecter avec les identifiants admin

#### Erreur de Mise à Jour
- **Symptôme** : Erreur 500 lors du changement de statut
- **Solution** : Vérifier les logs backend, redémarrer le serveur si nécessaire

#### Interface Non Accessible
- **Symptôme** : Page blanche ou erreur de chargement
- **Solution** : Vérifier que le frontend (port 3000) et backend (port 5001) sont démarrés

### Commandes de Démarrage
```bash
# Backend
cd backend
npm run dev

# Frontend
cd contes-ia
npm start
```

## 📈 Utilisation Recommandée

### Workflow Quotidien
1. Consulter le dashboard pour les nouvelles commandes
2. Traiter les commandes PENDING (vérifier paiements)
3. Faire progresser les commandes en cours
4. Mettre à jour les statuts selon l'avancement réel

### Bonnes Pratiques
- Marquer les commandes comme payées uniquement après vérification
- Suivre le workflow logique des statuts
- Utiliser les détails complets pour la production des contes
- Maintenir les statuts à jour pour le suivi client

## 🔒 Sécurité en Production

### Recommandations
- Changer le mot de passe admin par défaut
- Utiliser HTTPS en production
- Configurer des secrets JWT robustes
- Limiter l'accès réseau au panel admin
- Sauvegarder régulièrement la base de données
