// Script pour démarrer et tester tous les services
const { spawn, exec } = require('child_process');
const axios = require('axios');
const path = require('path');

const services = [
    {
        name: 'Backend',
        port: 4000,
        dir: 'backend',
        command: 'node',
        args: ['index.js'],
        healthCheck: 'http://localhost:4000/api/',
        expectedResponse: 'OK'
    },
    {
        name: 'Client',
        port: 3000,
        dir: 'Client',
        command: 'npm',
        args: ['start'],
        healthCheck: 'http://localhost:3000',
        expectedResponse: 'html'
    },
    {
        name: 'Admin',
        port: 3001,
        dir: 'admin-app',
        command: 'npm',
        args: ['start'],
        healthCheck: 'http://localhost:3001',
        expectedResponse: 'html'
    }
];

const processes = [];
const results = {
    started: [],
    failed: [],
    healthChecks: []
};

async function startService(service) {
    return new Promise((resolve, reject) => {
        console.log(`🚀 Démarrage de ${service.name}...`);
        
        const servicePath = path.join(__dirname, '..', service.dir);
        console.log(`   Répertoire: ${servicePath}`);
        
        // Vérifier que le répertoire existe
        const fs = require('fs');
        if (!fs.existsSync(servicePath)) {
            console.log(`❌ ${service.name}: Répertoire introuvable`);
            results.failed.push(`${service.name}: Directory not found`);
            return reject(new Error('Directory not found'));
        }
        
        const process = spawn(service.command, service.args, {
            cwd: servicePath,
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });
        
        let startupOutput = '';
        
        process.stdout.on('data', (data) => {
            const output = data.toString();
            startupOutput += output;
            
            // Détecter quand le service est prêt
            if (
                (service.name === 'Backend' && output.includes('Server is running')) ||
                (service.name === 'Client' && output.includes('webpack compiled')) ||
                (service.name === 'Admin' && output.includes('webpack compiled'))
            ) {
                console.log(`✅ ${service.name} démarré sur le port ${service.port}`);
                results.started.push(service.name);
                processes.push({ name: service.name, process });
                resolve(service);
            }
        });
        
        process.stderr.on('data', (data) => {
            console.log(`❌ ${service.name} error: ${data.toString()}`);
        });
        
        process.on('exit', (code) => {
            if (code !== 0) {
                console.log(`❌ ${service.name} exited with code ${code}`);
                results.failed.push(`${service.name}: Exit code ${code}`);
                reject(new Error(`Exit code ${code}`));
            }
        });
        
        // Timeout après 30 secondes
        setTimeout(() => {
            if (!results.started.includes(service.name)) {
                console.log(`⏰ ${service.name}: Timeout de démarrage`);
                console.log(`   Dernière sortie: ${startupOutput.slice(-200)}`);
                results.failed.push(`${service.name}: Startup timeout`);
                reject(new Error('Startup timeout'));
            }
        }, 30000);
    });
}

async function healthCheck(service) {
    try {
        console.log(`🏥 Test de santé ${service.name}...`);
        const response = await axios.get(service.healthCheck, { timeout: 5000 });
        
        if (service.expectedResponse === 'html' && response.data.includes('<html')) {
            console.log(`✅ ${service.name}: Interface web active`);
            results.healthChecks.push(`${service.name}: OK`);
            return true;
        } else if (service.expectedResponse === 'OK' && response.data.status === 'OK') {
            console.log(`✅ ${service.name}: API active`);
            results.healthChecks.push(`${service.name}: OK`);
            return true;
        }
    } catch (error) {
        console.log(`❌ ${service.name}: Health check failed - ${error.message}`);
        results.healthChecks.push(`${service.name}: FAILED - ${error.message}`);
        return false;
    }
}

async function startAllServices() {
    console.log('🎬 DÉMARRAGE DE TOUS LES SERVICES\n');
    
    // Démarrer les services un par un
    for (const service of services) {
        try {
            await startService(service);
            
            // Attendre un peu avant le health check
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Health check
            await healthCheck(service);
            
        } catch (error) {
            console.log(`❌ Échec démarrage ${service.name}: ${error.message}`);
        }
        
        console.log(''); // Ligne vide pour la lisibilité
    }
    
    // Rapport final
    console.log('📊 RAPPORT FINAL:');
    console.log(`✅ Services démarrés: ${results.started.length}/3`);
    console.log(`❌ Échecs: ${results.failed.length}`);
    console.log(`🏥 Health checks réussis: ${results.healthChecks.filter(h => h.includes('OK')).length}/3`);
    
    console.log('\n📋 URLs des services:');
    console.log('   🖥️  Backend: http://localhost:4000/api/');
    console.log('   🛒 Client: http://localhost:3000');
    console.log('   ⚙️  Admin: http://localhost:3001');
    
    console.log('\n⚠️  Appuyez sur Ctrl+C pour arrêter tous les services');
    
    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
        console.log('\n🛑 Arrêt des services...');
        processes.forEach(({ name, process }) => {
            console.log(`   Arrêt ${name}...`);
            process.kill();
        });
        process.exit(0);
    });
}

startAllServices().catch(error => {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
});