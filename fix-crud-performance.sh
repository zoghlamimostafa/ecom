#!/bin/bash

echo "🚀 Optimisation du CRUD admin en cours..."

# Aller dans le répertoire backend
cd /home/blackrdp/sanny/san/ecomerce_sanny/backend

# Installer node-cache si pas déjà installé
echo "📦 Installation des dépendances..."
npm install node-cache --save

# Exécuter le script d'optimisation de la base de données
echo "🗄️ Optimisation de la base de données..."
node scripts/fix-admin-performance.js

# Redémarrer PM2 avec les nouvelles optimisations
echo "🔄 Redémarrage du serveur admin..."
pm2 restart sanny-admin

# Vérifier le statut
echo "📊 Vérification du statut..."
pm2 list | grep sanny-admin

echo "✅ Optimisation terminée !"
echo "📈 Les performances admin devrait maintenant être améliorées :"
echo "   - Pagination forcée (max 20 éléments)"
echo "   - Cache intelligent"
echo "   - Index de base de données"
echo "   - Timeout des requêtes (10s max)"
echo "   - Monitoring des performances"