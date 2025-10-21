# 🔐 Sécurité Administration - Contes d'IA

## ✅ **Informations de Connexion Admin**

### **Accès Production**
- **URL** : `https://contedia.fr/admin`
- **Email** : `contact@contedia.fr`
- **Mot de passe** : `lvAlancheDestoc!ea`

### **Accès Local (Développement)**
- **URL** : `http://localhost:3000/admin`
- **Email** : `contact@contedia.fr`
- **Mot de passe** : `lvAlancheDestoc!ea`

---

## 🛡️ **Mesures de Sécurité Appliquées**

### **1. Authentification Renforcée**
- ✅ **Mot de passe complexe** : 18 caractères avec majuscules, minuscules, chiffres et symboles
- ✅ **Hachage bcrypt** : Mot de passe hashé avec salt (rounds: 10)
- ✅ **JWT sécurisé** : Token avec expiration 24h
- ✅ **Validation stricte** : Email et mot de passe requis

### **2. Protection Backend**
```typescript
// Vérification des identifiants
const isPasswordValid = await bcrypt.compare(password, admin.password);

// Token JWT avec expiration
const token = jwt.sign(
  { adminId: admin.id, email: admin.email, role: admin.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### **3. Protection Frontend**
- ✅ **Token localStorage** : Stockage sécurisé du token
- ✅ **Auto-déconnexion** : Redirection si token expiré
- ✅ **Routes protégées** : Vérification token sur chaque requête
- ✅ **Gestion erreurs** : Messages d'erreur sécurisés

---

## 🚀 **Fonctionnalités Admin**

### **Dashboard Principal**
- 📊 **Statistiques** : Commandes, revenus, utilisateurs
- 📋 **Liste des commandes** : Filtrage et recherche
- 🔍 **Détails commandes** : Vue complète avec actions

### **Gestion des Commandes**
- ✅ **Visualisation** : Toutes les informations client
- ✅ **Mise à jour statut** : En cours, terminé, annulé
- ✅ **Gestion paiements** : Suivi Stripe
- ✅ **Export données** : Fonctionnalité future

---

## 🔧 **Maintenance & Sécurité**

### **Rotation des Mots de Passe**
```bash
# Mettre à jour le mot de passe admin
cd backend
npx ts-node src/utils/createAdmin.ts
```

### **Surveillance des Accès**
- 📝 **Logs connexion** : Toutes les tentatives enregistrées
- 🚨 **Alertes sécurité** : Échecs de connexion multiples
- 🔍 **Audit trail** : Historique des actions admin

### **Variables d'Environnement**
```env
# Backend .env
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_SESSION_DURATION=24h
```

---

## 🆘 **Résolution des Problèmes**

### **Impossible de se connecter**
1. **Vérifier le backend** : `curl http://localhost:5001/health`
2. **Tester l'API** : `curl -X POST http://localhost:5001/api/admin/login`
3. **Recréer l'admin** : `npx ts-node src/utils/createAdmin.ts`

### **Token expiré**
- **Symptôme** : Redirection automatique vers `/admin`
- **Solution** : Se reconnecter avec les identifiants

### **Erreur 401 Unauthorized**
- **Cause** : Token invalide ou expiré
- **Solution** : Vider localStorage et se reconnecter

---

## 📋 **Checklist de Sécurité**

- [x] Mot de passe complexe configuré
- [x] Hachage bcrypt activé
- [x] JWT avec expiration
- [x] Routes protégées
- [x] Gestion des erreurs
- [x] Auto-déconnexion
- [x] Logs de sécurité
- [ ] Rate limiting (à implémenter)
- [ ] 2FA (fonctionnalité future)
- [ ] Audit complet (fonctionnalité future)

---

## 🔄 **Déploiement**

### **Variables d'Environnement Vercel**
```
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-database-url
```

### **Test Post-Déploiement**
1. Accéder à `https://contedia.fr/admin`
2. Se connecter avec les identifiants
3. Vérifier l'accès au dashboard
4. Tester les fonctionnalités de gestion

---

*Sécurité mise à jour le 21/10/2025*
*Prochaine révision : 21/01/2026*
