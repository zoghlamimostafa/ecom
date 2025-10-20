#!/bin/bash

echo "🔧 FIX AUTOMATIQUE - PROBLÈMES MINEURS"
echo "======================================"
echo ""

FIXED=0
FAILED=0

# Fix 1: Installer jq si manquant
echo "1️⃣ Vérification de jq..."
if ! command -v jq &> /dev/null; then
    echo "   ❌ jq non installé"
    echo "   📥 Installation de jq..."
    
    if command -v apt &> /dev/null; then
        sudo apt update && sudo apt install jq -y
        if [ $? -eq 0 ]; then
            echo "   ✅ jq installé avec succès"
            ((FIXED++))
        else
            echo "   ❌ Échec installation jq"
            ((FAILED++))
        fi
    elif command -v yum &> /dev/null; then
        sudo yum install jq -y
        if [ $? -eq 0 ]; then
            echo "   ✅ jq installé avec succès"
            ((FIXED++))
        else
            echo "   ❌ Échec installation jq"
            ((FAILED++))
        fi
    else
        echo "   ⚠️ Gestionnaire de paquets non détecté"
        echo "   💡 Installez manuellement: https://stedolan.github.io/jq/download/"
        ((FAILED++))
    fi
else
    echo "   ✅ jq déjà installé"
fi

echo ""

# Fix 2: Vérifier netstat/ss
echo "2️⃣ Vérification outils réseau..."
if command -v netstat &> /dev/null; then
    echo "   ✅ netstat disponible"
elif command -v ss &> /dev/null; then
    echo "   ✅ ss disponible (alternative à netstat)"
else
    echo "   ❌ ni netstat ni ss disponibles"
    echo "   📥 Installation net-tools..."
    
    if command -v apt &> /dev/null; then
        sudo apt install net-tools -y
        if [ $? -eq 0 ]; then
            echo "   ✅ net-tools installé"
            ((FIXED++))
        else
            echo "   ❌ Échec installation net-tools"
            ((FAILED++))
        fi
    elif command -v yum &> /dev/null; then
        sudo yum install net-tools -y
        if [ $? -eq 0 ]; then
            echo "   ✅ net-tools installé"
            ((FIXED++))
        else
            echo "   ❌ Échec installation net-tools"
            ((FAILED++))
        fi
    else
        echo "   ⚠️ Gestionnaire de paquets non détecté"
        ((FAILED++))
    fi
fi

echo ""

# Fix 3: Nettoyer warnings ESLint (optionnel)
echo "3️⃣ Nettoyage ESLint (optionnel)..."
read -p "Voulez-vous nettoyer les warnings ESLint ? (y/N): " response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "   🧹 Backend..."
    cd /home/blackrdp/sanny/san/ecomerce_sanny/backend
    npm run lint -- --fix 2>/dev/null || echo "   ⚠️ Pas de commande lint dans backend"
    
    echo "   🧹 Admin..."
    cd /home/blackrdp/sanny/san/ecomerce_sanny/admin-app
    npm run lint -- --fix 2>/dev/null || echo "   ⚠️ Pas de commande lint dans admin"
    
    echo "   🧹 Client..."
    cd /home/blackrdp/sanny/san/ecomerce_sanny/Client
    npm run lint -- --fix 2>/dev/null || echo "   ⚠️ Pas de commande lint dans client"
    
    echo "   ✅ Nettoyage ESLint terminé"
    ((FIXED++))
else
    echo "   ⏭️  ESLint nettoyage ignoré"
fi

echo ""

# Fix 4: Optimiser database SQLite
echo "4️⃣ Optimisation base de données..."
read -p "Voulez-vous optimiser la base de données ? (y/N): " response
if [[ "$response" =~ ^[Yy]$ ]]; then
    DB_PATH="/home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite"
    
    if [ -f "$DB_PATH" ]; then
        # Backup
        BACKUP_PATH="${DB_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$DB_PATH" "$BACKUP_PATH"
        echo "   💾 Backup créé: $(basename $BACKUP_PATH)"
        
        # Vérifier intégrité
        echo "   🔍 Vérification intégrité..."
        INTEGRITY=$(sqlite3 "$DB_PATH" "PRAGMA integrity_check;" 2>&1)
        if [ "$INTEGRITY" = "ok" ]; then
            echo "   ✅ Intégrité OK"
            
            # Optimiser
            echo "   ⚡ Optimisation (VACUUM)..."
            sqlite3 "$DB_PATH" "VACUUM;" 2>&1
            
            if [ $? -eq 0 ]; then
                echo "   ✅ Optimisation réussie"
                
                # Afficher gains
                SIZE_BEFORE=$(stat -c%s "$BACKUP_PATH")
                SIZE_AFTER=$(stat -c%s "$DB_PATH")
                SAVED=$((SIZE_BEFORE - SIZE_AFTER))
                
                echo "   📊 Avant: $(numfmt --to=iec $SIZE_BEFORE)"
                echo "   📊 Après: $(numfmt --to=iec $SIZE_AFTER)"
                echo "   💾 Économisé: $(numfmt --to=iec $SAVED)"
                
                ((FIXED++))
            else
                echo "   ❌ Erreur optimisation"
                echo "   🔄 Restauration backup..."
                cp "$BACKUP_PATH" "$DB_PATH"
                ((FAILED++))
            fi
        else
            echo "   ❌ Problème d'intégrité détecté!"
            echo "   $INTEGRITY"
            ((FAILED++))
        fi
    else
        echo "   ❌ Database non trouvée"
        ((FAILED++))
    fi
else
    echo "   ⏭️  Optimisation ignorée"
fi

echo ""
echo "======================================"
echo "📊 RÉSUMÉ"
echo "======================================"
echo ""
echo "✅ Corrections appliquées: $FIXED"
echo "❌ Corrections échouées: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 TOUS LES FIXES RÉUSSIS!"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "   1. Relancer le diagnostic: ./diagnostic-complet.sh"
    echo "   2. Vérifier les services: pm2 list"
    echo "   3. Tester l'application manuellement"
else
    echo "⚠️ Certains fixes ont échoué"
    echo "Consultez les messages ci-dessus pour détails"
fi

echo ""
