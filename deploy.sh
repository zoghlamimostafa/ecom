#!/bin/bash
# Script de déploiement automatique pour Sanny Store

echo "🚀 Déploiement Sanny Store - $(date)"
echo "=================================="

# Vérification des dépendances
command -v node >/dev/null 2>&1 || { echo "❌ Node.js requis"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm requis"; exit 1; }

# Variables
FRONTEND_DIR="Client"
BACKEND_DIR="backend"
BUILD_DIR="build"

echo "📦 1. Nettoyage et installation des dépendances..."

# Frontend
cd $FRONTEND_DIR
echo "   🔨 Frontend: installation des dépendances..."
npm ci --silent
echo "   📦 Frontend: build de production..."
npm run build
cd ..

# Backend
cd $BACKEND_DIR
echo "   🔨 Backend: installation des dépendances..."
npm ci --production --silent
echo "   🧪 Backend: tests..."
npm test --silent
cd ..

echo "✅ 2. Build terminé avec succès!"

# Vérification du build
if [ -d "$FRONTEND_DIR/$BUILD_DIR" ]; then
    echo "   ✅ Build frontend créé: $(du -sh $FRONTEND_DIR/$BUILD_DIR | cut -f1)"
else
    echo "   ❌ Erreur: Build frontend introuvable"
    exit 1
fi

echo "🌐 3. Prêt pour le déploiement!"
echo "   📁 Frontend build: $FRONTEND_DIR/$BUILD_DIR"
echo "   ⚙️  Backend: $BACKEND_DIR"
echo ""
echo "🚀 Étapes suivantes:"
echo "   1. Configurer les variables d'environnement"
echo "   2. Déployer le backend sur Railway/Heroku"
echo "   3. Déployer le frontend sur Vercel/Netlify"
echo "   4. Configurer le domaine personnalisé"
echo ""
echo "📖 Documentation complète: GUIDE_HEBERGEMENT_COMPLETE.md"
