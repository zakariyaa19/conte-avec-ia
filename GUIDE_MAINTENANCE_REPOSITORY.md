# 🔧 Guide de Maintenance du Repository Conte-IA

## 🎯 **Objectif**
Ce guide vous aide à maintenir votre repository GitHub propre et éviter les problèmes comme les dossiers vides ou les fichiers indésirables.

## ✅ **Vérifications Automatiques**

### **Script de Vérification**
Utilisez le script `verify-repo.sh` avant chaque push :
```bash
./verify-repo.sh
```

### **Vérifications Manuelles Rapides**
```bash
# Vérifier qu'il n'y a qu'un seul .git
find . -name ".git" -type d

# Vérifier les fichiers trackés
git ls-files | wc -l

# Vérifier le statut
git status
```

## 🚫 **Fichiers à NE JAMAIS Commiter**

### **Fichiers Sensibles**
- ❌ `.env`, `.env.local` - Variables d'environnement
- ❌ `*.key`, `*.secret` - Clés privées
- ❌ Tokens d'API en dur dans le code

### **Fichiers Temporaires**
- ❌ `node_modules/` - Dépendances (très lourd)
- ❌ `dist/`, `build/` - Fichiers compilés
- ❌ `.DS_Store`, `Thumbs.db` - Fichiers système
- ❌ `*.log` - Fichiers de logs

### **Fichiers de Base de Données**
- ❌ `*.db`, `*.sqlite` - Bases de données locales
- ❌ `uploads/` - Fichiers uploadés par les utilisateurs

## ✅ **Bonnes Pratiques**

### **Avant Chaque Commit**
1. **Vérifier** le statut : `git status`
2. **Exécuter** le script : `./verify-repo.sh`
3. **Reviewer** les fichiers : `git diff --cached`
4. **Commiter** avec un message descriptif

### **Messages de Commit**
```bash
# ✅ Bon
git commit -m "✨ Ajout: Nouvelle fonctionnalité de paiement Stripe"
git commit -m "🔧 Fix: Correction du bug d'affichage mobile"
git commit -m "📚 Docs: Mise à jour du guide d'installation"

# ❌ Mauvais
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### **Structure de Commit**
```
🎯 Type: Description courte (50 chars max)

- Détail 1
- Détail 2
- Détail 3

Fixes #123
```

**Types recommandés :**
- ✨ `:sparkles:` - Nouvelle fonctionnalité
- 🔧 `:wrench:` - Correction de bug
- 📚 `:books:` - Documentation
- 🎨 `:art:` - Amélioration UI/UX
- ⚡ `:zap:` - Performance
- 🔒 `:lock:` - Sécurité

## 🔄 **Workflow Recommandé**

### **Développement Local**
```bash
# 1. Vérifier l'état
git status

# 2. Ajouter les fichiers
git add .

# 3. Vérifier avant commit
./verify-repo.sh

# 4. Commiter
git commit -m "✨ Nouvelle fonctionnalité"

# 5. Pousser
git push origin main
```

### **En Cas de Problème**
```bash
# Annuler le dernier commit (garde les changements)
git reset --soft HEAD~1

# Retirer un fichier du staging
git restore --staged <fichier>

# Nettoyer les fichiers non trackés
git clean -fd

# Voir l'historique
git log --oneline -10
```

## 🛡️ **Protection du Repository**

### **Fichiers Critiques à Protéger**
- ✅ `backend/src/` - Code source backend
- ✅ `contes-ia/src/` - Code source frontend
- ✅ `*.md` - Documentation
- ✅ `package.json` - Configuration des dépendances
- ✅ `*.ts`, `*.tsx` - Fichiers TypeScript

### **Sauvegarde Automatique**
```bash
# Créer une branche de sauvegarde
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
git checkout main
```

## 🚨 **Résolution des Problèmes Courants**

### **Dossier Vide sur GitHub**
```bash
# Vérifier s'il y a un .git imbriqué
find . -name ".git" -type d

# Si trouvé, supprimer et re-ajouter
rm -rf dossier/.git
git rm --cached dossier
git add dossier/
git commit -m "🔧 Fix: Correction dossier vide"
git push
```

### **Fichiers Sensibles Commitées**
```bash
# Retirer du cache (garde le fichier local)
git rm --cached .env

# Ajouter au .gitignore
echo ".env" >> .gitignore

# Commiter la correction
git commit -m "🔒 Security: Suppression fichier sensible"
git push
```

### **Repository Trop Lourd**
```bash
# Voir les gros fichiers
git ls-files | xargs ls -la | sort -k5 -rn | head -20

# Nettoyer l'historique (ATTENTION: destructif)
git filter-branch --tree-filter 'rm -rf node_modules' HEAD
```

## 📊 **Monitoring du Repository**

### **Statistiques Utiles**
```bash
# Nombre de fichiers par type
git ls-files | grep -E "\.(ts|tsx|js|jsx)$" | wc -l  # Code
git ls-files | grep -E "\.(md|txt)$" | wc -l        # Docs
git ls-files | grep -E "\.(jpg|png|pdf)$" | wc -l   # Assets

# Taille du repository
du -sh .git

# Derniers commits
git log --oneline -10
```

### **Alertes à Surveiller**
- 🚨 Repository > 100MB
- 🚨 Plus de 1000 fichiers dans dist/
- 🚨 Fichiers .env trackés
- 🚨 node_modules/ présent

## 🎯 **Checklist Avant Push**

- [ ] `./verify-repo.sh` passe sans erreur
- [ ] Aucun fichier sensible (.env, .key, etc.)
- [ ] Aucun node_modules/ tracké
- [ ] Message de commit descriptif
- [ ] Tests locaux passent
- [ ] Documentation à jour

## 📞 **En Cas de Problème Majeur**

Si vous avez un problème que vous ne pouvez pas résoudre :

1. **Créer une sauvegarde** : `git branch backup-emergency`
2. **Noter l'erreur** exacte
3. **Ne pas forcer** avec `git push --force`
4. **Demander de l'aide** avec les détails du problème

**Votre repository est maintenant protégé et maintenu correctement !** 🛡️
