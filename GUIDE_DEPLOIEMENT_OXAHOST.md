# 🌐 GUIDE DÉPLOIEMENT OXAHOST - SANNY STORE

## 🎯 **DÉPLOIEMENT SUR HÉBERGEMENT OXAHOST**

OxaHost propose des solutions d'hébergement flexibles et abordables. Voici comment déployer **Sanny Store** sur l'infrastructure OxaHost.

---

## 📋 **TYPES D'HÉBERGEMENT OXAHOST**

### **Type 1 : Hébergement Web Shared**
- ✅ **PHP + MySQL** inclus
- ✅ **cPanel** pour gestion
- ⚠️ **Node.js** limité selon l'offre
- 💰 **2-8€/mois**

### **Type 2 : VPS OxaHost**
- ✅ **Contrôle total** du serveur
- ✅ **Node.js** + bases de données
- ✅ **SSH complet**
- 💰 **5-30€/mois**

### **Type 3 : Hébergement WordPress/Cloud**
- ✅ **Optimisé** pour applications web
- ✅ **Node.js possible** selon plan
- ✅ **SSL inclus**
- 💰 **3-15€/mois**

---

## 🚀 **OPTION 1 : HÉBERGEMENT SHARED OXAHOST**

### **SOLUTION ADAPTÉE POUR SHARED HOSTING**

#### **Frontend → OxaHost Shared**
```bash
# 1. Build de production React
cd Client
npm run build

# 2. Upload via cPanel File Manager ou FTP
```

#### **Backend → Solution hybride**
```bash
# Option A: API sur Railway/Render (gratuit)
# Option B: Si Node.js supporté par OxaHost
```

### **ÉTAPES DÉTAILLÉES**

#### **A. Préparation du build React**
```bash
# 1. Aller dans le dossier Client
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Créer le build de production
npm run build

# 4. Le dossier build/ contient votre site web
```

#### **B. Configuration pour OxaHost**
```javascript
// Dans Client/src/config.js
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-api.up.railway.app'  // API externe
    : 'http://localhost:4000',

  // Configuration OxaHost
  HOSTING_PROVIDER: 'oxahost',
  CDN_URL: '', // À configurer si CDN disponible
};

export default config;
```

#### **C. Upload via cPanel OxaHost**
```bash
# Connexion cPanel OxaHost
URL: https://cpanel.votre-domaine.com
Ou: https://votre-serveur.oxahost.com:2083

# Upload des fichiers
1. File Manager → public_html/
2. Upload du dossier build/
3. Extraire les fichiers
```

### **CONFIGURATION .htaccess pour OxaHost**
```apache
# .htaccess optimisé pour OxaHost
RewriteEngine On
RewriteBase /

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression GZIP (compatible OxaHost)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
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
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Protection fichiers sensibles
<FilesMatch "\\.(env|log|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

---

## 🚀 **OPTION 2 : VPS OXAHOST (RECOMMANDÉ)**

### **INSTALLATION COMPLÈTE SUR VPS**

#### **A. Connexion SSH au VPS OxaHost**
```bash
# Depuis votre ordinateur
ssh root@votre-ip-oxahost

# Informations fournies par OxaHost par email
```

#### **B. Installation de l'environnement**
```bash
# 1. Mise à jour du système (Ubuntu/CentOS selon OxaHost)
apt update && apt upgrade -y  # Ubuntu
# ou
yum update -y  # CentOS

# 2. Installation Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 3. Installation Nginx
apt install nginx -y

# 4. Installation PostgreSQL ou MySQL
apt install postgresql postgresql-contrib -y
# ou
apt install mysql-server -y

# 5. Installation PM2
npm install -g pm2

# 6. Installation Git
apt install git -y
```

#### **C. Configuration de la base de données**
```bash
# PostgreSQL
sudo -u postgres psql
CREATE DATABASE sanny_store;
CREATE USER sanny_user WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE sanny_store TO sanny_user;
\q

# Ou MySQL
mysql -u root -p
CREATE DATABASE sanny_store;
CREATE USER 'sanny_user'@'localhost' IDENTIFIED BY 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON sanny_store.* TO 'sanny_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### **D. Configuration .env pour VPS OxaHost**
```bash
NODE_ENV=production
PORT=4000

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanny_store
DB_USER=sanny_user
DB_PASSWORD=votre_mot_de_passe_securise

# Ou MySQL
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=sanny_store
# DB_USER=sanny_user
# DB_PASSWORD=votre_mot_de_passe_securise

JWT_SECRET=votre_secret_super_securise_oxahost
CORS_ORIGIN=https://votre-domaine.com

# Configuration OxaHost spécifique
HOSTING_PROVIDER=oxahost
```

