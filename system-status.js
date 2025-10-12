const axios = require('axios');

console.log('🔍 Vérification du statut du système...\n');

async function checkSystemStatus() {
    try {
        // Test Backend
        console.log('📡 Test du Backend (Port 4000)...');
        const backendResponse = await axios.get('http://localhost:4000/api/product');
        console.log(`✅ Backend actif - ${backendResponse.data.length} produits trouvés`);
        
        // Test des marques
        const brandResponse = await axios.get('http://localhost:4000/api/brand');
        console.log(`✅ API Marques - ${brandResponse.data.Count} marques disponibles`);
        
        // Test des catégories
        const categoryResponse = await axios.get('http://localhost:4000/api/category');
        console.log(`✅ API Catégories - ${categoryResponse.data.Count} catégories disponibles`);
        
        // Test des couleurs
        const colorResponse = await axios.get('http://localhost:4000/api/color');
        console.log(`✅ API Couleurs - ${colorResponse.data.length} couleurs disponibles`);
        
        console.log('\n🎉 SYSTÈME ENTIÈREMENT OPÉRATIONNEL !');
        console.log('💡 Admin accessible sur: http://localhost:3001');
        console.log('💡 Backend accessible sur: http://localhost:4000');
        
    } catch (error) {
        console.error('❌ Erreur système:', error.message);
        console.log('\n🔧 Vérifiez que les services sont démarrés:');
        console.log('   - Backend: node index.js (dans le dossier backend)');
        console.log('   - Admin: npm start (dans le dossier admin-app)');
    }
}

checkSystemStatus();
