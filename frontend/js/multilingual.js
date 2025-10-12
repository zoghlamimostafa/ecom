// Helper frontend pour le système multilingue
class SannyMultilingual {
    constructor(options = {}) {
        this.apiBase = options.apiBase || '/api';
        this.defaultLanguage = options.defaultLanguage || 'fr';
        this.currentLanguage = this.defaultLanguage;
        this.supportedLanguages = options.supportedLanguages || ['fr', 'en', 'ar'];
        this.translations = {};
        this.callbacks = {
            onLanguageChange: [],
            onTranslationLoad: []
        };
        
        this.init();
    }
    
    async init() {
        // Détecter la langue
        this.detectLanguage();
        
        // Charger les traductions
        await this.loadTranslations(this.currentLanguage);
        
        // Appliquer les traductions
        this.applyTranslations();
        
        // Configurer les événements
        this.setupEventListeners();
        
        console.log(`🌐 SannyMultilingual initialisé (${this.currentLanguage})`);
    }
    
    detectLanguage() {
        // 1. URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
            return;
        }
        
        // 2. Stockage local
        const savedLang = localStorage.getItem('sanny_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }
        
        // 3. Cookie
        const cookieLang = this.getCookie('language');
        if (cookieLang && this.supportedLanguages.includes(cookieLang)) {
            this.currentLanguage = cookieLang;
            return;
        }
        
        // 4. Navigateur
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            this.currentLanguage = browserLang;
        }
    }
    
    async loadTranslations(language) {
        try {
            const response = await fetch(`${this.apiBase}/translations/${language}`);
            
            if (response.ok) {
                const data = await response.json();
                this.translations[language] = data.translations;
            } else {
                console.warn(`⚠️ Impossible de charger les traductions pour ${language}`);
                // Utiliser les traductions par défaut si disponibles
                this.useDefaultTranslations(language);
            }
            
            // Déclencher les callbacks
            this.callbacks.onTranslationLoad.forEach(callback => {
                callback(language, this.translations[language]);
            });
            
        } catch (error) {
            console.error(`❌ Erreur chargement traductions ${language}:`, error);
            this.useDefaultTranslations(language);
        }
    }
    
    useDefaultTranslations(language) {
        // Traductions de secours intégrées
        const defaultTranslations = {
            fr: {
                'nav.home': 'Accueil',
                'nav.products': 'Produits',
                'nav.cart': 'Panier',
                'loading': 'Chargement...',
                'error': 'Erreur'
            },
            en: {
                'nav.home': 'Home',
                'nav.products': 'Products',
                'nav.cart': 'Cart',
                'loading': 'Loading...',
                'error': 'Error'
            },
            ar: {
                'nav.home': 'الرئيسية',
                'nav.products': 'المنتجات',
                'nav.cart': 'السلة',
                'loading': 'جاري التحميل...',
                'error': 'خطأ'
            }
        };
        
        this.translations[language] = defaultTranslations[language] || {};
    }
    
    async changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Langue non supportée: ${language}`);
            return false;
        }
        
        if (language === this.currentLanguage) {
            return true;
        }
        
        try {
            // Afficher le loader
            this.showLoader();
            
            // Charger les traductions si nécessaire
            if (!this.translations[language]) {
                await this.loadTranslations(language);
            }
            
            // Changer la langue côté serveur
            await fetch(`${this.apiBase}/language`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ language })
            });
            
            // Mettre à jour la langue courante
            const oldLanguage = this.currentLanguage;
            this.currentLanguage = language;
            
            // Sauvegarder localement
            localStorage.setItem('sanny_language', language);
            
            // Mettre à jour l'URL
            this.updateURL();
            
            // Appliquer les traductions
            this.applyTranslations();
            
            // Mettre à jour la direction du texte
            this.updateTextDirection();
            
            // Déclencher les callbacks
            this.callbacks.onLanguageChange.forEach(callback => {
                callback(language, oldLanguage);
            });
            
            // Masquer le loader
            this.hideLoader();
            
            return true;
            
        } catch (error) {
            console.error('Erreur changement de langue:', error);
            this.hideLoader();
            return false;
        }
    }
    
    translate(key, params = {}) {
        let translation = this.getNestedTranslation(this.translations[this.currentLanguage], key);
        
        // Fallback vers la langue par défaut
        if (!translation && this.currentLanguage !== this.defaultLanguage) {
            translation = this.getNestedTranslation(this.translations[this.defaultLanguage], key);
        }
        
        // Fallback vers la clé
        if (!translation) {
            console.warn(`Traduction manquante: ${key} (${this.currentLanguage})`);
            return key;
        }
        
        // Remplacer les paramètres
        return this.replaceParameters(translation, params);
    }
    
    getNestedTranslation(translations, key) {
        if (!translations) return null;
        
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
    
    replaceParameters(text, params) {
        if (!params || Object.keys(params).length === 0) {
            return text;
        }
        
        return text.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }
    
    applyTranslations() {
        // Traduire tous les éléments avec data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const params = this.parseDataParams(element.getAttribute('data-translate-params'));
            const translation = this.translate(key, params);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('data-translate-attr') === 'placeholder') {
                    element.placeholder = translation;
                } else {
                    element.value = translation;
                }
            } else {
                element.textContent = translation;
            }
        });
        
        // Traduire les attributs title, alt, etc.
        document.querySelectorAll('[data-translate-title]').forEach(element => {
            const key = element.getAttribute('data-translate-title');
            element.title = this.translate(key);
        });
        
        document.querySelectorAll('[data-translate-alt]').forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            element.alt = this.translate(key);
        });
    }
    
    parseDataParams(paramsStr) {
        if (!paramsStr) return {};
        
        try {
            return JSON.parse(paramsStr);
        } catch (e) {
            console.warn('Erreur parsing data-translate-params:', paramsStr);
            return {};
        }
    }
    
    updateTextDirection() {
        const html = document.documentElement;
        const isRtl = this.currentLanguage === 'ar';
        
        html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
        html.setAttribute('lang', this.currentLanguage);
        
        // Ajouter une classe CSS pour le styling conditionnel
        html.classList.toggle('rtl', isRtl);
        html.classList.toggle('ltr', !isRtl);
    }
    
    updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('lang', this.currentLanguage);
        window.history.replaceState({}, '', url);
    }
    
    setupEventListeners() {
        // Auto-configuration des boutons de langue
        document.querySelectorAll('[data-lang]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = element.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
        
        // Auto-configuration des sélecteurs de langue
        document.querySelectorAll('select[data-language-selector]').forEach(select => {
            select.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        });
    }
    
    showLoader() {
        const loader = document.getElementById('language-loader') || 
                     document.querySelector('.language-loader');
        
        if (loader) {
            loader.style.display = 'block';
        } else {
            // Créer un loader temporaire
            const tempLoader = document.createElement('div');
            tempLoader.id = 'temp-language-loader';
            tempLoader.innerHTML = this.translate('loading') || 'Loading...';
            tempLoader.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #667eea;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 9999;
                font-size: 14px;
            `;
            document.body.appendChild(tempLoader);
        }
    }
    
    hideLoader() {
        const loader = document.getElementById('language-loader') || 
                     document.querySelector('.language-loader');
        
        if (loader) {
            loader.style.display = 'none';
        }
        
        const tempLoader = document.getElementById('temp-language-loader');
        if (tempLoader) {
            tempLoader.remove();
        }
    }
    
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // Méthodes d'événements
    onLanguageChange(callback) {
        this.callbacks.onLanguageChange.push(callback);
    }
    
    onTranslationLoad(callback) {
        this.callbacks.onTranslationLoad.push(callback);
    }
    
    // Méthodes utilitaires
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
    
    isRTL() {
        return this.currentLanguage === 'ar';
    }
    
    getLanguageName(lang) {
        const names = {
            fr: 'Français',
            en: 'English',
            ar: 'العربية'
        };
        return names[lang] || lang;
    }
    
    // Plugin pour formulaires
    setupForm(formElement) {
        if (!formElement) return;
        
        // Auto-traduction des labels
        formElement.querySelectorAll('label[data-translate]').forEach(label => {
            const key = label.getAttribute('data-translate');
            label.textContent = this.translate(key);
        });
        
        // Auto-traduction des placeholders
        formElement.querySelectorAll('input[data-translate-placeholder]').forEach(input => {
            const key = input.getAttribute('data-translate-placeholder');
            input.placeholder = this.translate(key);
        });
        
        // Auto-traduction des boutons submit
        formElement.querySelectorAll('button[type="submit"][data-translate]').forEach(button => {
            const key = button.getAttribute('data-translate');
            button.textContent = this.translate(key);
        });
    }
    
    // Plugin pour notifications
    notify(messageKey, params = {}, type = 'info') {
        const message = this.translate(messageKey, params);
        
        // Créer une notification simple
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#e53e3e' : '#38a169'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            max-width: 400px;
            text-align: center;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto-masquer après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        return notification;
    }
}

// Initialisation automatique
if (typeof window !== 'undefined') {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.SannyMultilingual = window.SannyMultilingual || new SannyMultilingual();
        });
    } else {
        window.SannyMultilingual = window.SannyMultilingual || new SannyMultilingual();
    }
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SannyMultilingual;
}