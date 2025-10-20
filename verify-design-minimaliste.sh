#!/bin/bash

# 🎨 Vérification du Design Minimaliste
# Ce script vérifie que les couleurs orange, blanc et noir sont bien appliquées

echo "=================================="
echo "🎨 VÉRIFICATION DESIGN MINIMALISTE"
echo "=================================="
echo ""

CSS_FILE="/home/blackrdp/sanny/san/ecomerce_sanny/Client/src/pages/SingleProduct.css"

echo "📁 Fichier analysé : $CSS_FILE"
echo ""

# Vérifier les variables CSS orange
echo "🟠 Recherche des variables ORANGE..."
grep -n "orange-primary\|orange-light\|orange-dark" "$CSS_FILE" | head -5

echo ""

# Vérifier les dégradés supprimés
echo "❌ Vérification des DÉGRADÉS retirés..."
GRADIENTS=$(grep -c "gradient.*#667eea\|gradient.*#764ba2\|gradient.*#f093fb\|gradient.*#11998e" "$CSS_FILE")
if [ "$GRADIENTS" -eq 0 ]; then
    echo "✅ Tous les dégradés colorés ont été supprimés !"
else
    echo "⚠️  Attention : $GRADIENTS dégradés colorés trouvés"
fi

echo ""

# Vérifier la barre sous la description
echo "📋 Vérification de la BARRE sous description..."
BARRE=$(grep -c "product-description-section::before" "$CSS_FILE")
if [ "$BARRE" -eq 0 ]; then
    echo "✅ Barre retirée avec succès !"
else
    echo "⚠️  La barre est toujours présente"
fi

echo ""

# Compter les occurrences de chaque couleur
echo "📊 STATISTIQUES DES COULEURS :"
echo ""
ORANGE_COUNT=$(grep -c "orange-primary\|#FF6F00" "$CSS_FILE")
BLACK_COUNT=$(grep -c "black-primary\|#000000" "$CSS_FILE")
WHITE_COUNT=$(grep -c "white-primary\|white-soft\|#FFFFFF\|#F5F5F5" "$CSS_FILE")

echo "🟠 Orange : $ORANGE_COUNT occurrences"
echo "⚫ Noir   : $BLACK_COUNT occurrences"
echo "⚪ Blanc  : $WHITE_COUNT occurrences"

echo ""
echo "=================================="
echo "✨ Vérification terminée !"
echo "=================================="
echo ""
echo "🔄 Pour voir les changements dans le navigateur :"
echo "   1. Appuyez sur Ctrl+Shift+R (hard refresh)"
echo "   2. Naviguez vers une page produit"
echo "   3. Vérifiez les boutons orange/noir"
echo ""
