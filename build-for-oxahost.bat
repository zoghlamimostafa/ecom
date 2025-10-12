@echo off
echo ==========================================
echo      BUILD POUR OXAHOST - SANNY STORE
echo ==========================================

echo.
echo 1. Nettoyage des anciens builds...
if exist "Client\build" rmdir /s /q "Client\build"
if exist "admin-app\build" rmdir /s /q "admin-app\build"
if exist "oxahost-deploy" rmdir /s /q "oxahost-deploy"

echo.
echo 2. Installation des dépendances...
cd Client
call npm install
cd ..\admin-app
call npm install
cd ..

echo.
echo 3. Build du Client (Frontend)...
cd Client
set REACT_APP_API_URL=https://sanny-api.up.railway.app
set GENERATE_SOURCEMAP=false
call npm run build
cd ..

echo.
echo 4. Build de l'Admin Panel...
cd admin-app
set REACT_APP_API_URL=https://sanny-api.up.railway.app
set GENERATE_SOURCEMAP=false
call npm run build
cd ..

echo.
echo 5. Création du dossier de déploiement...
mkdir oxahost-deploy
mkdir oxahost-deploy\public_html
mkdir oxahost-deploy\admin

echo.
echo 6. Copie des builds...
xcopy "Client\build\*" "oxahost-deploy\public_html\" /E /I /Y
xcopy "admin-app\build\*" "oxahost-deploy\admin\" /E /I /Y

echo.
echo 7. Création du fichier .htaccess pour React Router...
echo ^<IfModule mod_rewrite.c^> > oxahost-deploy\public_html\.htaccess
echo   RewriteEngine On >> oxahost-deploy\public_html\.htaccess
echo   RewriteBase / >> oxahost-deploy\public_html\.htaccess
echo   RewriteRule ^index\.html$ - [L] >> oxahost-deploy\public_html\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-f >> oxahost-deploy\public_html\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-d >> oxahost-deploy\public_html\.htaccess
echo   RewriteRule . /index.html [L] >> oxahost-deploy\public_html\.htaccess
echo ^</IfModule^> >> oxahost-deploy\public_html\.htaccess

echo ^<IfModule mod_rewrite.c^> > oxahost-deploy\admin\.htaccess
echo   RewriteEngine On >> oxahost-deploy\admin\.htaccess
echo   RewriteBase /admin/ >> oxahost-deploy\admin\.htaccess
echo   RewriteRule ^index\.html$ - [L] >> oxahost-deploy\admin\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-f >> oxahost-deploy\admin\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-d >> oxahost-deploy\admin\.htaccess
echo   RewriteRule . /admin/index.html [L] >> oxahost-deploy\admin\.htaccess
echo ^</IfModule^> >> oxahost-deploy\admin\.htaccess

echo.
echo ==========================================
echo          BUILD TERMINÉ AVEC SUCCÈS!
echo ==========================================
echo.
echo Fichiers prêts dans le dossier 'oxahost-deploy':
echo - public_html/  (Frontend Client)
echo - admin/        (Admin Panel)
echo.
echo Prochaines étapes:
echo 1. Connectez-vous à votre cPanel OxaHost
echo 2. Uploadez le contenu de 'public_html' vers votre domaine principal
echo 3. Uploadez le contenu de 'admin' vers un sous-dossier /admin
echo.
pause