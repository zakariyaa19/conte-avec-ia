# 📸 Guide Telegram Photo Notification

## ✅ **Fonctionnalité Implémentée**

Votre service Telegram envoie maintenant **automatiquement la photo** de l'utilisateur avec chaque notification de commande payée !

### **🔄 Processus Automatique**

1. **Client passe commande** avec photo
2. **Paiement Stripe validé** 
3. **Webhook déclenché** automatiquement
4. **Service Telegram appelé** :
   - 📸 **Photo envoyée en premier** avec caption détaillé
   - 📝 **Message complet** envoyé ensuite

### **📸 Format de la Photo**

```
📸 Photo du protagoniste

🛍️ Commande #r6z0agil
👤 Client: Jean Dupont  
👦👧 Protagoniste: Lucas

Photo envoyée par le client pour personnaliser le conte
```

### **📝 Message Détaillé**

Le message habituel avec toutes les informations de la commande suit immédiatement après la photo.

## 🧪 **Test de la Fonctionnalité**

### **Méthode 1 : Commande Réelle (Recommandée)**
1. Passez une commande test avec photo sur votre site
2. Utilisez Stripe en mode test
3. Validez le paiement
4. Vérifiez votre Telegram

### **Méthode 2 : Simulation Webhook**
```bash
# Test avec curl (remplacez par vos données)
curl -X POST https://conte-avec-ia-1.onrender.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "metadata": {
          "orderId": "ID_COMMANDE_AVEC_PHOTO"
        }
      }
    }
  }'
```

## 🔧 **Gestion des Erreurs**

### **Photo Non Trouvée**
- ✅ **Comportement** : Message envoyé sans photo
- ✅ **Log** : "⚠️ Photo non trouvée, envoi du message sans photo"
- ✅ **Pas d'interruption** du processus de notification

### **Erreur Telegram API**
- ✅ **Comportement** : Erreur loggée, notification continue
- ✅ **Fallback** : Message texte envoyé même si photo échoue

## 📊 **Logs de Debugging**

Dans les logs Render, vous verrez :
```
📸 Envoi photo Telegram: /uploads/photo-xxx.png
📁 Chemin photo: /opt/render/project/src/backend/uploads/photo-xxx.png
✅ Photo Telegram envoyée avec succès
✅ Message Telegram envoyé avec succès
```

## 🎯 **Prochaines Commandes**

**Toutes les nouvelles commandes avec photo** déclencheront automatiquement :
1. 📸 Envoi de la photo du protagoniste
2. 📝 Notification complète avec détails

## ⚠️ **Limitations Actuelles**

### **Système de Fichiers Éphémère**
- **Problème** : Photos supprimées lors des redéploiements Render
- **Impact** : Photos récentes disponibles, anciennes non
- **Solution future** : Migration vers Cloudinary (voir `SOLUTION_IMAGES_CLOUD.md`)

### **Taille des Photos**
- **Limite Telegram** : 10MB par photo
- **Formats supportés** : JPG, PNG, GIF, WebP
- **Compression automatique** par Telegram si nécessaire

## 🚀 **Fonctionnalités Futures**

### **Améliorations Possibles**
- 🌩️ **Stockage cloud** pour persistance des photos
- 🖼️ **Compression automatique** avant envoi
- 📱 **Miniatures** pour aperçu rapide
- 🔄 **Retry automatique** en cas d'échec

---

## 🎉 **Résultat**

**Dès la prochaine commande payée avec photo, vous recevrez automatiquement :**
1. 📸 La photo du protagoniste sur Telegram
2. 📝 Tous les détails de la commande

**Plus besoin d'aller dans le dashboard admin pour voir les photos !** 🎯
