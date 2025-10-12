# Script de build simplifie pour OxaHost
Write-Host "Preparation du build pour OxaHost..." -ForegroundColor Yellow

$projectRoot = "C:\xampp\htdocs\sanny\san\ecomerce_sanny"
$clientPath = "$projectRoot\Client"
$adminPath = "$projectRoot\admin-app"
$backendPath = "$projectRoot\backend"
$deploymentDir = "$projectRoot\oxahost_deployment"

# Creer le dossier de deploiement
if (Test-Path $deploymentDir) {
    Remove-Item $deploymentDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deploymentDir -Force | Out-Null
Write-Host "Dossier de deploiement cree : $deploymentDir" -ForegroundColor Green

# 1. BUILD CLIENT
Write-Host ""
Write-Host "Building Client React..." -ForegroundColor Blue
if (Test-Path "$clientPath\package.json") {
    Set-Location $clientPath
    
    Write-Host "Build en cours..." -ForegroundColor Cyan
    npm run build
    
    if (Test-Path "$clientPath\build") {
        New-Item -ItemType Directory -Path "$deploymentDir\public_html" -Force | Out-Null
        Copy-Item "$clientPath\build\*" "$deploymentDir\public_html" -Recurse -Force
        Write-Host "Client build copie vers public_html" -ForegroundColor Green
    } else {
        Write-Host "Echec du build Client" -ForegroundColor Red
    }
} else {
    Write-Host "package.json Client introuvable" -ForegroundColor Red
}

# 2. BUILD ADMIN
Write-Host ""
Write-Host "Building Admin React..." -ForegroundColor Blue
if (Test-Path "$adminPath\package.json") {
    Set-Location $adminPath
    
    Write-Host "Build en cours..." -ForegroundColor Cyan
    npm run build
    
    if (Test-Path "$adminPath\build") {
        New-Item -ItemType Directory -Path "$deploymentDir\public_html\admin" -Force | Out-Null
        Copy-Item "$adminPath\build\*" "$deploymentDir\public_html\admin" -Recurse -Force
        Write-Host "Admin build copie vers public_html/admin" -ForegroundColor Green
    } else {
        Write-Host "Echec du build Admin" -ForegroundColor Red
    }
} else {
    Write-Host "package.json Admin introuvable" -ForegroundColor Red
}

# 3. PREPARER BACKEND
Write-Host ""
Write-Host "Preparation du Backend..." -ForegroundColor Blue
if (Test-Path "$backendPath\package.json") {
    New-Item -ItemType Directory -Path "$deploymentDir\backend" -Force | Out-Null
    Copy-Item "$backendPath\*" "$deploymentDir\backend" -Recurse -Force -Exclude @("node_modules", ".env", "*.log", "database.sqlite")
    Write-Host "Backend copie (sans node_modules)" -ForegroundColor Green
} else {
    Write-Host "Backend package.json introuvable" -ForegroundColor Red
}

# 4. CREER .env TEMPLATE
$envTemplate = @"
# Configuration Production OxaHost
NODE_ENV=production
PORT=4000

# Base de donnees MySQL OxaHost (A MODIFIER)
DB_HOST=localhost
DB_USER=votre_user_oxahost
DB_PASSWORD=votre_password_oxahost
DB_NAME=votre_db_name_oxahost
DB_PORT=3306

# JWT (GENERER UN SECRET SECURISE)
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_123456789
JWT_EXPIRES_IN=30d

# URLs Frontend (ADAPTER A VOTRE DOMAINE)
FRONTEND_URL=https://votredomaine.com
ADMIN_URL=https://votredomaine.com/admin

# Session (GENERER UN SECRET SECURISE)
SESSION_SECRET=votre_session_secret_securise_123456789
"@

$envTemplate | Out-File "$deploymentDir\backend\.env.template" -Encoding UTF8
Write-Host "Template .env cree" -ForegroundColor Green

# 5. CREER .htaccess
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

# Securite
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
"@

$htaccessContent | Out-File "$deploymentDir\public_html\.htaccess" -Encoding UTF8
Write-Host "Fichier .htaccess cree" -ForegroundColor Green

# 6. RESUME FINAL
Write-Host ""
Write-Host "BUILD TERMINE AVEC SUCCES !" -ForegroundColor Green
Write-Host ""
Write-Host "Package de deploiement cree dans :" -ForegroundColor Cyan
Write-Host "$deploymentDir" -ForegroundColor White
Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Magenta
Write-Host "1. Configurer la base MySQL sur OxaHost" -ForegroundColor White
Write-Host "2. Modifier backend/.env.template" -ForegroundColor White  
Write-Host "3. Uploader les fichiers via cPanel/FTP" -ForegroundColor White
Write-Host "4. Configurer Node.js App (si disponible)" -ForegroundColor White
Write-Host "5. Tester le deploiement" -ForegroundColor White

# Retourner au dossier initial
Set-Location $projectRoot