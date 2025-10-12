// Système de chiffrement pour données sensibles
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { securityLogger } = require('../middlewares/security');

class DataEncryption {
    constructor() {
        // Clé de chiffrement dérivée du JWT_SECRET
        this.masterKey = this.deriveMasterKey();
        this.algorithm = 'aes-256-gcm';
        this.ivLength = 16;
        this.tagLength = 16;
        this.saltRounds = 12; // Augmenté pour plus de sécurité
    }

    // Dériver une clé maître depuis le JWT_SECRET
    deriveMasterKey() {
        const secret = process.env.JWT_SECRET || 'default-secret-key';
        const salt = 'sanny-encryption-salt-2025';
        return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');
    }

    // Générer une clé dérivée pour un usage spécifique
    deriveKey(purpose, userId = null) {
        const info = `sanny-${purpose}${userId ? `-${userId}` : ''}`;
        return crypto.pbkdf2Sync(this.masterKey, info, 10000, 32, 'sha256');
    }

    // Chiffrer des données sensibles
    encryptSensitiveData(data, purpose, userId = null) {
        try {
            if (!data) return null;

            const key = this.deriveKey(purpose, userId);
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipher(this.algorithm, key);
            cipher.setAAD(Buffer.from(purpose, 'utf8'));

            let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const tag = cipher.getAuthTag();
            
            // Combiner IV + tag + données chiffrées
            const result = {
                iv: iv.toString('hex'),
                tag: tag.toString('hex'),
                encrypted,
                purpose
            };

            securityLogger.info('Data encrypted', {
                purpose,
                userId,
                dataLength: data.toString().length
            });

            return Buffer.from(JSON.stringify(result)).toString('base64');
        } catch (error) {
            securityLogger.error('Encryption failed', {
                error: error.message,
                purpose,
                userId
            });
            throw new Error('Échec du chiffrement');
        }
    }

    // Déchiffrer des données sensibles
    decryptSensitiveData(encryptedData, purpose, userId = null) {
        try {
            if (!encryptedData) return null;

            const data = JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf8'));
            
            if (data.purpose !== purpose) {
                throw new Error('Purpose mismatch');
            }

            const key = this.deriveKey(purpose, userId);
            const decipher = crypto.createDecipher(this.algorithm, key);
            decipher.setAAD(Buffer.from(purpose, 'utf8'));
            decipher.setAuthTag(Buffer.from(data.tag, 'hex'));

            let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            securityLogger.info('Data decrypted', { purpose, userId });

            return JSON.parse(decrypted);
        } catch (error) {
            securityLogger.error('Decryption failed', {
                error: error.message,
                purpose,
                userId
            });
            throw new Error('Échec du déchiffrement');
        }
    }

    // Hacher un mot de passe de manière sécurisée
    async hashPassword(password) {
        try {
            if (!password || password.length < 8) {
                throw new Error('Mot de passe trop court');
            }

            // Vérification de la force du mot de passe
            const strength = this.checkPasswordStrength(password);
            if (strength.score < 3) {
                securityLogger.warn('Weak password attempt', { 
                    score: strength.score,
                    issues: strength.feedback 
                });
            }

            const salt = await bcrypt.genSalt(this.saltRounds);
            const hash = await bcrypt.hash(password, salt);

            securityLogger.info('Password hashed successfully');
            return hash;
        } catch (error) {
            securityLogger.error('Password hashing failed', { error: error.message });
            throw error;
        }
    }

    // Vérifier un mot de passe
    async verifyPassword(password, hash) {
        try {
            const isValid = await bcrypt.compare(password, hash);
            
            if (!isValid) {
                securityLogger.warn('Password verification failed');
            } else {
                securityLogger.info('Password verified successfully');
            }
            
            return isValid;
        } catch (error) {
            securityLogger.error('Password verification error', { error: error.message });
            return false;
        }
    }

    // Vérifier la force d'un mot de passe
    checkPasswordStrength(password) {
        let score = 0;
        const feedback = [];

        // Longueur
        if (password.length >= 8) score += 1;
        else feedback.push('Au moins 8 caractères requis');

        if (password.length >= 12) score += 1;
        else if (password.length >= 8) feedback.push('12+ caractères recommandés');

        // Complexité
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Ajouter des lettres minuscules');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Ajouter des lettres majuscules');

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Ajouter des chiffres');

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('Ajouter des caractères spéciaux');

        // Patterns communs (réduisent le score)
        const commonPatterns = [
            /123456/,
            /password/i,
            /qwerty/i,
            /abc123/i,
            /admin/i,
            /letmein/i
        ];

        if (commonPatterns.some(pattern => pattern.test(password))) {
            score = Math.max(0, score - 2);
            feedback.push('Éviter les mots de passe communs');
        }

