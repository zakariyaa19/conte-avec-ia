# 🚀 Guide de Déploiement Backend - Contes d'IA

## 🚨 **Problème Actuel**

Le service Render est **suspendu**, c'est pourquoi l'interface admin ne fonctionne pas en production.

```
Service Status: SUSPENDED
URL: https://conte-avec-ia-backend.onrender.com
Erreur: "This service has been suspended by its owner"
```

## 🔧 **Solutions de Déploiement**

### **Option 1 : Réactiver Render (Recommandé)**

1. **Connectez-vous** à votre compte Render
2. **Réactivez** le service `conte-avec-ia-backend`
3. **Vérifiez** les variables d'environnement
4. **Redéployez** si nécessaire

### **Option 2 : Vercel Functions**

```bash
# Déployer le backend sur Vercel
cd backend
npx vercel --prod

# Récupérer l'URL de déploiement
# Ex: https://backend-abc123.vercel.app
```

### **Option 3 : Railway**

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Déployer
cd backend
railway login
railway init
railway up
```

### **Option 4 : Heroku**

```bash
# Installer Heroku CLI
cd backend
heroku create conte-ia-backend
git push heroku main
```

## 🔄 **Mise à Jour Configuration Frontend**

Une fois le backend redéployé, mettez à jour l'URL dans le frontend :

```typescript
// Dans contes-ia/src/config/api.ts
return 'https://VOTRE-NOUVELLE-URL-BACKEND.com';
```

## 📋 **Variables d'Environnement Requises**

Assurez-vous que ces variables sont configurées sur votre service :

```env
# Base de données
DATABASE_URL="your-database-url"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Mailjet
MAILJET_API_KEY="your-mailjet-api-key"
MAILJET_SECRET_KEY="your-mailjet-secret-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"

# URLs
FRONTEND_URL="https://contedia.fr"
```

## 🧪 **Test du Backend**

Une fois déployé, testez avec :

```bash
# Health check
curl https://VOTRE-URL-BACKEND/health

# Test admin login
curl -X POST https://VOTRE-URL-BACKEND/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"contact@contedia.fr","password":"lvAlancheDestoc!ea"}'
```

## ⚡ **Solution Temporaire**

En attendant le redéploiement, vous pouvez :

1. **Utiliser l'admin en local** :
   ```bash
   cd backend && npm run dev
   # Puis accéder à http://localhost:3000/admin
   ```

2. **Configurer une URL temporaire** dans `api.ts`

## 🎯 **Checklist de Déploiement**

- [ ] Service backend réactivé/redéployé
- [ ] Variables d'environnement configurées
- [ ] Base de données connectée
- [ ] URL mise à jour dans le frontend
- [ ] Test de santé réussi
- [ ] Test admin login réussi
- [ ] Frontend redéployé avec nouvelle config

## 📞 **Support**

Si vous avez besoin d'aide pour :
- Réactiver Render
- Configurer un nouveau service
- Débugger les variables d'environnement

Contactez-moi avec les détails de votre compte de déploiement.

---

**Status actuel :** ❌ Backend suspendu
**Action requise :** Réactiver ou redéployer le backend
**Impact :** Interface admin non fonctionnelle en production
