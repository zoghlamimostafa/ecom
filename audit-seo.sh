#!/bin/bash

echo "=== AUDIT SEO COMPLET - SANNY STORE ==="
echo "======================================="
echo

# Pages principales à vérifier
declare -a pages=("Home.js" "About.js" "Contact.js" "OurStore.js" "Cart.js" "Login.js" "Signup.js" "Checkout.js" "SingleProduct.js" "Blogs.js" "PrivacyPolicy.js" "RefundPolicy.js" "TermAndConditions.js")

completed_pages=0
pending_pages=0

echo "🔍 RÉSULTATS DE L'AUDIT:"
echo

for page in "${pages[@]}"; do
    file_path="./Client/src/pages/$page"
    if [ -f "$file_path" ]; then
        if grep -q "SEOEnhancer" "$file_path"; then
            echo "✅ $page - SEO Parfait (SEOEnhancer)"
            ((completed_pages++))
        elif grep -q "Meta" "$file_path"; then
            echo "⚠️  $page - SEO Basique (Meta seulement)"
            ((pending_pages++))
        else
            echo "❌ $page - Aucun SEO détecté"
            ((pending_pages++))
        fi
    else
        echo "❓ $page - Fichier non trouvé"
    fi
done

echo
echo "=== STATISTIQUES ==="
echo "✅ Pages parfaites: $completed_pages"
echo "⚠️  Pages à améliorer: $pending_pages"
echo "📊 Score SEO: $(( completed_pages * 100 / (completed_pages + pending_pages) ))%"

echo
echo "=== RECOMMANDATIONS ==="
echo "1. Ajouter SEOEnhancer aux pages avec Meta seulement"
echo "2. Créer les clés de traduction SEO manquantes"
echo "3. Optimiser les meta descriptions et mots-clés"
echo "4. Vérifier les images alt tags"
echo "5. Tester les Core Web Vitals"