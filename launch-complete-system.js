// Système de démarrage complet et automatique
const { spawn, exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class SannyLauncher {
    constructor() {
        this.services = [];
        this.baseDir = __dirname; // Utiliser le répertoire du script
        this.config = {
            backend: {
                name: 'Backend',
                dir: 'backend',  // Le backend est dans le sous-répertoire backend
                command: 'node',
                args: ['index-robust.js'],
                port: 4000,
                healthUrl: 'http://localhost:4000/api/health',
                startupTime: 8000,
                color: '🖥️'
            },
            client: {
                name: 'Client', 
                dir: '.',  // Pas de client React séparé dans cette structure
                command: 'node',
                args: ['index-robust.js'], // Le backend sert aussi le client
                port: 3000,
                healthUrl: 'http://localhost:3000',
                startupTime: 20000,
                color: '🛒',
                skip: true // Skip pour l'instant car pas de client séparé
            },
            admin: {
                name: 'Admin',
                dir: '.',  // Pas d'admin séparé dans cette structure 
                command: 'node',
                args: ['index-robust.js'], // Le backend sert tout
                port: 3001,
                healthUrl: 'http://localhost:3001', 
                startupTime: 25000,
                color: '⚙️',
                skip: true // Skip pour l'instant car pas d'admin séparé
            }
        };
        
        this.status = {
            backend: { started: false, healthy: false, error: null },
            client: { started: false, healthy: false, error: null },
            admin: { started: false, healthy: false, error: null }
        };
    }

    log(service, level, message, data = null) {
        const timestamp = new Date().toISOString().slice(11, 19);
        const config = this.config[service];
        const symbols = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔍'
        };
        
        const prefix = config ? `${config.color} ${config.name}` : service;
        console.log(`${symbols[level]} [${timestamp}] ${prefix}: ${message}`);
        if (data) console.log('   ', JSON.stringify(data, null, 2));
    }

    async checkPort(port) {
        try {
            const response = await axios.get(`http://localhost:${port}`, { timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async killProcessOnPort(port) {
        return new Promise((resolve) => {
            if (process.platform === 'win32') {
                exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
                    if (!err && stdout) {
                        const lines = stdout.trim().split('\n');
                        const pids = lines.map(line => {
                            const parts = line.trim().split(/\s+/);
                            return parts[parts.length - 1];
                        }).filter(pid => pid && pid !== '0');
                        
                        if (pids.length > 0) {
                            exec(`taskkill /F /PID ${pids.join(' /PID ')}`, (killErr) => {
                                if (!killErr) {
                                    console.log(`🔪 Processus arrêtés sur le port ${port}`);
                                }
                                setTimeout(resolve, 2000);
                            });
                        } else {
                            resolve();
                        }
                    } else {
                        resolve();
                    }
                });
            } else {
                exec(`lsof -ti:${port}`, (err, stdout) => {
                    if (!err && stdout) {
                        const pids = stdout.trim().split('\n');
                        exec(`kill -9 ${pids.join(' ')}`, () => {
                            setTimeout(resolve, 2000);
                        });
                    } else {
                        resolve();
                    }
                });
            }
        });
    }

    async startService(serviceKey) {
        const config = this.config[serviceKey];
        
        // Vérifier si le service doit être skippé
        if (config.skip) {
            this.log(serviceKey, 'info', 'Service non configuré, ignoré');
            this.status[serviceKey].started = true; // Marquer comme démarré pour éviter les erreurs
            return true;
        }
        
        this.log(serviceKey, 'info', 'Démarrage...');

        // Vérifier si le port est libre
        const portBusy = await this.checkPort(config.port);
        if (portBusy) {
            this.log(serviceKey, 'warning', `Port ${config.port} occupé, libération en cours...`);
            await this.killProcessOnPort(config.port);
        }

        const servicePath = path.join(this.baseDir, config.dir);
        
        if (!fs.existsSync(servicePath)) {
            this.log(serviceKey, 'error', `Répertoire introuvable: ${servicePath}`);
            this.status[serviceKey].error = 'Directory not found';
            return false;
        }

        const env = { 
            ...process.env, 
            ...(config.env || {})
        };

        const childProcess = spawn(config.command, config.args, {
            cwd: servicePath,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: process.platform === 'win32',
            env
        });

        let startupOutput = '';
        
        childProcess.stdout.on('data', (data) => {
            const output = data.toString();
            startupOutput += output;
            
            // Détecter le démarrage réussi
            const startupIndicators = {
                backend: ['SERVEUR BACKEND DÉMARRÉ AVEC SUCCÈS', 'Server is running'],
                client: ['webpack compiled', 'compiled successfully'],
                admin: ['webpack compiled', 'compiled successfully']
            };
            
            const indicators = startupIndicators[serviceKey] || [];
            if (indicators.some(indicator => output.includes(indicator))) {
                if (!this.status[serviceKey].started) {
                    this.status[serviceKey].started = true;
                    this.log(serviceKey, 'success', `Démarré sur le port ${config.port}`);
                }
            }
        });

        childProcess.stderr.on('data', (data) => {
            const error = data.toString();
            if (!error.includes('Warning') && !error.includes('deprecated')) {
                this.log(serviceKey, 'error', `Erreur: ${error.trim()}`);
            }
        });

        childProcess.on('exit', (code) => {
            if (code !== 0) {
                this.log(serviceKey, 'error', `Processus terminé avec le code ${code}`);
                this.status[serviceKey].error = `Exit code ${code}`;
            }
        });

        this.services.push({
            name: serviceKey,
            process: childProcess,
            config
        });

        // Attendre le démarrage
        await new Promise(resolve => setTimeout(resolve, config.startupTime));

        // Vérifier la santé
        try {
            const response = await axios.get(config.healthUrl, { 
                timeout: 5000,
                validateStatus: () => true 
            });
            
            if (response.status === 200) {
                this.status[serviceKey].healthy = true;
                this.log(serviceKey, 'success', 'Service en bonne santé');
                return true;
            }
        } catch (error) {
            this.log(serviceKey, 'warning', 'Health check échoué mais service potentiellement actif');
        }

        return this.status[serviceKey].started;
    }

    async startAll() {
        console.log('🚀 DÉMARRAGE COMPLET - APPLICATION E-COMMERCE SANNY');
        console.log('=' .repeat(60));
        console.log('⏳ Temps estimé: ~60 secondes');
        console.log('');

        // Démarrer les services dans l'ordre
        const order = ['backend', 'client', 'admin'];
        
        for (const service of order) {
            const success = await this.startService(service);
            if (!success) {
                this.log(service, 'error', 'Échec du démarrage');
            }
            console.log(''); // Ligne vide pour la lisibilité
        }

        // Rapport final
        this.generateReport();
        this.setupCleanup();
    }

    generateReport() {
        console.log('📊 RAPPORT DE DÉMARRAGE:');
        console.log('=' .repeat(40));
        
        let successCount = 0;
        let totalServices = 0;
        
        Object.entries(this.status).forEach(([service, status]) => {
            const config = this.config[service];
            
            // Ignorer les services skippés dans le rapport
            if (config.skip) {
                return;
            }
            
            totalServices++;
            const statusIcon = status.started ? '✅' : '❌';
            const healthIcon = status.healthy ? '💚' : '🟡';
            
            console.log(`${config.color} ${config.name}:`);
            console.log(`   Status: ${statusIcon} ${status.started ? 'Démarré' : 'Échec'}`);
            console.log(`   Health: ${healthIcon} ${status.healthy ? 'Sain' : 'Non testé'}`);
            console.log(`   URL: http://localhost:${config.port}`);
            
            if (status.error) {
                console.log(`   Erreur: ${status.error}`);
            }
            
            if (status.started) successCount++;
            console.log('');
        });

        console.log(`📈 Résultat: ${successCount}/${totalServices} services démarrés`);
        
        if (successCount === totalServices && totalServices > 0) {
            console.log('🎉 TOUS LES SERVICES SONT ACTIFS !');
            console.log('');
        } else if (successCount > 0) {
            console.log('✅ Certains services sont actifs');
            console.log('');
            console.log('🌐 Accès aux interfaces:');
            console.log('   🖥️  API Backend: http://localhost:4000/api/');
            console.log('   🛒 Client Shop: http://localhost:3000');
            console.log('   ⚙️  Admin Panel: http://localhost:3001');
        } else {
            console.log('⚠️  Certains services ont échoué. Consultez les logs ci-dessus.');
        }
        
        console.log('');
        console.log('⚠️  Appuyez sur Ctrl+C pour arrêter tous les services');
    }

    setupCleanup() {
        const cleanup = () => {
            console.log('\n🛑 Arrêt de tous les services...');
            this.services.forEach(({ name, process }) => {
                this.log(name, 'info', 'Arrêt en cours...');
                try {
                    if (process.platform === 'win32') {
                        exec(`taskkill /F /T /PID ${process.pid}`);
                    } else {
                        process.kill('SIGTERM');
                    }
                } catch (error) {
                    console.error(`Erreur arrêt ${name}:`, error.message);
                }
            });
            
            setTimeout(() => {
                console.log('✅ Tous les services arrêtés');
                process.exit(0);
            }, 3000);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('exit', cleanup);
    }
}

// Lancer le système complet
const launcher = new SannyLauncher();
launcher.startAll().catch(error => {
    console.error('❌ Erreur critique:', error);
    process.exit(1);
});