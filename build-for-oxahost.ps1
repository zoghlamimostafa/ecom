# Script de build complet pour OxaHost
# Prépare tous les fichiers pour le déploiement

Write-Host "🚀 Préparation du build pour OxaHost..." -ForegroundColor Yellow

$projectRoot = "C:\xampp\htdocs\sanny\san\ecomerce_sanny"
$clientPath = "$projectRoot\Client"
$adminPath = "$projectRoot\Admin"
$backendPath = "$projectRoot\backend"
$deploymentDir = "$projectRoot\oxahost_deployment"

# Créer le dossier de déploiement
if (Test-Path $deploymentDir) {
    Remove-Item $deploymentDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deploymentDir -Force | Out-Null
Write-Host "📁 Dossier de déploiement créé : $deploymentDir" -ForegroundColor Green

# 1. BUILD CLIENT
Write-Host ""
Write-Host "🔨 Building Client React..." -ForegroundColor Blue
if (Test-Path "$clientPath\package.json") {
    Set-Location $clientPath
    
    # Installer les dépendances si nécessaire
    if (!(Test-Path "$clientPath\node_modules")) {
        Write-Host "📦 Installation des dépendances Client..." -ForegroundColor Cyan
        npm install
    }
    
    # Build de production
    Write-Host "⚡ Build en cours..." -ForegroundColor Cyan
    npm run build
    
    if (Test-Path "$clientPath\build") {
        # Copier le build vers le dossier de déploiement
        Copy-Item "$clientPath\build\*" "$deploymentDir\public_html" -Recurse -Force
        New-Item -ItemType Directory -Path "$deploymentDir\public_html" -Force | Out-Null
        Copy-Item "$clientPath\build\*" "$deploymentDir\public_html" -Recurse -Force
        Write-Host "✅ Client build copié vers public_html" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du build Client" -ForegroundColor Red
    }
} else {
    Write-Host "❌ package.json Client introuvable" -ForegroundColor Red
}

# 2. BUILD ADMIN
Write-Host ""
Write-Host "🔨 Building Admin React..." -ForegroundColor Blue
if (Test-Path "$adminPath\package.json") {
    Set-Location $adminPath
    
    # Installer les dépendances si nécessaire
    if (!(Test-Path "$adminPath\node_modules")) {
        Write-Host "📦 Installation des dépendances Admin..." -ForegroundColor Cyan
        npm install
    }
    
    # Build de production
    Write-Host "⚡ Build en cours..." -ForegroundColor Cyan
    npm run build
    
    if (Test-Path "$adminPath\build") {
        # Copier le build vers le dossier admin
        New-Item -ItemType Directory -Path "$deploymentDir\public_html\admin" -Force | Out-Null
        Copy-Item "$adminPath\build\*" "$deploymentDir\public_html\admin" -Recurse -Force
        Write-Host "✅ Admin build copié vers public_html/admin" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du build Admin" -ForegroundColor Red
    }
} else {
    Write-Host "❌ package.json Admin introuvable" -ForegroundColor Red
}

# 3. PRÉPARER BACKEND
Write-Host ""
Write-Host "🔧 Préparation du Backend..." -ForegroundColor Blue
if (Test-Path "$backendPath\package.json") {
    Set-Location $backendPath
    
    # Copier le backend
    New-Item -ItemType Directory -Path "$deploymentDir\backend" -Force | Out-Null
    Copy-Item "$backendPath\*" "$deploymentDir\backend" -Recurse -Force -Exclude @("node_modules", ".env", "*.log")
    
    Write-Host "✅ Backend copié (sans node_modules)" -ForegroundColor Green
    
    # Créer un package.json optimisé pour production
    Set-Location "$deploymentDir\backend"
    Write-Host "📦 Installation des dépendances de production..." -ForegroundColor Cyan
    npm install --production
    
} else {
    Write-Host "❌ Backend package.json introuvable" -ForegroundColor Red
}

# 4. CRÉER FICHIERS DE CONFIGURATION
Write-Host ""
Write-Host "⚙️ Création des fichiers de configuration..." -ForegroundColor Blue

# .env template pour production
$envTemplate = @"
# Configuration Production OxaHost
NODE_ENV=production
PORT=4000

# Base de données MySQL OxaHost (À MODIFIER)
DB_HOST=localhost
DB_USER=votre_user_oxahost
DB_PASSWORD=votre_password_oxahost
DB_NAME=votre_db_name_oxahost
DB_PORT=3306

# JWT (GÉNÉRER UN SECRET SÉCURISÉ)
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_123456789
JWT_EXPIRES_IN=30d

# URLs Frontend (ADAPTER À VOTRE DOMAINE)
FRONTEND_URL=https://votredomaine.com
ADMIN_URL=https://votredomaine.com/admin

# Session (GÉNÉRER UN SECRET SÉCURISÉ)
SESSION_SECRET=votre_session_secret_securise_123456789

# Cloudinary (Optionnel - si utilisé)
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
"@

$envTemplate | Out-File "$deploymentDir\backend\.env.template" -Encoding UTF8
Write-Host "✅ Template .env créé" -ForegroundColor Green

# .htaccess pour React Router
$htaccessContent = @"
RewriteEngine On

# React Router pour Client (routes principales)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/admin
RewriteCond %{REQUEST_URI} !^/api
RewriteRule . /index.html [L]

# React Router pour Admin
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d  
RewriteCond %{REQUEST_URI} ^/admin
RewriteRule . /admin/index.html [L]

# Sécurité - Empêcher l'accès aux fichiers sensibles
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>

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

# Cache navigateur
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
"@

$htaccessContent | Out-File "$deploymentDir\public_html\.htaccess" -Encoding UTF8
Write-Host "✅ Fichier .htaccess créé" -ForegroundColor Green

# 5. CRÉER GUIDE DE DÉPLOIEMENT
$deployGuide = @"
# 🚀 GUIDE DE DÉPLOIEMENT OXAHOST

## 📁 Contenu du Package
- public_html/     → À uploader dans public_html OxaHost
- backend/         → À uploader dans un dossier séparé (ex: ~/backend)
- .env.template    → À renommer en .env et configurer

## 🔧 Étapes de Déploiement

### 1. Préparer la Base de Données
- Créer une base MySQL dans cPanel OxaHost
- Importer votre fichier database_complete_[date].sql
- Noter : nom_db, utilisateur, mot_de_passe

### 2. Configurer l'Environnement
- Renommer backend/.env.template en backend/.env
- Modifier les valeurs DB_* avec vos identifiants OxaHost
- Générer des secrets sécurisés pour JWT_SECRET et SESSION_SECRET

### 3. Upload des Fichiers
- Uploader public_html/ vers /public_html OxaHost
- Uploader backend/ vers /home/username/backend (hors web)

### 4. Configuration Node.js (si disponible)
- cPanel → Setup Node.js App
- Dossier : /home/username/backend
- Fichier de démarrage : index.js
- Version : Node.js 18+ ou 20+

### 5. Configuration DNS et SSL
- Pointer votre domaine vers OxaHost
- Activer SSL (Let's Encrypt) dans cPanel

### 6. Tests
- Tester : https://votredomaine.com (Client)
- Tester : https://votredomaine.com/admin (Admin)
- Tester : https://votredomaine.com/api (Backend)

## 🔍 Vérifications
- [ ] Site Client charge correctement
- [ ] Panel Admin accessible
- [ ] API répond (health check)
- [ ] Base de données connectée
- [ ] Authentification fonctionne
- [ ] SSL activé

## 🆘 Support
En cas de problème :
1. Vérifier les logs cPanel
2. Tester la connexion base de données
3. Vérifier les permissions fichiers
4. Contacter support OxaHost si nécessaire

Bon déploiement ! 🎉
"@

$deployGuide | Out-File "$deploymentDir\DEPLOYMENT_GUIDE.md" -Encoding UTF8
Write-Host "✅ Guide de déploiement créé" -ForegroundColor Green

# 6. RÉSUMÉ FINAL
Write-Host ""
Write-Host "🎉 BUILD TERMINÉ AVEC SUCCÈS !" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Package de déploiement créé dans :" -ForegroundColor Cyan
Write-Host "$deploymentDir" -ForegroundColor White
Write-Host ""
Write-Host "📁 Structure créée :" -ForegroundColor Cyan
Get-ChildItem $deploymentDir -Recurse -Directory | ForEach-Object {
    $relativePath = $_.FullName.Replace($deploymentDir, "")
    Write-Host "   $relativePath" -ForegroundColor Gray
}
Write-Host ""
Write-Host "🔧 Prochaines étapes :" -ForegroundColor Magenta
Write-Host "1. Configurer la base MySQL sur OxaHost" -ForegroundColor White
Write-Host "2. Modifier backend/.env.template" -ForegroundColor White  
Write-Host "3. Uploader les fichiers via cPanel/FTP" -ForegroundColor White
Write-Host "4. Configurer Node.js App (si disponible)" -ForegroundColor White
Write-Host "5. Tester le déploiement" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consultez DEPLOYMENT_GUIDE.md pour les détails" -ForegroundColor Yellow

# Retourner au dossier initial
Set-Location $projectRoot