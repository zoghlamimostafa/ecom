// Configuration JWT sécurisée avec refresh tokens
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { securityLogger } = require('../middlewares/security');

class SecureJWTManager {
    constructor() {
        this.secret = process.env.JWT_SECRET || this.generateSecureSecret();
        this.refreshSecret = process.env.JWT_REFRESH_SECRET || this.generateSecureSecret();
        
        // Configuration sécurisée
        this.config = {
            accessToken: {
                expiresIn: '15m', // 15 minutes pour sécurité maximale
                issuer: 'sanny-ecommerce',
                audience: 'sanny-users'
            },
            refreshToken: {
                expiresIn: '7d', // 7 jours
                issuer: 'sanny-ecommerce',
                audience: 'sanny-refresh'
            }
        };
        
        // Blacklist des tokens révoqués
        this.tokenBlacklist = new Set();
        this.refreshBlacklist = new Set();
    }

    generateSecureSecret() {
        return crypto.randomBytes(64).toString('hex');
    }

    // Générer un access token sécurisé
    generateAccessToken(payload) {
        try {
            const tokenPayload = {
                ...payload,
                type: 'access',
                iat: Math.floor(Date.now() / 1000),
                jti: crypto.randomUUID() // ID unique pour révocation
            };

            const token = jwt.sign(tokenPayload, this.secret, {
                expiresIn: this.config.accessToken.expiresIn,
                issuer: this.config.accessToken.issuer,
                audience: this.config.accessToken.audience,
                algorithm: 'HS256'
            });

            securityLogger.info('Access token generated', {
                userId: payload.id || payload.userId,
                email: payload.email,
                jti: tokenPayload.jti
            });

            return token;
        } catch (error) {
            securityLogger.error('Access token generation failed', { error: error.message });
            throw new Error('Token generation failed');
        }
    }

    // Générer un refresh token sécurisé
    generateRefreshToken(payload) {
        try {
            const tokenPayload = {
                userId: payload.id || payload.userId,
                email: payload.email,
                type: 'refresh',
                iat: Math.floor(Date.now() / 1000),
                jti: crypto.randomUUID()
            };

            const token = jwt.sign(tokenPayload, this.refreshSecret, {
                expiresIn: this.config.refreshToken.expiresIn,
                issuer: this.config.refreshToken.issuer,
                audience: this.config.refreshToken.audience,
                algorithm: 'HS256'
            });

            securityLogger.info('Refresh token generated', {
                userId: payload.id || payload.userId,
                email: payload.email,
                jti: tokenPayload.jti
            });

            return token;
        } catch (error) {
            securityLogger.error('Refresh token generation failed', { error: error.message });
            throw new Error('Refresh token generation failed');
        }
    }

    // Générer une paire de tokens
    generateTokenPair(userPayload) {
        const accessToken = this.generateAccessToken(userPayload);
        const refreshToken = this.generateRefreshToken(userPayload);

        return {
            accessToken,
            refreshToken,
            expiresIn: this.config.accessToken.expiresIn,
            tokenType: 'Bearer'
        };
    }

    // Vérifier un access token
    verifyAccessToken(token, req = null) {
        try {
            // Vérifier si token est blacklisté
            if (this.tokenBlacklist.has(token)) {
                if (req) {
                    securityLogger.warn('Blacklisted token used', {
                        ip: req.ip,
                        userAgent: req.get('User-Agent')
                    });
                }
                throw new Error('Token révoqué');
            }

            const decoded = jwt.verify(token, this.secret, {
                issuer: this.config.accessToken.issuer,
                audience: this.config.accessToken.audience,
                algorithms: ['HS256']
            });

            // Vérifier le type de token
            if (decoded.type !== 'access') {
                throw new Error('Type de token invalide');
            }

            securityLogger.info('Access token verified', {
                userId: decoded.id || decoded.userId,
                jti: decoded.jti
            });

            return decoded;
        } catch (error) {
            if (req) {
                securityLogger.warn('Access token verification failed', {
                    error: error.message,
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                });
            }
            throw error;
        }
    }

