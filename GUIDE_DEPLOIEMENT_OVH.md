# 🌐 GUIDE DÉPLOIEMENT OVH - SANNY STORE

## 🎯 **DÉPLOIEMENT SUR HÉBERGEMENT OVH**

OVH propose plusieurs solutions d'hébergement. Voici comment déployer **Sanny Store** selon votre type d'hébergement OVH.

---

## 📋 **IDENTIFICATION DE VOTRE HÉBERGEMENT OVH**

### **Type 1 : Hébergement Web Mutualisé (Perso/Pro/Performance)**
- ✅ **PHP + MySQL** inclus
- ✅ **FTP/SFTP** pour upload
- ❌ **Node.js limité** ou non disponible
- 💰 **3-15€/mois**

### **Type 2 : VPS OVH**
- ✅ **Contrôle total** du serveur
- ✅ **Node.js** + bases de données
- ✅ **SSH** complet
- 💰 **3-50€/mois**

### **Type 3 : Serveur Dédié OVH**
- ✅ **Performance maximale**
- ✅ **Ressources dédiées**
- ✅ **Configurations avancées**
- 💰 **30-200€/mois**

---

## 🚀 **OPTION 1 : HÉBERGEMENT WEB MUTUALISÉ OVH**

### **⚠️ LIMITATION IMPORTANTE**
L'hébergement mutualisé OVH ne supporte **pas Node.js** nativement. Nous devons adapter la solution.

### **SOLUTION HYBRIDE RECOMMANDÉE**

#### **Frontend → Hébergement OVH**
```bash
# 1. Build de production React
cd Client
npm run build

# 2. Upload du dossier build/ vers OVH via FTP
```

#### **Backend → Service externe gratuit**
```bash
# Railway ou Render pour l'API Node.js (gratuit)
# Puis connexion depuis l'hébergement OVH
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

#### **B. Configuration de l'API externe**
```javascript
// Dans Client/src/config.js (à créer)
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-api.up.railway.app'
    : 'http://localhost:4000'
};

export default config;
```

#### **C. Upload via FTP sur OVH**
```bash
# Informations FTP OVH (dans votre espace client)
Serveur FTP: ftp.votre-domaine.com
Utilisateur: votre-login-ovh
Mot de passe: votre-mot-de-passe-ftp
Dossier: www/ ou public_html/

