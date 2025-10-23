import axios from 'axios';

// Configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes - Ajouter le token automatiquement
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses - Gérer les erreurs de token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Token expiré ou invalide
      if (status === 401) {
        if (data.expired || data.invalid || data.message?.includes('Token') || data.message?.includes('token')) {
          console.error('🔴 Token expiré ou invalide, déconnexion...');
          
          // Nettoyer le localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Rediriger vers la page de login
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
          
          return Promise.reject({
            message: 'Session expirée. Veuillez vous reconnecter.',
            expired: true
          });
        }
      }

      // Autres erreurs d'authentification
      if (status === 403) {
        console.error('🔴 Accès refusé');
        return Promise.reject({
          message: data.message || 'Accès refusé. Privilèges insuffisants.',
          forbidden: true
        });
      }

      // Erreur serveur
      if (status >= 500) {
        console.error('🔴 Erreur serveur:', data);
        return Promise.reject({
          message: 'Erreur serveur. Veuillez réessayer plus tard.',
          serverError: true
        });
      }
    }

    // Erreur réseau
    if (error.request && !error.response) {
      console.error('🔴 Erreur réseau:', error.message);
      return Promise.reject({
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        networkError: true
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
