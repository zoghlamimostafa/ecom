// config.js - Configuration production OVH
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://localhost:4000',
  
  // Note: API hébergée sur le même serveur
  
  // Configuration spécifique OVH
  HOSTING_TYPE: 'vps',
  
  // Optimisations
  CHUNK_SIZE_LIMIT: 512000,
  
  // Features selon l'hébergement
  FEATURES: {
    real_time_chat: true,
    file_upload: true,
    admin_dashboard: true,
    analytics: true
  }
};

export default config;