# Fichiers à uploader
Client/build/* → www/
```

### **CONFIGURATION .htaccess pour React Router**
```apache
# Créer .htaccess dans www/
RewriteEngine On
RewriteBase /

# Handle React Router
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
</IfModule>

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

---

## 🚀 **OPTION 2 : VPS OVH (RECOMMANDÉ)**

### **INSTALLATION COMPLÈTE SUR VPS**

#### **A. Connexion SSH au VPS**
```bash
# Depuis votre ordinateur
ssh root@votre-ip-vps

# Ou avec PuTTY sur Windows
# Adresse: votre-ip-vps
# Port: 22
# Utilisateur: root
```

#### **B. Installation de l'environnement**
```bash
# 1. Mise à jour du système
apt update && apt upgrade -y

# 2. Installation Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 3. Installation Nginx
apt install nginx -y

# 4. Installation PostgreSQL
apt install postgresql postgresql-contrib -y

# 5. Installation PM2 (gestionnaire de processus)
npm install -g pm2

# 6. Installation Git
apt install git -y
```

#### **C. Configuration de la base de données**
```bash
# 1. Connexion PostgreSQL
sudo -u postgres psql

# 2. Création de la base (dans psql)
CREATE DATABASE sanny_store;
CREATE USER sanny_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE sanny_store TO sanny_user;
\q
```

#### **D. Déploiement du code**
```bash
# 1. Cloner depuis GitHub (ou upload via SFTP)
cd /var/www
git clone https://github.com/votre-username/sanny-store.git
cd sanny-store

# 2. Installation backend
cd backend
npm install --production
cp .env.example .env

# 3. Configuration .env
nano .env
```

#### **Configuration .env pour VPS OVH**
```bash
NODE_ENV=production
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanny_store
DB_USER=sanny_user
DB_PASSWORD=votre_mot_de_passe_securise
JWT_SECRET=votre_secret_super_securise_123456789
CORS_ORIGIN=https://votre-domaine.com
```

#### **E. Build et déploiement frontend**
```bash
# 1. Installation et build
cd ../Client
npm install
npm run build

# 2. Copier vers Nginx
cp -r build/* /var/www/html/
```

#### **F. Configuration Nginx**
```nginx
# /etc/nginx/sites-available/sanny-store
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    root /var/www/html;
    index index.html;

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### **G. Activation et démarrage**
```bash
# 1. Activer le site Nginx
ln -s /etc/nginx/sites-available/sanny-store /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 2. Démarrer le backend avec PM2
cd /var/www/sanny-store/backend
pm2 start npm --name "sanny-backend" -- start
pm2 startup
pm2 save
```

---

## 🔒 **CONFIGURATION SSL GRATUIT (Let's Encrypt)**

```bash
# 1. Installation Certbot
apt install certbot python3-certbot-nginx -y

# 2. Obtention du certificat SSL
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# 3. Renouvellement automatique
crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🌐 **CONFIGURATION DNS OVH**

### **A. Dans l'espace client OVH**
```bash
# Zone DNS de votre domaine
Type: A
Sous-domaine: (vide)
Cible: IP-DE-VOTRE-VPS

Type: A  
Sous-domaine: www
Cible: IP-DE-VOTRE-VPS

Type: CNAME (si API séparée)
Sous-domaine: api
Cible: votre-api.up.railway.app
```

---

## 🔄 **SCRIPT DE DÉPLOIEMENT AUTOMATIQUE OVH**

```bash
#!/bin/bash
# deploy-ovh.sh - Script de déploiement pour VPS OVH

echo "🚀 Déploiement Sanny Store sur VPS OVH"
echo "====================================="

# Variables
PROJECT_DIR="/var/www/sanny-store"
NGINX_DIR="/var/www/html"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/Client"

echo "📦 1. Mise à jour du code..."
cd $PROJECT_DIR
git pull origin main

echo "⚙️ 2. Backend..."
cd $BACKEND_DIR
npm install --production
pm2 restart sanny-backend

echo "🎨 3. Frontend..."
cd $FRONTEND_DIR
npm install
npm run build
rm -rf $NGINX_DIR/*
cp -r build/* $NGINX_DIR/

echo "🔄 4. Redémarrage des services..."
systemctl reload nginx
pm2 restart sanny-backend

echo "✅ Déploiement terminé!"
echo "🌐 Site: https://votre-domaine.com"
```

---

## 📊 **MONITORING ET MAINTENANCE**

### **A. Logs et surveillance**
```bash
# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs PM2
pm2 logs sanny-backend

# Status des services
systemctl status nginx
pm2 status
```

### **B. Backup automatique**
```bash
#!/bin/bash
# backup.sh - Backup quotidien

# Base de données
pg_dump -U sanny_user sanny_store > /backup/db-$(date +%Y%m%d).sql

# Fichiers
tar -czf /backup/files-$(date +%Y%m%d).tar.gz /var/www/sanny-store

# Nettoyage (garder 7 jours)
find /backup -name "*.sql" -mtime +7 -delete
find /backup -name "*.tar.gz" -mtime +7 -delete
```

---

## 💰 **COÛTS ESTIMÉS OVH**

| Solution | Prix | Performance | Recommandation |
|----------|------|-------------|----------------|
| **Web Mutualisé** | 3-8€/mois | Limitée | Pour site vitrine |
| **VPS Starter** | 3-6€/mois | Bonne | ✅ **Recommandé** |
| **VPS Comfort** | 12-20€/mois | Très bonne | Pour fort trafic |
| **Serveur Dédié** | 30€+/mois | Excellente | Pour e-commerce important |

---

## 🎯 **RECOMMANDATION FINALE**

### **Solution recommandée : VPS OVH Starter (6€/mois)**
- ✅ **Node.js** natif
- ✅ **PostgreSQL** incluse
- ✅ **SSL gratuit** Let's Encrypt
- ✅ **Performance** excellente
- ✅ **Contrôle total**

### **Alternative économique : Hébergement mutualisé + API externe**
- ✅ **Frontend** sur OVH (3€/mois)
- ✅ **Backend** sur Railway (gratuit)
- ✅ **Coût total** : 3€/mois

---

## 📞 **ÉTAPES SUIVANTES**

1. **Choisir** votre solution OVH
2. **Commander** si nécessaire
3. **Configurer** DNS pointant vers OVH
4. **Suivre** le guide selon votre type d'hébergement
5. **Tester** votre site en production

---

**🏆 Votre Sanny Store sera bientôt en ligne sur l'infrastructure OVH !**

Quel type d'hébergement OVH avez-vous exactement ? Je peux vous donner des instructions plus spécifiques.