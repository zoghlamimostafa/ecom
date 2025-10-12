// Lanceur simple pour démarrer seulement le backend
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 DÉMARRAGE BACKEND SANNY');
console.log('=' .repeat(40));

const backendPath = path.join(__dirname, 'backend');
console.log(`📁 Répertoire: ${backendPath}`);

// Lancer le serveur backend
const backend = spawn('node', ['index-robust.js'], {
    cwd: backendPath,
    stdio: 'inherit', // Afficher les logs directement
    shell: process.platform === 'win32'
});

backend.on('error', (error) => {
    console.error('❌ Erreur de démarrage:', error.message);
    process.exit(1);
});

backend.on('close', (code) => {
    if (code !== 0) {
        console.error(`❌ Backend fermé avec le code ${code}`);
    } else {
        console.log('✅ Backend fermé proprement');
    }
});

console.log(`✅ Backend en cours de démarrage...`);
console.log(`🌐 API accessible sur: http://localhost:4000/api/`);
console.log(`📋 Pour arrêter: Ctrl+C`);

// Gérer l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du backend...');
    backend.kill('SIGTERM');
    process.exit(0);
});

process.on('SIGTERM', () => {
    backend.kill('SIGTERM');
});