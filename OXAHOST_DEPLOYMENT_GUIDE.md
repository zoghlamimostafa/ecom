# 🏆 Guide Complet d'Hébergement OxaHost - E-commerce Sanny

## 📊 Architecture Actuelle Détectée

### Structure du Projet
```
Frontend Client (React)  → Port 3000
Frontend Admin (React)   → Port 3001  
Backend API (Node.js)    → Port 4000
Base MySQL               → ecomerce_sanny_mysql
```

### Technologies Utilisées
- **Backend** : Node.js + Express + Sequelize ORM
- **Base de données** : MySQL (avec mysql2 driver)
- **Frontend** : React (Client + Admin séparés)
- **Upload** : Cloudinary + stockage local
- **Auth** : JWT + bcrypt

---

## 🎯 ÉTAPE 1 : Exporter la Base de Données MySQL

### A. Exporter depuis XAMPP
```powershell
# 1. Naviguer vers le dossier MySQL de XAMPP
cd C:\xampp\mysql\bin

# 2. Exporter la base de données
.\mysqldump.exe -u root -p ecomerce_sanny_mysql > C:\xampp\htdocs\sanny\san\ecomerce_sanny\database_export.sql

# 3. Créer aussi une sauvegarde avec structure + données
.\mysqldump.exe -u root -p --single-transaction --routines --triggers ecomerce_sanny_mysql > C:\xampp\htdocs\sanny\san\ecomerce_sanny\database_complete.sql
```

### B. Informations Base Actuelle
- **Nom** : `ecomerce_sanny_mysql`
- **Utilisateur** : `root` 
- **Mot de passe** : (vide en local)
- **Host** : `127.0.0.1`
- **Port** : `3306`

---

## 🎯 ÉTAPE 2 : Configurer l'Environnement de Production

### A. Créer les variables d'environnement pour OxaHost
```bash
# Fichier .env pour production
NODE_ENV=production
PORT=4000

# Base de données OxaHost
DB_HOST=localhost
DB_USER=votre_user_oxahost
DB_PASSWORD=votre_password_oxahost  
DB_NAME=votre_db_name_oxahost
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_jwt_securise_longue_chaine
JWT_EXPIRES_IN=30d

# Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# URLs Frontend (à adapter selon votre domaine)
FRONTEND_URL=https://votredomaine.com
ADMIN_URL=https://votredomaine.com/admin

# Sécurité
SESSION_SECRET=votre_session_secret_securise
```

### B. Adapter la configuration database pour production
Le fichier `config/config.json` doit être modifié pour utiliser les variables d'environnement :

```json
{
  "production": {
    "username": "${DB_USER}",
    "password": "${DB_PASSWORD}",
    "database": "${DB_NAME}",
    "host": "${DB_HOST}",
    "port": "${DB_PORT}",
    "dialect": "mysql",
    "logging": false,
    "pool": {
      "max": 10,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  }
}
```

---

## 🎯 ÉTAPE 3 : Préparer les Builds de Production

### A. Build du Frontend Client
```powershell
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client

# Installer les dépendances
npm install

# Configurer l'URL de l'API pour production
# Modifier src/utils/api.js ou config pour pointer vers votre domaine
# Exemple : https://votredomaine.com/api

# Créer le build de production
npm run build
```

### B. Build du Frontend Admin  
```powershell
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Admin

# Installer les dépendances
npm install

# Configurer l'URL de l'API pour production
# Modifier les fichiers de config API

# Créer le build de production  
npm run build
```

### C. Préparer le Backend pour Production
```powershell
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend

# Installer les dépendances de production
npm install --production

# Vérifier que tous les modules requis sont présents
npm list
```

---

## 🎯 ÉTAPE 4 : Déploiement sur OxaHost

### A. Configuration cPanel OxaHost

#### 1. **Accès Base de Données**
- Aller dans cPanel → **MySQL Databases**
- Créer une nouvelle base : `votre_nom_db`
- Créer un utilisateur MySQL avec droits complets
- Noter : nom_db, utilisateur, mot_de_passe

#### 2. **Import de la Base**
- cPanel → **phpMyAdmin**
- Sélectionner votre nouvelle base
- Cliquer **Importer**
- Uploader le fichier `database_complete.sql`
- Exécuter l'import

