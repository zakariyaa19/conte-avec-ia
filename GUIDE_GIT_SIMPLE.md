# 🚀 Guide Git Simple - Comment Envoyer vos Modifications sur GitHub

## 📋 **Commandes de Base (à retenir par cœur)**

### **1. Vérifier l'état de vos fichiers**
```bash
git status
```
*Affiche quels fichiers ont été modifiés*

### **2. Ajouter tous les fichiers modifiés**
```bash
git add .
```
*Prépare tous les fichiers pour le commit*

### **3. Créer un commit avec un message**
```bash
git commit -m "Description de vos modifications"
```
*Sauvegarde vos modifications avec un message descriptif*

### **4. Envoyer vers GitHub**
```bash
git push origin main
```
*Envoie vos modifications sur GitHub*

---

## ⚡ **Processus Complet en 4 Étapes**

```bash
# 1. Voir ce qui a changé
git status

# 2. Ajouter tout
git add .

# 3. Commit avec message
git commit -m "✨ Vos modifications ici"

# 4. Push vers GitHub
git push origin main
```

---

## 💡 **Exemples de Messages de Commit**

**✅ Bons exemples :**
```bash
git commit -m "✨ Ajout nouvelle fonctionnalité de paiement"
git commit -m "🐛 Correction bug affichage footer"
git commit -m "📧 Mise à jour email de contact"
git commit -m "🎨 Amélioration design page d'accueil"
```

**❌ À éviter :**
```bash
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

---

## 🔄 **Workflow Quotidien**

**Avant de commencer à travailler :**
```bash
git pull origin main
```
*Récupère les dernières modifications*

**Après avoir terminé vos modifications :**
```bash
git add .
git commit -m "📝 Description de ce que vous avez fait"
git push origin main
```

---

## 🆘 **Commandes Utiles en Cas de Problème**

### **Annuler des modifications non commitées**
```bash
git restore .
```

### **Voir l'historique des commits**
```bash
git log --oneline
```

### **Voir les différences**
```bash
git diff
```

### **Récupérer les dernières modifications de GitHub**
```bash
git pull origin main
```

---

## 📱 **Version Ultra-Rapide (à utiliser 90% du temps)**

```bash
git add . && git commit -m "✨ Vos modifications" && git push origin main
```

*Cette commande fait tout en une fois !*

---

## 🎯 **Conseils Pro**

1. **Commitez souvent** - Mieux vaut 10 petits commits qu'un gros
2. **Messages clairs** - Expliquez ce que vous avez fait
3. **Pull avant push** - Récupérez les modifications avant d'envoyer
4. **Testez avant commit** - Vérifiez que tout fonctionne

---

## 🚨 **En Cas d'Urgence**

Si vous avez un problème, ces commandes peuvent vous sauver :

```bash
# Voir l'état actuel
git status

# Annuler toutes les modifications non sauvées
git restore .

# Récupérer la dernière version de GitHub
git pull origin main
```

---

**💪 Avec ces commandes, vous êtes autonome pour gérer votre code sur GitHub !**
