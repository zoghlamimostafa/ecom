#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

console.log('\n🔍 DIAGNOSTIC COMPLET SANNY STORE');
console.log('='.repeat(50));

class SannyDiagnostic {
    constructor() {
        this.baseDir = process.cwd();
        this.issues = [];
        this.fixes = [];
        this.projects = [
            { name: 'Client', path: 'Client', type: 'react' },
            { name: 'Backend', path: 'backend', type: 'node' },
            { name: 'Admin', path: 'admin-app', type: 'react' }
        ];
    }

    async runDiagnostic() {
        console.log('\n📊 1. VÉRIFICATION DE L\'ENVIRONNEMENT');
        await this.checkEnvironment();

        console.log('\n📁 2. VÉRIFICATION DES STRUCTURES');
        await this.checkProjectStructures();

        console.log('\n📦 3. VÉRIFICATION DES PACKAGES');
        await this.checkPackages();

        console.log('\n🔧 4. VÉRIFICATION DES SCRIPTS');
        await this.checkScripts();

        console.log('\n🌐 5. VÉRIFICATION DES PORTS');
        await this.checkPorts();

        console.log('\n📋 RÉSUMÉ DU DIAGNOSTIC');
        this.displaySummary();

        console.log('\n🔨 CORRECTIONS AUTOMATIQUES');
        await this.applyFixes();
    }

    async checkEnvironment() {
        try {
            const { stdout: nodeVersion } = await execAsync('node --version');
            const { stdout: npmVersion } = await execAsync('npm --version');
            
            console.log(`✅ Node.js: ${nodeVersion.trim()}`);
            console.log(`✅ npm: ${npmVersion.trim()}`);

            // Vérifier si les versions sont compatibles
            const nodeV = parseFloat(nodeVersion.replace('v', ''));
            if (nodeV < 16) {
                this.issues.push('⚠️  Node.js version trop ancienne (minimum v16)');
            }
        } catch (error) {
            this.issues.push('❌ Node.js ou npm non installé');
        }
    }

    async checkProjectStructures() {
        for (const project of this.projects) {
            const projectPath = path.join(this.baseDir, project.path);
            
            if (!fs.existsSync(projectPath)) {
                this.issues.push(`❌ Dossier ${project.name} manquant: ${project.path}`);
                continue;
            }

            console.log(`✅ Dossier ${project.name} trouvé`);

            // Vérifier package.json
            const packagePath = path.join(projectPath, 'package.json');
            if (!fs.existsSync(packagePath)) {
                this.issues.push(`❌ package.json manquant dans ${project.name}`);
                continue;
            }

            // Vérifier node_modules
            const nodeModulesPath = path.join(projectPath, 'node_modules');
            if (!fs.existsSync(nodeModulesPath)) {
                this.issues.push(`⚠️  node_modules manquant dans ${project.name}`);
                this.fixes.push(`npm install dans ${project.path}`);
            }

            // Vérifications spécifiques React
            if (project.type === 'react') {
                const srcPath = path.join(projectPath, 'src');
                const publicPath = path.join(projectPath, 'public');
                
                if (!fs.existsSync(srcPath)) {
                    this.issues.push(`❌ Dossier src manquant dans ${project.name}`);
                }
                if (!fs.existsSync(publicPath)) {
                    this.issues.push(`❌ Dossier public manquant dans ${project.name}`);
                }
            }

            // Vérifications spécifiques Node.js
            if (project.type === 'node') {
                const indexPath = path.join(projectPath, 'index.js');
                const serverPath = path.join(projectPath, 'server.js');
                
                if (!fs.existsSync(indexPath) && !fs.existsSync(serverPath)) {
                    this.issues.push(`❌ Fichier principal manquant dans ${project.name}`);
                }
            }
        }
    }

    async checkPackages() {
        for (const project of this.projects) {
            const projectPath = path.join(this.baseDir, project.path);
            const packagePath = path.join(projectPath, 'package.json');
            
            if (!fs.existsSync(packagePath)) continue;

            try {
                const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                console.log(`\n📦 ${project.name}:`);
                
                // Vérifier les scripts essentiels
                if (!packageData.scripts || !packageData.scripts.start) {
                    this.issues.push(`❌ Script 'start' manquant dans ${project.name}`);
                    this.fixes.push(`Ajouter script start dans ${project.path}/package.json`);
                } else {
                    console.log(`  ✅ Script start: ${packageData.scripts.start}`);
                }

                // Vérifications spécifiques React
                if (project.type === 'react') {
                    const reactVersion = packageData.dependencies?.react;
                    const reactScriptsVersion = packageData.dependencies?.['react-scripts'];
                    
                    if (!reactVersion) {
                        this.issues.push(`❌ React manquant dans ${project.name}`);
                    } else {
                        console.log(`  ✅ React: ${reactVersion}`);
                    }
                    
                    if (!reactScriptsVersion) {
                        this.issues.push(`❌ react-scripts manquant dans ${project.name}`);
                        this.fixes.push(`npm install react-scripts dans ${project.path}`);
                    } else {
                        console.log(`  ✅ react-scripts: ${reactScriptsVersion}`);
                    }

                    // Vérifier les peer dependencies
                    await this.checkReactPeerDeps(projectPath, packageData);
                }

                // Vérifications spécifiques Node.js
                if (project.type === 'node') {
                    const expressVersion = packageData.dependencies?.express;
                    if (!expressVersion) {
                        this.issues.push(`❌ Express manquant dans ${project.name}`);
                    } else {
                        console.log(`  ✅ Express: ${expressVersion}`);
                    }
                }

            } catch (error) {
                this.issues.push(`❌ Erreur lecture package.json dans ${project.name}: ${error.message}`);
            }
        }
    }

