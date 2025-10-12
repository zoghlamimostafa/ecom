// Middleware de sécurité renforcée
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const winston = require('winston');
const validator = require('validator');

// Configuration du logger de sécurité
const securityLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/security.log' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Rate Limiting - Protection contre brute force
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            securityLogger.warn('Rate limit exceeded', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                endpoint: req.path,
                timestamp: new Date().toISOString()
            });
            res.status(429).json({ error: message });
        }
    });
};

// Rate limits spécifiques
const generalLimiter = createRateLimit(15 * 60 * 1000, 100, 'Trop de requêtes, réessayez dans 15 minutes');
const authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Trop de tentatives de connexion, réessayez dans 15 minutes');
const uploadLimiter = createRateLimit(60 * 60 * 1000, 10, 'Trop d\'uploads, réessayez dans 1 heure');

// Validation des entrées sécurisée
const validateInput = (schema) => {
    return (req, res, next) => {
        const errors = [];
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = req.body[field];
            
            if (rules.required && !value) {
                errors.push(`${field} est requis`);
                continue;
            }
            
            if (value) {
                // Validation email
                if (rules.isEmail && !validator.isEmail(value)) {
                    errors.push(`${field} doit être un email valide`);
                }
                
                // Validation longueur
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`${field} doit contenir au moins ${rules.minLength} caractères`);
                }
                
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors.push(`${field} ne peut pas dépasser ${rules.maxLength} caractères`);
                }
                
                // Validation mot de passe fort
                if (rules.isStrongPassword && !validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })) {
                    errors.push(`${field} doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et symbole`);
                }
                
                // Validation numérique
                if (rules.isNumeric && !validator.isNumeric(value.toString())) {
                    errors.push(`${field} doit être numérique`);
                }
                
                // Sanitisation XSS
                if (rules.sanitize) {
                    req.body[field] = validator.escape(value);
                }
            }
        }
        
        if (errors.length > 0) {
            securityLogger.warn('Validation failed', {
                ip: req.ip,
                errors,
                body: req.body,
                timestamp: new Date().toISOString()
            });
            return res.status(400).json({ error: 'Données invalides', details: errors });
        }
        
        next();
    };
};

// Middleware de logging sécurisé
const securityMiddleware = (req, res, next) => {
    // Log des tentatives suspectes
    const suspiciousPatterns = [
        /script/i, /<.*>/i, /javascript:/i, /vbscript:/i,
        /onload/i, /onerror/i, /onclick/i, /eval\(/i,
        /union.*select/i, /drop.*table/i, /insert.*into/i
    ];
    
    const requestData = JSON.stringify({
        body: req.body,
        query: req.query,
        params: req.params
    });
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));
    
    if (isSuspicious) {
        securityLogger.error('Suspicious request detected', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,
            timestamp: new Date().toISOString()
        });
        
        return res.status(400).json({ error: 'Requête suspecte détectée' });
    }
    
    // Log normal des requêtes sensibles
    if (req.path.includes('login') || req.path.includes('register') || req.path.includes('admin')) {
        securityLogger.info('Sensitive endpoint accessed', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }
    
    next();
};

// Configuration Helmet sécurisée
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false, // Pour compatibilité images
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// Middleware CORS sécurisé
const corsSecure = (req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ];
    
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24h cache preflight
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};

// Nettoyage sécurisé des données
const sanitizeData = (req, res, next) => {
    // Nettoyer les données récursives
    const clean = (obj) => {
        if (typeof obj === 'string') {
            return validator.escape(obj.trim());
        }
        if (Array.isArray(obj)) {
            return obj.map(clean);
        }
        if (obj && typeof obj === 'object') {
            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
                cleaned[key] = clean(value);
            }
            return cleaned;
        }
        return obj;
    };
    
    req.body = clean(req.body);
    req.query = clean(req.query);
    
    next();
};

// Export des middlewares
module.exports = {
    // Rate limiting
    generalLimiter,
    authLimiter,
    uploadLimiter,
    
    // Sécurité générale
    helmetConfig,
    corsSecure,
    sanitizeData,
    securityMiddleware,
    
    // Validation
    validateInput,
    
    // Middlewares tiers configurés
    mongoSanitize: mongoSanitize({
        replaceWith: '_',
        onSanitize: ({ req, key }) => {
            securityLogger.warn('NoSQL injection attempt', {
                ip: req.ip,
                key,
                value: req.body[key],
                timestamp: new Date().toISOString()
            });
        }
    }),
    xssClean: xss(),
    hppProtection: hpp({
        whitelist: ['sort', 'fields', 'page', 'limit', 'category']
    }),
    compression: compression({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) return false;
            return compression.filter(req, res);
        }
    }),
    
    // Logger
    securityLogger,
    
    // Schémas de validation communs
    schemas: {
        user: {
            firstname: { required: true, minLength: 2, maxLength: 50, sanitize: true },
            lastname: { required: true, minLength: 2, maxLength: 50, sanitize: true },
            email: { required: true, isEmail: true },
            password: { required: true, isStrongPassword: true },
            mobile: { required: true, minLength: 8, maxLength: 20 }
        },
        login: {
            email: { required: true, isEmail: true },
            password: { required: true, minLength: 8 }
        },
        product: {
            title: { required: true, minLength: 3, maxLength: 200, sanitize: true },
            description: { required: true, minLength: 10, maxLength: 2000, sanitize: true },
            price: { required: true, isNumeric: true },
            category: { required: true, sanitize: true }
        }
    }
};