#### **E. Configuration Nginx pour OxaHost**
```nginx
# /etc/nginx/sites-available/sanny-store
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    root /var/www/html;
    index index.html;

    # Logs
    access_log /var/log/nginx/sanny-access.log;
    error_log /var/log/nginx/sanny-error.log;

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
        
        # Headers sécurité
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout optimisé OxaHost
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Assets statiques
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header Vary Accept-Encoding;
    }

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

---

## 🔧 **SCRIPT DE DÉPLOIEMENT OXAHOST**

```bash
#!/bin/bash
# deploy-oxahost.sh - Script pour VPS OxaHost

echo "🚀 Déploiement Sanny Store sur OxaHost VPS"
echo "=========================================="

# Variables
PROJECT_DIR="/var/www/sanny-store"
NGINX_DIR="/var/www/html"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/Client"

echo "📦 1. Mise à jour du code..."
cd $PROJECT_DIR
git pull origin main || echo "Premier déploiement"

echo "⚙️ 2. Backend..."
cd $BACKEND_DIR
npm install --production
pm2 restart sanny-backend || pm2 start npm --name "sanny-backend" -- start

echo "🎨 3. Frontend..."
cd $FRONTEND_DIR
npm install
npm run build
rm -rf $NGINX_DIR/*
cp -r build/* $NGINX_DIR/

echo "🔄 4. Services..."
systemctl reload nginx
pm2 restart sanny-backend

echo "✅ Déploiement OxaHost terminé!"
echo "🌐 Site: https://votre-domaine.com"
```

---

## 📊 **INFORMATIONS OXAHOST NÉCESSAIRES**

### **Pour Hébergement Shared :**
1. **URL cPanel** : `https://cpanel.votre-domaine.com`
2. **Login cPanel** : fourni par OxaHost
3. **Mot de passe cPanel** : fourni par OxaHost
4. **Nom de domaine** : configuré chez OxaHost

### **Pour VPS :**
1. **Adresse IP VPS** : fournie par OxaHost
2. **Login SSH** : root (généralement)
3. **Mot de passe SSH** : fourni par OxaHost
4. **OS** : Ubuntu/CentOS (selon choix)

---

## 💰 **TARIFICATION OXAHOST**

| Type | Prix OxaHost | Performance | Node.js | Recommandation |
|------|--------------|-------------|---------|----------------|
| **Shared Basic** | 2€/mois | Correcte | ❌ | Débutant |
| **Shared Pro** | 5€/mois | Bonne | ⚠️ | Site vitrine |
| **VPS Start** | 5€/mois | Très bonne | ✅ | ✅ **Idéal** |
| **VPS Pro** | 15€/mois | Excellente | ✅ | E-commerce pro |

### **💡 Recommandation : VPS Start OxaHost (5€/mois)**

---

## 🔒 **CONFIGURATION SSL OXAHOST**

### **A. Via cPanel (Shared)**
```bash
# Dans cPanel OxaHost
1. SSL/TLS → Let's Encrypt
2. Sélectionner votre domaine
3. Activer SSL gratuit
```

### **B. Via VPS (Let's Encrypt)**
```bash
# Installation Certbot
apt install certbot python3-certbot-nginx -y

# Certificat SSL
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique
crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🎯 **COMMANDES RAPIDES OXAHOST**

### **Build local :**
```powershell
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client
npm run build
```

### **Upload cPanel :**
```bash
# Via File Manager cPanel
# Ou via FTP : ftp.votre-domaine.com
```

### **Déploiement VPS :**
```bash
chmod +x deploy-oxahost.sh
./deploy-oxahost.sh
```

---

## 🚨 **RÉSOLUTION PROBLÈMES OXAHOST**

### **Problème : cPanel inaccessible**
```bash
# Vérifiez l'URL fournie par OxaHost
# Format : https://server.oxahost.com:2083
```

### **Problème : VPS SSH ne fonctionne pas**
```bash
# Vérifiez IP et port SSH (22 par défaut)
# Contactez support OxaHost si nécessaire
```

### **Problème : Site ne s'affiche pas**
```bash
# Vérifiez DNS (24-48h propagation)
# Vérifiez .htaccess (shared)
# Vérifiez Nginx (VPS)
```

---

## 📞 **SUPPORT OXAHOST**

### **Informations de contact :**
- 🌐 **Site** : https://oxahost.com
- 💬 **Support** : Via espace client
- 📧 **Email** : Généralement support@oxahost.com
- ⏰ **Disponibilité** : Selon votre plan

---

## 🎉 **ÉTAPES APRÈS DÉPLOIEMENT**

1. ✅ **Tester** votre site
2. 🔧 **Configurer** l'admin
3. 📊 **Ajouter** vos produits
4. 🎨 **Personnaliser** le design
5. 📈 **Analyser** les performances

---

**🏆 Votre Sanny Store sera bientôt en ligne sur OxaHost !**

> **Quel type d'hébergement OxaHost avez-vous exactement ?**  
> (Shared, VPS, ou autre plan spécifique)