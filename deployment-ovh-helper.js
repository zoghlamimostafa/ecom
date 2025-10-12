// deployment-ovh-helper.js
// Script d'aide au déploiement OVH pour Sanny Store

const fs = require('fs');
const path = require('path');

console.log('🌐 ASSISTANT DÉPLOIEMENT OVH - SANNY STORE');
console.log('==========================================');

// Fonction pour détecter le type d'hébergement OVH
function detectOVHHostingType() {
    console.log('\n📋 IDENTIFICATION DE VOTRE HÉBERGEMENT OVH');
    console.log('-------------------------------------------');
    
    console.log('Pour identifier votre type d\'hébergement OVH :');
    console.log('1. 🌐 Connectez-vous à votre espace client OVH');
    console.log('2. 📂 Allez dans la section "Hébergements web" ou "Serveurs"');
    console.log('3. 🔍 Vérifiez le nom de votre offre :');
    console.log('');
    console.log('   📦 HÉBERGEMENT MUTUALISÉ :');
    console.log('   - Perso, Pro, Performance, Cloud Web');
    console.log('   - Prix : 3-15€/mois');
    console.log('   - ⚠️  Node.js limité ou non disponible');
    console.log('');
    console.log('   🖥️  VPS (Virtual Private Server) :');
    console.log('   - VPS SSD, VPS Cloud');
    console.log('   - Prix : 3-50€/mois');
    console.log('   - ✅ Node.js supporté');
    console.log('');
    console.log('   🏢 SERVEUR DÉDIÉ :');
    console.log('   - Advance, Infrastructure');
    console.log('   - Prix : 30-200€/mois');
    console.log('   - ✅ Contrôle total');
}

// Fonction pour créer les fichiers de configuration selon le type
function createOVHConfigs() {
    console.log('\n⚙️ CRÉATION DES FICHIERS DE CONFIGURATION OVH');
    console.log('----------------------------------------------');

    // .htaccess pour hébergement mutualisé
    const htaccessContent = `# Configuration OVH - Hébergement Mutualisé
# Fichier .htaccess pour React Router

RewriteEngine On
RewriteBase /

# Handle React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression GZIP
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

# Cache browser
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 year"
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>

# Bloquer l'accès aux fichiers sensibles
<FilesMatch "\\.(env|log|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>`;

    // Configuration Nginx pour VPS
    const nginxConfig = `# Configuration Nginx pour VPS OVH
# /etc/nginx/sites-available/sanny-store

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    root /var/www/html;
    index index.html;

    # Logs
    access_log /var/log/nginx/sanny-access.log;
    error_log /var/log/nginx/sanny-error.log;

    # React Router - SPA
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache des assets statiques
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary Accept-Encoding;
        }
    }

    # Proxy vers l'API Node.js
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Uploads et images
    location /uploads/ {
        alias /var/www/sanny-store/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Compression
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
        application/json;
}`;

    // Configuration environment pour VPS
    const envVPSContent = `# Configuration environnement VPS OVH
NODE_ENV=production
PORT=4000

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanny_store
DB_USER=sanny_user
DB_PASSWORD=CHANGEZ_MOI_MOT_DE_PASSE_SECURISE

# JWT et sécurité
JWT_SECRET=CHANGEZ_MOI_SECRET_SUPER_SECURISE_123456789
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://votre-domaine.com

# Uploads
UPLOAD_DIR=/var/www/sanny-store/uploads
MAX_FILE_SIZE=5242880

# Email (optionnel)
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=noreply@votre-domaine.com
SMTP_PASS=votre_mot_de_passe_email

# Sessions
SESSION_SECRET=CHANGEZ_MOI_SESSION_SECRET_789456123

# Rate limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100`;

    // Script de déploiement VPS
    const deployScriptVPS = `#!/bin/bash
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
main "$@"`;

    // Configuration pour hébergement mutualisé
    const configMutualise = `// config-ovh-mutualise.js
// Configuration pour hébergement mutualisé OVH

const config = {
  // API externe (Railway/Render gratuit)
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://sanny-api.up.railway.app'  // À remplacer par votre URL
    : 'http://localhost:4000',

  // Configuration build
  BUILD_PATH: './build',
  PUBLIC_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com' 
    : '',

  // Optimisations pour hébergement mutualisé
  CHUNK_SIZE_LIMIT: 244000,  // Limite OVH
  
  // Configuration FTP pour upload automatique
  FTP_CONFIG: {
    host: 'ftp.votre-domaine.com',
    user: 'votre-login-ovh',
    password: 'CHANGEZ_MOI',
    secure: false,
    connTimeout: 60000,
    pasvTimeout: 60000,
    remoteDir: '/www'
  }
};

module.exports = config;`;

    try {
        // Création des fichiers
        fs.writeFileSync('.htaccess-ovh', htaccessContent);
        fs.writeFileSync('nginx-ovh.conf', nginxConfig);
        fs.writeFileSync('.env.vps-ovh', envVPSContent);
        fs.writeFileSync('deploy-vps-ovh.sh', deployScriptVPS);
        fs.writeFileSync('config-ovh-mutualise.js', configMutualise);

        // Permissions pour le script
        if (process.platform !== 'win32') {
            fs.chmodSync('deploy-vps-ovh.sh', '755');
        }

        console.log('✅ Fichiers de configuration OVH créés :');
        console.log('   - .htaccess-ovh (hébergement mutualisé)');
        console.log('   - nginx-ovh.conf (configuration VPS)');
        console.log('   - .env.vps-ovh (environnement VPS)');
        console.log('   - deploy-vps-ovh.sh (script déploiement)');
        console.log('   - config-ovh-mutualise.js (config mutualisé)');

    } catch (error) {
        console.error('❌ Erreur lors de la création des fichiers :', error.message);
    }
}

