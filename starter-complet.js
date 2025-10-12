#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

console.log('🔧 SOLUTION PROBLÈME DÉMARRAGE SANNY STORE');
console.log('='.repeat(50));

class SannyStarter {
    constructor() {
        this.baseDir = path.resolve('.');
        this.projects = [
            {
                name: 'Backend',
                path: path.join(this.baseDir, 'backend'),
                port: 5000,
                command: 'node',
                args: ['index.js'],
                env: { PORT: '5000' }
            },
            {
                name: 'Client',
                path: path.join(this.baseDir, 'Client'),
                port: 3000,
                command: 'npm',
                args: ['start'],
                env: { PORT: '3000', BROWSER: 'none' }
            },
            {
                name: 'Admin',
                path: path.join(this.baseDir, 'admin-app'),
                port: 3001,
                command: 'npm',
                args: ['start'],
                env: { PORT: '3001', BROWSER: 'none' }
            }
        ];
        this.processes = [];
    }

    async startAll() {
        console.log('🚀 Démarrage de tous les services...\n');

        for (const project of this.projects) {
            await this.startProject(project);
            // Attendre 3 secondes entre chaque démarrage
            await this.sleep(3000);
        }

        console.log('\n✅ Tous les services sont démarrés !');
        console.log('\n🌐 URLs:');
        console.log('   Backend: http://localhost:5000');
        console.log('   Client:  http://localhost:3000');
        console.log('   Admin:   http://localhost:3001');

        // Garder le processus vivant
        console.log('\n📝 Appuyez sur Ctrl+C pour arrêter tous les services');
        process.on('SIGINT', () => this.stopAll());
    }

    async startProject(project) {
        return new Promise((resolve, reject) => {
            console.log(`🔄 Démarrage ${project.name}...`);
            
            if (!fs.existsSync(project.path)) {
                console.log(`❌ Dossier ${project.path} introuvable`);
                resolve();
                return;
            }

            const packageJsonPath = path.join(project.path, 'package.json');
            if (!fs.existsSync(packageJsonPath)) {
                console.log(`❌ package.json introuvable dans ${project.name}`);
                resolve();
                return;
            }

            // Vérifier node_modules
            const nodeModulesPath = path.join(project.path, 'node_modules');
            if (!fs.existsSync(nodeModulesPath) && project.command === 'npm') {
                console.log(`📦 Installation des dépendances pour ${project.name}...`);
                // Installation synchrone des dépendances
                this.installDependencies(project.path, project.name === 'Client' || project.name === 'Admin');
            }

            const env = { ...process.env, ...project.env };
            
            const child = spawn(project.command, project.args, {
                cwd: project.path,
                stdio: ['inherit', 'pipe', 'pipe'],
                env: env,
                shell: true
            });

            this.processes.push({
                name: project.name,
                process: child,
                port: project.port
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                const output = data.toString();
                stdout += output;
                
                // Détecter les messages de succès
                if (output.includes('Server running') || 
                    output.includes('webpack compiled') ||
                    output.includes('Local:') ||
                    output.includes('development server')) {
                    console.log(`✅ ${project.name} démarré avec succès sur le port ${project.port}`);
                }
                
                // Afficher les erreurs importantes
                if (output.includes('Error') || output.includes('error')) {
                    console.log(`⚠️  ${project.name}: ${output.trim()}`);
                }
            });

            child.stderr.on('data', (data) => {
                const output = data.toString();
                stderr += output;
                
                // Ignorer les warnings de dépréciation
                if (!output.includes('DeprecationWarning') && 
                    !output.includes('ExperimentalWarning')) {
                    console.log(`⚠️  ${project.name} stderr: ${output.trim()}`);
                }
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    console.log(`❌ ${project.name} s'est arrêté avec le code ${code}`);
                } else {
                    console.log(`✅ ${project.name} s'est arrêté proprement`);
                }
            });

            child.on('error', (error) => {
                console.log(`❌ Erreur démarrage ${project.name}: ${error.message}`);
            });

            // Résoudre après 2 secondes (temps pour que le processus démarre)
            setTimeout(() => {
                console.log(`📍 ${project.name} en cours de démarrage...`);
                resolve();
            }, 2000);
        });
    }

    installDependencies(projectPath, useLegacyPeerDeps = false) {
        const { execSync } = require('child_process');
        
        try {
            const installCommand = useLegacyPeerDeps 
                ? 'npm install --legacy-peer-deps'
                : 'npm install';
                
            console.log(`📦 Exécution: ${installCommand}`);
            execSync(installCommand, { 
                cwd: projectPath, 
                stdio: 'inherit',
                timeout: 300000 // 5 minutes timeout
            });
            console.log(`✅ Dépendances installées`);
        } catch (error) {
            console.log(`❌ Erreur installation: ${error.message}`);
        }
    }

    async stopAll() {
        console.log('\n🛑 Arrêt de tous les services...');
        
        for (const proc of this.processes) {
            try {
                proc.process.kill();
                console.log(`✅ ${proc.name} arrêté`);
            } catch (error) {
                console.log(`⚠️  Erreur arrêt ${proc.name}: ${error.message}`);
            }
        }
        
        process.exit(0);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async testPorts() {
        console.log('🔍 Test des ports...');
        
        for (const project of this.projects) {
            const isPortFree = await this.checkPort(project.port);
            console.log(`Port ${project.port} (${project.name}): ${isPortFree ? '✅ Libre' : '⚠️  Occupé'}`);
        }
    }

    checkPort(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.listen(port, () => {
                server.once('close', () => {
                    resolve(true); // Port libre
                });
                server.close();
            });
            
            server.on('error', () => {
                resolve(false); // Port occupé
            });
        });
    }
}

// Fonction principale
async function main() {
    const starter = new SannyStarter();
    
    // Test des ports d'abord
    await starter.testPorts();
    
    console.log('\n');
    
    // Démarrer tous les services
    await starter.startAll();
}

// Démarrage si exécuté directement
if (require.main === module) {
    main().catch(console.error);
}

module.exports = SannyStarter;