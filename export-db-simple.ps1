# Script d'export de base de donnees MySQL
Write-Host "Exportation de la base de donnees MySQL..." -ForegroundColor Yellow

$xamppPath = "C:\xampp\mysql\bin"
$projectPath = "C:\xampp\htdocs\sanny\san\ecomerce_sanny"
$dbName = "ecomerce_sanny_mysql"
$dbUser = "root"
$backupDate = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Creer le dossier de sauvegarde
$backupDir = "$projectPath\database_backups"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "Dossier de sauvegarde cree : $backupDir" -ForegroundColor Green
}

# Export complet
Write-Host "Export de la base de donnees..." -ForegroundColor Blue
$completeFile = "$backupDir\database_complete_$backupDate.sql"

try {
    & "$xamppPath\mysqldump.exe" -u $dbUser --single-transaction --routines --triggers $dbName > $completeFile
    
    Write-Host "Sauvegarde creee avec succes !" -ForegroundColor Green
    Write-Host "Fichier : $completeFile" -ForegroundColor White
    
    $completeSize = [math]::Round((Get-Item $completeFile).Length / 1KB, 2)
    Write-Host "Taille : $completeSize KB" -ForegroundColor White
    
} catch {
    Write-Host "Erreur lors de l'export : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Magenta
Write-Host "1. Uploader le fichier SQL vers OxaHost via phpMyAdmin" -ForegroundColor White
Write-Host "2. Creer une nouvelle base MySQL dans cPanel OxaHost" -ForegroundColor White
Write-Host "3. Importer le fichier SQL dans la nouvelle base" -ForegroundColor White

Write-Host ""
Write-Host "Export termine avec succes !" -ForegroundColor Green