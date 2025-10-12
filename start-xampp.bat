@echo off
echo Démarrage des services XAMPP...

echo Démarrage d'Apache...
start /B C:\xampp\apache\bin\httpd.exe

echo Démarrage de MySQL...
start /B C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\xampp\mysql\bin\my.ini

echo Attente de 10 secondes pour que les services se lancent...
timeout /t 10 /nobreak

echo Vérification des services...
tasklist | findstr "mysqld.exe httpd.exe"

echo Terminé ! XAMPP devrait être en marche.
pause