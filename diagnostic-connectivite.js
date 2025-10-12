const axios = require('axios');

console.log('🔍 Diagnostic détaillé de connectivité Admin <-> Backend\n');

async function diagnosticDetaille() {
    const baseUrl = 'http://localhost:4000/api/';
    
    console.log('📡 Test des endpoints API...\n');
    
    const endpoints = [
        { name: 'Produits', url: `${baseUrl}product` },
        { name: 'Marques', url: `${baseUrl}brand` },
        { name: 'Catégories', url: `${baseUrl}category` },
        { name: 'Couleurs', url: `${baseUrl}color` },
        { name: 'Coupons', url: `${baseUrl}coupon` },
        { name: 'Blogs', url: `${baseUrl}blog` },
        { name: 'Enquêtes', url: `${baseUrl}enquiry` }
    ];
    
    let totalSuccess = 0;
    let totalErrors = 0;
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔗 Test ${endpoint.name}...`);
            const response = await axios.get(endpoint.url, { timeout: 5000 });
            
            if (Array.isArray(response.data)) {
                console.log(`✅ ${endpoint.name}: ${response.data.length} éléments`);
            } else if (response.data && typeof response.data === 'object') {
                if (response.data.Count !== undefined) {
                    console.log(`✅ ${endpoint.name}: ${response.data.Count} éléments`);
                } else if (response.data.length !== undefined) {
                    console.log(`✅ ${endpoint.name}: ${response.data.length} éléments`);
                } else {
                    console.log(`✅ ${endpoint.name}: Données disponibles`);
                }
            } else {
                console.log(`✅ ${endpoint.name}: Réponse reçue`);
            }
            totalSuccess++;
            
        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);
            totalErrors++;
            
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}...`);
            }
        }
    }
    
    console.log(`\n📊 Résultat: ${totalSuccess}/${endpoints.length} endpoints fonctionnels`);
    
    if (totalErrors === 0) {
        console.log('\n✅ BACKEND ENTIÈREMENT OPÉRATIONNEL');
        console.log('💡 Le problème vient probablement du côté admin (cache, compilation, etc.)');
        console.log('\n🔧 Solutions à essayer:');
        console.log('1. Actualiser la page (F5)');
        console.log('2. Vider le cache navigateur (Ctrl+Shift+R)');
        console.log('3. Redémarrer l\'admin');
    } else {
        console.log('\n⚠️  Certains endpoints ont des problèmes');
    }
}

diagnosticDetaille();
