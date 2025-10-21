# 🚀 Guide de Démarrage Local - Contes d'IA

## 📋 **Prérequis**
- Node.js (v18+)
- npm ou yarn
- Base de données SQLite (automatique avec Prisma)

## 🔧 **Démarrage Complet**

### **1. Backend (Port 5001)**
```bash
cd backend
npm install
npm run dev
```

**Vérification :**
- ✅ Message : "🚀 Serveur démarré sur le port 5001"
- ✅ Test : `curl http://localhost:5001/health`

### **2. Frontend (Port 3000)**
```bash
cd contes-ia
npm install
npm start
```

**Vérification :**
- ✅ Ouverture automatique : `http://localhost:3000`

## 🐛 **Résolution des Erreurs Courantes**

### **ERR_CONNECTION_REFUSED**
```
POST http://localhost:5001/api/orders net::ERR_CONNECTION_REFUSED
```

**Cause :** Backend non démarré
**Solution :**
```bash
cd backend
npm run dev
```

### **Port 5001 déjà utilisé**
```bash
# Trouver le processus
lsof -i :5001

# Tuer le processus (remplacer PID)
kill -9 <PID>
```

### **Erreur Base de Données**
```bash
cd backend
npm run db:push
npm run db:generate
```

## 📊 **Endpoints API Principaux**

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Status du serveur |
| `/api/orders` | POST | Créer une commande |
| `/api/orders/:id` | GET | Récupérer une commande |
| `/api/stripe/create-checkout-session` | POST | Session Stripe |

## 🔍 **Debugging**

### **Logs Backend**
```bash
# Dans le terminal backend
tail -f logs/app.log  # Si configuré
```

### **Logs Frontend**
- Ouvrir DevTools (F12)
- Onglet Console
- Onglet Network pour les requêtes API

### **Variables d'Environnement**
```bash
# Backend
cat backend/.env

# Frontend  
cat contes-ia/.env.local
```

## 🚀 **Commandes Utiles**

### **Redémarrage Complet**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd contes-ia && npm start
```

### **Build Production**
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd contes-ia
npm run build
```

## 📝 **Checklist de Démarrage**

- [ ] Backend démarré (port 5001)
- [ ] Frontend démarré (port 3000)
- [ ] Base de données connectée
- [ ] Variables d'environnement configurées
- [ ] Test de santé API réussi

## 🆘 **Support**

En cas de problème :
1. Vérifier les logs dans les terminaux
2. Tester les endpoints avec curl
3. Vérifier les variables d'environnement
4. Redémarrer les services

---
*Guide créé le 21/10/2025*
