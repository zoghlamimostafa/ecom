# Script PowerShell pour déploiement automatique sur OxaHost
# deploy-oxahost.ps1

param(
    [string]$DomainName = "",
    [string]$FtpHost = "",
    [string]$FtpUser = "",
    [string]$FtpPassword = ""
)

Write-Host "==============================================" -ForegroundColor Green
Write-Host "    DÉPLOIEMENT AUTOMATIQUE OXAHOST" -ForegroundColor Green
Write-Host "    SANNY E-COMMERCE PLATFORM" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Vérification des prérequis
Write-Host "`n🔍 Vérification des prérequis..." -ForegroundColor Yellow

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ NPM n'est pas installé!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "Client\package.json")) {
    Write-Host "❌ Dossier Client non trouvé!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "admin-app\package.json")) {
    Write-Host "❌ Dossier admin-app non trouvé!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tous les prérequis sont satisfaits" -ForegroundColor Green

# Nettoyage
Write-Host "`n🧹 Nettoyage des anciens builds..." -ForegroundColor Yellow
$foldersToClean = @("Client\build", "admin-app\build", "oxahost-deploy")
foreach ($folder in $foldersToClean) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder
        Write-Host "   Supprimé: $folder" -ForegroundColor Gray
    }
}

# Configuration des variables d'environnement
Write-Host "`n⚙️ Configuration des variables d'environnement..." -ForegroundColor Yellow
$env:REACT_APP_API_URL = "https://sanny-api.up.railway.app"
$env:GENERATE_SOURCEMAP = "false"
$env:NODE_ENV = "production"

Write-Host "   API_URL: $env:REACT_APP_API_URL" -ForegroundColor Gray
Write-Host "   SOURCEMAP: $env:GENERATE_SOURCEMAP" -ForegroundColor Gray

# Installation des dépendances
Write-Host "`n📦 Installation des dépendances..." -ForegroundColor Yellow

Write-Host "   Client..." -ForegroundColor Gray
Set-Location Client
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation Client" -ForegroundColor Red
    exit 1
}

Write-Host "   Admin..." -ForegroundColor Gray
Set-Location ..\admin-app
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation Admin" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Build du Client
Write-Host "`n🏗️ Build du Client (Frontend)..." -ForegroundColor Yellow
Set-Location Client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build Client" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build Client terminé" -ForegroundColor Green
Set-Location ..

# Build de l'Admin
Write-Host "`n🏗️ Build de l'Admin Panel..." -ForegroundColor Yellow
Set-Location admin-app
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build Admin" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build Admin terminé" -ForegroundColor Green
Set-Location ..

# Création de la structure de déploiement
Write-Host "`n📁 Création de la structure de déploiement..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "oxahost-deploy" -Force | Out-Null
New-Item -ItemType Directory -Path "oxahost-deploy\public_html" -Force | Out-Null
New-Item -ItemType Directory -Path "oxahost-deploy\admin" -Force | Out-Null

# Copie des builds
Write-Host "`n📋 Copie des fichiers..." -ForegroundColor Yellow
Write-Host "   Copie du Client..." -ForegroundColor Gray
Copy-Item -Path "Client\build\*" -Destination "oxahost-deploy\public_html\" -Recurse -Force

Write-Host "   Copie de l'Admin..." -ForegroundColor Gray
Copy-Item -Path "admin-app\build\*" -Destination "oxahost-deploy\admin\" -Recurse -Force

# Création des fichiers .htaccess
Write-Host "`n📝 Création des fichiers .htaccess..." -ForegroundColor Yellow

$htaccessClient = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Sécurité
<Files ~ "^\.ht">
  Order allow,deny
  Deny from all
</Files>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/xml+rss
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
"@

$htaccessAdmin = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /admin/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /admin/index.html [L]
</IfModule>

# Sécurité renforcée pour l'admin
<Files ~ "^\.ht">
  Order allow,deny
  Deny from all
</Files>

