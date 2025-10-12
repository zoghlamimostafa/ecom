const fs = require('fs');
const path = require('path');

console.log("🔧 Utilitaire de Configuration des Limites d'Images");
console.log("==================================================");

// Configurations prédéfinies (en MB)
const PRESETS = {
    mobile: 2,
    standard: 5,
    premium: 10,
    portfolio: 20
};

function formatMB(mb) {
    return `${mb} MB (${mb * 1024 * 1024} bytes)`;
}

function updateBackendLimit(limitMB) {
    const backendFile = path.join(__dirname, 'backend', 'middlewares', 'uploadImage.js');
    let content = fs.readFileSync(backendFile, 'utf8');
    
    const oldPattern = /limits:\s*\{\s*fileSize:\s*[^}]+\}/;
    const newLimit = `limits: { fileSize: ${limitMB} * 1024 * 1024 }`;
    
    content = content.replace(oldPattern, newLimit);
    fs.writeFileSync(backendFile, content);
    
    console.log(`✅ Backend limite mise à jour : ${formatMB(limitMB)}`);
}

function updateFrontendLimit(limitMB) {
    const frontendFile = path.join(__dirname, 'admin-app', 'src', 'pages', 'Addproduct.js');
    let content = fs.readFileSync(frontendFile, 'utf8');
    
    // Mettre à jour maxSize
    const maxSizePattern = /maxSize=\{[^}]+\}/g;
    const newMaxSize = `maxSize={${limitMB} * 1024 * 1024}`;
    content = content.replace(maxSizePattern, newMaxSize);
    
    // Mettre à jour les messages
    const messagePattern = /max \d+MB/g;
    content = content.replace(messagePattern, `max ${limitMB}MB`);
    
    const errorPattern = /< \d+MB/g;
    content = content.replace(errorPattern, `< ${limitMB}MB`);
    
    fs.writeFileSync(frontendFile, content);
    
    console.log(`✅ Frontend limite mise à jour : ${formatMB(limitMB)}`);
}

function setImageLimit(preset) {
    if (!PRESETS[preset]) {
        console.log("❌ Preset invalide. Utilisez : mobile, standard, premium, ou portfolio");
        return;
    }
    
    const limitMB = PRESETS[preset];
    
    console.log(`\n🎯 Application du preset "${preset}" : ${formatMB(limitMB)}`);
    
    try {
        updateBackendLimit(limitMB);
        updateFrontendLimit(limitMB);
        
        console.log("\n✅ Configuration mise à jour avec succès !");
        console.log("🔄 Redémarrez les serveurs pour appliquer les changements");
        
    } catch (error) {
        console.log("❌ Erreur lors de la mise à jour :", error.message);
    }
}

// Interface en ligne de commande
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("\n📋 Presets disponibles :");
    Object.entries(PRESETS).forEach(([name, mb]) => {
        console.log(`   ${name}: ${formatMB(mb)}`);
    });
    
    console.log("\n💻 Usage :");
    console.log("   node configure-image-limits.js [preset]");
    console.log("   node configure-image-limits.js standard");
    
} else {
    const preset = args[0].toLowerCase();
    setImageLimit(preset);
}

module.exports = { setImageLimit, PRESETS };
