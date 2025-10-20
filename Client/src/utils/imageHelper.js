/**
 * Utilitaire pour obtenir l'URL de l'image d'un produit
 * Gère différents formats d'images
 * Supporte Cloudinary, URLs externes et chemins locaux
 * @param {Object|Array|String} images - Les images du produit
 * @param {Number} index - Index de l'image (par défaut 0)
 * @returns {String} - URL de l'image ou image par défaut
 */
export const getProductImageUrl = (images, index = 0) => {
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://74.235.205.26:4000';
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
    const url = images.url || images.path || images.public_id || '';
    if (url && typeof url === 'string') {
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
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
    if (images.startsWith('http://') || images.startsWith('https://')) return images;
    if (images.startsWith('/')) return `${BACKEND_URL}${images}`;
    return `${BACKEND_URL}/images/${images}`;
  }

  return defaultImage;
};

/**
 * Obtient toutes les URLs d'images d'un produit
 * @param {Object|Array|String} images - Les images du produit
 * @returns {Array} - Tableau d'URLs
 */
export const getAllProductImageUrls = (images) => {
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://74.235.205.26:4000';
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
    
    try {
      // Tenter de parser l'URL pour vérifier si elle est valide
      const url = new URL(images);
      // Si c'est déjà une URL valide (avec protocole), la retourner telle quelle
      return [images];
    } catch (e) {
      // Ce n'est pas une URL valide, donc c'est un chemin relatif
      if (images.startsWith('/')) {
        // Éviter la double préfixation si l'URL contient déjà le BACKEND_URL
        if (images.includes(BACKEND_URL)) {
          return [images];
        }
        return [`${BACKEND_URL}${images}`];
      }
      // Sinon ajouter le préfixe /images/
      return [`${BACKEND_URL}/images/${images}`];
    }
  }
  
  // Si c'est un tableau
  if (Array.isArray(images)) {
    if (images.length === 0) {
      return [defaultImage];
    }
    
    return images.map(image => {
      if (typeof image === 'object' && image !== null) {
        const url = image.url || image.public_id || image.path || '';
        if (!url || url === 'null') return defaultImage;
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
        if (image.startsWith('http://') || image.startsWith('https://')) {
          return image;
        }
        if (image.startsWith('/')) {
          return `${BACKEND_URL}${image}`;
        }
        return `${BACKEND_URL}/images/${image}`;
      }
      return defaultImage;
    });
  }
  
  // Si c'est un objet direct
  if (typeof images === 'object') {
    const url = images.url || images.public_id || images.path || '';
    if (!url || url === 'null') return [defaultImage];
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
