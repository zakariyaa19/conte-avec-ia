# Guide de Démarrage - Contes d'IA

Ce guide vous explique comment démarrer les serveurs backend et frontend de votre application Contes d'IA.

## 📋 Prérequis

- Node.js installé (version 16 ou supérieure)
- npm ou yarn
- Terminal/Invite de commandes

## 🚀 Démarrage Rapide

### 1. Ouvrir le Terminal

**Sur Mac :**
- Appuyez sur `Cmd + Espace`
- Tapez "Terminal" et appuyez sur Entrée

**Sur Windows :**
- Appuyez sur `Win + R`
- Tapez "cmd" et appuyez sur Entrée

### 2. Naviguer vers le projet

```bash
cd "/Users/kovsky/Documents/conte-ia copie"
```

## 🔧 Démarrer le Backend (Port 5001)

### Étape 1 : Aller dans le dossier backend
```bash
cd backend
```

### Étape 2 : Démarrer le serveur
```bash
npm run dev
```

**✅ Signes que ça fonctionne :**
- Vous voyez : `🚀 Serveur démarré sur le port 5001`
- Vous voyez : `✅ Connexion à la base de données établie`
- Le terminal reste ouvert et affiche des logs

**❌ Si ça ne marche pas :**
- Vérifiez que vous êtes dans le bon dossier : `pwd` (doit afficher le chemin vers backend)
- Installez les dépendances : `npm install`
- Puis relancez : `npm run dev`

## 🎨 Démarrer le Frontend (Port 3000)

### Étape 1 : Ouvrir un NOUVEAU terminal
**Important :** Ne fermez pas le terminal du backend, ouvrez-en un nouveau !

### Étape 2 : Aller dans le dossier frontend
```bash
cd "/Users/kovsky/Documents/conte-ia copie/contes-ia"
```

### Étape 3 : Démarrer le serveur
```bash
npm start
```

**✅ Signes que ça fonctionne :**
- Vous voyez : `Compiled successfully!`
- Vous voyez : `Local: http://localhost:3000`
- Votre navigateur s'ouvre automatiquement

**❌ Si ça ne marche pas :**
- Installez les dépendances : `npm install`
- Puis relancez : `npm start`

## 🌐 Vérifier que tout fonctionne

### Backend (API)
Ouvrez votre navigateur et allez sur :
- http://localhost:5001/health

Vous devriez voir : `{"status":"OK","message":"API is running"}`

### Frontend (Site web)
Ouvrez votre navigateur et allez sur :
- http://localhost:3000

Vous devriez voir votre site Contes d'IA.

### Images
Les images des exemples devraient se charger depuis :
- http://localhost:5001/images/covers/

## 🛑 Arrêter les serveurs

Pour arrêter un serveur :
- Dans le terminal correspondant, appuyez sur `Ctrl + C`
- Confirmez avec `Y` si demandé

## 📝 Résumé des commandes

```bash
# Terminal 1 - Backend
cd "/Users/kovsky/Documents/conte-ia copie/backend"
npm run dev

# Terminal 2 - Frontend  
cd "/Users/kovsky/Documents/conte-ia copie/contes-ia"
npm start
```

## 🔍 Dépannage

### Port déjà utilisé
Si vous voyez "Port 3000 is already in use" :
- Tapez `Y` pour utiliser un autre port
- Ou arrêtez l'ancien processus avec `Ctrl + C`

### Erreurs de dépendances
```bash
# Dans le dossier concerné
npm install
# Puis relancez le serveur
```

### Base de données
Si le backend ne se connecte pas à la DB :
```bash
cd backend
npm run db:push
```

## 💡 Conseils

1. **Gardez les deux terminaux ouverts** pendant que vous travaillez
2. **Backend d'abord**, puis frontend
3. **Vérifiez les URLs** : 3000 pour le site, 5001 pour l'API
4. **En cas de doute**, redémarrez les deux serveurs

---

🎉 **Votre application Contes d'IA est maintenant prête !**