#### 3. **Configuration Node.js** (si disponible)
- cPanel → **Node.js App** ou **Setup Node.js**
- Créer nouvelle application :
  - **Version Node.js** : 18.x ou 20.x
  - **Dossier** : `/home/username/backend`
  - **Fichier de démarrage** : `index.js`
  - **URL** : `/api` (optionnel)

### B. Upload des Fichiers

#### 1. **Structure Recommandée sur OxaHost**
```
public_html/
├── index.html          (build Client)
├── static/            (assets Client)
├── admin/             (build Admin)
│   ├── index.html
│   └── static/
└── api/               (si sous-dossier)

backend/               (hors public_html)
├── index.js
├── package.json
├── config/
├── models/
├── controllers/
└── .env
```

#### 2. **Upload via cPanel File Manager**
- **Frontend Client** : Copier tout le contenu de `Client/build/` vers `public_html/`
- **Frontend Admin** : Copier tout le contenu de `Admin/build/` vers `public_html/admin/`
- **Backend** : Uploader le dossier `backend/` complet (hors public_html pour sécurité)

### C. Configuration des URLs et Redirections

#### 1. **Fichier .htaccess pour React Router**
Créer dans `public_html/.htaccess` :
```apache
# React Router pour Client
RewriteEngine On
RewriteRule ^(?!admin).*$ /index.html [QSA,L]

# React Router pour Admin 
RewriteRule ^admin/(?!static).*$ /admin/index.html [QSA,L]

# Redirection API vers backend (si nécessaire)
RewriteRule ^api/(.*)$ /backend/index.js?path=$1 [QSA,L]
```

#### 2. **Configuration CORS du Backend**
Modifier dans `backend/index.js` :
```javascript
app.use(cors({
  origin: [
    'https://votredomaine.com',
    'https://www.votredomaine.com',
    'https://votredomaine.com/admin'
  ],
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}));
```

---

## 🎯 ÉTAPE 5 : Configuration du Domaine et SSL

### A. Configuration DNS
- Pointer votre domaine vers les serveurs OxaHost
- Attendre la propagation DNS (24-48h max)

### B. Activation SSL
- cPanel → **SSL/TLS**
- Activer **AutoSSL** ou installer **Let's Encrypt**
- Forcer la redirection HTTPS

---

## 🎯 ÉTAPE 6 : Tests et Vérifications

### A. Checklist de Vérification
- [ ] Site Client accessible : `https://votredomaine.com`
- [ ] Panel Admin accessible : `https://votredomaine.com/admin`
- [ ] API répond : `https://votredomaine.com/api/`
- [ ] Connexion base de données OK
- [ ] Authentification fonctionne
- [ ] Upload d'images fonctionne
- [ ] Panier et commandes OK

### B. Monitoring et Logs
- Vérifier les logs d'erreur dans cPanel
- Tester toutes les fonctionnalités principales
- Vérifier les performances de chargement

---

## 🛠️ Scripts d'Automatisation

### Script de Build Complet
```powershell
# build-for-oxahost.ps1
Write-Host "🚀 Building Sanny E-commerce for OxaHost..."

# Build Client
cd "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client"
npm run build

# Build Admin  
cd "..\Admin"
npm run build

# Préparer Backend
cd "..\backend"
npm install --production

Write-Host "✅ Build completed! Ready for OxaHost deployment."
```

---

## 📞 Support et Ressources

### Contacts OxaHost
- **Support** : Ticket dans l'espace client
- **Documentation** : Base de connaissances OxaHost
- **Node.js** : Vérifier disponibilité selon votre plan

### Alternatives si Node.js non disponible
1. **Backend externe** : Railway, Heroku, Vercel
2. **API Gateway** : Connecter frontend OxaHost → API externe
3. **Upgrade plan** : Passer à un plan VPS OxaHost

---

## 🔧 Dépannage Courant

### Problème : "Cannot connect to database"
- Vérifier les identifiants MySQL dans `.env`
- Tester la connexion via phpMyAdmin
- Vérifier les permissions utilisateur MySQL

### Problème : "CORS error"
- Ajuster les origins dans le backend
- Vérifier les URLs de l'API dans le frontend

### Problème : "404 on page refresh"
- Vérifier le fichier `.htaccess`
- Configurer les redirections React Router

---

*Guide créé pour le déploiement du site E-commerce Sanny sur OxaHost - v1.0*