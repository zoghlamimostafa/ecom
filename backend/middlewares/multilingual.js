// Système de traduction multilingue pour Sanny E-commerce
const fs = require('fs');
const path = require('path');

class MultilingualSystem {
    constructor() {
        this.supportedLanguages = ['fr', 'en', 'ar'];
        this.defaultLanguage = 'fr';
        this.currentLanguage = 'fr';
        this.translations = {};
        this.translationsPath = path.join(__dirname, '..', 'translations');
        
        // Créer le répertoire de traductions s'il n'existe pas
        this.ensureTranslationsDirectory();
        
        // Charger toutes les traductions
        this.loadAllTranslations();
    }

    ensureTranslationsDirectory() {
        if (!fs.existsSync(this.translationsPath)) {
            fs.mkdirSync(this.translationsPath, { recursive: true });
            console.log('📁 Répertoire translations créé');
        }
    }

    // Charger les traductions pour toutes les langues
    loadAllTranslations() {
        this.supportedLanguages.forEach(lang => {
            this.loadTranslations(lang);
        });
        console.log(`🌐 Traductions chargées pour: ${this.supportedLanguages.join(', ')}`);
    }

    // Charger les traductions pour une langue spécifique
    loadTranslations(language) {
        const filePath = path.join(this.translationsPath, `${language}.json`);
        
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                this.translations[language] = JSON.parse(data);
            } else {
                // Créer un fichier de traduction vide si inexistant
                this.translations[language] = {};
                this.saveTranslations(language);
            }
        } catch (error) {
            console.error(`❌ Erreur chargement traductions ${language}:`, error.message);
            this.translations[language] = {};
        }
    }

    // Sauvegarder les traductions
    saveTranslations(language) {
        const filePath = path.join(this.translationsPath, `${language}.json`);
        
        try {
            fs.writeFileSync(filePath, JSON.stringify(this.translations[language], null, 2), 'utf8');
            console.log(`💾 Traductions sauvées pour ${language}`);
        } catch (error) {
            console.error(`❌ Erreur sauvegarde traductions ${language}:`, error.message);
        }
    }

    // Définir la langue courante
    setLanguage(language) {
        if (this.supportedLanguages.includes(language)) {
            this.currentLanguage = language;
            return true;
        }
        return false;
    }

    // Obtenir la langue courante
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Traduire une clé
    translate(key, language = null, params = {}) {
        const lang = language || this.currentLanguage;
        
        if (!this.translations[lang]) {
            console.warn(`⚠️ Langue non supportée: ${lang}`);
            return key;
        }

        // Chercher la traduction
        let translation = this.getNestedTranslation(this.translations[lang], key);
        
        // Fallback vers la langue par défaut
        if (!translation && lang !== this.defaultLanguage) {
            translation = this.getNestedTranslation(this.translations[this.defaultLanguage], key);
        }
        
        // Fallback vers la clé elle-même
        if (!translation) {
            console.warn(`⚠️ Traduction manquante pour: ${key} (${lang})`);
            return key;
        }

        // Remplacer les paramètres
        return this.replaceParameters(translation, params);
    }

    // Obtenir une traduction imbriquée (ex: "user.profile.name")
    getNestedTranslation(translations, key) {
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && value[k] !== undefined) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }

    // Remplacer les paramètres dans la traduction
    replaceParameters(text, params) {
        if (!params || Object.keys(params).length === 0) {
            return text;
        }

        return text.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    // Ajouter ou mettre à jour une traduction
    addTranslation(key, translations) {
        this.supportedLanguages.forEach(lang => {
            if (translations[lang]) {
                this.setNestedTranslation(this.translations[lang], key, translations[lang]);
                this.saveTranslations(lang);
            }
        });
        
        console.log(`✅ Traduction ajoutée: ${key}`);
    }

    // Définir une traduction imbriquée
    setNestedTranslation(translations, key, value) {
        const keys = key.split('.');
        let current = translations;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k] || typeof current[k] !== 'object') {
                current[k] = {};
            }
            current = current[k];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    // Obtenir toutes les traductions pour une langue
    getAllTranslations(language = null) {
        const lang = language || this.currentLanguage;
        return this.translations[lang] || {};
    }

    // Middleware Express pour la détection de langue
    middleware() {
        return (req, res, next) => {
            // 1. Langue depuis query parameter (?lang=en)
            const queryLang = req.query.lang;
            
            // 2. Langue depuis header Accept-Language
            const acceptLanguage = req.headers['accept-language'];
            
            // 3. Langue depuis cookie
            const cookieLang = req.cookies && req.cookies.language;
            
            // 4. Langue depuis session
            const sessionLang = req.session && req.session.language;

            // Déterminer la langue prioritaire
            let detectedLang = this.defaultLanguage;
            
            if (queryLang && this.supportedLanguages.includes(queryLang)) {
                detectedLang = queryLang;
                // Sauver dans session et cookie
                if (req.session) req.session.language = detectedLang;
                res.cookie('language', detectedLang, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 an
            } else if (sessionLang && this.supportedLanguages.includes(sessionLang)) {
                detectedLang = sessionLang;
            } else if (cookieLang && this.supportedLanguages.includes(cookieLang)) {
                detectedLang = cookieLang;
            } else if (acceptLanguage) {
                // Parser Accept-Language header
                const preferred = this.parseAcceptLanguage(acceptLanguage);
                detectedLang = preferred || this.defaultLanguage;
            }

            // Définir la langue pour cette requête
            this.setLanguage(detectedLang);
            
            // Ajouter les fonctions de traduction à req
            req.language = detectedLang;
            req.translate = (key, params) => this.translate(key, detectedLang, params);
            req.t = req.translate; // Raccourci
            
            // Ajouter les fonctions de traduction à res.locals pour les templates
            res.locals.language = detectedLang;
            res.locals.translate = req.translate;
            res.locals.t = req.translate;
            res.locals.supportedLanguages = this.supportedLanguages;

            next();
        };
    }

    // Parser le header Accept-Language
    parseAcceptLanguage(acceptLanguage) {
        const languages = acceptLanguage
            .split(',')
            .map(lang => {
                const parts = lang.trim().split(';q=');
                const code = parts[0].toLowerCase().split('-')[0]; // 'en-US' -> 'en'
                const quality = parts[1] ? parseFloat(parts[1]) : 1.0;
                return { code, quality };
            })
            .sort((a, b) => b.quality - a.quality);

        // Retourner la première langue supportée
        for (const lang of languages) {
            if (this.supportedLanguages.includes(lang.code)) {
                return lang.code;
            }
        }

        return null;
    }

    // API REST pour la gestion des traductions
    setupAPI(app) {
        // Obtenir toutes les traductions pour une langue
        app.get('/api/translations/:language', (req, res) => {
            const { language } = req.params;
            
            if (!this.supportedLanguages.includes(language)) {
                return res.status(400).json({ error: 'Langue non supportée' });
            }

            res.json({
                language,
                translations: this.getAllTranslations(language),
                supportedLanguages: this.supportedLanguages
            });
        });

        // Changer la langue
        app.post('/api/language', (req, res) => {
            const { language } = req.body;
            
            if (!this.supportedLanguages.includes(language)) {
                return res.status(400).json({ error: 'Langue non supportée' });
            }

            // Sauver dans session et cookie
            if (req.session) req.session.language = language;
            res.cookie('language', language, { maxAge: 365 * 24 * 60 * 60 * 1000 });

            res.json({
                success: true,
                language,
                message: this.translate('language.changed', language, { language })
            });
        });

        // Ajouter/modifier une traduction (admin seulement)
        app.post('/api/translations', (req, res) => {
            const { key, translations } = req.body;
            
            if (!key || !translations) {
                return res.status(400).json({ error: 'Clé et traductions requises' });
            }

            try {
                this.addTranslation(key, translations);
                res.json({ success: true, message: 'Traduction ajoutée' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        console.log('🌐 API de traduction configurée');
    }

    // Générer les statistiques de traduction
    getTranslationStats() {
        const stats = {};
        
        this.supportedLanguages.forEach(lang => {
            stats[lang] = {
                totalKeys: this.countKeys(this.translations[lang]),
                completeness: 0
            };
        });

        // Calculer le taux de complétude par rapport au français (langue de référence)
        const referenceCount = stats[this.defaultLanguage].totalKeys;
        
        this.supportedLanguages.forEach(lang => {
            if (lang !== this.defaultLanguage && referenceCount > 0) {
                stats[lang].completeness = Math.round(
                    (stats[lang].totalKeys / referenceCount) * 100
                );
            } else if (lang === this.defaultLanguage) {
                stats[lang].completeness = 100;
            }
        });

        return stats;
    }

    // Compter récursivement les clés de traduction
    countKeys(obj) {
        let count = 0;
        
        function countRecursive(obj) {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    countRecursive(obj[key]);
                } else {
                    count++;
                }
            });
        }
        
        if (obj) countRecursive(obj);
        return count;
    }

    // Initialiser les traductions de base pour l'e-commerce
    initializeDefaultTranslations() {
        const defaultTranslations = {
            // Navigation
            'nav.home': {
                fr: 'Accueil',
                en: 'Home',
                ar: 'الرئيسية'
            },
            'nav.products': {
                fr: 'Produits',
                en: 'Products',
                ar: 'المنتجات'
            },
            'nav.categories': {
                fr: 'Catégories',
                en: 'Categories',
                ar: 'الفئات'
            },
            'nav.cart': {
                fr: 'Panier',
                en: 'Cart',
                ar: 'السلة'
            },
            'nav.account': {
                fr: 'Mon Compte',
                en: 'My Account',
                ar: 'حسابي'
            },
            'nav.login': {
                fr: 'Connexion',
                en: 'Login',
                ar: 'تسجيل الدخول'
            },
            'nav.logout': {
                fr: 'Déconnexion',
                en: 'Logout',
                ar: 'تسجيل الخروج'
            },
            
            // Produits
            'product.name': {
                fr: 'Nom du produit',
                en: 'Product name',
                ar: 'اسم المنتج'
            },
            'product.price': {
                fr: 'Prix',
                en: 'Price',
                ar: 'السعر'
            },
            'product.description': {
                fr: 'Description',
                en: 'Description',
                ar: 'الوصف'
            },
            'product.add_to_cart': {
                fr: 'Ajouter au panier',
                en: 'Add to cart',
                ar: 'أضف للسلة'
            },
            'product.buy_now': {
                fr: 'Acheter maintenant',
                en: 'Buy now',
                ar: 'اشتري الآن'
            },
            'product.out_of_stock': {
                fr: 'Rupture de stock',
                en: 'Out of stock',
                ar: 'غير متوفر'
            },
            
            // Panier
            'cart.title': {
                fr: 'Mon Panier',
                en: 'My Cart',
                ar: 'سلتي'
            },
            'cart.empty': {
                fr: 'Votre panier est vide',
                en: 'Your cart is empty',
                ar: 'سلتك فارغة'
            },
            'cart.total': {
                fr: 'Total',
                en: 'Total',
                ar: 'المجموع'
            },
            'cart.checkout': {
                fr: 'Commander',
                en: 'Checkout',
                ar: 'إتمام الطلب'
            },
            
            // Formulaires
            'form.email': {
                fr: 'Email',
                en: 'Email',
                ar: 'البريد الإلكتروني'
            },
            'form.password': {
                fr: 'Mot de passe',
                en: 'Password',
                ar: 'كلمة المرور'
            },
            'form.confirm_password': {
                fr: 'Confirmer le mot de passe',
                en: 'Confirm password',
                ar: 'تأكيد كلمة المرور'
            },
            'form.first_name': {
                fr: 'Prénom',
                en: 'First name',
                ar: 'الاسم الأول'
            },
            'form.last_name': {
                fr: 'Nom',
                en: 'Last name',
                ar: 'اسم العائلة'
            },
            'form.phone': {
                fr: 'Téléphone',
                en: 'Phone',
                ar: 'الهاتف'
            },
            'form.address': {
                fr: 'Adresse',
                en: 'Address',
                ar: 'العنوان'
            },
            'form.submit': {
                fr: 'Envoyer',
                en: 'Submit',
                ar: 'إرسال'
            },
            'form.cancel': {
                fr: 'Annuler',
                en: 'Cancel',
                ar: 'إلغاء'
            },
            
            // Messages
            'message.success': {
                fr: 'Opération réussie',
                en: 'Operation successful',
                ar: 'تمت العملية بنجاح'
            },
            'message.error': {
                fr: 'Une erreur est survenue',
                en: 'An error occurred',
                ar: 'حدث خطأ'
            },
            'message.loading': {
                fr: 'Chargement...',
                en: 'Loading...',
                ar: 'جاري التحميل...'
            },
            
            // Admin
            'admin.dashboard': {
                fr: 'Tableau de bord',
                en: 'Dashboard',
                ar: 'لوحة التحكم'
            },
            'admin.products': {
                fr: 'Gestion des produits',
                en: 'Product management',
                ar: 'إدارة المنتجات'
            },
            'admin.users': {
                fr: 'Gestion des utilisateurs',
                en: 'User management',
                ar: 'إدارة المستخدمين'
            },
            'admin.orders': {
                fr: 'Gestion des commandes',
                en: 'Order management',
                ar: 'إدارة الطلبات'
            },
            
            // Langue
            'language.changed': {
                fr: 'Langue changée vers le français',
                en: 'Language changed to English',
                ar: 'تم تغيير اللغة إلى العربية'
            }
        };

        // Ajouter toutes les traductions par défaut
        Object.entries(defaultTranslations).forEach(([key, translations]) => {
            this.addTranslation(key, translations);
        });

        console.log('🌐 Traductions par défaut initialisées');
    }
}

module.exports = MultilingualSystem;