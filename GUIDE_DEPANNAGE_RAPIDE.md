# 🔧 GUIDE DE DÉPANNAGE RAPIDE - Erreur de Chargement des Données

## 🚨 Si vous voyez "Une erreur s'est produite lors du chargement des données"

### 📋 ÉTAPES DE RÉSOLUTION (Dans l'ordre)

#### 1️⃣ **Actualisation Simple**
```
- Appuyez sur F5 dans le navigateur
- Ou Ctrl + F5 (actualisation forcée)
```

#### 2️⃣ **Vérification des Services**
```powershell
# Vérifiez que les deux services fonctionnent
netstat -ano | findstr ":4000"  # Backend
netstat -ano | findstr ":3001"  # Admin
```

#### 3️⃣ **Redémarrage Express** 
```powershell
# Utilisez le script de redémarrage automatique
cd "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny"
.\restart-clean.bat
```

#### 4️⃣ **Nettoyage Cache Navigateur**
```
1. Ouvrez les Outils de Développement (F12)
2. Clic droit sur l'icône d'actualisation 
3. Sélectionnez "Vider le cache et actualiser"
```

#### 5️⃣ **Redémarrage Manuel Complet**
```powershell
# 1. Arrêter tous les processus Node
taskkill /F /IM node.exe

# 2. Attendre 3 secondes
Start-Sleep 3

# 3. Démarrer Backend (terminal 1)
cd "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\backend"
node index.js

# 4. Démarrer Admin (nouveau terminal)
cd "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\admin-app"
npm start

# 5. Attendre 10 secondes puis ouvrir http://localhost:3001
```

### 🔍 **Tests de Diagnostic**

#### Test API Backend
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/product" -Method GET
```

#### Script de Vérification Automatique
```powershell
cd "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny"
node system-status.js
```

### 🎯 **Points Critiques**

- ✅ **Backend DOIT être sur port 4000**
- ✅ **Admin DOIT être sur port 3001** 
- ✅ **Démarrer Backend AVANT Admin**
- ✅ **Attendre 5-10 secondes entre les démarrages**

### 🚀 **Solution d'Urgence**
```
Si rien ne fonctionne, utilisez simplement :
.\restart-clean.bat

Ce script fait tout automatiquement !
```

### 📱 **Vérification Rapide**
```
✅ L'admin charge → Actualisez (F5)
❌ Page blanche → Redémarrez les services  
❌ Erreur de connexion → Vérifiez les ports
```

---
**💡 Astuce**: Gardez toujours 2 terminaux ouverts (Backend + Admin) pour un contrôle visuel des services.
