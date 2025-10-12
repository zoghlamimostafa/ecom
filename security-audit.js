// Audit de sécurité complet - Application Sanny E-commerce
const fs = require('fs');
const path = require('path');

class SecurityAuditor {
    constructor() {
        this.vulnerabilities = [];
        this.recommendations = [];
        this.backendPath = path.join(__dirname, 'backend');
    }

    log(level, message, details = null) {
        const symbols = { info: '🔍', warning: '⚠️', critical: '🚨', success: '✅' };
        console.log(`${symbols[level]} ${message}`);
        if (details) console.log(`   ${details}`);
    }

    addVulnerability(level, title, description, solution) {
        this.vulnerabilities.push({ level, title, description, solution });
        this.log(level === 'critical' ? 'critical' : 'warning', title, description);
    }

    addRecommendation(title, description) {
        this.recommendations.push({ title, description });
        this.log('info', title, description);
    }

    checkFileExists(filePath) {
        return fs.existsSync(path.join(this.backendPath, filePath));
    }

    readFileContent(filePath) {
        try {
            return fs.readFileSync(path.join(this.backendPath, filePath), 'utf8');
        } catch (error) {
            return null;
        }
    }

    auditAuthentication() {
        console.log('\n🔐 AUDIT AUTHENTIFICATION');
        console.log('=' .repeat(40));

        // Vérifier JWT configuration
        const envContent = this.readFileContent('.env');
        if (!envContent) {
            this.addVulnerability('critical', 'Configuration JWT manquante', 
                'Fichier .env non trouvé', 'Créer fichier .env avec JWT_SECRET');
        } else if (!envContent.includes('JWT_SECRET')) {
            this.addVulnerability('critical', 'JWT_SECRET non configuré', 
                'Secret JWT manquant dans .env', 'Ajouter JWT_SECRET sécurisé');
        } else {
            this.log('success', 'JWT_SECRET configuré');
        }

        // Vérifier middleware auth
        const authController = this.readFileContent('controller/userCtrl.js');
        if (authController) {
            if (!authController.includes('bcrypt')) {
                this.addVulnerability('critical', 'Mots de passe non hashés', 
                    'Utilisation possible de mots de passe en clair', 'Implémenter bcrypt');
            } else {
                this.log('success', 'Bcrypt détecté pour hashage mots de passe');
            }

            if (!authController.includes('jwt.sign')) {
                this.addVulnerability('warning', 'JWT non utilisé', 
                    'Authentification JWT non implémentée', 'Ajouter génération JWT');
            } else {
                this.log('success', 'JWT utilisé pour authentification');
            }
        }

        this.addRecommendation('Expiration JWT courte', 'Configurer expiration 15 minutes + refresh token');
        this.addRecommendation('Blacklist tokens', 'Implémenter révocation de tokens');
    }

    auditDatabaseSecurity() {
        console.log('\n💾 AUDIT BASE DE DONNÉES');
        console.log('=' .repeat(40));

        // Vérifier protection SQL Injection
        const models = this.readFileContent('models/index.js');
        if (models && models.includes('Sequelize')) {
            this.log('success', 'Sequelize ORM utilisé (protection SQL injection)');
        } else {
            this.addVulnerability('critical', 'Protection SQL injection', 
                'ORM non détecté', 'Utiliser Sequelize avec requêtes préparées');
        }

        // Vérifier chiffrement base
        const dbFile = path.join(this.backendPath, 'database.sqlite');
        if (fs.existsSync(dbFile)) {
            const stats = fs.statSync(dbFile);
            this.log('info', `Base SQLite: ${Math.round(stats.size / 1024)}KB`);
            this.addRecommendation('Chiffrement base', 'Considérer SQLCipher pour chiffrer la base');
        }

        this.addRecommendation('Sauvegarde chiffrée', 'Implémenter sauvegarde automatique chiffrée');
    }

