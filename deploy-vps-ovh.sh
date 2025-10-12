#!/bin/bash
# deploy-vps-ovh.sh
# Script de déploiement automatique pour VPS OVH

set -e

echo "🚀 DÉPLOIEMENT SANNY STORE - VPS OVH"
echo "===================================="

# Variables
PROJECT_DIR="/var/www/sanny-store"
NGINX_DIR="/var/www/html"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/Client"
BACKUP_DIR="/backup/$(date +%Y%m%d-%H%M%S)"

# Fonction de backup
backup_current() {
    echo "📦 Création du backup..."
    mkdir -p $BACKUP_DIR
    
    # Backup base de données
    if command -v pg_dump &> /dev/null; then
        pg_dump -U sanny_user sanny_store > $BACKUP_DIR/database.sql
        echo "✅ Backup base de données créé"
    fi
    
    # Backup fichiers
    if [ -d "$PROJECT_DIR" ]; then
        tar -czf $BACKUP_DIR/files.tar.gz $PROJECT_DIR
        echo "✅ Backup fichiers créé"
    fi
}

# Mise à jour du code
update_code() {
    echo "📥 Mise à jour du code..."
    cd $PROJECT_DIR
    
    # Stash des modifications locales
    git stash
    
    # Pull des dernières modifications
    git pull origin main
    
    echo "✅ Code mis à jour"
}

# Déploiement backend
deploy_backend() {
    echo "⚙️ Déploiement backend..."
    cd $BACKEND_DIR
    
    # Installation des dépendances
    npm install --production --silent
    
    # Migration base de données (si applicable)
    if [ -f "migrate.js" ]; then
        node migrate.js
    fi
    
    # Redémarrage PM2
    pm2 restart sanny-backend || pm2 start npm --name "sanny-backend" -- start
    
    echo "✅ Backend déployé"
}

# Déploiement frontend
deploy_frontend() {
    echo "🎨 Déploiement frontend..."
    cd $FRONTEND_DIR
    
    # Installation des dépendances
    npm install --silent
    
    # Build de production
    npm run build
    
    # Backup de l'ancien site
    if [ -d "$NGINX_DIR" ]; then
        mv $NGINX_DIR $BACKUP_DIR/old-site
    fi
    
    # Déploiement du nouveau build
    mkdir -p $NGINX_DIR
    cp -r build/* $NGINX_DIR/
    
    # Permissions
    chown -R www-data:www-data $NGINX_DIR
    
    echo "✅ Frontend déployé"
}

# Redémarrage des services
restart_services() {
    echo "🔄 Redémarrage des services..."
    
    # Test configuration Nginx
    nginx -t
    
    # Redémarrage Nginx
    systemctl reload nginx
    
    # Vérification PM2
    pm2 status
    
    echo "✅ Services redémarrés"
}

# Vérification santé
health_check() {
    echo "🏥 Vérification santé..."
    
    # Test Nginx
    if curl -f http://localhost > /dev/null 2>&1; then
        echo "✅ Nginx fonctionne"
    else
        echo "❌ Nginx ne répond pas"
        exit 1
    fi
    
    # Test API
    if curl -f http://localhost:4000/api/health > /dev/null 2>&1; then
        echo "✅ API fonctionne"
    else
        echo "❌ API ne répond pas"
        exit 1
    fi
    
    echo "✅ Santé vérifiée"
}

# Nettoyage
cleanup() {
    echo "🧹 Nettoyage..."
    
    # Nettoyage des anciens backups (garder 7 jours)
    find /backup -name "*" -mtime +7 -type d -exec rm -rf {} +
    
    # Nettoyage npm cache
    npm cache clean --force --silent
    
    echo "✅ Nettoyage terminé"
}

# Exécution principale
main() {
    echo "Début du déploiement à $(date)"
    
    backup_current
    update_code
    deploy_backend
    deploy_frontend
    restart_services
    health_check
    cleanup
    
    echo ""
    echo "🎉 DÉPLOIEMENT RÉUSSI !"
    echo "========================"
    echo "🌐 Site: https://votre-domaine.com"
    echo "📊 Admin: https://votre-domaine.com/admin"
    echo "🔧 Logs: pm2 logs sanny-backend"
    echo "📈 Status: pm2 status"
    echo ""
    echo "Déploiement terminé à $(date)"
}

# Gestion des erreurs
trap 'echo "❌ Erreur détectée. Vérifiez les logs." ; exit 1' ERR

# Exécution
main "$@"