    // Vérifier un refresh token
    verifyRefreshToken(token, req = null) {
        try {
            // Vérifier si token est blacklisté
            if (this.refreshBlacklist.has(token)) {
                if (req) {
                    securityLogger.warn('Blacklisted refresh token used', {
                        ip: req.ip,
                        userAgent: req.get('User-Agent')
                    });
                }
                throw new Error('Refresh token révoqué');
            }

            const decoded = jwt.verify(token, this.refreshSecret, {
                issuer: this.config.refreshToken.issuer,
                audience: this.config.refreshToken.audience,
                algorithms: ['HS256']
            });

            // Vérifier le type de token
            if (decoded.type !== 'refresh') {
                throw new Error('Type de refresh token invalide');
            }

            securityLogger.info('Refresh token verified', {
                userId: decoded.userId,
                jti: decoded.jti
            });

            return decoded;
        } catch (error) {
            if (req) {
                securityLogger.warn('Refresh token verification failed', {
                    error: error.message,
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                });
            }
            throw error;
        }
    }

    // Révoquer un token (l'ajouter à la blacklist)
    revokeToken(token, type = 'access') {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.jti) {
                throw new Error('Token invalide pour révocation');
            }

            if (type === 'access') {
                this.tokenBlacklist.add(token);
            } else {
                this.refreshBlacklist.add(token);
            }

            securityLogger.info('Token revoked', {
                type,
                jti: decoded.jti,
                userId: decoded.id || decoded.userId
            });

            return true;
        } catch (error) {
            securityLogger.error('Token revocation failed', { error: error.message });
            return false;
        }
    }

    // Nettoyer les tokens expirés de la blacklist
    cleanExpiredTokens() {
        const now = Math.floor(Date.now() / 1000);
        let cleanedAccess = 0;
        let cleanedRefresh = 0;

        // Nettoyer access tokens
        for (const token of this.tokenBlacklist) {
            try {
                const decoded = jwt.decode(token);
                if (decoded && decoded.exp < now) {
                    this.tokenBlacklist.delete(token);
                    cleanedAccess++;
                }
            } catch (error) {
                // Token malformé, le supprimer
                this.tokenBlacklist.delete(token);
                cleanedAccess++;
            }
        }

        // Nettoyer refresh tokens
        for (const token of this.refreshBlacklist) {
            try {
                const decoded = jwt.decode(token);
                if (decoded && decoded.exp < now) {
                    this.refreshBlacklist.delete(token);
                    cleanedRefresh++;
                }
            } catch (error) {
                this.refreshBlacklist.delete(token);
                cleanedRefresh++;
            }
        }

        if (cleanedAccess > 0 || cleanedRefresh > 0) {
            securityLogger.info('Expired tokens cleaned', {
                accessTokens: cleanedAccess,
                refreshTokens: cleanedRefresh
            });
        }

        return { cleanedAccess, cleanedRefresh };
    }

    // Middleware d'authentification sécurisé
    authMiddleware = (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({ error: 'Token d\'authentification requis' });
            }

            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                securityLogger.warn('Invalid authorization header format', {
                    ip: req.ip,
                    header: authHeader
                });
                return res.status(401).json({ error: 'Format d\'autorisation invalide' });
            }

            const token = parts[1];
            const decoded = this.verifyAccessToken(token, req);
            
            // Ajouter les infos utilisateur à la requête
            req.user = {
                id: decoded.id || decoded.userId,
                email: decoded.email,
                role: decoded.role,
                jti: decoded.jti
            };

            next();
        } catch (error) {
            securityLogger.warn('Authentication failed', {
                error: error.message,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });

            return res.status(401).json({ 
                error: 'Token invalide',
                message: error.message 
            });
        }
    };

    // Middleware pour admin seulement
    adminMiddleware = (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            securityLogger.warn('Unauthorized admin access attempt', {
                userId: req.user?.id,
                ip: req.ip,
                path: req.path
            });
            res.status(403).json({ error: 'Accès administrateur requis' });
        }
    };

    // Obtenir les statistiques de sécurité
    getSecurityStats() {
        return {
            blacklistedAccessTokens: this.tokenBlacklist.size,
            blacklistedRefreshTokens: this.refreshBlacklist.size,
            secretLength: this.secret.length,
            refreshSecretLength: this.refreshSecret.length,
            accessTokenExpiry: this.config.accessToken.expiresIn,
            refreshTokenExpiry: this.config.refreshToken.expiresIn
        };
    }
}

// Créer une instance globale
const jwtManager = new SecureJWTManager();

// Nettoyer les tokens expirés toutes les heures
setInterval(() => {
    jwtManager.cleanExpiredTokens();
}, 60 * 60 * 1000);

module.exports = jwtManager;