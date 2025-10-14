#!/bin/bash

# 🔍 Script de Vérification du Repository Conte-IA
# Ce script vérifie que le repository est propre et prêt pour le déploiement

echo "🔍 VÉRIFICATION DU REPOSITORY CONTE-IA"
echo "======================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur d'erreurs
ERRORS=0

echo ""
echo "1️⃣  Vérification des repositories Git imbriqués..."
NESTED_REPOS=$(find . -name ".git" -type d | grep -v "^./.git$")
if [ -z "$NESTED_REPOS" ]; then
    echo -e "${GREEN}✅ Aucun repository Git imbriqué trouvé${NC}"
else
    echo -e "${RED}❌ Repositories Git imbriqués détectés:${NC}"
    echo "$NESTED_REPOS"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "2️⃣  Vérification des fichiers sensibles..."
SENSITIVE_FILES=$(git ls-files | grep -E "\.(env|key|secret|token)$")
if [ -z "$SENSITIVE_FILES" ]; then
    echo -e "${GREEN}✅ Aucun fichier sensible tracké${NC}"
else
    echo -e "${RED}❌ Fichiers sensibles détectés:${NC}"
    echo "$SENSITIVE_FILES"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "3️⃣  Vérification des node_modules..."
NODE_MODULES=$(git ls-files | grep node_modules)
if [ -z "$NODE_MODULES" ]; then
    echo -e "${GREEN}✅ Aucun node_modules tracké${NC}"
else
    echo -e "${RED}❌ node_modules détectés:${NC}"
    echo "$NODE_MODULES" | head -5
    echo "... (et plus)"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "4️⃣  Vérification des fichiers build..."
BUILD_FILES=$(git ls-files | grep -E "(dist/|build/)")
if [ -z "$BUILD_FILES" ]; then
    echo -e "${GREEN}✅ Aucun fichier build tracké${NC}"
else
    echo -e "${YELLOW}⚠️  Fichiers build détectés (peuvent être ignorés):${NC}"
    echo "$BUILD_FILES" | wc -l | xargs echo "Nombre de fichiers:"
fi

echo ""
echo "5️⃣  Vérification des fichiers système..."
SYSTEM_FILES=$(git ls-files | grep -E "\.(DS_Store|Thumbs\.db)$")
if [ -z "$SYSTEM_FILES" ]; then
    echo -e "${GREEN}✅ Aucun fichier système tracké${NC}"
else
    echo -e "${RED}❌ Fichiers système détectés:${NC}"
    echo "$SYSTEM_FILES"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "6️⃣  Vérification de la structure principale..."
FRONTEND_FILES=$(git ls-files | grep "contes-ia/" | wc -l)
BACKEND_FILES=$(git ls-files | grep "backend/" | wc -l)
echo -e "${GREEN}📁 Frontend: $FRONTEND_FILES fichiers${NC}"
echo -e "${GREEN}📁 Backend: $BACKEND_FILES fichiers${NC}"

if [ $FRONTEND_FILES -lt 50 ]; then
    echo -e "${RED}❌ Trop peu de fichiers frontend détectés${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ $BACKEND_FILES -lt 20 ]; then
    echo -e "${RED}❌ Trop peu de fichiers backend détectés${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "7️⃣  Vérification du statut Git..."
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✅ Working directory propre${NC}"
else
    echo -e "${YELLOW}⚠️  Modifications non commitées détectées${NC}"
    git status --porcelain
fi

echo ""
echo "8️⃣  Vérification de la connexion remote..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ -n "$REMOTE_URL" ]; then
    echo -e "${GREEN}✅ Remote configuré: $REMOTE_URL${NC}"
else
    echo -e "${RED}❌ Aucun remote configuré${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 REPOSITORY PRÊT POUR LE DÉPLOIEMENT!${NC}"
    echo -e "${GREEN}✅ Toutes les vérifications sont passées${NC}"
else
    echo -e "${RED}❌ $ERRORS erreur(s) détectée(s)${NC}"
    echo -e "${YELLOW}⚠️  Corrigez les erreurs avant de déployer${NC}"
fi
echo "======================================"
