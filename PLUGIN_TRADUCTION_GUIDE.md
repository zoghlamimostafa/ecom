# 🌐 Plugin de Traduction Multilingue - Sanny Store

## 📋 Vue d'ensemble

Plugin complet de traduction multilingue pour Sanny Store supportant **Français**, **English** et **العربية (Arabe)** avec gestion RTL automatique.

## ✨ Fonctionnalités

### 🌍 Support multilingue
- **Français** (langue par défaut)
- **English** 
- **العربية** avec support RTL complet

### 🔄 Détection automatique
- Paramètre URL (`?lang=en`)
- Cookie de session
- Stockage local navigateur
- Header `Accept-Language`

### 🛠️ API complète
- REST API pour changement de langue
- Chargement dynamique des traductions
- Middleware Express intégré
- Support des templates (EJS, Handlebars)

### 📱 Interface utilisateur
- Changement de langue en temps réel
- Support RTL/LTR automatique
- Interface responsive
- Notifications multilingues

## 🚀 Installation et Utilisation

### 1. Initialisation du système

```bash
# Initialiser les traductions par défaut
cd /path/to/sanny-store
node init-multilingual.js
```

### 2. Intégration dans Express.js

```javascript
const MultilingualSystem = require('./backend/middlewares/multilingual');
const multilingual = new MultilingualSystem();

// Middleware de traduction
app.use(multilingual.middleware());

// API de traduction
multilingual.setupAPI(app);

// Dans les routes
app.get('/', (req, res) => {
    const welcomeMessage = req.t('welcome.title');
    const currentLang = req.language;
    // ...
});
```

### 3. Utilisation dans les templates

#### EJS
```html
<h1><%= t('nav.home') %></h1>
<p><%= t('welcome.description') %></p>
<button><%= t('product.add_to_cart') %></button>
```

#### HTML avec JavaScript
```html
<h1 data-translate="nav.home">Accueil</h1>
<button data-translate="product.buy_now">Acheter</button>

<script src="/static/js/multilingual.js"></script>
<script>
const ml = new SannyMultilingual();
ml.changeLanguage('en');
</script>
```

### 4. API REST

#### Changer de langue
```javascript
POST /api/language
Content-Type: application/json

{
  "language": "en"
}
```

#### Obtenir les traductions
```javascript
GET /api/translations/fr
GET /api/translations/en  
GET /api/translations/ar
```

## 📁 Structure des fichiers

```
ecomerce_sanny/
├── backend/
│   ├── middlewares/
│   │   └── multilingual.js          # Système principal
│   └── translations/                # Fichiers de traduction
│       ├── fr.json                  # Français
│       ├── en.json                  # English  
│       └── ar.json                  # العربية
├── frontend/
│   └── js/
│       └── multilingual.js          # Helper frontend
├── server-multilingual.js           # Serveur de démo
├── multilingual-demo.html           # Démo interactive
└── init-multilingual.js             # Script d'initialisation
```

## 🔧 Configuration avancée

### Personnaliser les langues supportées
```javascript
const multilingual = new MultilingualSystem({
    supportedLanguages: ['fr', 'en', 'ar', 'es'],
    defaultLanguage: 'fr'
});
```

### Ajouter des traductions dynamiquement
```javascript
multilingual.addTranslation('custom.message', {
    fr: 'Message personnalisé',
    en: 'Custom message', 
    ar: 'رسالة مخصصة'
});
```

### Frontend avec options
```javascript
const ml = new SannyMultilingual({
    apiBase: '/api',
    supportedLanguages: ['fr', 'en', 'ar'],
    defaultLanguage: 'fr'
});

// Callbacks
ml.onLanguageChange((newLang, oldLang) => {
    console.log(`Langue changée: ${oldLang} → ${newLang}`);
});
```

## 🎯 Fonctionnalités avancées

### Support RTL pour l'arabe
```css
[dir="rtl"] {
    text-align: right;
}

[dir="rtl"] .navbar {
    flex-direction: row-reverse;
}
```