    auditInputValidation() {
        console.log('\n🛡️ AUDIT VALIDATION ENTRÉES');
        console.log('=' .repeat(40));

        // Vérifier validation middleware
        const routes = ['routes/authRoute.js', 'routes/productRoute.js', 'routes/categoryRoute.js'];
        let validationFound = false;

        routes.forEach(route => {
            const content = this.readFileContent(route);
            if (content) {
                if (content.includes('validator') || content.includes('joi') || content.includes('express-validator')) {
                    validationFound = true;
                    this.log('success', `Validation détectée dans ${route}`);
                } else {
                    this.addVulnerability('warning', `Validation manquante: ${route}`, 
                        'Pas de validation d\'entrée détectée', 'Ajouter middleware validation');
                }
            }
        });

        if (!validationFound) {
            this.addVulnerability('critical', 'Aucune validation d\'entrée', 
                'XSS et injection possibles', 'Implémenter express-validator');
        }

        this.addRecommendation('Sanitisation XSS', 'Ajouter DOMPurify côté client');
        this.addRecommendation('Rate limiting', 'Limiter requêtes par IP');
    }

    auditFileUpload() {
        console.log('\n📁 AUDIT UPLOAD FICHIERS');
        console.log('=' .repeat(40));

        const uploadRoute = this.readFileContent('routes/uploadRoute.js');
        if (uploadRoute) {
            if (!uploadRoute.includes('multer')) {
                this.addVulnerability('warning', 'Upload non sécurisé', 
                    'Middleware upload manquant', 'Utiliser multer avec restrictions');
            } else {
                this.log('success', 'Multer utilisé pour uploads');
            }

            if (!uploadRoute.includes('fileFilter')) {
                this.addVulnerability('critical', 'Types fichiers non filtrés', 
                    'Risque upload fichiers malveillants', 'Ajouter fileFilter strict');
            }

            if (!uploadRoute.includes('limits')) {
                this.addVulnerability('warning', 'Taille fichiers illimitée', 
                    'Risque saturation serveur', 'Limiter taille uploads');
            }
        } else {
            this.addVulnerability('info', 'Route upload non trouvée', 
                'Vérifier si upload implémenté', 'Sécuriser route upload si existante');
        }

        this.addRecommendation('Scan antivirus', 'Intégrer ClamAV pour scan fichiers');
        this.addRecommendation('Stockage sécurisé', 'Stocker uploads hors webroot');
    }

    auditServerConfiguration() {
        console.log('\n⚙️ AUDIT CONFIGURATION SERVEUR');
        console.log('=' .repeat(40));

        const indexFile = this.readFileContent('index-robust.js');
        if (indexFile) {
            // Vérifier CORS
            if (!indexFile.includes('cors')) {
                this.addVulnerability('warning', 'CORS non configuré', 
                    'Risque requêtes cross-origin', 'Configurer CORS restrictif');
            } else {
                this.log('success', 'CORS configuré');
            }

            // Vérifier helmet
            if (!indexFile.includes('helmet')) {
                this.addVulnerability('critical', 'Headers sécurité manquants', 
                    'Vulnérabilité clickjacking, XSS', 'Ajouter helmet.js');
            }

            // Vérifier rate limiting
            if (!indexFile.includes('express-rate-limit')) {
                this.addVulnerability('warning', 'Rate limiting absent', 
                    'Risque attaque bruteforce/DDoS', 'Ajouter express-rate-limit');
            }

            // Vérifier HTTPS
            if (!indexFile.includes('https')) {
                this.addVulnerability('critical', 'HTTPS non configuré', 
                    'Communications non chiffrées', 'Configurer certificat SSL/TLS');
            }
        }

        this.addRecommendation('Variables sensibles', 'Vérifier aucune clé en dur dans le code');
        this.addRecommendation('Logs sécurité', 'Implémenter logging tentatives d\'intrusion');
    }

