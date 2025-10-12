# ⚡ DÉMARRAGE RAPIDE OVH - SANNY STORE

## 🎯 **DÉPLOIEMENT EN 3 ÉTAPES SELON VOTRE HÉBERGEMENT OVH**

---

## 📦 **HÉBERGEMENT MUTUALISÉ OVH (Perso/Pro/Performance)**

### ⏱️ **Temps estimé : 15 minutes**

#### **ÉTAPE 1 : Préparation (5 min)**
```powershell
# Dans le terminal PowerShell
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client
npm install --legacy-peer-deps
npm run build
```

#### **ÉTAPE 2 : Configuration FTP (5 min)**
```javascript
// Éditez ftp-upload-ovh.js ligne 13-17
host: 'ftp.votre-domaine.com',        // Votre serveur FTP OVH
user: 'votre-login-ovh',              // Login depuis espace client OVH
password: 'votre-mot-de-passe-ftp',   // Mot de passe FTP OVH
```

#### **ÉTAPE 3 : Déploiement automatique (5 min)**
```powershell
# Upload automatique vers OVH
node ftp-upload-ovh.js
```

#### **🚀 Résultat :**
- ✅ **Site web** en ligne sur `https://votre-domaine.com`
- ⚠️ **API** à héberger séparément (Railway gratuit)

---

## 🖥️ **VPS OVH (recommandé)**

### ⏱️ **Temps estimé : 30 minutes**

#### **ÉTAPE 1 : Connexion VPS (5 min)**
```powershell
# Connexion SSH à votre VPS OVH
ssh root@IP-DE-VOTRE-VPS
# Mot de passe fourni par OVH par email/SMS
```

#### **ÉTAPE 2 : Installation automatique (15 min)**
```bash
# Sur le VPS, exécutez ces commandes :
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Installation de l'environnement
apt update && apt upgrade -y
apt install nginx postgresql postgresql-contrib git -y
npm install -g pm2
```

#### **ÉTAPE 3 : Déploiement (10 min)**
```bash
# Clone et configuration
cd /var/www
git clone https://github.com/votre-repo/sanny-store.git
cd sanny-store

# Déploiement automatique
chmod +x deploy-vps-ovh.sh
./deploy-vps-ovh.sh
```

#### **🚀 Résultat :**
- ✅ **Site complet** en ligne avec API
- ✅ **Base de données** PostgreSQL
- ✅ **SSL automatique** Let's Encrypt

---

## 🏢 **SERVEUR DÉDIÉ OVH**

### ⏱️ **Temps estimé : 45 minutes**

#### **Même processus que VPS + optimisations avancées**
```bash
# Configuration haute performance
# + Docker optionnel
# + Load balancing
# + Monitoring avancé
```

---

## 🔧 **INFORMATIONS OVH NÉCESSAIRES**

### **Pour TOUS les types d'hébergement :**
1. **Nom de domaine** : `votre-domaine.com`
2. **Accès espace client OVH** : login + mot de passe

### **Pour Hébergement Mutualisé :**
3. **Serveur FTP** : `ftp.votre-domaine.com`
4. **Login FTP** : (dans espace client OVH > Hébergements)
5. **Mot de passe FTP** : (dans espace client OVH)

### **Pour VPS/Serveur Dédié :**
3. **Adresse IP** : (fournie par OVH)
4. **Mot de passe root** : (reçu par email/SMS)

---

## ⚡ **COMMANDES RAPIDES**

### **Build et test en local :**
```powershell
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client
npm run build
# Teste le build dans build/
```

### **Upload hébergement mutualisé :**
```powershell
node ftp-upload-ovh.js
# Upload automatique via FTP
```

### **Déploiement VPS :**
```bash
./deploy-vps-ovh.sh
# Déploiement complet automatique
```

---

## 🎯 **COÛTS ET RECOMMANDATIONS**

| Type | Prix OVH | Performance | Recommandation |
|------|----------|-------------|----------------|
| **Mutualisé Pro** | 8€/mois | Correcte | Pour commencer |
| **VPS SSD 1** | 6€/mois | Très bonne | ✅ **Idéal** |
| **VPS SSD 2** | 12€/mois | Excellente | Pour croissance |

### **💡 Notre recommandation : VPS SSD 1 (6€/mois)**
- ✅ **Performance** optimale
- ✅ **Node.js** natif
- ✅ **Base de données** incluse
- ✅ **SSL gratuit**
- ✅ **Évolutif**

---

## 🚨 **RÉSOLUTION RAPIDE DES PROBLÈMES**

### **Problème : FTP ne fonctionne pas**
```powershell
# Vérifiez dans espace client OVH > Hébergements > FTP
# Mode passif : True
# Port : 21
```

### **Problème : VPS inaccessible**
```bash
# Mode rescue depuis espace client OVH
# Ou redémarrage du VPS
```

### **Problème : Site ne s'affiche pas**
```bash
# Vérifiez les DNS (48h de propagation max)
# Vérifiez .htaccess (mutualisé)
# Vérifiez Nginx (VPS)
```

---

## 📞 **SUPPORT IMMÉDIAT**

### **Documentation complète :**
- 📖 `GUIDE_DEPLOIEMENT_OVH.md` - Guide détaillé
- ⚙️ Tous les fichiers de configuration créés automatiquement

### **Support OVH :**
- 🌐 **Espace client** : https://www.ovh.com/manager/
- 📞 **Téléphone** : Disponible dans l'espace client
- 💬 **Chat** : Support 24/7

---

## 🎉 **ÉTAPES SUIVANTES APRÈS DÉPLOIEMENT**

1. ✅ **Tester** votre site sur `https://votre-domaine.com`
2. 🔧 **Configurer** l'admin sur `/admin`
3. 📊 **Ajouter** vos produits
4. 🎨 **Personnaliser** le design
5. 📈 **Configurer** Google Analytics
6. 🔒 **Sauvegarder** régulièrement

---

**🏆 Votre Sanny Store va être en ligne sur l'infrastructure OVH !**

> **Quelle est votre configuration OVH exacte ?**  
> Je peux vous donner des instructions encore plus précises !