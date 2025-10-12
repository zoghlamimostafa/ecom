# Script de sauvegarde de la base de données MySQL
# À exécuter depuis le dossier racine du projet

Write-Host "🗄️ Exportation de la base de données MySQL..." -ForegroundColor Yellow

# Configuration
$xamppPath = "C:\xampp\mysql\bin"
$projectPath = "C:\xampp\htdocs\sanny\san\ecomerce_sanny"
$dbName = "ecomerce_sanny_mysql"
$dbUser = "root"
$backupDate = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Vérifier que XAMPP MySQL est accessible
if (!(Test-Path "$xamppPath\mysqldump.exe")) {
    Write-Host "❌ XAMPP MySQL introuvable à : $xamppPath" -ForegroundColor Red
    Write-Host "📝 Veuillez ajuster le chemin XAMPP dans le script" -ForegroundColor Yellow
    exit 1
}

# Créer le dossier de sauvegarde s'il n'existe pas
$backupDir = "$projectPath\database_backups"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "📁 Dossier de sauvegarde créé : $backupDir" -ForegroundColor Green
}

# Export structure + données
Write-Host "📤 Export de la structure et des données..." -ForegroundColor Blue
$structureFile = "$backupDir\database_structure_$backupDate.sql"
$completeFile = "$backupDir\database_complete_$backupDate.sql"

try {
    # Export structure seulement
    & "$xamppPath\mysqldump.exe" -u $dbUser --no-data --routines --triggers $dbName > $structureFile
    
    # Export complet (structure + données)
    & "$xamppPath\mysqldump.exe" -u $dbUser --single-transaction --routines --triggers $dbName > $completeFile
    
    Write-Host "✅ Sauvegarde créée avec succès !" -ForegroundColor Green
    Write-Host "📁 Fichiers créés :" -ForegroundColor Cyan
    Write-Host "   - Structure seule : $structureFile" -ForegroundColor White
    Write-Host "   - Base complète : $completeFile" -ForegroundColor White
    
    # Afficher la taille des fichiers
    $structureSize = [math]::Round((Get-Item $structureFile).Length / 1KB, 2)
    $completeSize = [math]::Round((Get-Item $completeFile).Length / 1KB, 2)
    
    Write-Host "📊 Tailles :" -ForegroundColor Cyan
    Write-Host "   - Structure : $structureSize KB" -ForegroundColor White
    Write-Host "   - Complète : $completeSize KB" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors de l'export : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Prochaines étapes :" -ForegroundColor Magenta
Write-Host "1. Uploader $completeFile vers OxaHost via phpMyAdmin" -ForegroundColor White
Write-Host "2. Créer une nouvelle base MySQL dans cPanel OxaHost" -ForegroundColor White
Write-Host "3. Importer le fichier SQL dans la nouvelle base" -ForegroundColor White

Write-Host ""
Write-Host "📋 Notes importantes :" -ForegroundColor Yellow
Write-Host "• Notez les identifiants MySQL OxaHost (user, password, database)" -ForegroundColor Gray
Write-Host "• Mettez à jour le fichier .env avec ces identifiants" -ForegroundColor Gray
Write-Host "• Testez la connexion après import" -ForegroundColor Gray

Write-Host ""
Write-Host "✨ Export terminé avec succès !" -ForegroundColor Green