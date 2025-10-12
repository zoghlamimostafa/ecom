// Middleware de sécurité pour upload de fichiers
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { securityLogger } = require('./security');

class SecureFileUpload {
    constructor() {
        this.allowedImageTypes = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'image/webp'
        ];
        
        this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        // Tailles maximales (en bytes)
        this.maxSizes = {
            image: 5 * 1024 * 1024, // 5MB
            avatar: 1 * 1024 * 1024, // 1MB
            default: 2 * 1024 * 1024 // 2MB
        };
        
        // Répertoire de upload sécurisé (hors webroot)
        this.uploadDir = path.join(__dirname, '..', 'uploads');
        this.tempDir = path.join(__dirname, '..', 'temp');
        
        // Créer les répertoires s'ils n'existent pas
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.uploadDir, this.tempDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
                securityLogger.info('Upload directory created', { directory: dir });
            }
        });
    }

    // Générer un nom de fichier sécurisé
    generateSecureFilename(originalname) {
        const ext = path.extname(originalname).toLowerCase();
        const hash = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        return `${timestamp}_${hash}${ext}`;
    }

    // Vérifier le type MIME réel du fichier
    async verifyFileType(buffer) {
        // Signatures des fichiers images (magic bytes)
        const signatures = {
            'image/jpeg': [0xFF, 0xD8, 0xFF],
            'image/png': [0x89, 0x50, 0x4E, 0x47],
            'image/gif': [0x47, 0x49, 0x46],
            'image/webp': [0x52, 0x49, 0x46, 0x46]
        };

        for (const [mimeType, signature] of Object.entries(signatures)) {
            if (signature.every((byte, index) => buffer[index] === byte)) {
                return mimeType;
            }
        }
        
        return null;
    }

    // Scanner de sécurité basique pour fichiers malveillants
    scanForMaliciousContent(buffer, filename) {
        const content = buffer.toString('ascii', 0, Math.min(buffer.length, 1024));
        
        // Patterns suspects
        const maliciousPatterns = [
            /<script/i,
            /javascript:/i,
            /vbscript:/i,
            /onload=/i,
            /onerror=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /eval\(/i,
            /document\./i
        ];

        const suspicious = maliciousPatterns.some(pattern => pattern.test(content));
        
        if (suspicious) {
            securityLogger.error('Malicious file content detected', {
                filename,
                contentSample: content.substring(0, 100)
            });
            return true;
        }

        // Vérifier les extensions doubles suspectes
        const suspiciousExtensions = ['.php', '.jsp', '.asp', '.exe', '.sh', '.bat'];
        const hasSuspiciousExt = suspiciousExtensions.some(ext => 
            filename.toLowerCase().includes(ext)
        );

        if (hasSuspiciousExt) {
            securityLogger.error('Suspicious file extension detected', { filename });
            return true;
        }

        return false;
    }

    // Configuration de stockage sécurisée
    createSecureStorage(uploadType = 'default') {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                // Créer un sous-répertoire basé sur la date
                const dateDir = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
                const fullPath = path.join(this.uploadDir, uploadType, dateDir);
                
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true, mode: 0o755 });
                }
                
                cb(null, fullPath);
            },
            filename: (req, file, cb) => {
                const secureFilename = this.generateSecureFilename(file.originalname);
                
                // Log l'upload
                securityLogger.info('File upload initiated', {
                    originalName: file.originalname,
                    secureFilename,
                    mimeType: file.mimetype,
                    size: file.size,
                    ip: req.ip,
                    userId: req.user?.id
                });
                
                cb(null, secureFilename);
            }
        });
    }

    // Filtre de validation des fichiers
    createFileFilter(uploadType = 'image') {
        return (req, file, cb) => {
            try {
                // Vérifier le type MIME
                if (!this.allowedImageTypes.includes(file.mimetype)) {
                    securityLogger.warn('Invalid MIME type upload attempt', {
                        mimeType: file.mimetype,
                        originalName: file.originalname,
                        ip: req.ip,
                        userId: req.user?.id
                    });
                    return cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`), false);
                }

                // Vérifier l'extension
                const ext = path.extname(file.originalname).toLowerCase();
                if (!this.allowedExtensions.includes(ext)) {
                    securityLogger.warn('Invalid file extension upload attempt', {
                        extension: ext,
                        originalName: file.originalname,
                        ip: req.ip,
                        userId: req.user?.id
                    });
                    return cb(new Error(`Extension non autorisée: ${ext}`), false);
                }

                // Vérifier la taille du nom de fichier
                if (file.originalname.length > 255) {
                    securityLogger.warn('Filename too long upload attempt', {
                        originalName: file.originalname,
                        length: file.originalname.length,
                        ip: req.ip,
                        userId: req.user?.id
                    });
                    return cb(new Error('Nom de fichier trop long'), false);
                }

                cb(null, true);
            } catch (error) {
                securityLogger.error('File filter error', { error: error.message });
                cb(error, false);
            }
        };
    }

    // Créer une configuration multer sécurisée
    createSecureUpload(uploadType = 'image', maxFiles = 1) {
        const maxSize = this.maxSizes[uploadType] || this.maxSizes.default;
        
        return multer({
            storage: this.createSecureStorage(uploadType),
            fileFilter: this.createFileFilter(uploadType),
            limits: {
                fileSize: maxSize,
                files: maxFiles,
                fields: 10,
                fieldSize: 1024 * 1024, // 1MB per field
                parts: 15
            }
        });
    }

    // Middleware de post-traitement sécurisé
    postProcessMiddleware = async (req, res, next) => {
        if (!req.files && !req.file) {
            return next();
        }

        try {
            const files = req.files ? Object.values(req.files).flat() : [req.file];
            
            for (const file of files) {
                if (file && file.path) {
                    // Lire le fichier pour vérification
                    const buffer = fs.readFileSync(file.path);
                    
                    // Vérifier le type MIME réel
                    const realMimeType = await this.verifyFileType(buffer);
                    if (!realMimeType || !this.allowedImageTypes.includes(realMimeType)) {
                        fs.unlinkSync(file.path); // Supprimer le fichier
                        securityLogger.error('File type mismatch detected', {
                            declaredType: file.mimetype,
                            realType: realMimeType,
                            filename: file.filename,
                            ip: req.ip,
                            userId: req.user?.id
                        });
                        return res.status(400).json({ 
                            error: 'Type de fichier invalide détecté' 
                        });
                    }

                    // Scanner pour contenu malveillant
                    if (this.scanForMaliciousContent(buffer, file.originalname)) {
                        fs.unlinkSync(file.path); // Supprimer le fichier
                        return res.status(400).json({ 
                            error: 'Contenu de fichier suspect détecté' 
                        });
                    }

                    // Mettre à jour les métadonnées du fichier
                    file.secureUrl = `/uploads/${path.relative(this.uploadDir, file.path)}`;
                    file.verified = true;
                    
                    securityLogger.info('File upload completed successfully', {
                        filename: file.filename,
                        size: file.size,
                        secureUrl: file.secureUrl,
                        ip: req.ip,
                        userId: req.user?.id
                    });
                }
            }

            next();
        } catch (error) {
            securityLogger.error('Post-process upload error', { error: error.message });
            res.status(500).json({ error: 'Erreur de traitement du fichier' });
        }
    };

    // Middleware de gestion d'erreurs d'upload
    uploadErrorHandler = (error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            let message = 'Erreur d\'upload';
            
            switch (error.code) {
                case 'LIMIT_FILE_SIZE':
                    message = 'Fichier trop volumineux';
                    break;
                case 'LIMIT_FILE_COUNT':
                    message = 'Trop de fichiers';
                    break;
                case 'LIMIT_UNEXPECTED_FILE':
                    message = 'Champ de fichier inattendu';
                    break;
            }

            securityLogger.warn('Upload error', {
                error: error.code,
                message: error.message,
                ip: req.ip,
                userId: req.user?.id
            });

            return res.status(400).json({ error: message });
        }

        if (error.message) {
            securityLogger.warn('Upload validation error', {
                error: error.message,
                ip: req.ip,
                userId: req.user?.id
            });
            return res.status(400).json({ error: error.message });
        }

        next(error);
    };

    // Nettoyer les fichiers temporaires anciens
    cleanOldTempFiles(maxAgeHours = 24) {
        try {
            const maxAge = maxAgeHours * 60 * 60 * 1000; // en milliseconds
            const now = Date.now();

            const cleanDir = (dirPath) => {
                if (!fs.existsSync(dirPath)) return 0;
                
                let cleaned = 0;
                const items = fs.readdirSync(dirPath);
                
                for (const item of items) {
                    const itemPath = path.join(dirPath, item);
                    const stats = fs.statSync(itemPath);
                    
                    if (stats.isFile() && (now - stats.mtime.getTime()) > maxAge) {
                        fs.unlinkSync(itemPath);
                        cleaned++;
                    }
                }
                
                return cleaned;
            };

            const tempCleaned = cleanDir(this.tempDir);
            
            if (tempCleaned > 0) {
                securityLogger.info('Temporary files cleaned', { count: tempCleaned });
            }
            
            return tempCleaned;
        } catch (error) {
            securityLogger.error('Error cleaning temp files', { error: error.message });
            return 0;
        }
    }

    // Obtenir les statistiques d'upload
    getUploadStats() {
        try {
            const getDirectorySize = (dirPath) => {
                if (!fs.existsSync(dirPath)) return { files: 0, size: 0 };
                
                let totalSize = 0;
                let fileCount = 0;
                
                const scanDir = (dir) => {
                    const items = fs.readdirSync(dir);
                    for (const item of items) {
                        const itemPath = path.join(dir, item);
                        const stats = fs.statSync(itemPath);
                        if (stats.isDirectory()) {
                            scanDir(itemPath);
                        } else {
                            totalSize += stats.size;
                            fileCount++;
                        }
                    }
                };
                
                scanDir(dirPath);
                return { files: fileCount, size: totalSize };
            };

            const uploadStats = getDirectorySize(this.uploadDir);
            const tempStats = getDirectorySize(this.tempDir);

            return {
                uploads: uploadStats,
                temp: tempStats,
                allowedTypes: this.allowedImageTypes,
                maxSizes: this.maxSizes
            };
        } catch (error) {
            securityLogger.error('Error getting upload stats', { error: error.message });
            return null;
        }
    }
}

// Créer instance globale
const secureUpload = new SecureFileUpload();

// Nettoyer les fichiers temporaires toutes les 6 heures
setInterval(() => {
    secureUpload.cleanOldTempFiles();
}, 6 * 60 * 60 * 1000);

module.exports = secureUpload;