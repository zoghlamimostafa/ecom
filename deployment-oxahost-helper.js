// deployment-oxahost-helper.js
// Script d'aide au déploiement OxaHost pour Sanny Store

const fs = require('fs');
const path = require('path');

console.log('🌐 ASSISTANT DÉPLOIEMENT OXAHOST - SANNY STORE');
console.log('=============================================');

// Fonction pour détecter le type d'hébergement OxaHost
function detectOxaHostType() {
    console.log('\n📋 IDENTIFICATION DE VOTRE HÉBERGEMENT OXAHOST');
    console.log('----------------------------------------------');
    
    console.log('Pour identifier votre type d\'hébergement OxaHost :');
    console.log('1. 🌐 Connectez-vous à votre espace client OxaHost');
    console.log('2. 📂 Vérifiez votre tableau de bord');
    console.log('3. 🔍 Identifiez votre type d\'offre :');
    console.log('');
    console.log('   📦 HÉBERGEMENT SHARED :');
    console.log('   - Web Hosting, Shared Hosting');
    console.log('   - Prix : 2-8€/mois');
    console.log('   - ✅ cPanel inclus');
    console.log('   - ⚠️  Node.js limité');
    console.log('');
    console.log('   🖥️  VPS OXAHOST :');
    console.log('   - Virtual Private Server');
    console.log('   - Prix : 5-30€/mois');
    console.log('   - ✅ SSH complet');
    console.log('   - ✅ Node.js supporté');
    console.log('');
    console.log('   ☁️  CLOUD HOSTING :');
    console.log('   - Cloud Web Hosting');
    console.log('   - Prix : 3-15€/mois');
    console.log('   - ✅ Performance optimisée');
    console.log('   - ⚠️  Node.js selon plan');
}

// Fonction pour créer les configurations OxaHost
function createOxaHostConfigs() {
    console.log('\n⚙️ CRÉATION DES FICHIERS DE CONFIGURATION OXAHOST');
    console.log('------------------------------------------------');

    // .htaccess pour hébergement shared
    const htaccessOxaHost = `# Configuration OxaHost - Hébergement Shared
# Optimisé pour l'infrastructure OxaHost

RewriteEngine On
RewriteBase /

# Handle React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression GZIP (compatible OxaHost)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Cache headers (optimisé OxaHost)
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType application/pdf "access plus 2 weeks"
</IfModule>

# Sécurité (compatible OxaHost)
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>

# Protection fichiers sensibles
<FilesMatch "\\.(env|log|md|git)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Optimisation OxaHost
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
</IfModule>`;

    // Configuration Nginx pour VPS OxaHost
    const nginxOxaHost = `# Configuration Nginx pour VPS OxaHost
# /etc/nginx/sites-available/sanny-store-oxahost

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    root /var/www/html;
    index index.html;

    # Logs spécifiques OxaHost
    access_log /var/log/nginx/oxahost-sanny-access.log;
    error_log /var/log/nginx/oxahost-sanny-error.log;

    # Configuration client max body size (OxaHost)
    client_max_body_size 10M;

    # React Router - SPA
    location / {
        try_files $uri $uri/ /index.html;
        
        # Headers sécurité
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        
        # Cache pour assets statiques
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
            add_header Vary Accept-Encoding;
        }
    }

    # API Proxy vers Node.js
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout optimisé pour OxaHost VPS
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Uploads et médias
    location /uploads/ {
        alias /var/www/sanny-store/uploads/;
        expires 7d;
        add_header Cache-Control "public";
        
        # Sécurité uploads
        location ~* \\.(php|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }

    # Compression optimisée OxaHost
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/x-font-ttf
        font/opentype
        image/svg+xml;
}`;

    // Configuration environment pour VPS OxaHost
    const envOxaHost = `# Configuration environnement VPS OxaHost
NODE_ENV=production
PORT=4000

# Base de données (PostgreSQL recommandé)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanny_store
DB_USER=sanny_user
DB_PASSWORD=CHANGEZ_MOI_PASSWORD_OXAHOST_SECURISE

# Alternative MySQL (si préféré)
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=sanny_store
# DB_USER=sanny_user
# DB_PASSWORD=CHANGEZ_MOI_PASSWORD_MYSQL

# JWT et sécurité
JWT_SECRET=CHANGEZ_MOI_JWT_SECRET_OXAHOST_SUPER_SECURISE
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://votre-domaine.com

# Configuration OxaHost spécifique
HOSTING_PROVIDER=oxahost
SERVER_LOCATION=europe

# Uploads
UPLOAD_DIR=/var/www/sanny-store/uploads
MAX_FILE_SIZE=10485760

# Email (configuration SMTP OxaHost)
SMTP_HOST=mail.votre-domaine.com
SMTP_PORT=587
SMTP_USER=noreply@votre-domaine.com
SMTP_PASS=CHANGEZ_MOI_PASSWORD_EMAIL
SMTP_SECURE=false

# Sessions
SESSION_SECRET=CHANGEZ_MOI_SESSION_SECRET_OXAHOST

# Rate limiting (adapté OxaHost)
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logs
LOG_LEVEL=info
LOG_FILE=/var/log/sanny-store/app.log`;

    // Script de déploiement VPS OxaHost
    const deployScriptOxaHost = `#!/bin/bash
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
echo "Déploiement terminé à $(date)"`;

    // Configuration pour hébergement shared OxaHost
    const configSharedOxaHost = `// config-oxahost-shared.js
// Configuration pour hébergement shared OxaHost

const config = {
  // Configuration API
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://sanny-api.up.railway.app'  // API externe
    : 'http://localhost:4000',

  // Configuration build optimisée OxaHost
  BUILD_PATH: './build',
  PUBLIC_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com' 
    : '',

  // Optimisations spécifiques OxaHost
  CHUNK_SIZE_LIMIT: 512000,  // Limite généreuse
  
  // Configuration cPanel FTP OxaHost
  CPANEL_CONFIG: {
    url: 'https://cpanel.votre-domaine.com',
    ftp_host: 'ftp.votre-domaine.com',
    ftp_port: 21,
    remote_dir: '/public_html'
  },

  // Caractéristiques OxaHost
  HOSTING_FEATURES: {
    ssl_included: true,
    backup_daily: true,
    cpanel_version: 'latest',
    php_versions: ['7.4', '8.0', '8.1', '8.2'],
    mysql_support: true,
    nodejs_support: false  // Généralement pas sur shared
  }
};

module.exports = config;`;

    try {
        // Création des fichiers
        fs.writeFileSync('.htaccess-oxahost', htaccessOxaHost);
        fs.writeFileSync('nginx-oxahost.conf', nginxOxaHost);
        fs.writeFileSync('.env.oxahost-vps', envOxaHost);
        fs.writeFileSync('deploy-oxahost-vps.sh', deployScriptOxaHost);
        fs.writeFileSync('config-oxahost-shared.js', configSharedOxaHost);

        // Permissions pour le script
        if (process.platform !== 'win32') {
            fs.chmodSync('deploy-oxahost-vps.sh', '755');
        }

        console.log('✅ Fichiers de configuration OxaHost créés :');
        console.log('   - .htaccess-oxahost (hébergement shared)');
        console.log('   - nginx-oxahost.conf (configuration VPS)');
        console.log('   - .env.oxahost-vps (environnement VPS)');
        console.log('   - deploy-oxahost-vps.sh (script déploiement VPS)');
        console.log('   - config-oxahost-shared.js (config shared)');

    } catch (error) {
        console.error('❌ Erreur lors de la création des fichiers :', error.message);
    }
}