# Protection contre les attaques
<IfModule mod_rewrite.c>
  RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
  RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
  RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2}) [OR]
  RewriteCond %{QUERY_STRING} proc/self/environ [OR]
  RewriteCond %{QUERY_STRING} mosConfig_[a-zA-Z_]{1,21}(=|\%3D) [OR]
  RewriteCond %{QUERY_STRING} base64_(en|de)code[^(]*\([^)]*\) [OR]
  RewriteCond %{REQUEST_URI} ^/(.*)\.php(\?.*)?$ [OR]
  RewriteCond %{REQUEST_URI} ^/(.*)\.pl(\?.*)?$ [OR]
  RewriteCond %{REQUEST_URI} ^/(.*)\.py(\?.*)?$
  RewriteRule ^(.*)$ - [F,L]
</IfModule>
"@

$htaccessClient | Out-File -FilePath "oxahost-deploy\public_html\.htaccess" -Encoding UTF8
$htaccessAdmin | Out-File -FilePath "oxahost-deploy\admin\.htaccess" -Encoding UTF8

Write-Host "   ✅ Fichiers .htaccess créés" -ForegroundColor Green

# Création du rapport de déploiement
Write-Host "`n📊 Génération du rapport..." -ForegroundColor Yellow

$clientSize = (Get-ChildItem -Path "oxahost-deploy\public_html" -Recurse | Measure-Object -Property Length -Sum).Sum
$adminSize = (Get-ChildItem -Path "oxahost-deploy\admin" -Recurse | Measure-Object -Property Length -Sum).Sum
$totalSize = $clientSize + $adminSize

$rapport = @"
# Rapport de déploiement OxaHost
Généré le: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

## Statistiques
- Taille Client: $([math]::Round($clientSize/1MB, 2)) MB
- Taille Admin: $([math]::Round($adminSize/1MB, 2)) MB
- Taille totale: $([math]::Round($totalSize/1MB, 2)) MB

## Structure générée
```
oxahost-deploy/
├── public_html/     # Frontend Client ($([math]::Round($clientSize/1MB, 2)) MB)
└── admin/           # Admin Panel ($([math]::Round($adminSize/1MB, 2)) MB)
```

## Prochaines étapes
1. Connectez-vous à votre cPanel OxaHost
2. Accédez au gestionnaire de fichiers
3. Uploadez le contenu de 'public_html' vers votre domaine principal
4. Uploadez le contenu de 'admin' vers un sous-dossier /admin
5. Vérifiez que l'API Railway fonctionne: https://sanny-api.up.railway.app
6. Testez votre site: https://$DomainName
7. Testez l'admin: https://$DomainName/admin

## Configuration requise
- API URL: https://sanny-api.up.railway.app
- SSL: Activé (recommandé)
- PHP: Non requis (site statique)
- Node.js: Non requis sur OxaHost (API externe)

## Support
En cas de problème, vérifiez:
1. Les logs d'erreur dans cPanel
2. La console du navigateur (F12)
3. Que l'API Railway est accessible
"@

$rapport | Out-File -FilePath "oxahost-deploy\RAPPORT_DEPLOIEMENT.md" -Encoding UTF8

# Résumé final
Write-Host "`n🎉 DÉPLOIEMENT PRÉPARÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "📁 Dossier de déploiement: oxahost-deploy" -ForegroundColor White
Write-Host "📊 Taille totale: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor White
Write-Host "📋 Rapport: oxahost-deploy\RAPPORT_DEPLOIEMENT.md" -ForegroundColor White
Write-Host "`n🚀 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Ouvrez votre cPanel OxaHost" -ForegroundColor White
Write-Host "2. Uploadez public_html/ vers votre domaine" -ForegroundColor White
Write-Host "3. Uploadez admin/ vers /admin/" -ForegroundColor White
Write-Host "4. Activez SSL et testez!" -ForegroundColor White

if ($DomainName) {
    Write-Host "`n🌐 URLs de test:" -ForegroundColor Yellow
    Write-Host "Client: https://$DomainName" -ForegroundColor White
    Write-Host "Admin: https://$DomainName/admin" -ForegroundColor White
    Write-Host "API: https://sanny-api.up.railway.app" -ForegroundColor White
}

Write-Host "`n✨ Bon déploiement!" -ForegroundColor Green