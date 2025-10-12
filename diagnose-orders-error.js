const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:4000';
const CLIENT_URL = 'http://localhost:3000';
const ADMIN_URL = 'http://localhost:3001';

// Test token (token test générique)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI3MjY5MjAwLCJleHAiOjE3MjcyNzI4MDB9.KY8wRGDcvbXrZ7WsY-3jYcSVfzJ-QOgRq2j0PlzOKYM';

async function testServers() {
    console.log('🔍 Diagnostic des serveurs et API...\n');
    
    // Test de connectivité des serveurs
    const servers = [
        { name: 'Backend', url: BACKEND_URL, port: 4000 },
        { name: 'Client', url: CLIENT_URL, port: 3000 },
        { name: 'Admin', url: ADMIN_URL, port: 3001 }
    ];
    
    for (const server of servers) {
        try {
            console.log(`⏳ Test ${server.name} (${server.url})...`);
            const response = await axios.get(server.url, { timeout: 5000 });
            console.log(`✅ ${server.name}: ACCESSIBLE (${response.status})`);
        } catch (error) {
            console.log(`❌ ${server.name}: INACCESSIBLE (${error.message})`);
        }
    }
    
    console.log('\n🔍 Test de l\'API des commandes...\n');
    
    // Test de l'endpoint des commandes
    try {
        console.log('⏳ Test /api/user/getmyorders...');
        const response = await axios.get(`${BACKEND_URL}/api/user/getmyorders`, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log(`✅ API Commandes: SUCCESS (${response.status})`);
        console.log(`📦 Nombre de commandes: ${response.data?.length || 0}`);
        console.log(`📋 Données reçues:`, JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log(`❌ API Commandes: ERREUR`);
        console.log(`🔍 Code d'erreur: ${error.response?.status || 'NETWORK_ERROR'}`);
        console.log(`🔍 Message: ${error.response?.data?.message || error.message}`);
        console.log(`🔍 Détails:`, error.response?.data || error.message);
    }
    
    // Test de l'authentification
    console.log('\n🔍 Test de l\'authentification...\n');
    
    try {
        console.log('⏳ Test /api/user/profile...');
        const response = await axios.get(`${BACKEND_URL}/api/user/profile`, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        console.log(`✅ Authentification: SUCCESS (${response.status})`);
        console.log(`👤 Utilisateur:`, response.data?.firstname || 'Nom non disponible');
        
    } catch (error) {
        console.log(`❌ Authentification: ERREUR`);
        console.log(`🔍 Code d'erreur: ${error.response?.status || 'NETWORK_ERROR'}`);
        console.log(`🔍 Message: ${error.response?.data?.message || error.message}`);
    }
}

// Test simple des ports
async function checkPorts() {
    console.log('\n🔍 Vérification des ports...\n');
    
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
        exec('netstat -ano | findstr ":3000\\|:3001\\|:4000"', (error, stdout) => {
            if (stdout) {
                console.log('📍 Ports actifs:');
                console.log(stdout);
            } else {
                console.log('❌ Aucun port détecté');
            }
            resolve();
        });
    });
}

async function main() {
    console.log('🚀 DIAGNOSTIC DES ERREURS DE COMMANDES\n');
    console.log('=======================================\n');
    
    await checkPorts();
    await testServers();
    
    console.log('\n✅ Diagnostic terminé !');
}

main().catch(console.error);