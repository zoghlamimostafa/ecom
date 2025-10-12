# ✅ CHECKLIST DE DÉPLOIEMENT - OXAHOST

## 📋 AVANT LE DÉPLOIEMENT

### ✅ Fichiers Préparés
- [ ] Package de déploiement : `oxahost_deployment/` créé
- [ ] Base de données exportée : `database_backups/database_complete_2025-10-01_12-20-21.sql` (95.5 KB)
- [ ] Build Client React terminé (234.75 kB gzipped)
- [ ] Build Admin React terminé (434.61 kB gzipped)
- [ ] Backend préparé avec .env.template

---

## 🎯 DÉPLOIEMENT SUR OXAHOST

### 📊 1. Configuration Base de Données
- [ ] Connexion à cPanel OxaHost
- [ ] Création base MySQL : `sanny_prod` (ou nom choisi)
- [ ] Création utilisateur MySQL avec droits complets
- [ ] Import du fichier SQL via phpMyAdmin
- [ ] Test connexion base de données
- [ ] **Noter** : DB_USER, DB_PASSWORD, DB_NAME, DB_HOST

### 📁 2. Upload des Fichiers
- [ ] Connexion File Manager cPanel
- [ ] Sauvegarde contenu actuel `public_html/` (si nécessaire)
- [ ] Upload contenu `oxahost_deployment/public_html/` vers `/public_html/`
- [ ] Création dossier `/home/username/backend/`
- [ ] Upload contenu `oxahost_deployment/backend/` vers `/home/username/backend/`
- [ ] Vérification structure des dossiers

### ⚙️ 3. Configuration Backend
- [ ] Renommer `/home/username/backend/.env.template` en `.env`
- [ ] Modifier `.env` avec identifiants MySQL réels
- [ ] Générer secrets sécurisés pour JWT_SECRET et SESSION_SECRET
- [ ] Adapter FRONTEND_URL et ADMIN_URL à votre domaine
- [ ] Permissions fichiers : `.env` → 600, dossiers → 755

### 🚀 4. Configuration Node.js (si disponible)
- [ ] cPanel → Setup Node.js App
- [ ] Configuration application :
  - Version : Node.js 18.x+
  - Dossier : `/home/username/backend`
  - Fichier : `index.js`
- [ ] Variables d'environnement ajoutées
- [ ] Installation dépendances : `npm install`
- [ ] Démarrage application

### 🌐 5. Configuration Domaine
- [ ] DNS pointé vers serveurs OxaHost
- [ ] SSL activé (AutoSSL/Let's Encrypt)
- [ ] Redirection HTTPS forcée
- [ ] Test résolution DNS

---

## 🧪 TESTS DE VALIDATION

### 🌐 Tests Frontend
- [ ] **Site Client** : `https://votredomaine.com`
  - [ ] Page d'accueil charge correctement
  - [ ] Navigation entre pages fonctionne
  - [ ] Images s'affichent
  - [ ] Responsive design OK
  
- [ ] **Panel Admin** : `https://votredomaine.com/admin`
  - [ ] Page de login accessible
  - [ ] Interface admin charge
  - [ ] Navigation admin fonctionne

### ⚙️ Tests Backend/API
- [ ] **API Health Check** : `https://votredomaine.com/api/`
  - [ ] Endpoint répond avec status 200
  - [ ] Message "Backend server is running"
  
- [ ] **Connexion Base de Données**
  - [ ] Logs backend sans erreurs de connexion
  - [ ] Tables visibles dans phpMyAdmin

### 🛒 Tests E-commerce
- [ ] **Fonctionnalités Client**
  - [ ] Affichage des produits
  - [ ] Recherche de produits
  - [ ] Filtres par catégorie
  - [ ] Ajout au panier
  - [ ] Ajout à la wishlist
  - [ ] Authentification utilisateur
  
- [ ] **Fonctionnalités Admin**
  - [ ] Login admin
  - [ ] Dashboard admin
  - [ ] Gestion des produits
  - [ ] Gestion des commandes
  - [ ] Upload d'images

---

## 🔧 DÉPANNAGE RAPIDE

### ❌ Site ne charge pas
**Vérifier** :
- [ ] DNS propagé (24-48h max)
- [ ] SSL activé et valide
- [ ] Fichiers dans `/public_html/`
- [ ] `.htaccess` présent et correct

### ❌ API ne répond pas
**Vérifier** :
- [ ] Node.js app démarrée dans cPanel
- [ ] Variables d'environnement correctes
- [ ] Logs d'erreur dans cPanel
- [ ] Port et configuration réseau

### ❌ Erreurs de base de données
**Vérifier** :
- [ ] Identifiants MySQL dans `.env`
- [ ] Permissions utilisateur MySQL
- [ ] Import SQL réussi
- [ ] Nom de base correct (avec prefix)

### ❌ Erreurs CORS
**Solutions** :
- [ ] URLs CORS dans `backend/index.js`
- [ ] Domaine ajouté dans origins
- [ ] HTTPS vs HTTP cohérent

---

## 📊 POST-DÉPLOIEMENT

### 🔍 Monitoring
- [ ] Vérifier logs d'erreur régulièrement
- [ ] Surveiller utilisation ressources
- [ ] Tester fonctionnalités critiques

### 🚀 Optimisations
- [ ] Cache navigateur activé
- [ ] Compression GZIP configurée
- [ ] Images optimisées
- [ ] Performance testée

### 🔒 Sécurité
- [ ] Mots de passe forts
- [ ] Fichiers sensibles protégés
- [ ] Sauvegardes régulières planifiées
- [ ] SSL/HTTPS fonctionnel

---

## 📞 RESSOURCES

### 📚 Documentation
- **Guide complet** : `GUIDE_DEPLOIEMENT_COMPLET_OXAHOST.md`
- **Package déploiement** : `oxahost_deployment/`
- **Base de données** : `database_backups/`

### 🆘 Support
- **OxaHost** : Support via espace client
- **Logs** : cPanel → Error Logs
- **Node.js** : cPanel → Node.js Apps

---

**✅ DÉPLOIEMENT TERMINÉ !**

*Cochez chaque étape au fur et à mesure. En cas de problème, consultez la section dépannage ou le guide complet.*