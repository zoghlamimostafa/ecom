# ⚡ DÉMARRAGE RAPIDE OXAHOST - SANNY STORE

## 🎯 **DÉPLOIEMENT EXPRESS SUR OXAHOST**

Guide ultra-rapide pour mettre votre **Sanny Store** en ligne sur **OxaHost** en moins de 30 minutes !

---

## 📦 **HÉBERGEMENT SHARED OXAHOST (2-8€/mois)**

### ⏱️ **Déploiement en 15 minutes**

#### **ÉTAPE 1 : Préparation (5 min)**
```powershell
# Build de production
cd C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client
npm install --legacy-peer-deps
npm run build
```

#### **ÉTAPE 2 : Upload cPanel (5 min)**
```bash
# 1. Connectez-vous à cPanel OxaHost
URL: https://cpanel.votre-domaine.com
Login/Password: fournis par OxaHost

# 2. File Manager → public_html/
# 3. Upload dossier build/
# 4. Extraire les fichiers
```

#### **ÉTAPE 3 : Configuration (5 min)**
```bash
# Copier .htaccess-oxahost vers public_html/.htaccess
# Configurer API externe (Railway gratuit)
```

#### **🚀 Résultat :**
- ✅ **Site web** : `https://votre-domaine.com`
- ⚠️ **API** : Déployer sur Railway/Render (gratuit)

---

## 🖥️ **VPS OXAHOST (5-30€/mois) - RECOMMANDÉ**

### ⏱️ **Déploiement en 30 minutes**

#### **ÉTAPE 1 : Connexion SSH (5 min)**
```bash
# Connexion à votre VPS OxaHost
ssh root@IP-OXAHOST
# Password fourni par OxaHost
```

#### **ÉTAPE 2 : Installation environnement (15 min)**
```bash
# Installation automatique
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt update && apt upgrade -y
apt install nodejs nginx postgresql postgresql-contrib git -y
npm install -g pm2
```

#### **ÉTAPE 3 : Déploiement automatique (10 min)**
```bash
# Clone et déploiement
cd /var/www
git clone https://github.com/votre-repo/sanny-store.git
cd sanny-store
chmod +x deploy-oxahost-vps.sh
./deploy-oxahost-vps.sh
```

#### **🚀 Résultat :**
- ✅ **Site complet** avec API et base de données
- ✅ **SSL** Let's Encrypt automatique

---

## 🔧 **INFORMATIONS OXAHOST REQUISES**

### **Pour tous les types :**
- 🌐 **Nom de domaine** configuré
- 🔑 **Accès espace client OxaHost**

### **Hébergement Shared :**
- 📱 **URL cPanel** : `https://cpanel.votre-domaine.com`
- 🔐 **Login cPanel** : fourni par OxaHost
- 🔒 **Mot de passe cPanel** : fourni par OxaHost

### **VPS :**
- 🌐 **Adresse IP** : fournie par OxaHost
- 🔐 **Login SSH** : root
- 🔒 **Mot de passe SSH** : fourni par OxaHost

---

## ⚡ **COMMANDES EXPRESS**

### **Build local :**
```powershell
cd Client && npm run build
```

### **Upload Shared (via cPanel) :**
```bash
# File Manager → public_html → Upload build/*
```

### **Déploiement VPS :**
```bash
./deploy-oxahost-vps.sh
```

### **Monitoring :**
```bash
node monitoring-oxahost.js
```

---

## 💰 **PRIX OXAHOST RECOMMANDÉS**

| Plan | Prix | Performance | Node.js | SSL | Recommandation |
|------|------|-------------|---------|-----|----------------|
| **Shared Basic** | 2€/mois | ⭐⭐ | ❌ | ✅ | Découverte |
| **Shared Pro** | 5€/mois | ⭐⭐⭐ | ❌ | ✅ | Site vitrine |
| **VPS Start** | 5€/mois | ⭐⭐⭐⭐ | ✅ | ✅ | ✅ **IDÉAL** |
| **VPS Pro** | 15€/mois | ⭐⭐⭐⭐⭐ | ✅ | ✅ | E-commerce pro |

### **🎯 Recommandation : VPS Start (5€/mois)**
- ✅ **Excellent rapport qualité/prix**
- ✅ **Support complet Node.js**
- ✅ **Performance pour e-commerce**

---

## 🚨 **RÉSOLUTION RAPIDE**

### **cPanel inaccessible :**
```bash
# Vérifiez URL : https://server.oxahost.com:2083/
# Ou contactez support OxaHost
```

### **VPS SSH refuse connexion :**
```bash
# Vérifiez IP et port 22
# Redémarrez VPS depuis espace client
```

### **Site ne s'affiche pas :**
```bash
# Attendez 24-48h pour propagation DNS
# Vérifiez .htaccess (Shared)
# Vérifiez Nginx status (VPS)
```

---

## 📞 **SUPPORT OXAHOST**

### **Accès support :**
- 🌐 **Espace client** : https://client.oxahost.com
- 💬 **Tickets** : Via espace client
- 📧 **Email** : support@oxahost.com
- ⏰ **Horaires** : Selon votre plan

---

## ✅ **CHECKLIST DÉPLOIEMENT**

### **Avant de commencer :**
- [ ] Compte OxaHost actif
- [ ] Domaine configuré
- [ ] Accès cPanel ou SSH
- [ ] Build React prêt

### **Après déploiement :**
- [ ] Site accessible
- [ ] SSL activé
- [ ] Admin fonctionnel
- [ ] API connectée
- [ ] Monitoring configuré

---

## 🎉 **ÉTAPES POST-DÉPLOIEMENT**

1. ✅ **Tester** toutes les fonctionnalités
2. 🔧 **Configurer** l'administration
3. 📊 **Ajouter** vos premiers produits
4. 🎨 **Personnaliser** le design
5. 📈 **Analyser** les performances
6. 🔒 **Sauvegarder** régulièrement

---

## 🚀 **ÉVOLUTION POSSIBLE**

### **Démarrage** (Shared 5€/mois)
- Frontend OxaHost + API externe
- 500-1000 visiteurs/jour

### **Croissance** (VPS Start 5€/mois)
- Site complet sur OxaHost
- 1000-5000 visiteurs/jour

### **Expansion** (VPS Pro 15€/mois)
- Performance optimisée
- 5000+ visiteurs/jour

---

**🏆 Votre Sanny Store sera en ligne sur OxaHost dans 15-30 minutes !**

> **Quel type d'hébergement OxaHost avez-vous ?**  
> Dites-moi et je vous donne les instructions précises !

---

*Guide créé le 29 septembre 2025 - Solution optimisée OxaHost*