    auditDependencies() {
        console.log('\n📦 AUDIT DÉPENDANCES');
        console.log('=' .repeat(40));

        const packageJson = this.readFileContent('package.json');
        if (packageJson) {
            try {
                const pkg = JSON.parse(packageJson);
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                
                this.log('info', `${Object.keys(deps).length} dépendances trouvées`);
                
                // Vérifier dépendances obsolètes/vulnérables
                const criticalDeps = ['express', 'sequelize', 'jsonwebtoken', 'bcryptjs'];
                criticalDeps.forEach(dep => {
                    if (deps[dep]) {
                        this.log('success', `Dépendance critique: ${dep}@${deps[dep]}`);
                    }
                });

            } catch (error) {
                this.addVulnerability('warning', 'Package.json invalide', 
                    'Impossible de parser package.json', 'Vérifier syntaxe JSON');
            }
        }

        this.addRecommendation('Audit npm', 'Exécuter npm audit régulièrement');
        this.addRecommendation('Mise à jour sécurité', 'Automatiser updates sécurité');
    }

    generateSecurityReport() {
        console.log('\n📊 RAPPORT DE SÉCURITÉ COMPLET');
        console.log('=' .repeat(50));
        
        // Compter vulnérabilités par niveau
        const critical = this.vulnerabilities.filter(v => v.level === 'critical').length;
        const warning = this.vulnerabilities.filter(v => v.level === 'warning').length;
        const info = this.vulnerabilities.filter(v => v.level === 'info').length;
        
        console.log(`🚨 Critiques: ${critical}`);
        console.log(`⚠️  Moyennes: ${warning}`);
        console.log(`ℹ️  Info: ${info}`);
        console.log(`💡 Recommandations: ${this.recommendations.length}`);
        
        // Score de sécurité
        const maxScore = 100;
        const criticalPenalty = critical * 25;
        const warningPenalty = warning * 10;
        const infoPenalty = info * 2;
        
        const securityScore = Math.max(0, maxScore - criticalPenalty - warningPenalty - infoPenalty);
        
        console.log(`\n🎯 SCORE DE SÉCURITÉ: ${securityScore}/100`);
        
        if (securityScore >= 80) {
            console.log('✅ Sécurité: BONNE');
        } else if (securityScore >= 60) {
            console.log('⚠️  Sécurité: MOYENNE - Améliorations requises');
        } else {
            console.log('🚨 Sécurité: FAIBLE - Action immédiate requise');
        }

        // Priorités
        console.log('\n🎯 PRIORITÉS D\'ACTION:');
        if (critical > 0) {
            console.log('1. 🚨 URGENT: Corriger vulnérabilités critiques');
        }
        if (warning > 0) {
            console.log('2. ⚠️  IMPORTANT: Traiter avertissements');
        }
        console.log('3. 💡 AMÉLIORATION: Implémenter recommandations');
        
        return { 
            score: securityScore, 
            critical, 
            warning, 
            info, 
            vulnerabilities: this.vulnerabilities,
            recommendations: this.recommendations 
        };
    }

    async audit() {
        console.log('🔐 AUDIT DE SÉCURITÉ - APPLICATION SANNY E-COMMERCE');
        console.log('=' .repeat(60));
        console.log('⏳ Analyse en cours...\n');
        
        try {
            this.auditAuthentication();
            this.auditDatabaseSecurity();
            this.auditInputValidation();
            this.auditFileUpload();
            this.auditServerConfiguration();
            this.auditDependencies();
            
            const report = this.generateSecurityReport();
            
            // Sauvegarder rapport
            const reportPath = path.join(__dirname, 'security-audit-report.json');
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            
            console.log(`\n📄 Rapport détaillé sauvé: ${reportPath}`);
            console.log('\n🔧 Prochaine étape: Implémenter correctifs de sécurité');
            
            return report;
            
        } catch (error) {
            console.error('❌ Erreur durant audit:', error.message);
            return null;
        }
    }
}

// Exécution
if (require.main === module) {
    const auditor = new SecurityAuditor();
    auditor.audit().then(report => {
        if (report && report.score < 60) {
            console.log('\n⚠️  ATTENTION: Score de sécurité faible détecté');
            console.log('📋 Action immédiate recommandée');
        }
        process.exit(0);
    }).catch(error => {
        console.error('❌ Audit échoué:', error);
        process.exit(1);
    });
}

module.exports = SecurityAuditor;