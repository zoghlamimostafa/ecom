const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log('🔍 DIAGNOSTIC AVANCÉ - PROBLÈME REACT');
console.log('='.repeat(50));

async function testReactStart() {
    const clientPath = path.join(__dirname, 'Client');
    
    console.log(`📁 Répertoire Client: ${clientPath}`);
    console.log(`📁 Répertoire actuel: ${process.cwd()}`);
    
    // Vérifier l'existence des fichiers essentiels
    console.log('\n📋 VÉRIFICATION DES FICHIERS:');
    const essentialFiles = [
        'package.json',
        'src/index.js',
        'src/App.js',
        'public/index.html',
        'node_modules/react-scripts/bin/react-scripts.js'
    ];
    
    for (const file of essentialFiles) {
        const filePath = path.join(clientPath, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} MANQUANT`);
        }
    }
    
    // Test direct de react-scripts
    console.log('\n🧪 TEST REACT-SCRIPTS:');
    
    return new Promise((resolve) => {
        const reactScriptsPath = path.join(clientPath, 'node_modules', '.bin', 'react-scripts.cmd');
        const reactScriptsPathJs = path.join(clientPath, 'node_modules', 'react-scripts', 'bin', 'react-scripts.js');
        
        console.log(`📍 Chemin react-scripts.cmd: ${reactScriptsPath}`);
        console.log(`📍 Existe: ${fs.existsSync(reactScriptsPath)}`);
        
        console.log(`📍 Chemin react-scripts.js: ${reactScriptsPathJs}`);
        console.log(`📍 Existe: ${fs.existsSync(reactScriptsPathJs)}`);
        
        // Test avec chemin complet
        if (fs.existsSync(reactScriptsPathJs)) {
            console.log('\n🔧 Test avec node + chemin complet...');
            
            const child = spawn('node', [reactScriptsPathJs, 'start'], {
                cwd: clientPath,
                stdio: ['inherit', 'pipe', 'pipe'],
                env: { ...process.env, NODE_ENV: 'development' }
            });
            
            let stdout = '';
            let stderr = '';
            
            child.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`STDOUT: ${data}`);
            });
            
            child.stderr.on('data', (data) => {
                stderr += data.toString();
                console.log(`STDERR: ${data}`);
            });
            
            child.on('close', (code) => {
                console.log(`\n📊 Code de sortie: ${code}`);
                console.log(`📝 STDOUT: ${stdout}`);
                console.log(`📝 STDERR: ${stderr}`);
                resolve({ code, stdout, stderr });
            });
            
            child.on('error', (error) => {
                console.log(`❌ Erreur spawn: ${error.message}`);
                resolve({ error: error.message });
            });
            
            // Timeout après 10 secondes
            setTimeout(() => {
                child.kill();
                console.log('⏰ Timeout - processus arrêté');
                resolve({ timeout: true });
            }, 10000);
            
        } else {
            console.log('❌ react-scripts.js introuvable');
            resolve({ notFound: true });
        }
    });
}

// Test du problème de PWD
async function testPWDIssue() {
    console.log('\n🔍 TEST PROBLÈME PWD:');
    
    const clientPath = path.join(__dirname, 'Client');
    
    return new Promise((resolve) => {
        exec('pwd', { cwd: clientPath }, (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Erreur pwd: ${error.message}`);
            } else {
                console.log(`📍 PWD dans Client: ${stdout.trim()}`);
            }
            
            // Test npm start avec CWD correct
            exec('npm start', { 
                cwd: clientPath,
                timeout: 5000
            }, (error, stdout, stderr) => {
                console.log('\n📊 RÉSULTAT NPM START:');
                console.log(`Code: ${error ? error.code : 'success'}`);
                console.log(`STDOUT: ${stdout}`);
                console.log(`STDERR: ${stderr}`);
                resolve({ error, stdout, stderr });
            });
        });
    });
}

// Exécution des tests
async function runTests() {
    await testReactStart();
    await testPWDIssue();
    
    console.log('\n🔧 SOLUTIONS PROPOSÉES:');
    console.log('1. Utiliser le chemin complet vers react-scripts');
    console.log('2. Réinstaller les node_modules');
    console.log('3. Vérifier les variables d\'environnement');
    console.log('4. Utiliser un script batch pour le démarrage');
}

runTests().catch(console.error);