### Traductions avec paramètres
```javascript
// Fichier de traduction
{
    "welcome.user": "Bienvenue {{name}}, vous avez {{count}} messages"
}

// Utilisation
req.t('welcome.user', { name: 'Ahmed', count: 5 });
// → "Bienvenue Ahmed, vous avez 5 messages"
```

### Traductions imbriquées
```json
{
    "product": {
        "details": {
            "name": "Nom du produit",
            "price": "Prix",
            "description": "Description"
        }
    }
}
```

```javascript
req.t('product.details.name'); // → "Nom du produit"
```

## 🌐 URLs et Navigation

### Paramètres URL automatiques
- `http://localhost:3000/?lang=fr` → Français
- `http://localhost:3000/?lang=en` → English
- `http://localhost:3000/?lang=ar` → العربية

### Sauvegarde persistante
- Cookie navigateur (1 an)
- Session serveur
- Local storage (frontend)

## 📊 Statistiques et monitoring

```javascript
// Obtenir les statistiques de traduction
const stats = multilingual.getTranslationStats();
console.log(stats);
// {
//   fr: { totalKeys: 34, completeness: 100 },
//   en: { totalKeys: 34, completeness: 100 },
//   ar: { totalKeys: 34, completeness: 100 }
// }
```

## 🔍 Test et débogage

### Serveur de test
```bash
node server-multilingual.js
# → http://localhost:3000
```

### Démo interactive
```
http://localhost:3000/demo/multilingual-demo.html
```

### Tests API
```bash
# Test changement de langue
curl -X POST http://localhost:3000/api/language \
  -H "Content-Type: application/json" \
  -d '{"language": "en"}'

# Test récupération traductions
curl http://localhost:3000/api/translations/fr
```

## 🚀 Déploiement

### Variables d'environnement
```bash
# .env
DEFAULT_LANGUAGE=fr
SUPPORTED_LANGUAGES=fr,en,ar
SESSION_SECRET=your-secret-key
```

### Production avec HTTPS
```javascript
app.use(session({
    secret: process.env.SESSION_SECRET,
    secure: true,  // HTTPS seulement
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
}));
```

## 📚 Traductions par défaut incluses

Le plugin inclut 34+ traductions de base:

- **Navigation**: Accueil, Produits, Panier, Compte
- **E-commerce**: Ajouter au panier, Prix, Description
- **Formulaires**: Email, Mot de passe, Nom, Téléphone
- **Messages**: Succès, Erreur, Chargement
- **Administration**: Dashboard, Gestion produits/utilisateurs

## 🛠️ Intégration avec le système existant

### Avec votre backend existant
```javascript
// Dans vos routes existantes
app.get('/products', (req, res) => {
    const products = getProducts();
    
    res.render('products', {
        title: req.t('nav.products'),
        products: products.map(p => ({
            ...p,
            localizedName: req.t(`product.${p.id}.name`)
        }))
    });
});
```

### Avec votre base de données
```javascript
// Stocker les clés de traduction en DB
const product = {
    id: 1,
    name_key: 'product.tshirt.name',
    description_key: 'product.tshirt.description'
};

// Rendu avec traduction
const localizedProduct = {
    ...product,
    name: req.t(product.name_key),
    description: req.t(product.description_key)
};
```

## ✅ Statut d'implémentation

- ✅ Système multilingue complet
- ✅ Support FR/EN/AR avec RTL
- ✅ API REST fonctionnelle  
- ✅ Middleware Express intégré
- ✅ Frontend JavaScript helper
- ✅ Démo interactive complète
- ✅ 34+ traductions par défaut
- ✅ Détection automatique de langue
- ✅ Sauvegarde session/cookie/localStorage
- ✅ Support traductions imbriquées et paramètres

## 🎉 Prêt à utiliser !

Votre site Sanny Store est maintenant multilingue avec support professionnel pour le français, l'anglais et l'arabe. Le système detecte automatiquement la langue préférée de l'utilisateur et offre une expérience fluide de changement de langue en temps réel.

**Démarrage rapide**: `node server-multilingual.js` puis visitez `http://localhost:3000`