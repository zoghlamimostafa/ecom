// ftp-upload-ovh.js
// Script d'upload automatique vers hébergement mutualisé OVH

const FTP = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function uploadToOVH() {
    const client = new FTP.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔗 Connexion au serveur FTP OVH...');
        
        await client.access({
            host: 'ftp.votre-domaine.com',
            user: 'votre-login-ovh',
            password: 'votre-mot-de-passe',
            secure: false
        });

        console.log('📁 Navigation vers le dossier www...');
        await client.cd('/www');

        console.log('🚀 Upload du build React...');
        await client.uploadFromDir('./build');

        console.log('📄 Upload du fichier .htaccess...');
        await client.uploadFrom('.htaccess-ovh', '.htaccess');

        console.log('✅ Upload terminé avec succès !');
        console.log('🌐 Votre site est maintenant en ligne !');

    } catch (error) {
        console.error('❌ Erreur upload FTP :', error.message);
    } finally {
        client.close();
    }
}

// Installation automatique de basic-ftp si nécessaire
async function installDependencies() {
    try {
        require('basic-ftp');
    } catch (error) {
        console.log('📦 Installation de basic-ftp...');
        const { execSync } = require('child_process');
        execSync('npm install basic-ftp', { stdio: 'inherit' });
    }
}

async function main() {
    console.log('📤 UPLOAD AUTOMATIQUE VERS OVH');
    console.log('===============================');
    
    await installDependencies();
    await uploadToOVH();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { uploadToOVH };