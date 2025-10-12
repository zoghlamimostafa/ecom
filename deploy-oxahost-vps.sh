#!/bin/bash
# deploy-oxahost-vps.sh
# Script de déploiement pour VPS OxaHost

set -e

echo "🚀 DÉPLOIEMENT SANNY STORE - VPS OXAHOST"
echo "========================================"

# Variables spécifiques OxaHost
PROJECT_DIR="/var/www/sanny-store"
NGINX_DIR="/var/www/html"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/Client"
BACKUP_DIR="/backup/$(date +%Y%m%d-%H%M%S)"
LOG_DIR="/var/log/sanny-store"

# Création des dossiers de logs
mkdir -p $LOG_DIR
mkdir -p $BACKUP_DIR

echo "📦 1. Backup et mise à jour du code..."
if [ -d "$PROJECT_DIR" ]; then
    echo "Création du backup..."
    tar -czf $BACKUP_DIR/backup-$(date +%H%M%S).tar.gz $PROJECT_DIR
fi

cd $PROJECT_DIR
git stash
git pull origin main

echo "⚙️ 2. Configuration et déploiement backend..."
cd $BACKEND_DIR

# Installation dépendances
npm install --production --silent

# Migration base de données (si applicable)
if [ -f "migrations.js" ]; then
    echo "Migration base de données..."
    node migrations.js
fi

# Configuration PM2 avec logs
pm2 delete sanny-backend 2>/dev/null || true
pm2 start npm --name "sanny-backend" -- start
pm2 startup
pm2 save

echo "🎨 3. Build et déploiement frontend..."
cd $FRONTEND_DIR

# Installation et build
npm install --silent
npm run build

# Backup de l'ancien site
if [ -d "$NGINX_DIR" ] && [ "$(ls -A $NGINX_DIR)" ]; then
    mv $NGINX_DIR/* $BACKUP_DIR/old-site/ 2>/dev/null || true
fi

# Déploiement nouveau build
cp -r build/* $NGINX_DIR/
chown -R www-data:www-data $NGINX_DIR

echo "🔧 4. Configuration serveur..."
# Test configuration Nginx
nginx -t

# Redémarrage services
systemctl reload nginx
pm2 restart sanny-backend

echo "🔒 5. Vérification SSL..."
if command -v certbot &> /dev/null; then
    echo "SSL Let's Encrypt disponible"
else
    echo "Pour SSL : apt install certbot python3-certbot-nginx"
fi

echo "🏥 6. Vérification santé..."
sleep 5

# Test frontend
if curl -f -s http://localhost > /dev/null; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend non accessible"
fi

# Test API
if curl -f -s http://localhost:4000/api/health > /dev/null 2>&1; then
    echo "✅ API accessible"
else
    echo "⚠️  API non accessible (vérifiez PM2)"
fi

echo "🧹 7. Nettoyage..."
# Nettoyage anciens backups (7 jours)
find /backup -name "*" -mtime +7 -type f -delete 2>/dev/null || true

echo ""
echo "🎉 DÉPLOIEMENT OXAHOST RÉUSSI !"
echo "=============================="
echo "🌐 Site: https://votre-domaine.com"
echo "🔧 Admin: https://votre-domaine.com/admin"
echo "📊 Logs: pm2 logs sanny-backend"
echo "📈 Status: pm2 status"
echo "🔍 Nginx logs: tail -f /var/log/nginx/oxahost-sanny-*.log"
echo ""
echo "Déploiement terminé à $(date)"