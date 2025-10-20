import axios from 'axios';

/**
 * Détermine l'URL du backend automatiquement
 * - Si REACT_APP_API_URL est défini, l'utiliser
 * - Sinon, détecter selon window.location.hostname
 */
const getBackendUrl = () => {
  // 1. Priorité: Variable d'environnement
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 2. Détection automatique selon l'hôte
  const hostname = window.location.hostname;
  
  // Si on accède via l'IP publique Azure
  if (hostname === '74.235.205.26') {
    return 'http://74.235.205.26:4000';
  }
  
  // Si on accède via localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Si on accède via l'IP interne
  if (hostname === '10.1.0.4') {
    return 'http://10.1.0.4:4000';
  }
  
  // 3. Fallback par défaut
  return 'http://localhost:4000';
};

const axiosInstance = axios.create({
  baseURL: `${getBackendUrl()}/api`,
});

// Ajouter un interceptor pour inclure le jeton d'accès dans les en-têtes de chaque requête
axiosInstance.interceptors.request.use((config) => {
  // Try customer object first (new format)
  let token = "";
  const customer = localStorage.getItem('customer');
  if (customer) {
    try {
      const parsedCustomer = JSON.parse(customer);
      token = parsedCustomer.token || "";
    } catch (e) {
      console.error("Error parsing customer from localStorage:", e);
    }
  }
  
  // Fallback to old accessToken format
  if (!token) {
    token = localStorage.getItem('accessToken') || "";
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default axiosInstance;