// Fonction pour créer un script FTP pour hébergement mutualisé
function createFTPUploadScript() {
    const ftpScript = `// ftp-upload-ovh.js
// Script d'upload automatique vers hébergement mutualisé OVH

const FTP = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function uploadToOVH() {
    const client = new FTP.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔗 Connexion au serveur FTP OVH...');
        
        await client.access({
            host: 'ftp.votre-domaine.com',
            user: 'votre-login-ovh',
            password: 'votre-mot-de-passe',
            secure: false
        });

        console.log('📁 Navigation vers le dossier www...');
        await client.cd('/www');

        console.log('🚀 Upload du build React...');
        await client.uploadFromDir('./build');

        console.log('📄 Upload du fichier .htaccess...');
        await client.uploadFrom('.htaccess-ovh', '.htaccess');

        console.log('✅ Upload terminé avec succès !');
        console.log('🌐 Votre site est maintenant en ligne !');

    } catch (error) {
        console.error('❌ Erreur upload FTP :', error.message);
    } finally {
        client.close();
    }
}

// Installation automatique de basic-ftp si nécessaire
async function installDependencies() {
    try {
        require('basic-ftp');
    } catch (error) {
        console.log('📦 Installation de basic-ftp...');
        const { execSync } = require('child_process');
        execSync('npm install basic-ftp', { stdio: 'inherit' });
    }
}

async function main() {
    console.log('📤 UPLOAD AUTOMATIQUE VERS OVH');
    console.log('===============================');
    
    await installDependencies();
    await uploadToOVH();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { uploadToOVH };`;

    fs.writeFileSync('ftp-upload-ovh.js', ftpScript);
    console.log('✅ Script FTP upload créé : ftp-upload-ovh.js');
}

// Fonction principale
function main() {
    detectOVHHostingType();
    createOVHConfigs();
    createFTPUploadScript();
    
    console.log('\n🎯 ÉTAPES SUIVANTES');
    console.log('------------------');
    console.log('1. 📋 Identifiez votre type d\'hébergement OVH');
    console.log('2. 📝 Consultez GUIDE_DEPLOIEMENT_OVH.md');
    console.log('3. ⚙️  Configurez les fichiers selon votre type');
    console.log('4. 🚀 Suivez le guide de déploiement approprié');
    console.log('');
    console.log('📞 Support : Les guides contiennent toutes les étapes détaillées');
    console.log('🎉 Votre Sanny Store sera bientôt en ligne sur OVH !');
}

main();