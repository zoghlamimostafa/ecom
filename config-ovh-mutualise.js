// config-ovh-mutualise.js
// Configuration pour hébergement mutualisé OVH

const config = {
  // API externe (Railway/Render gratuit)
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://sanny-api.up.railway.app'  // À remplacer par votre URL
    : 'http://localhost:4000',

  // Configuration build
  BUILD_PATH: './build',
  PUBLIC_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com' 
    : '',

  // Optimisations pour hébergement mutualisé
  CHUNK_SIZE_LIMIT: 244000,  // Limite OVH
  
  // Configuration FTP pour upload automatique
  FTP_CONFIG: {
    host: 'ftp.votre-domaine.com',
    user: 'votre-login-ovh',
    password: 'CHANGEZ_MOI',
    secure: false,
    connTimeout: 60000,
    pasvTimeout: 60000,
    remoteDir: '/www'
  }
};

module.exports = config;