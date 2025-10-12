# 📄 GUIDE DE CONVERSION PDF

## Méthodes recommandées pour convertir la documentation en PDF

### Méthode 1 : Pandoc (Recommandée)

#### Installation Pandoc
```bash
# Windows (avec Chocolatey)
choco install pandoc

# Ubuntu/Debian
sudo apt-get install pandoc

# macOS (avec Homebrew)
brew install pandoc
```

#### Conversion en PDF
```bash
# Documentation principale
pandoc DOCUMENTATION_SANNY_STORE.md -o DOCUMENTATION_SANNY_STORE.pdf --pdf-engine=xelatex

# Annexes techniques  
pandoc ANNEXES_TECHNIQUES.md -o ANNEXES_TECHNIQUES.pdf --pdf-engine=xelatex

# Tout en un seul PDF
pandoc DOCUMENTATION_SANNY_STORE.md ANNEXES_TECHNIQUES.md -o DOCUMENTATION_COMPLETE_SANNY_STORE.pdf --pdf-engine=xelatex
```

#### Options avancées Pandoc
```bash
pandoc DOCUMENTATION_SANNY_STORE.md \
  -o DOCUMENTATION_SANNY_STORE.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --highlight-style=github \
  --geometry=margin=2cm \
  --variable=fontsize:11pt \
  --variable=mainfont:"Arial" \
  --variable=monofont:"Courier New"
```

### Méthode 2 : VS Code avec extensions

#### Extensions recommandées
1. **Markdown PDF** (yzane.markdown-pdf)
2. **Markdown All in One** (yzhang.markdown-all-in-one)

#### Utilisation
1. Ouvrir le fichier .md dans VS Code
2. Ctrl+Shift+P → "Markdown PDF: Export (pdf)"
3. Le PDF sera généré dans le même dossier

### Méthode 3 : Outils en ligne

#### GitLab/GitHub Pages
1. Push les fichiers .md sur GitLab/GitHub
2. Utiliser GitLab Pages ou GitHub Pages
3. Imprimer en PDF depuis le navigateur

#### Typora (Payant mais excellent)
1. Ouvrir le fichier .md dans Typora
2. File → Export → PDF
3. Configuration avancée disponible

### Méthode 4 : Markdown to PDF API

#### Script Node.js
```javascript
const markdownpdf = require("markdown-pdf");
const fs = require("fs");

const options = {
  paperFormat: "A4",
  paperOrientation: "portrait",
  paperBorder: "2cm",
  renderDelay: 1000,
  cssPath: "./pdf-style.css"
};

markdownpdf(options)
  .from("DOCUMENTATION_SANNY_STORE.md")
  .to("DOCUMENTATION_SANNY_STORE.pdf", function () {
    console.log("PDF généré avec succès!");
  });
```

### Style CSS pour PDF personnalisé

Créer un fichier `pdf-style.css` :
```css
body {
  font-family: 'Arial', sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #FF6B35;
  border-bottom: 3px solid #FF6B35;
  padding-bottom: 10px;
  page-break-before: always;
}

h2 {
  color: #2E86AB;
  border-bottom: 2px solid #2E86AB;
  padding-bottom: 5px;
  margin-top: 30px;
}

h3 {
  color: #A23B72;
  margin-top: 25px;
}

code {
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 9pt;
}

pre {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  overflow-x: auto;
  font-size: 9pt;
}

blockquote {
  border-left: 4px solid #FF6B35;
  margin-left: 0;
  padding-left: 20px;
  color: #666;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.page-break {
  page-break-before: always;
}

@media print {
  body {
    font-size: 10pt;
  }
  
  h1 {
    font-size: 18pt;
  }
  
  h2 {
    font-size: 14pt;
  }
  
  h3 {
    font-size: 12pt;
  }
}
```

## Contenu du package complet

Votre documentation complète comprend :

### 📋 Fichiers principaux
1. **DOCUMENTATION_SANNY_STORE.md** - Documentation utilisateur complète
2. **ANNEXES_TECHNIQUES.md** - Détails techniques pour développeurs  
3. **GUIDE_CONVERSION_PDF.md** - Ce guide (optionnel)
4. **RAPPORT_TEST_COMPLET.md** - Rapport des tests effectués

### 📊 Statistiques de la documentation
- **Pages estimées** : ~50-60 pages en PDF
- **Sections** : 12 sections principales + annexes
- **Diagrammes** : Architecture, flux de données, API
- **Code samples** : Plus de 50 exemples
- **Configuration** : Variables d'environnement complètes

### 🎯 Public cible
- **Développeurs** : Installation, configuration, API
- **Administrateurs système** : Déploiement, maintenance
- **Utilisateurs finaux** : Guide d'utilisation
- **Management** : Vue d'ensemble, roadmap

## Commande rapide pour tout générer

Créer un script `generate-pdf.bat` pour Windows :
```batch
@echo off
echo Génération de la documentation PDF Sanny Store...

echo.
echo [1/3] Documentation principale...
pandoc DOCUMENTATION_SANNY_STORE.md -o DOCUMENTATION_SANNY_STORE.pdf --pdf-engine=xelatex --toc --number-sections

echo.
echo [2/3] Annexes techniques...
pandoc ANNEXES_TECHNIQUES.md -o ANNEXES_TECHNIQUES.pdf --pdf-engine=xelatex --toc --number-sections

echo.
echo [3/3] Documentation complète...
pandoc DOCUMENTATION_SANNY_STORE.md ANNEXES_TECHNIQUES.md RAPPORT_TEST_COMPLET.md -o DOCUMENTATION_COMPLETE_SANNY_STORE.pdf --pdf-engine=xelatex --toc --number-sections --geometry=margin=2cm

echo.
echo ✅ Génération terminée !
echo 📄 Fichiers créés :
echo    - DOCUMENTATION_SANNY_STORE.pdf
echo    - ANNEXES_TECHNIQUES.pdf  
echo    - DOCUMENTATION_COMPLETE_SANNY_STORE.pdf
pause
```

Ou script `generate-pdf.sh` pour Linux/Mac :
```bash
#!/bin/bash
echo "Génération de la documentation PDF Sanny Store..."

echo ""
echo "[1/3] Documentation principale..."
pandoc DOCUMENTATION_SANNY_STORE.md -o DOCUMENTATION_SANNY_STORE.pdf --pdf-engine=xelatex --toc --number-sections

echo ""
echo "[2/3] Annexes techniques..."
pandoc ANNEXES_TECHNIQUES.md -o ANNEXES_TECHNIQUES.pdf --pdf-engine=xelatex --toc --number-sections

echo ""
echo "[3/3] Documentation complète..."
pandoc DOCUMENTATION_SANNY_STORE.md ANNEXES_TECHNIQUES.md RAPPORT_TEST_COMPLET.md -o DOCUMENTATION_COMPLETE_SANNY_STORE.pdf --pdf-engine=xelatex --toc --number-sections --geometry=margin=2cm

echo ""
echo "✅ Génération terminée !"
echo "📄 Fichiers créés :"
echo "   - DOCUMENTATION_SANNY_STORE.pdf"
echo "   - ANNEXES_TECHNIQUES.pdf"
echo "   - DOCUMENTATION_COMPLETE_SANNY_STORE.pdf"
```
