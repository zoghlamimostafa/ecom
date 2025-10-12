// monitoring-oxahost.js
// Script de monitoring pour OxaHost

const fs = require('fs');
const { execSync } = require('child_process');

async function checkOxaHostStatus() {
    console.log('📊 MONITORING OXAHOST - SANNY STORE');
    console.log('==================================');

    const status = {
        timestamp: new Date().toISOString(),
        hosting: 'oxahost',
        checks: {}
    };

    // Vérification du site web
    try {
        const response = await fetch('https://votre-domaine.com');
        status.checks.website = {
            status: response.ok ? 'OK' : 'ERROR',
            code: response.status,
            time: Date.now()
        };
        console.log('✅ Site web accessible');
    } catch (error) {
        status.checks.website = {
            status: 'ERROR',
            error: error.message,
            time: Date.now()
        };
        console.log('❌ Site web inaccessible');
    }

    // Vérification API (si VPS)
    try {
        const apiResponse = await fetch('https://votre-domaine.com/api/health');
        status.checks.api = {
            status: apiResponse.ok ? 'OK' : 'ERROR',
            code: apiResponse.status,
            time: Date.now()
        };
        console.log('✅ API accessible');
    } catch (error) {
        status.checks.api = {
            status: 'ERROR',
            error: error.message,
            time: Date.now()
        };
        console.log('⚠️  API non accessible (normal si shared hosting)');
    }

    // Vérification SSL
    try {
        const sslCheck = await fetch('https://votre-domaine.com');
        status.checks.ssl = {
            status: 'OK',
            secure: true,
            time: Date.now()
        };
        console.log('✅ SSL actif');
    } catch (error) {
        status.checks.ssl = {
            status: 'WARNING',
            secure: false,
            error: error.message,
            time: Date.now()
        };
        console.log('⚠️  SSL non configuré');
    }

    // Sauvegarde du status
    fs.writeFileSync('oxahost-status.json', JSON.stringify(status, null, 2));
    
    console.log('\n📊 Status sauvegardé dans oxahost-status.json');
    return status;
}

if (require.main === module) {
    checkOxaHostStatus().catch(console.error);
}

module.exports = { checkOxaHostStatus };