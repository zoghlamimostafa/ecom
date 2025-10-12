#!/bin/bash

echo "🧪 Test des Améliorations de la Page Contact"
echo "=============================================="
echo ""

# Vérifier que le fichier CSS existe
if [ -f "/home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css" ]; then
    echo "✅ Fichier CSS trouvé"
else
    echo "❌ Fichier CSS introuvable"
    exit 1
fi

echo ""
echo "📊 Vérification des modifications CSS..."
echo ""

# Vérifier les icônes circulaires
if grep -q "border-radius: 50%" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "✅ Icônes circulaires (border-radius: 50%)"
else
    echo "❌ Icônes circulaires manquantes"
fi

# Vérifier le gradient orange
if grep -q "linear-gradient(135deg, #ff6b35, #ff8c42)" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "✅ Gradient orange présent"
else
    echo "❌ Gradient orange manquant"
fi

# Vérifier les ombres oranges
if grep -q "rgba(255, 107, 53," /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "✅ Ombres oranges configurées"
else
    echo "❌ Ombres oranges manquantes"
fi

# Vérifier le bouton pilule
if grep -q "border-radius: 50px" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "✅ Bouton pilule (border-radius: 50px)"
else
    echo "❌ Bouton pilule manquant"
fi

# Vérifier l'animation shake
if grep -q "@keyframes shake" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "✅ Animation shake définie"
else
    echo "❌ Animation shake manquante"
fi

# Vérifier les transitions cubic-bezier
if grep -q "cubic-bezier(0.4, 0, 0.2, 1)" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "✅ Transitions fluides (cubic-bezier)"
else
    echo "❌ Transitions fluides manquantes"
fi

echo ""
echo "📁 Fichiers créés:"
echo ""

if [ -f "/home/blackrdp/sanny/san/ecomerce_sanny/AMELIORATION_PAGE_CONTACT.md" ]; then
    echo "✅ AMELIORATION_PAGE_CONTACT.md"
else
    echo "❌ AMELIORATION_PAGE_CONTACT.md manquant"
fi

if [ -f "/home/blackrdp/sanny/san/ecomerce_sanny/RAPPORT_FINAL_CONTACT_DESIGN.md" ]; then
    echo "✅ RAPPORT_FINAL_CONTACT_DESIGN.md"
else
    echo "❌ RAPPORT_FINAL_CONTACT_DESIGN.md manquant"
fi

if [ -f "/home/blackrdp/sanny/san/ecomerce_sanny/test-design-contact.html" ]; then
    echo "✅ test-design-contact.html"
else
    echo "❌ test-design-contact.html manquant"
fi

echo ""
echo "🚀 État des Services:"
echo ""

pm2 list | grep -E "backend-fixed|sanny-admin|sanny-client"

echo ""
echo "🌐 URLs de Test:"
echo ""
echo "  📱 Client: http://localhost:3000/contact"
echo "  🎨 Aperçu: file:///home/blackrdp/sanny/san/ecomerce_sanny/test-design-contact.html"
echo "  🔧 Admin: http://localhost:3001"
echo ""

# Compter les occurrences de border-radius: 50%
COUNT=$(grep -c "border-radius: 50%" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css)
echo "📊 Statistiques:"
echo "  • Icônes circulaires trouvées: $COUNT"

# Compter les linear-gradient orange
COUNT_GRADIENT=$(grep -c "linear-gradient(135deg, #ff6b35, #ff8c42)" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css)
echo "  • Gradients orange trouvés: $COUNT_GRADIENT"

echo ""
echo "✅ Test terminé!"
echo ""
echo "💡 Pour voir les changements:"
echo "   1. Ouvrir: http://localhost:3000/contact"
echo "   2. Ou ouvrir test-design-contact.html dans le navigateur"
echo ""