// Fonction pour créer un script de monitoring OxaHost
function createOxaHostMonitoring() {
    const monitoringScript = `// monitoring-oxahost.js
// Script de monitoring pour OxaHost

const fs = require('fs');
const { execSync } = require('child_process');

async function checkOxaHostStatus() {
    console.log('📊 MONITORING OXAHOST - SANNY STORE');
    console.log('==================================');

    const status = {
        timestamp: new Date().toISOString(),
        hosting: 'oxahost',
        checks: {}
    };

    // Vérification du site web
    try {
        const response = await fetch('https://votre-domaine.com');
        status.checks.website = {
            status: response.ok ? 'OK' : 'ERROR',
            code: response.status,
            time: Date.now()
        };
        console.log('✅ Site web accessible');
    } catch (error) {
        status.checks.website = {
            status: 'ERROR',
            error: error.message,
            time: Date.now()
        };
        console.log('❌ Site web inaccessible');
    }

    // Vérification API (si VPS)
    try {
        const apiResponse = await fetch('https://votre-domaine.com/api/health');
        status.checks.api = {
            status: apiResponse.ok ? 'OK' : 'ERROR',
            code: apiResponse.status,
            time: Date.now()
        };
        console.log('✅ API accessible');
    } catch (error) {
        status.checks.api = {
            status: 'ERROR',
            error: error.message,
            time: Date.now()
        };
        console.log('⚠️  API non accessible (normal si shared hosting)');
    }

    // Vérification SSL
    try {
        const sslCheck = await fetch('https://votre-domaine.com');
        status.checks.ssl = {
            status: 'OK',
            secure: true,
            time: Date.now()
        };
        console.log('✅ SSL actif');
    } catch (error) {
        status.checks.ssl = {
            status: 'WARNING',
            secure: false,
            error: error.message,
            time: Date.now()
        };
        console.log('⚠️  SSL non configuré');
    }

    // Sauvegarde du status
    fs.writeFileSync('oxahost-status.json', JSON.stringify(status, null, 2));
    
    console.log('\\n📊 Status sauvegardé dans oxahost-status.json');
    return status;
}

if (require.main === module) {
    checkOxaHostStatus().catch(console.error);
}

module.exports = { checkOxaHostStatus };`;

    fs.writeFileSync('monitoring-oxahost.js', monitoringScript);
    console.log('✅ Script de monitoring créé : monitoring-oxahost.js');
}

// Fonction principale
function main() {
    detectOxaHostType();
    createOxaHostConfigs();
    createOxaHostMonitoring();
    
    console.log('\n🎯 ÉTAPES SUIVANTES OXAHOST');
    console.log('--------------------------');
    console.log('1. 📋 Identifiez votre type d\'hébergement OxaHost');
    console.log('2. 📝 Consultez GUIDE_DEPLOIEMENT_OXAHOST.md');
    console.log('3. ⚙️  Configurez selon votre type (Shared/VPS)');
    console.log('4. 🚀 Suivez le guide de déploiement approprié');
    console.log('');
    console.log('📊 Monitoring : node monitoring-oxahost.js');
    console.log('📞 Support : Via votre espace client OxaHost');
    console.log('🎉 Votre Sanny Store sera bientôt en ligne sur OxaHost !');
}

main();