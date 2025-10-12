# Configuration Railway API - Checklist OxaHost

## 🚆 Configuration Railway Backend

### 1. Variables d'environnement à configurer

```bash
# Production
NODE_ENV=production

# Base de données MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sanny_store?retryWrites=true&w=majority

# Sécurité JWT
JWT_SECRET=votre_jwt_secret_super_secure_minimum_32_caracteres

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email (Notifications)
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_app_password_gmail

# Stripe (Paiements)
STRIPE_SECRET_KEY=sk_live_ou_sk_test_votre_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_ou_pk_test_votre_stripe_key

# Port (Railway)
PORT=4000

# CORS Origins pour OxaHost
ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
```

### 2. Domaines autorisés (CORS)

Ajoutez dans votre backend Railway (`backend/index.js` ou `app.js`) :

```javascript
const corsOptions = {
  origin: [
    'https://votre-domaine.com',
    'https://www.votre-domaine.com',
    'https://admin.votre-domaine.com', // Si sous-domaine admin
    'http://localhost:3000', // Dev
    'http://localhost:3001'  // Dev admin
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
};

app.use(cors(corsOptions));
```

### 3. Routes de test à vérifier

Créez une route de santé si elle n'existe pas :

```javascript
// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'MongoDB Atlas',
    version: '1.0.0'
  });
});

// Route de test CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS fonctionne!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});
```

### 4. Configuration MongoDB Atlas

1. **Créer un cluster** : [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Sécurité réseau** : Autoriser toutes les IPs (0.0.0.0/0)
3. **Utilisateur DB** : Créer un utilisateur avec permissions lecture/écriture
4. **Connection String** : Format :
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sanny_store
   ```

### 5. Test de l'API Railway

URLs à tester avant déploiement :

```bash
# Test de santé
curl https://sanny-api.up.railway.app/api/health

# Test CORS
curl -H "Origin: https://votre-domaine.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://sanny-api.up.railway.app/api/test-cors

# Test authentification
curl -X POST https://sanny-api.up.railway.app/api/user/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
```

### 6. Déploiement sur Railway

1. **Connecter le repo GitHub** à Railway
2. **Ajouter les variables d'environnement** dans Railway Dashboard
3. **Déployer** automatiquement depuis `main` branch
4. **Vérifier les logs** de déploiement

### 7. Configuration Cloudinary

1. **Compte Cloudinary** : [cloudinary.com](https://cloudinary.com/)
2. **Paramètres** :
   - Upload folder: `sanny-store`
   - Transformation: Optimisation automatique
   - Formats: webp, jpg, png
3. **Limites** : Plan gratuit (25 crédits/mois)

### 8. Configuration Stripe

1. **Compte Stripe** : [stripe.com](https://stripe.com/)
2. **Mode Test** vs **Live** :
   - Test: `sk_test_...` et `pk_test_...`
   - Live: `sk_live_...` et `pk_live_...`
3. **Webhooks** : Configurer pour `https://sanny-api.up.railway.app/api/stripe/webhook`

### 9. Email avec Gmail

1. **App Password** : Générer dans les paramètres Google
2. **Configuration SMTP** :
   ```javascript
   const transporter = nodemailer.createTransporter({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS // App Password, pas le mot de passe
     }
   });
   ```

### 10. Monitoring et logs

1. **Railway Logs** : Surveiller les erreurs de déploiement
2. **MongoDB Atlas Monitoring** : Vérifier les connexions
3. **Cloudinary Usage** : Surveiller l'utilisation
4. **Stripe Dashboard** : Vérifier les transactions

## ✅ Checklist finale

- [ ] Variables d'environnement configurées sur Railway
- [ ] MongoDB Atlas connecté et accessible
- [ ] CORS configuré pour votre domaine OxaHost
- [ ] Routes de test fonctionnelles
- [ ] Cloudinary configuré pour les images
- [ ] Stripe configuré pour les paiements
- [ ] Email configuré avec Gmail
- [ ] API déployée et accessible via HTTPS
- [ ] Logs Railway sans erreurs
- [ ] Base de données initialisée avec admin par défaut

## 🔗 URLs importantes

- **API Railway** : https://sanny-api.up.railway.app
- **Test santé** : https://sanny-api.up.railway.app/api/health
- **MongoDB Atlas** : https://cloud.mongodb.com/
- **Cloudinary** : https://cloudinary.com/console
- **Stripe** : https://dashboard.stripe.com/

## 📞 Support

En cas d'erreur :
1. Vérifiez les logs Railway
2. Testez la connectivité MongoDB Atlas
3. Vérifiez les variables d'environnement
4. Consultez la documentation API Sanny