    async checkReactPeerDeps(projectPath, packageData) {
        const reactVersion = packageData.dependencies?.react;
        if (!reactVersion) return;

        // Problèmes connus de peer dependencies
        const problematicDeps = [
            'react-magnifier',
            'react-image-magnify'
        ];

        for (const dep of problematicDeps) {
            if (packageData.dependencies?.[dep]) {
                this.issues.push(`⚠️  ${dep} peut causer des conflits de peer dependencies`);
                this.fixes.push(`Remplacer ${dep} par une alternative compatible`);
            }
        }
    }

    async checkScripts() {
        console.log('\n🔧 Vérification des scripts de démarrage...');
        
        for (const project of this.projects) {
            const projectPath = path.join(this.baseDir, project.path);
            
            try {
                process.chdir(projectPath);
                
                if (project.type === 'react') {
                    // Test react-scripts
                    try {
                        await execAsync('npx react-scripts --version', { timeout: 5000 });
                        console.log(`✅ react-scripts fonctionnel dans ${project.name}`);
                    } catch (error) {
                        this.issues.push(`❌ react-scripts non fonctionnel dans ${project.name}`);
                        this.fixes.push(`Réinstaller react-scripts dans ${project.path}`);
                    }
                }

                if (project.type === 'node') {
                    // Test Node.js
                    const mainFile = fs.existsSync('index.js') ? 'index.js' : 'server.js';
                    if (fs.existsSync(mainFile)) {
                        console.log(`✅ Fichier principal ${mainFile} trouvé dans ${project.name}`);
                    }
                }

            } catch (error) {
                this.issues.push(`❌ Erreur vérification scripts ${project.name}: ${error.message}`);
            } finally {
                process.chdir(this.baseDir);
            }
        }
    }

    async checkPorts() {
        const ports = [3000, 3001, 5000, 8000, 8080];
        
        for (const port of ports) {
            try {
                await execAsync(`netstat -an | findstr :${port}`, { timeout: 2000 });
                console.log(`⚠️  Port ${port} utilisé`);
            } catch (error) {
                console.log(`✅ Port ${port} libre`);
            }
        }
    }

    displaySummary() {
        console.log('\n' + '='.repeat(50));
        console.log(`📊 PROBLÈMES DÉTECTÉS: ${this.issues.length}`);
        
        if (this.issues.length > 0) {
            this.issues.forEach(issue => console.log(issue));
        } else {
            console.log('✅ Aucun problème détecté !');
        }

        console.log(`\n🔨 CORRECTIONS PROPOSÉES: ${this.fixes.length}`);
        if (this.fixes.length > 0) {
            this.fixes.forEach(fix => console.log(`🔧 ${fix}`));
        }
    }

    async applyFixes() {
        if (this.fixes.length === 0) {
            console.log('✅ Aucune correction nécessaire');
            return;
        }

        console.log('\nApplication des corrections automatiques...');

        for (const project of this.projects) {
            const projectPath = path.join(this.baseDir, project.path);
            
            if (!fs.existsSync(path.join(projectPath, 'node_modules'))) {
                console.log(`📦 Installation des dépendances pour ${project.name}...`);
                
                try {
                    process.chdir(projectPath);
                    
                    if (project.type === 'react') {
                        await execAsync('npm install --legacy-peer-deps', { timeout: 120000 });
                    } else {
                        await execAsync('npm install', { timeout: 120000 });
                    }
                    
                    console.log(`✅ Dépendances installées pour ${project.name}`);
                } catch (error) {
                    console.log(`❌ Erreur installation ${project.name}: ${error.message}`);
                } finally {
                    process.chdir(this.baseDir);
                }
            }
        }

        // Créer scripts de démarrage
        await this.createStartupScripts();
    }

    async createStartupScripts() {
        console.log('\n📝 Création des scripts de démarrage...');

        // Script de démarrage global
        const startupScript = `@echo off
echo Demarrage Sanny Store...
echo.

echo 1. Demarrage du Backend...
start "Backend" cmd /k "cd backend && npm start"
timeout /t 3

echo 2. Demarrage du Client...
start "Client" cmd /k "cd Client && npm start"
timeout /t 3

echo 3. Demarrage de l'Admin...
start "Admin" cmd /k "cd admin-app && npm start"

echo.
echo Tous les services sont en cours de demarrage...
echo Backend: http://localhost:5000
echo Client: http://localhost:3000  
echo Admin: http://localhost:3001
pause
`;

        fs.writeFileSync('DEMARRAGE_SANNY.bat', startupScript);
        console.log('✅ Script DEMARRAGE_SANNY.bat créé');

        // Script de test
        const testScript = `@echo off
echo Test des services Sanny Store...
echo.

echo Test du Backend...
curl -s http://localhost:5000/api/health > nul
if %ERRORLEVEL% == 0 (
    echo ✅ Backend: OK
) else (
    echo ❌ Backend: Hors ligne
)

echo Test du Client...
curl -s http://localhost:3000 > nul
if %ERRORLEVEL% == 0 (
    echo ✅ Client: OK
) else (
    echo ❌ Client: Hors ligne
)

echo Test de l'Admin...
curl -s http://localhost:3001 > nul
if %ERRORLEVEL% == 0 (
    echo ✅ Admin: OK
) else (
    echo ❌ Admin: Hors ligne
)

pause
`;

        fs.writeFileSync('TEST_SANNY.bat', testScript);
        console.log('✅ Script TEST_SANNY.bat créé');
    }
}

// Exécution du diagnostic
const diagnostic = new SannyDiagnostic();
diagnostic.runDiagnostic().catch(console.error);