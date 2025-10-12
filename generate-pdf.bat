@echo off
chcp 65001 > nul
title Génération Documentation PDF - Sanny Store

echo.
echo ███████╗ █████╗ ███╗   ███╗███╗   ██╗██╗   ██╗    ███████╗████████╗ ██████╗ ██████╗ ███████╗
echo ██╔════╝██╔══██╗████╗ ████║████╗  ██║╚██╗ ██╔╝    ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
echo ███████╗███████║██╔████╔██║██╔██╗ ██║ ╚████╔╝     ███████╗   ██║   ██║   ██║██████╔╝█████╗  
echo ╚════██║██╔══██║██║╚██╔╝██║██║╚██╗██║  ╚██╔╝      ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  
echo ███████║██║  ██║██║ ╚═╝ ██║██║ ╚████║   ██║       ███████║   ██║   ╚██████╔╝██║  ██║███████╗
echo ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝       ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
echo.
echo               🚀 Génération de la documentation PDF en cours...
echo.

REM Vérifier si Pandoc est installé
where pandoc >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Pandoc n'est pas installé !
    echo.
    echo 📥 Pour installer Pandoc:
    echo    1. Télécharger depuis: https://pandoc.org/installing.html
    echo    2. Ou avec Chocolatey: choco install pandoc
    echo.
    pause
    exit /b 1
)

echo ✅ Pandoc détecté - Version:
pandoc --version | findstr "pandoc"
echo.

REM Créer le dossier de sortie
if not exist "Documentation_PDF" mkdir Documentation_PDF

echo 📄 [1/4] Génération de la documentation principale...
pandoc "DOCUMENTATION_SANNY_STORE.md" ^
    -o "Documentation_PDF/01_DOCUMENTATION_SANNY_STORE.pdf" ^
    --pdf-engine=xelatex ^
    --toc ^
    --toc-depth=3 ^
    --number-sections ^
    --highlight-style=github ^
    --geometry=margin=2cm ^
    --variable=fontsize:11pt ^
    --metadata title="Documentation Sanny Store" ^
    --metadata author="Équipe Sanny Store" ^
    --metadata date="%date%"

if %ERRORLEVEL% EQU 0 (
    echo    ✅ Documentation principale générée
) else (
    echo    ❌ Erreur lors de la génération
)

echo.
echo 📄 [2/4] Génération des annexes techniques...
pandoc "ANNEXES_TECHNIQUES.md" ^
    -o "Documentation_PDF/02_ANNEXES_TECHNIQUES.pdf" ^
    --pdf-engine=xelatex ^
    --toc ^
    --toc-depth=3 ^
    --number-sections ^
    --highlight-style=github ^
    --geometry=margin=2cm ^
    --variable=fontsize:10pt ^
    --metadata title="Annexes Techniques - Sanny Store" ^
    --metadata author="Équipe Technique" ^
    --metadata date="%date%"

if %ERRORLEVEL% EQU 0 (
    echo    ✅ Annexes techniques générées
) else (
    echo    ❌ Erreur lors de la génération
)

echo.
echo 📄 [3/4] Génération du rapport de tests...
pandoc "RAPPORT_TEST_COMPLET.md" ^
    -o "Documentation_PDF/03_RAPPORT_TESTS.pdf" ^
    --pdf-engine=xelatex ^
    --toc ^
    --number-sections ^
    --highlight-style=github ^
    --geometry=margin=2cm ^
    --variable=fontsize:11pt ^
    --metadata title="Rapport de Tests - Sanny Store" ^
    --metadata author="QA Team" ^
    --metadata date="%date%"

if %ERRORLEVEL% EQU 0 (
    echo    ✅ Rapport de tests généré
) else (
    echo    ❌ Erreur lors de la génération
)

echo.
echo 📄 [4/4] Génération de la documentation complète...
pandoc "DOCUMENTATION_SANNY_STORE.md" "ANNEXES_TECHNIQUES.md" "RAPPORT_TEST_COMPLET.md" ^
    -o "Documentation_PDF/00_DOCUMENTATION_COMPLETE_SANNY_STORE.pdf" ^
    --pdf-engine=xelatex ^
    --toc ^
    --toc-depth=3 ^
    --number-sections ^
    --highlight-style=github ^
    --geometry=margin=2cm ^
    --variable=fontsize:11pt ^
    --metadata title="Documentation Complète - Sanny Store v1.0" ^
    --metadata author="Équipe Sanny Store" ^
    --metadata date="%date%" ^
    --metadata subtitle="Application E-commerce MERN Stack"

if %ERRORLEVEL% EQU 0 (
    echo    ✅ Documentation complète générée
) else (
    echo    ❌ Erreur lors de la génération
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo                        🎉 GÉNÉRATION TERMINÉE !
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📁 Fichiers générés dans le dossier "Documentation_PDF":
echo.
echo    📄 00_DOCUMENTATION_COMPLETE_SANNY_STORE.pdf  (Tout en un)
echo    📄 01_DOCUMENTATION_SANNY_STORE.pdf           (Doc principale)
echo    📄 02_ANNEXES_TECHNIQUES.pdf                  (Détails techniques)
echo    📄 03_RAPPORT_TESTS.pdf                       (Tests et validation)
echo.

REM Obtenir la taille des fichiers
for %%f in (Documentation_PDF\*.pdf) do (
    echo    📊 %%~nf: %%~zf octets
)

echo.
echo 🚀 Les documents PDF sont prêts pour distribution !
echo.
echo 💡 Astuce: Pour ouvrir le dossier, tapez: explorer Documentation_PDF
echo.
pause
