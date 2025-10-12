// Intégration du système multilingue dans le serveur principal
const express = require('express');
const MultilingualSystem = require('./backend/middlewares/multilingual');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuration des sessions
app.use(session({
    secret: 'sanny-multilingual-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // true en production avec HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Servir les fichiers statiques
app.use('/static', express.static(path.join(__dirname, 'frontend')));
app.use('/demo', express.static(__dirname));

// Initialiser le système multilingue
const multilingual = new MultilingualSystem();

// Initialiser les traductions par défaut
multilingual.initializeDefaultTranslations();

// Appliquer le middleware multilingue
app.use(multilingual.middleware());

// Configurer l'API de traduction
multilingual.setupAPI(app);

// Routes principales
app.get('/', (req, res) => {
    const language = req.language;
    const isRTL = language === 'ar';
    
    res.send(`
<!DOCTYPE html>
<html lang="${language}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${req.t('nav.home')} - Sanny Store</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            color: #667eea;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .nav a {
            color: #667eea;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.3s;
        }
        .nav a:hover {
            background: #667eea;
            color: white;
        }
        .lang-selector {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        .lang-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            background: #f7fafc;
            color: #333;
            transition: all 0.3s;
        }
        .lang-btn.active {
            background: #667eea;
            color: white;
        }
        .content {
            text-align: center;
            padding: 20px 0;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: #f7fafc;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .demo-links {
            margin: 30px 0;
            text-align: center;
        }
        .demo-link {
            display: inline-block;
            background: #48bb78;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 5px;
            transition: all 0.3s;
        }
        .demo-link:hover {
            background: #38a169;
            transform: translateY(-2px);
        }
        ${isRTL ? 'body { direction: rtl; text-align: right; }' : ''}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛍️ Sanny Store</div>
            <p>${req.t('welcome.description') || 'Boutique multilingue'}</p>
        </div>
        
        <div class="nav">
            <a href="/">${req.t('nav.home')}</a>
            <a href="/products">${req.t('nav.products')}</a>
            <a href="/cart">${req.t('nav.cart')}</a>
            <a href="/account">${req.t('nav.account')}</a>
        </div>
        
        <div class="lang-selector">
            <button class="lang-btn ${language === 'fr' ? 'active' : ''}" onclick="changeLanguage('fr')">
                🇫🇷 Français
            </button>
            <button class="lang-btn ${language === 'en' ? 'active' : ''}" onclick="changeLanguage('en')">
                🇺🇸 English
            </button>
            <button class="lang-btn ${language === 'ar' ? 'active' : ''}" onclick="changeLanguage('ar')">
                🇸🇦 العربية
            </button>
        </div>
        
        <div class="content">
            <h1>${req.t('welcome.title') || 'Bienvenue'}</h1>
            <p>Langue actuelle: <strong>${language.toUpperCase()}</strong></p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🌐 ${req.t('features.multilingual') || 'Multilingue'}</h3>
                <p>Support français, anglais et arabe</p>
            </div>
            <div class="feature">
                <h3>🔄 ${req.t('features.automatic') || 'Automatique'}</h3>
                <p>Détection automatique de langue</p>
            </div>
            <div class="feature">
                <h3>📱 ${req.t('features.responsive') || 'Responsive'}</h3>
                <p>Support RTL pour l'arabe</p>
            </div>
        </div>
        
        <div class="demo-links">
            <a href="/demo/multilingual-demo.html" class="demo-link">
                🎯 Démo Interactive
            </a>
            <a href="/api/translations/fr" class="demo-link">
                📝 API Français
            </a>
            <a href="/api/translations/en" class="demo-link">
                📝 API English
            </a>
            <a href="/api/translations/ar" class="demo-link">
                📝 API العربية
            </a>
        </div>
    </div>
    
    <script>
        function changeLanguage(lang) {
            fetch('/api/language', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ language: lang })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Recharger avec la nouvelle langue
                    window.location.href = '/?lang=' + lang;
                }
            })
            .catch(error => console.error('Erreur:', error));
        }
    </script>
</body>
</html>
    `);
});

// Route pour les produits
app.get('/products', (req, res) => {
    const products = [
        {
            id: 1,
            nameKey: 'product.tshirt.name',
            descriptionKey: 'product.tshirt.description',
            price: 25.99
        },
        {
            id: 2,
            nameKey: 'product.jeans.name',
            descriptionKey: 'product.jeans.description',
            price: 45.99
        }
    ];
    
    res.json({
        message: req.t('products.welcome'),
        language: req.language,
        products: products.map(p => ({
            ...p,
            name: req.t(p.nameKey),
            description: req.t(p.descriptionKey)
        }))
    });
});

// Route pour le panier
app.get('/cart', (req, res) => {
    res.json({
        title: req.t('cart.title'),
        message: req.t('cart.empty'),
        language: req.language
    });
});

// Route pour le compte utilisateur
app.get('/account', (req, res) => {
    res.json({
        title: req.t('nav.account'),
        language: req.language,
        form: {
            email: req.t('form.email'),
            password: req.t('form.password'),
            firstName: req.t('form.first_name'),
            lastName: req.t('form.last_name')
        }
    });
});

// Route pour tester les traductions
app.get('/test-translations', (req, res) => {
    const testKeys = [
        'nav.home',
        'nav.products',
        'product.add_to_cart',
        'message.success',
        'form.submit'
    ];
    
    const results = {};
    
    ['fr', 'en', 'ar'].forEach(lang => {
        results[lang] = {};
        testKeys.forEach(key => {
            results[lang][key] = multilingual.translate(key, lang);
        });
    });
    
    res.json({
        currentLanguage: req.language,
        supportedLanguages: multilingual.supportedLanguages,
        translations: results,
        stats: multilingual.getTranslationStats()
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        error: req.t('error.not_found') || 'Page non trouvée',
        language: req.language
    });
});

// Gestion des erreurs serveur
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({
        error: req.t('error.server') || 'Erreur serveur',
        language: req.language
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('🌐 ===============================');
    console.log('🛍️  SANNY STORE - SERVEUR MULTILINGUE');
    console.log('🌐 ===============================');
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log('');
    console.log('📍 Routes disponibles:');
    console.log(`   • http://localhost:${PORT}/ - Page d'accueil`);
    console.log(`   • http://localhost:${PORT}/products - Produits`);
    console.log(`   • http://localhost:${PORT}/demo/multilingual-demo.html - Démo`);
    console.log('');
    console.log('🌐 API de traduction:');
    console.log(`   • POST /api/language - Changer langue`);
    console.log(`   • GET /api/translations/:lang - Obtenir traductions`);
    console.log('');
    console.log('🔗 Paramètres URL:');
    console.log('   • ?lang=fr (français)');
    console.log('   • ?lang=en (anglais)'); 
    console.log('   • ?lang=ar (arabe)');
    console.log('');
    console.log('✨ Langues supportées: Français, English, العربية');
    console.log('🌐 ===============================');
});

module.exports = app;