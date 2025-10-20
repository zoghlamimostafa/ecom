#!/bin/bash

# Script pour corriger automatiquement toutes les pages de catégories
# Remplace les filtres par tags par des filtres par category

echo "🔧 CORRECTION AUTOMATIQUE - Filtrage par Catégorie"
echo "═══════════════════════════════════════════════════════════════"
echo ""

CLIENT_DIR="/home/blackrdp/sanny/san/ecomerce_sanny/Client/src/pages"
BACKUP_DIR="/home/blackrdp/sanny/san/ecomerce_sanny/backup-pages-$(date +%Y%m%d-%H%M%S)"

# Créer un backup
echo "📁 Création du backup dans: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Mapping: Fichier → ID Catégorie
declare -A PAGE_TO_CATEGORY
PAGE_TO_CATEGORY["Maison.js"]="4"
PAGE_TO_CATEGORY["Telephone.js"]="379"
PAGE_TO_CATEGORY["Informatique.js"]="378"
PAGE_TO_CATEGORY["Electro.js"]="1"
PAGE_TO_CATEGORY["Sport.js"]="3"
PAGE_TO_CATEGORY["Animaux.js"]="277"
PAGE_TO_CATEGORY["Auto.js"]="39"
PAGE_TO_CATEGORY["Femme.js"]="381"
PAGE_TO_CATEGORY["Homme.js"]="380"
PAGE_TO_CATEGORY["Bebe.js"]="300"
PAGE_TO_CATEGORY["Jeux.js"]="345"
PAGE_TO_CATEGORY["Jardin.js"]="326"
PAGE_TO_CATEGORY["Sante.js"]="261"
PAGE_TO_CATEGORY["Other.js"]="387"

TOTAL=0
SUCCESS=0
FAILED=0

for PAGE in "${!PAGE_TO_CATEGORY[@]}"; do
    CATEGORY_ID="${PAGE_TO_CATEGORY[$PAGE]}"
    FILE_PATH="$CLIENT_DIR/$PAGE"
    
    if [ ! -f "$FILE_PATH" ]; then
        echo "⚠️  $PAGE - Fichier non trouvé, ignoré"
        continue
    fi
    
    TOTAL=$((TOTAL + 1))
    
    # Backup du fichier
    cp "$FILE_PATH" "$BACKUP_DIR/$PAGE"
    
    echo "🔄 Traitement: $PAGE → Catégorie $CATEGORY_ID"
    
    # Chercher la ligne à remplacer
    if grep -q 'productState.filter(item => item.tags ===' "$FILE_PATH"; then
        # Créer le nouveau code de filtrage
        NEW_FILTER="productState.filter(item => {
        const productCategory = item.category ? item.category.toString() : '';
        const productSubcategory = item.subcategory ? item.subcategory.toString() : '';
        console.log('🔍 [${PAGE%.js}] Produit:', item.title, '| cat:', productCategory, '| subcat:', productSubcategory);
        return productCategory === '$CATEGORY_ID' || productSubcategory === '$CATEGORY_ID';
      })"
        
        # Remplacer avec sed (attention aux caractères spéciaux)
        # On va utiliser perl pour plus de flexibilité
        perl -i -pe "s/productState\.filter\(item => item\.tags === \"[^\"]+\"\)/$NEW_FILTER/g" "$FILE_PATH"
        
        if [ $? -eq 0 ]; then
            echo "   ✅ Corrigé avec succès"
            SUCCESS=$((SUCCESS + 1))
        else
            echo "   ❌ Erreur lors de la correction"
            # Restaurer depuis le backup
            cp "$BACKUP_DIR/$PAGE" "$FILE_PATH"
            FAILED=$((FAILED + 1))
        fi
    else
        echo "   ⚠️  Pattern de filtrage non trouvé, ignoré"
    fi
    
    echo ""
done

echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 RÉSUMÉ:"
echo "   Total traité: $TOTAL"
echo "   Réussis: $SUCCESS"
echo "   Échoués: $FAILED"
echo ""
echo "💾 Backup sauvegardé dans: $BACKUP_DIR"
echo ""

if [ $SUCCESS -gt 0 ]; then
    echo "✅ Correction terminée !"
    echo ""
    echo "🔄 PROCHAINES ÉTAPES:"
    echo "   1. Recharger le client: Ctrl+Shift+R"
    echo "   2. Tester chaque page de catégorie"
    echo "   3. Vérifier les logs dans la console (F12)"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════════"
