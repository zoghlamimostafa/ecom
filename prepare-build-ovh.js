// prepare-build-ovh.js
// Préparation du build selon le type d'hébergement OVH

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️ PRÉPARATION BUILD OVH - SANNY STORE');
console.log('======================================');

// Configuration selon le type d'hébergement
const hostingTypes = {
    mutualise: {
        name: 'Hébergement Mutualisé OVH',
        buildCommand: 'npm run build',
        apiMode: 'external', // API externe (Railway/Render)
        uploadMethod: 'ftp'
    },
    vps: {
        name: 'VPS OVH',
        buildCommand: 'npm run build',
        apiMode: 'local', // API sur le même serveur
        uploadMethod: 'git'
    },
    dedicated: {
        name: 'Serveur Dédié OVH',
        buildCommand: 'npm run build',
        apiMode: 'local',
        uploadMethod: 'git'
    }
};

function createProductionConfig(hostingType) {
    console.log(`\n⚙️ Configuration pour ${hostingTypes[hostingType].name}`);
    
    // Configuration API selon le type d'hébergement
    const apiConfig = hostingTypes[hostingType].apiMode === 'external' 
        ? {
            apiUrl: 'https://votre-api.up.railway.app', // À personnaliser
            note: 'API hébergée sur service externe gratuit'
          }
        : {
            apiUrl: '/api', // API locale
            note: 'API hébergée sur le même serveur'
          };

    // Créer le fichier de configuration
    const configContent = `// config.js - Configuration production OVH
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? '${apiConfig.apiUrl}'
    : 'http://localhost:4000',
  
  // Note: ${apiConfig.note}
  
  // Configuration spécifique OVH
  HOSTING_TYPE: '${hostingType}',
  
  // Optimisations
  CHUNK_SIZE_LIMIT: ${hostingType === 'mutualise' ? '244000' : '512000'},
  
  // Features selon l'hébergement
  FEATURES: {
    real_time_chat: ${hostingType !== 'mutualise'},
    file_upload: true,
    admin_dashboard: true,
    analytics: ${hostingType !== 'mutualise'}
  }
};

export default config;`;

    fs.writeFileSync('Client/src/config.js', configContent);
    console.log('✅ Configuration créée : Client/src/config.js');
    
    return apiConfig;
}

