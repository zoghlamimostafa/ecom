// Diagnostic complet de l'application e-commerce Sanny
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class SannyDiagnostic {
    constructor() {
        this.baseDir = process.cwd();
        this.results = {
            structure: {},
            configs: {},
            dependencies: {},
            services: {},
            issues: []
        };
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString().slice(11, 19);
        const symbols = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔍'
        };
        
        console.log(`${symbols[level] || '📋'} [${timestamp}] ${message}`);
        if (data) console.log('   ', JSON.stringify(data, null, 2));
    }

    checkDirectoryStructure() {
        this.log('info', 'Vérification de la structure des répertoires...');
        
        const expectedDirs = {
            'backend': 'Serveur backend Node.js',
            'Client': 'Interface client React',
            'admin-app': 'Interface admin React'
        };

        for (const [dir, description] of Object.entries(expectedDirs)) {
            const dirPath = path.join(this.baseDir, dir);
            const exists = fs.existsSync(dirPath);
            
            this.results.structure[dir] = {
                exists,
                path: dirPath,
                description
            };
            
            if (exists) {
                this.log('success', `${description}: Trouvé`);
                
                // Vérifier les fichiers clés
                if (dir === 'backend') {
                    const keyFiles = ['index.js', 'package.json', 'config/config.js'];
                    keyFiles.forEach(file => {
                        const filePath = path.join(dirPath, file);
                        if (fs.existsSync(filePath)) {
                            this.log('success', `  ${file}: ✓`);
                        } else {
                            this.log('error', `  ${file}: Manquant`);
                            this.results.issues.push(`Backend: ${file} manquant`);
                        }
                    });
                } else {
                    const packagePath = path.join(dirPath, 'package.json');
                    if (fs.existsSync(packagePath)) {
                        this.log('success', `  package.json: ✓`);
                    } else {
                        this.log('error', `  package.json: Manquant`);
                        this.results.issues.push(`${dir}: package.json manquant`);
                    }
                }
            } else {
                this.log('error', `${description}: Introuvable`);
                this.results.issues.push(`Répertoire ${dir} introuvable`);
            }
        }
    }

    checkConfigurations() {
        this.log('info', 'Vérification des configurations...');
        
        // Backend config
        const backendConfigPath = path.join(this.baseDir, 'backend', 'config', 'config.js');
        if (fs.existsSync(backendConfigPath)) {
            this.log('success', 'Configuration backend trouvée');
            try {
                const config = require(backendConfigPath);
                this.results.configs.backend = { status: 'found', hasJWT: !!config.JWT_SECRET };
                this.log('success', `JWT_SECRET configuré: ${!!config.JWT_SECRET}`);
            } catch (error) {
                this.log('error', 'Erreur lecture config backend', error.message);
                this.results.issues.push('Configuration backend corrompue');
            }
        } else {
            this.log('error', 'Configuration backend manquante');
            this.results.issues.push('config/config.js manquant');
        }

        // Client env
        const clientEnvPath = path.join(this.baseDir, 'Client', '.env');
        this.results.configs.client = { 
            hasEnv: fs.existsSync(clientEnvPath),
            path: clientEnvPath 
        };
        this.log(fs.existsSync(clientEnvPath) ? 'success' : 'warning', 
                `Client .env: ${fs.existsSync(clientEnvPath) ? 'Trouvé' : 'Manquant (optionnel)'}`);

        // Admin env
        const adminEnvPath = path.join(this.baseDir, 'admin-app', '.env');
        this.results.configs.admin = { 
            hasEnv: fs.existsSync(adminEnvPath),
            path: adminEnvPath 
        };
        this.log(fs.existsSync(adminEnvPath) ? 'success' : 'warning', 
                `Admin .env: ${fs.existsSync(adminEnvPath) ? 'Trouvé' : 'Manquant (optionnel)'}`);
    }

    checkDependencies() {
        this.log('info', 'Vérification des dépendances...');
        
        ['backend', 'Client', 'admin-app'].forEach(dir => {
            const nodeModulesPath = path.join(this.baseDir, dir, 'node_modules');
            const packagePath = path.join(this.baseDir, dir, 'package.json');
            
            const hasNodeModules = fs.existsSync(nodeModulesPath);
            const hasPackageJson = fs.existsSync(packagePath);
            
            this.results.dependencies[dir] = {
                hasNodeModules,
                hasPackageJson,
                needsInstall: hasPackageJson && !hasNodeModules
            };
            
            if (hasPackageJson) {
                if (hasNodeModules) {
                    this.log('success', `${dir}: Dépendances installées`);
                } else {
                    this.log('warning', `${dir}: npm install requis`);
                    this.results.issues.push(`${dir}: npm install nécessaire`);
                }
            } else {
                this.log('error', `${dir}: package.json manquant`);
            }
        });
    }

    async checkServices() {
        this.log('info', 'Vérification des services actifs...');
        
        const axios = require('axios').default;
        const services = [
            { name: 'Backend', url: 'http://localhost:4000/api/', port: 4000 },
            { name: 'Client', url: 'http://localhost:3000', port: 3000 },
            { name: 'Admin', url: 'http://localhost:3001', port: 3001 }
        ];

        for (const service of services) {
            try {
                const response = await axios.get(service.url, { timeout: 3000 });
                this.results.services[service.name.toLowerCase()] = {
                    status: 'active',
                    port: service.port,
                    responseCode: response.status
                };
                this.log('success', `${service.name}: Actif (${response.status})`);
            } catch (error) {
                this.results.services[service.name.toLowerCase()] = {
                    status: 'inactive',
                    port: service.port,
                    error: error.code || error.message
                };
                this.log('warning', `${service.name}: Inactif (${error.code || 'NO_RESPONSE'})`);
            }
        }
    }

    async checkDatabase() {
        this.log('info', 'Vérification de la base de données...');
        
        const dbPath = path.join(this.baseDir, 'backend', 'database.sqlite');
        const dbExists = fs.existsSync(dbPath);
        
        if (dbExists) {
            const stats = fs.statSync(dbPath);
            this.results.database = {
                exists: true,
                size: stats.size,
                path: dbPath,
                lastModified: stats.mtime
            };
            this.log('success', `Base SQLite: ${Math.round(stats.size/1024)}KB`);
        } else {
            this.results.database = { exists: false, path: dbPath };
            this.log('warning', 'Base SQLite: Pas trouvée (sera créée au démarrage)');
        }
    }

    generateReport() {
        this.log('info', 'Génération du rapport de diagnostic...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalIssues: this.results.issues.length,
                structureOK: Object.values(this.results.structure).every(s => s.exists),
                dependenciesOK: Object.values(this.results.dependencies).every(d => !d.needsInstall),
                servicesActive: Object.values(this.results.services).filter(s => s.status === 'active').length
            },
            issues: this.results.issues,
            recommendations: this.generateRecommendations(),
            fullResults: this.results
        };

        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Vérifier les installations manquantes
        Object.entries(this.results.dependencies).forEach(([dir, deps]) => {
            if (deps.needsInstall) {
                recommendations.push({
                    priority: 'high',
                    action: `Installer les dépendances ${dir}`,
                    command: `cd ${dir} && npm install`
                });
            }
        });

        // Vérifier les services inactifs
        Object.entries(this.results.services).forEach(([service, info]) => {
            if (info.status === 'inactive') {
                recommendations.push({
                    priority: 'medium',
                    action: `Démarrer le service ${service}`,
                    command: service === 'backend' ? 'cd backend && node index.js' : 
                            service === 'client' ? 'cd Client && npm start' :
                            'cd admin-app && npm start'
                });
            }
        });

        // Vérifier la config manquante
        if (this.results.issues.some(i => i.includes('config.js'))) {
            recommendations.push({
                priority: 'high',
                action: 'Créer la configuration backend',
                command: 'Créer config/config.js avec JWT_SECRET'
            });
        }

        return recommendations;
    }

    async run() {
        console.log('🚀 DIAGNOSTIC COMPLET - APPLICATION E-COMMERCE SANNY');
        console.log('=' .repeat(60));
        
        this.checkDirectoryStructure();
        console.log('');
        
        this.checkConfigurations();
        console.log('');
        
        this.checkDependencies();
        console.log('');
        
        await this.checkServices();
        console.log('');
        
        await this.checkDatabase();
        console.log('');
        
        const report = this.generateReport();
        
        console.log('📊 RÉSUMÉ DU DIAGNOSTIC:');
        console.log(`   Structure: ${report.summary.structureOK ? '✅' : '❌'}`);
        console.log(`   Dépendances: ${report.summary.dependenciesOK ? '✅' : '❌'}`);
        console.log(`   Services actifs: ${report.summary.servicesActive}/3`);
        console.log(`   Issues trouvées: ${report.summary.totalIssues}`);
        
        if (report.recommendations.length > 0) {
            console.log('\n🔧 ACTIONS RECOMMANDÉES:');
            report.recommendations.forEach((rec, i) => {
                console.log(`   ${i+1}. [${rec.priority.toUpperCase()}] ${rec.action}`);
                console.log(`      → ${rec.command}`);
            });
        }
        
        if (report.summary.totalIssues === 0) {
            console.log('\n🎉 AUCUN PROBLÈME DÉTECTÉ - APPLICATION PRÊTE !');
        } else {
            console.log(`\n⚠️  ${report.summary.totalIssues} PROBLÈME(S) À CORRIGER`);
        }
        
        // Sauvegarder le rapport
        const reportPath = path.join(this.baseDir, 'diagnostic-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Rapport complet sauvé: ${reportPath}`);
        
        return report;
    }
}

// Exécuter le diagnostic
const diagnostic = new SannyDiagnostic();
diagnostic.run().catch(error => {
    console.error('❌ Erreur durant le diagnostic:', error);
    process.exit(1);
});