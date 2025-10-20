#!/bin/bash

# Script de monitoring d'upload en temps réel
# Usage: ./monitor-upload.sh

echo "🔍 MONITORING UPLOAD EN TEMPS RÉEL"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📊 Informations système:"
echo "  - Backend: http://74.235.205.26:4000"
echo "  - Admin:   http://74.235.205.26:3001"
echo ""
echo "⌛ En attente d'upload... (Ctrl+C pour quitter)"
echo "════════════════════════════════════════════════════════════"
echo ""

# Suivre les logs PM2 en filtrant les uploads
pm2 logs backend-fixed --lines 0 --raw | while read line; do
    # Détecter les uploads
    if echo "$line" | grep -q "DEBUT UPLOAD\|Base URL\|URL générée\|Upload terminé\|ERREUR UPLOAD"; then
        # Colorier les lignes importantes
        if echo "$line" | grep -q "DEBUT UPLOAD"; then
            echo -e "\n🚀 \033[1;36m$line\033[0m"
        elif echo "$line" | grep -q "Base URL"; then
            echo -e "🌐 \033[1;32m$line\033[0m"
        elif echo "$line" | grep -q "URL générée"; then
            echo -e "✅ \033[1;32m$line\033[0m"
        elif echo "$line" | grep -q "Upload terminé"; then
            echo -e "🎉 \033[1;32m$line\033[0m\n"
        elif echo "$line" | grep -q "ERREUR"; then
            echo -e "❌ \033[1;31m$line\033[0m"
        else
            echo "$line"
        fi
    fi
done
