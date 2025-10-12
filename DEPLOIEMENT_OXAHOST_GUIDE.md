# Guide de déploiement OxaHost - Sanny Store

## 📋 Vue d'ensemble

Votre e-commerce Sanny utilise une **architecture séparée** :
- **Frontend** (React) → OxaHost (hébergement partagé)
- **Backend** (Node.js) → Railway (API externe)
- **Database** → MongoDB Atlas (cloud)

## 🚀 Étapes de déploiement

### 1. Préparation des builds

```bash
# Exécuter le script de build
.\build-for-oxahost.bat
```

### 2. Configuration du Backend (Railway)

Votre API est déjà configurée sur : `https://sanny-api.up.railway.app`

Variables d'environnement nécessaires sur Railway :
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sanny_store
JWT_SECRET=votre_jwt_secret_super_secure
CLOUDINARY_CLOUD_NAME=votre_cloudinary_name
CLOUDINARY_API_KEY=votre_cloudinary_key
CLOUDINARY_API_SECRET=votre_cloudinary_secret
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_app_password
STRIPE_SECRET_KEY=sk_live_votre_stripe_key
PORT=4000
```

### 3. MongoDB Atlas (Base de données)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit
3. Configurez l'accès réseau (0.0.0.0/0 pour l'accès depuis tous les IPs)
4. Créez un utilisateur de base de données
5. Récupérez votre connection string

### 4. Déploiement sur OxaHost

#### A. Connexion cPanel
1. Connectez-vous à votre cPanel OxaHost
2. Accédez au gestionnaire de fichiers

#### B. Upload des fichiers
1. **Frontend Client** :
   - Uploadez tout le contenu de `oxahost-deploy/public_html/` vers `/public_html/`
   
2. **Admin Panel** :
   - Créez un dossier `/public_html/admin/`
   - Uploadez tout le contenu de `oxahost-deploy/admin/` vers `/public_html/admin/`

#### C. Configuration des sous-domaines (optionnel)
- Créez un sous-domaine `admin.votre-domaine.com` pointant vers `/public_html/admin/`

### 5. Configuration DNS et SSL

1. **Domaine** : Pointez votre domaine vers les serveurs OxaHost
2. **SSL** : Activez le certificat SSL gratuit dans cPanel
3. **HTTPS redirect** : Configurez la redirection automatique

### 6. Tests post-déploiement

URLs à tester :
- `https://votre-domaine.com` (Frontend)
- `https://votre-domaine.com/admin` (Admin Panel)
- `https://sanny-api.up.railway.app/api/test` (API)

## 📁 Structure finale sur OxaHost

```
public_html/
├── index.html              # Page d'accueil Client
├── static/                 # Assets CSS/JS du Client
├── admin/
│   ├── index.html         # Admin Panel
│   ├── static/            # Assets CSS/JS Admin
│   └── .htaccess          # Règles pour React Router
├── .htaccess              # Règles pour React Router
└── autres-fichiers/       # Autres assets
```

## 🔧 Configurations spéciales

### .htaccess pour React Router
Les fichiers `.htaccess` sont automatiquement créés par le script pour :
- Gérer le routing côté client
- Rediriger toutes les routes vers `index.html`

### Variables d'environnement React
Configurées dans le build :
```
REACT_APP_API_URL=https://sanny-api.up.railway.app
GENERATE_SOURCEMAP=false
```

## 🐛 Résolution de problèmes

### Erreur CORS
Si vous avez des erreurs CORS, vérifiez dans votre backend Railway :
```javascript
// Ajoutez votre domaine OxaHost
const corsOptions = {
  origin: [
    'https://votre-domaine.com',
    'https://www.votre-domaine.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
};
```

### Routes React non trouvées
Assurez-vous que les fichiers `.htaccess` sont bien uploadés.

### Images/Assets non chargés
Vérifiez que tous les fichiers du dossier `static/` sont bien uploadés.

## 📞 Support

En cas de problème :
1. Vérifiez les logs d'erreur dans cPanel
2. Testez l'API directement : `https://sanny-api.up.railway.app/api/health`
3. Vérifiez la console du navigateur pour les erreurs JavaScript

## 🎯 Optimisations post-déploiement

1. **Performance** : Activez la compression gzip dans cPanel
2. **Cache** : Configurez les règles de cache pour les assets statiques
3. **CDN** : Considérez Cloudflare pour améliorer les performances
4. **Monitoring** : Surveillez l'utilisation des ressources

## 💰 Coûts estimés

- **OxaHost** : Plan partagé (~20-50€/an)
- **Railway** : Plan gratuit ou ~5$/mois
- **MongoDB Atlas** : Plan gratuit (512MB) ou ~9$/mois
- **Domaine** : ~10-15€/an

## 🔒 Sécurité

1. Changez tous les mots de passe par défaut
2. Utilisez des clés JWT sécurisées
3. Configurez HTTPS obligatoire
4. Mettez à jour régulièrement les dépendances