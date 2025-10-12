#!/bin/bash

# Script pour mettre à jour les contrôleurs CRUD avec les versions corrigées

echo "🔧 Mise à jour des contrôleurs CRUD..."

# Répertoire backend
BACKEND_DIR="/home/blackrdp/sanny/san/ecomerce_sanny/backend"
CONTROLLER_DIR="$BACKEND_DIR/controller"

# Sauvegarde des anciens contrôleurs
echo "📁 Sauvegarde des anciens contrôleurs..."
mkdir -p "$CONTROLLER_DIR/backup_$(date +%Y%m%d_%H%M%S)"

# Sauvegarder les anciens fichiers s'ils existent
[ -f "$CONTROLLER_DIR/userCtrl.js" ] && cp "$CONTROLLER_DIR/userCtrl.js" "$CONTROLLER_DIR/backup_$(date +%Y%m%d_%H%M%S)/"
[ -f "$CONTROLLER_DIR/productCtrl.js" ] && cp "$CONTROLLER_DIR/productCtrl.js" "$CONTROLLER_DIR/backup_$(date +%Y%m%d_%H%M%S)/"
[ -f "$CONTROLLER_DIR/prodcategoryCtrl.js" ] && cp "$CONTROLLER_DIR/prodcategoryCtrl.js" "$CONTROLLER_DIR/backup_$(date +%Y%m%d_%H%M%S)/"
[ -f "$CONTROLLER_DIR/brandCtrl.js" ] && cp "$CONTROLLER_DIR/brandCtrl.js" "$CONTROLLER_DIR/backup_$(date +%Y%m%d_%H%M%S)/"
[ -f "$CONTROLLER_DIR/colorCtrl.js" ] && cp "$CONTROLLER_DIR/colorCtrl.js" "$CONTROLLER_DIR/backup_$(date +%Y%m%d_%H%M%S)/"

# Remplacer par les versions corrigées
echo "🔄 Remplacement par les versions corrigées..."

# User Controller
if [ -f "$CONTROLLER_DIR/userCtrlFixed.js" ]; then
    cp "$CONTROLLER_DIR/userCtrlFixed.js" "$CONTROLLER_DIR/userCtrl.js"
    echo "✅ userCtrl.js mis à jour"
fi

# Product Controller
if [ -f "$CONTROLLER_DIR/productCtrlFixed.js" ]; then
    cp "$CONTROLLER_DIR/productCtrlFixed.js" "$CONTROLLER_DIR/productCtrl.js"
    echo "✅ productCtrl.js mis à jour"
fi

# Category Controller
if [ -f "$CONTROLLER_DIR/prodcategoryCtrlFixed.js" ]; then
    cp "$CONTROLLER_DIR/prodcategoryCtrlFixed.js" "$CONTROLLER_DIR/prodcategoryCtrl.js"
    echo "✅ prodcategoryCtrl.js mis à jour"
fi

# Brand Controller
if [ -f "$CONTROLLER_DIR/brandCtrlFixed.js" ]; then
    cp "$CONTROLLER_DIR/brandCtrlFixed.js" "$CONTROLLER_DIR/brandCtrl.js"
    echo "✅ brandCtrl.js mis à jour"
fi

# Color Controller
if [ -f "$CONTROLLER_DIR/colorCtrlFixed.js" ]; then
    cp "$CONTROLLER_DIR/colorCtrlFixed.js" "$CONTROLLER_DIR/colorCtrl.js"
    echo "✅ colorCtrl.js mis à jour"
fi

echo ""
echo "🎉 Tous les contrôleurs CRUD ont été mis à jour avec succès !"
echo ""
echo "📝 Résumé des améliorations :"
echo "  - Gestion d'erreurs complète avec try/catch"
echo "  - Validation des données d'entrée"
echo "  - Réponses JSON standardisées"
echo "  - Pagination pour les listes"
echo "  - Recherche et filtrage avancés"
echo "  - Vérification d'intégrité des données"
echo "  - Protection contre les suppressions dangereuses"
echo ""
echo "⚠️  N'oubliez pas de redémarrer le backend pour appliquer les changements :"
echo "   cd $BACKEND_DIR && pm2 restart backend"