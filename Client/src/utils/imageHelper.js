/**
 * Utilitaire pour obtenir l'URL de l'image d'un produit
 * Gère différents formats d'images
 * Supporte Cloudinary, URLs externes et chemins locaux
 * @param {Object|Array|String} images - Les images du produit
 * @param {Number} index - Index de l'image (par défaut 0)
 * @returns {String} - URL de l'image ou image par défaut
 */
/**
 * Détermine l'URL du backend automatiquement
 * - Si REACT_APP_API_URL est défini, l'utiliser
 * - Sinon, détecter selon window.location.hostname
 */
export const getBackendUrl = () => {
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

/**
 * Normalise une URL d'image en enlevant les domaines hardcodés
 * et en ne gardant que le chemin relatif
 */
const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Si c'est une URL Cloudinary, la garder telle quelle
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary')) {
    return url;
  }
  
  // Enlever les domaines hardcodés (localhost, IP Azure, IP interne)
  const patterns = [
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://74.235.205.26:4000',
    'http://10.1.0.4:4000',
    'https://localhost:4000',
    'https://127.0.0.1:4000',
    'https://74.235.205.26:4000',
    'https://10.1.0.4:4000'
  ];
  
  for (const pattern of patterns) {
    if (url.startsWith(pattern)) {
      return url.replace(pattern, '');
    }
  }
  
  return url;
};

export const getProductImageUrl = (images, index = 0) => {
  const BACKEND_URL = getBackendUrl();
  const defaultImage = '/images/default-product.jpg';
  if (!images) return defaultImage;

  // 🔄 Parser JSON si c'est une string JSON
  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        images = JSON.parse(trimmed);
        // Continue avec le parsing normal maintenant que c'est un objet/array
      } catch (e) {
        console.warn('⚠️ Failed to parse images JSON:', e.message);
      }
    }
  }

  // Si tableau, on prend le premier élément non vide
  if (Array.isArray(images)) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const url = getProductImageUrl(img);
      if (url && !url.includes('default-product')) return url;
    }
    return defaultImage;
  }

  // Si objet avec .url ou .path ou .public_id
  if (typeof images === 'object') {
    let url = images.url || images.path || images.public_id || '';
    if (url && typeof url === 'string') {
      // Normaliser l'URL d'abord
      url = normalizeImageUrl(url);
      
      // Si c'est une URL externe (Cloudinary, etc.), la retourner telle quelle
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      
      // Sinon, ajouter le backend URL approprié
      if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
      return `${BACKEND_URL}/images/${url}`;
    }
    // Si l'objet est un File (upload direct)
    if (images instanceof File && images.name) {
      return `${BACKEND_URL}/images/${images.name}`;
    }
    return defaultImage;
  }

  // Si string
  if (typeof images === 'string') {
    if (!images || images === 'null' || images === 'undefined') return defaultImage;
    
    // Normaliser l'URL d'abord
    let url = normalizeImageUrl(images);
    
    // Si c'est une URL externe (Cloudinary, etc.), la retourner telle quelle
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    // Sinon, ajouter le backend URL approprié
    if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
    return `${BACKEND_URL}/images/${url}`;
  }

  return defaultImage;
};

/**
 * Obtient toutes les URLs d'images d'un produit
 * @param {Object|Array|String} images - Les images du produit
 * @returns {Array} - Tableau d'URLs
 */
export const getAllProductImageUrls = (images) => {
  const BACKEND_URL = getBackendUrl();
  const defaultImage = '/images/default-product.jpg';
  
  if (!images) {
    return [defaultImage];
  }
  
  // 🔄 Parser JSON si c'est une string JSON
  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        images = JSON.parse(trimmed);
        // Continue avec le parsing normal maintenant que c'est un objet/array
      } catch (e) {
        console.warn('⚠️ Failed to parse images JSON:', e.message);
      }
    }
  }
  
  // Si c'est une chaîne directe
  if (typeof images === 'string') {
    if (!images || images === 'null' || images === 'undefined') {
      return [defaultImage];
    }
    
    // Normaliser l'URL d'abord
    let url = normalizeImageUrl(images);
    
    // Si c'est une URL externe (Cloudinary, etc.), la retourner telle quelle
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return [url];
    }
    
    // Sinon, ajouter le backend URL approprié
    if (url.startsWith('/')) {
      return [`${BACKEND_URL}${url}`];
    }
    
    return [`${BACKEND_URL}/images/${url}`];
  }
  
  // Si c'est un tableau
  if (Array.isArray(images)) {
    if (images.length === 0) {
      return [defaultImage];
    }
    
    return images.map(image => {
      if (typeof image === 'object' && image !== null) {
        let url = image.url || image.public_id || image.path || '';
        if (!url || url === 'null') return defaultImage;
        
        // Normaliser l'URL
        url = normalizeImageUrl(url);
        
        // Si c'est une URL externe, la retourner telle quelle
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }
        if (url.startsWith('/')) {
          return `${BACKEND_URL}${url}`;
        }
        return `${BACKEND_URL}/images/${url}`;
      }
      if (typeof image === 'string') {
        if (!image || image === 'null' || image === 'undefined') return defaultImage;
        
        // Normaliser l'URL
        let url = normalizeImageUrl(image);
        
        // Si c'est une URL externe, la retourner telle quelle
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }
        if (url.startsWith('/')) {
          return `${BACKEND_URL}${url}`;
        }
        return `${BACKEND_URL}/images/${url}`;
      }
      return defaultImage;
    });
  }
  
  // Si c'est un objet direct
  if (typeof images === 'object') {
    let url = images.url || images.public_id || images.path || '';
    if (!url || url === 'null') return [defaultImage];
    
    // Normaliser l'URL
    url = normalizeImageUrl(url);
    
    let finalUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      finalUrl = url;
    } else if (url.startsWith('/')) {
      finalUrl = `${BACKEND_URL}${url}`;
    } else {
      finalUrl = `${BACKEND_URL}/images/${url}`;
    }
    return [finalUrl];
  }
  
  return [defaultImage];
};