function updatePackageJson(hostingType) {
    console.log('\n📦 Mise à jour package.json...');
    
    const packageJsonPath = 'Client/package.json';
    if (!fs.existsSync(packageJsonPath)) {
        console.error('❌ package.json non trouvé');
        return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Scripts spécifiques OVH
    packageJson.scripts = packageJson.scripts || {};
    
    if (hostingType === 'mutualise') {
        packageJson.scripts['build:ovh'] = 'npm run build && cp .htaccess-ovh build/.htaccess';
        packageJson.scripts['deploy:ovh'] = 'npm run build:ovh && node ftp-upload-ovh.js';
    } else {
        packageJson.scripts['build:ovh'] = 'npm run build';
        packageJson.scripts['deploy:ovh'] = './deploy-vps-ovh.sh';
    }
    
    // Optimisations pour OVH
    packageJson.scripts['analyze'] = 'npm run build && npx bundle-analyzer build/static/js/*.js';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json mis à jour avec scripts OVH');
}

function createEnvironmentFiles(hostingType, apiConfig) {
    console.log('\n🌍 Création des fichiers d\'environnement...');
    
    // .env.production pour React
    const envProduction = `# Production OVH - ${hostingTypes[hostingType].name}
REACT_APP_API_URL=${apiConfig.apiUrl}
REACT_APP_ENVIRONMENT=production
REACT_APP_HOSTING=ovh-${hostingType}
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false`;

    fs.writeFileSync('Client/.env.production', envProduction);
    console.log('✅ Fichier .env.production créé');
    
    if (hostingType !== 'mutualise') {
        // .env pour le backend (VPS/Dédié)
        const envBackend = `# Backend Production OVH
NODE_ENV=production
PORT=4000

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanny_store
DB_USER=sanny_user
DB_PASSWORD=CHANGEZ_MOI_PASSWORD_SECURISE

# Sécurité
JWT_SECRET=CHANGEZ_MOI_JWT_SECRET_SUPER_SECURISE
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://votre-domaine.com

# Uploads
UPLOAD_DIR=/var/www/sanny-store/uploads
MAX_FILE_SIZE=5242880

# Email OVH
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=noreply@votre-domaine.com
SMTP_PASS=CHANGEZ_MOI_PASSWORD_EMAIL

# Sessions
SESSION_SECRET=CHANGEZ_MOI_SESSION_SECRET`;

        fs.writeFileSync('backend/.env.production', envBackend);
        console.log('✅ Fichier backend/.env.production créé');
    }
}

function buildForOVH(hostingType) {
    console.log(`\n🏗️ Build pour ${hostingTypes[hostingType].name}...`);
    
    try {
        // Aller dans le dossier Client
        process.chdir('Client');
        
        // Installation des dépendances si nécessaire
        if (!fs.existsSync('node_modules')) {
            console.log('📦 Installation des dépendances...');
            execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
        }
        
        // Build de production
        console.log('⚙️ Création du build de production...');
        execSync('npm run build', { stdio: 'inherit' });
        
        // Copier .htaccess pour hébergement mutualisé
        if (hostingType === 'mutualise') {
            if (fs.existsSync('../.htaccess-ovh')) {
                fs.copyFileSync('../.htaccess-ovh', 'build/.htaccess');
                console.log('✅ .htaccess copié dans le build');
            }
        }
        
        // Retour au dossier parent
        process.chdir('..');
        
        console.log('✅ Build créé avec succès !');
        console.log(`📁 Dossier de build : Client/build/`);
        
        // Afficher les instructions suivantes
        displayNextSteps(hostingType);
        
    } catch (error) {
        console.error('❌ Erreur lors du build :', error.message);
    }
}

function displayNextSteps(hostingType) {
    console.log(`\n🎯 ÉTAPES SUIVANTES - ${hostingTypes[hostingType].name.toUpperCase()}`);
    console.log('='.repeat(50));
    
    if (hostingType === 'mutualise') {
        console.log('📤 HÉBERGEMENT MUTUALISÉ :');
        console.log('1. 🔧 Configurez ftp-upload-ovh.js avec vos identifiants FTP');
        console.log('2. 🚀 Exécutez : node ftp-upload-ovh.js');
        console.log('3. 🌐 Votre site sera en ligne sur votre domaine OVH');
        console.log('');
        console.log('⚠️  NOTE : Pour l\'API, utilisez Railway ou Render (gratuit)');
        console.log('🔗 Railway : https://railway.app');
        console.log('🔗 Render : https://render.com');
    } else {
        console.log('🖥️ VPS/SERVEUR DÉDIÉ :');
        console.log('1. 📤 Uploadez le code sur votre VPS (git clone ou SFTP)');
        console.log('2. 🔧 Configurez la base de données PostgreSQL');
        console.log('3. ⚙️  Configurez Nginx avec nginx-ovh.conf');
        console.log('4. 🚀 Exécutez : ./deploy-vps-ovh.sh');
        console.log('5. 🔒 Configurez SSL avec Let\'s Encrypt');
        console.log('');
        console.log('📝 Consultez GUIDE_DEPLOIEMENT_OVH.md pour les détails');
    }
    
    console.log('\n📞 Support : Tous les fichiers de configuration sont prêts !');
    console.log('🎉 Votre Sanny Store sera bientôt en ligne sur OVH !');
}

function main() {
    console.log('Quel type d\'hébergement OVH avez-vous ?');
    console.log('1. 📦 Hébergement Mutualisé (Perso/Pro/Performance)');
    console.log('2. 🖥️  VPS (Virtual Private Server)');
    console.log('3. 🏢 Serveur Dédié');
    
    // Pour la démo, on va préparer pour les 3 types
    console.log('\n🔄 Préparation pour tous les types d\'hébergement...');
    
    // Préparer pour hébergement mutualisé
    console.log('\n' + '='.repeat(60));
    const apiConfigMutualise = createProductionConfig('mutualise');
    updatePackageJson('mutualise');
    createEnvironmentFiles('mutualise', apiConfigMutualise);
    
    // Préparer pour VPS
    console.log('\n' + '='.repeat(60));
    const apiConfigVPS = createProductionConfig('vps');
    createEnvironmentFiles('vps', apiConfigVPS);
    
    console.log('\n✅ PRÉPARATION TERMINÉE !');
    console.log('========================');
    console.log('📁 Fichiers créés :');
    console.log('   - Client/src/config.js (configuration API)');
    console.log('   - Client/.env.production (environnement React)');
    console.log('   - backend/.env.production (environnement Node.js)');
    console.log('   - Scripts de déploiement mis à jour');
    
    console.log('\n🚀 Pour builder maintenant :');
    console.log('   npm run build:ovh     # Build avec config OVH');
    console.log('   npm run deploy:ovh    # Build + déploiement');
    
    console.log('\n📖 Consultez GUIDE_DEPLOIEMENT_OVH.md pour les étapes détaillées');
}

if (require.main === module) {
    main();
}