        // Répétitions
        if (/(.)\1{2,}/.test(password)) {
            score = Math.max(0, score - 1);
            feedback.push('Éviter les répétitions');
        }

        return {
            score: Math.min(5, score),
            strength: score < 2 ? 'Très faible' : 
                     score < 3 ? 'Faible' :
                     score < 4 ? 'Moyen' :
                     score < 5 ? 'Fort' : 'Très fort',
            feedback
        };
    }

    // Chiffrer des informations de carte de crédit (PCI DSS compliant)
    encryptPaymentData(paymentInfo, userId) {
        try {
            // Masquer le numéro de carte (garder seulement les 4 derniers chiffres)
            const maskedCard = paymentInfo.cardNumber ? 
                '**** **** **** ' + paymentInfo.cardNumber.slice(-4) : null;

            // Données à chiffrer
            const sensitiveData = {
                cardNumber: paymentInfo.cardNumber,
                cvv: paymentInfo.cvv,
                expiryDate: paymentInfo.expiryDate
            };

            // Données non sensibles à garder en clair
            const publicData = {
                cardholderName: paymentInfo.cardholderName,
                maskedCardNumber: maskedCard,
                cardType: paymentInfo.cardType,
                billingAddress: paymentInfo.billingAddress
            };

            const encrypted = this.encryptSensitiveData(sensitiveData, 'payment', userId);

            securityLogger.info('Payment data encrypted', { 
                userId,
                cardType: paymentInfo.cardType,
                lastFour: paymentInfo.cardNumber?.slice(-4)
            });

            return {
                ...publicData,
                encryptedData: encrypted,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            securityLogger.error('Payment encryption failed', { error: error.message, userId });
            throw new Error('Échec du chiffrement des données de paiement');
        }
    }

    // Déchiffrer des informations de paiement
    decryptPaymentData(encryptedPayment, userId) {
        try {
            if (!encryptedPayment.encryptedData) {
                throw new Error('Données de paiement non trouvées');
            }

            const sensitiveData = this.decryptSensitiveData(
                encryptedPayment.encryptedData, 
                'payment', 
                userId
            );

            securityLogger.info('Payment data decrypted', { userId });

            return {
                ...encryptedPayment,
                ...sensitiveData
            };
        } catch (error) {
            securityLogger.error('Payment decryption failed', { error: error.message, userId });
            throw new Error('Échec du déchiffrement des données de paiement');
        }
    }

    // Chiffrer des adresses personnelles
    encryptPersonalData(personalInfo, userId) {
        const sensitiveFields = ['address', 'phone', 'mobile', 'passport', 'nationalId'];
        const encrypted = {};
        const public = {};

        for (const [key, value] of Object.entries(personalInfo)) {
            if (sensitiveFields.includes(key) && value) {
                encrypted[key] = value;
            } else {
                public[key] = value;
            }
        }

        if (Object.keys(encrypted).length > 0) {
            const encryptedData = this.encryptSensitiveData(encrypted, 'personal', userId);
            return {
                ...public,
                encryptedPersonalData: encryptedData
            };
        }

        return public;
    }

    // Générer un token sécurisé pour reset de mot de passe
    generateSecureToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    // Créer un hash pour token de vérification
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    // Vérifier l'intégrité des données avec HMAC
    signData(data, purpose) {
        const key = this.deriveKey(purpose);
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(JSON.stringify(data));
        return hmac.digest('hex');
    }

    // Vérifier la signature des données
    verifyDataSignature(data, signature, purpose) {
        const expectedSignature = this.signData(data, purpose);
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    }

    // Middleware pour chiffrement automatique des données sensibles
    autoEncryptMiddleware = (sensitiveFields = []) => {
        return (req, res, next) => {
            if (req.body && sensitiveFields.length > 0) {
                try {
                    const userId = req.user?.id;
                    
                    for (const field of sensitiveFields) {
                        if (req.body[field]) {
                            req.body[`encrypted_${field}`] = this.encryptSensitiveData(
                                req.body[field], 
                                field, 
                                userId
                            );
                            delete req.body[field]; // Supprimer la version non chiffrée
                        }
                    }
                    
                    next();
                } catch (error) {
                    securityLogger.error('Auto-encryption failed', { error: error.message });
                    res.status(500).json({ error: 'Erreur de chiffrement' });
                }
            } else {
                next();
            }
        };
    };

    // Obtenir les statistiques de chiffrement
    getEncryptionStats() {
        return {
            algorithm: this.algorithm,
            keyLength: this.masterKey.length,
            saltRounds: this.saltRounds,
            ivLength: this.ivLength,
            tagLength: this.tagLength
        };
    }
}

// Instance globale
const encryption = new DataEncryption();

module.exports = encryption;