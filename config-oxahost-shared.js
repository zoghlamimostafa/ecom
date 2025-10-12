// config-oxahost-shared.js
// Configuration pour hébergement shared OxaHost

const config = {
  // Configuration API
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://sanny-api.up.railway.app'  // API externe
    : 'http://localhost:4000',

  // Configuration build optimisée OxaHost
  BUILD_PATH: './build',
  PUBLIC_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com' 
    : '',

  // Optimisations spécifiques OxaHost
  CHUNK_SIZE_LIMIT: 512000,  // Limite généreuse
  
  // Configuration cPanel FTP OxaHost
  CPANEL_CONFIG: {
    url: 'https://cpanel.votre-domaine.com',
    ftp_host: 'ftp.votre-domaine.com',
    ftp_port: 21,
    remote_dir: '/public_html'
  },

  // Caractéristiques OxaHost
  HOSTING_FEATURES: {
    ssl_included: true,
    backup_daily: true,
    cpanel_version: 'latest',
    php_versions: ['7.4', '8.0', '8.1', '8.2'],
    mysql_support: true,
    nodejs_support: false  // Généralement pas sur shared
  }
};

module.exports = config;