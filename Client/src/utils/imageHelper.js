/**
 * Utilitaire pour obtenir l'URL de l'image d'un produit
 * Gère différents formats d'images
 * Supporte Cloudinary, URLs externes et chemins locaux
 * @param {Object|Array|String} images - Les images du produit
 * @param {Number} index - Index de l'image (par défaut 0)
 * @returns {String} - URL de l'image ou image par défaut
 */
export const getProductImageUrl = (images, index = 0) => {
  const defaultImage = '/images/default-product.jpg';
  
  // Si null ou undefined
  if (!images) {
    return defaultImage;
  }
  
  // Si c'est une chaîne directe
  if (typeof images === 'string') {
    // Si chaîne vide ou "null" en string
    if (!images || images === 'null' || images === 'undefined') {
      return defaultImage;
    }
    // Si c'est une URL Cloudinary ou externe
    if (images.startsWith('http://') || images.startsWith('https://')) {
      return images;
    }
    // Si c'est un chemin local
    if (images.startsWith('/')) {
      return images;
    }
    // Sinon ajouter le préfixe /images/
    return `/images/${images}`;
  }
  
  // Si c'est un tableau
  if (Array.isArray(images)) {
    if (images.length === 0) {
      return defaultImage;
    }
    
    const image = images[index] || images[0];
    
    // Si l'élément du tableau est un objet avec url
    if (typeof image === 'object' && image !== null) {
      const url = image.url || image.public_id || image.path || '';
      if (!url || url === 'null') return defaultImage;
      // Si URL complète
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Si chemin local
      if (url.startsWith('/')) {
        return url;
      }
      return `/images/${url}`;
    }
    
    // Si l'élément est une chaîne
    if (typeof image === 'string') {
      if (!image || image === 'null' || image === 'undefined') {
        return defaultImage;
      }
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      if (image.startsWith('/')) {
        return image;
      }
      return `/images/${image}`;
    }
    
    return defaultImage;
  }
  
  // Si c'est un objet direct
  if (typeof images === 'object') {
    const url = images.url || images.public_id || images.path || '';
    if (!url || url === 'null') return defaultImage;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return url;
    }
    return `/images/${url}`;
  }
  
  return defaultImage;
};

/**
 * Obtient toutes les URLs d'images d'un produit
 * @param {Object|Array|String} images - Les images du produit
 * @returns {Array} - Tableau d'URLs
 */
export const getAllProductImageUrls = (images) => {
  const defaultImage = '/images/default-product.jpg';
  
  if (!images) {
    return [defaultImage];
  }
  
  // Si c'est une chaîne directe
  if (typeof images === 'string') {
    if (!images || images === 'null' || images === 'undefined') {
      return [defaultImage];
    }
    const url = images.startsWith('http') || images.startsWith('/') 
      ? images 
      : `/images/${images}`;
    return [url];
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
        return url.startsWith('http') || url.startsWith('/') 
          ? url 
          : `/images/${url}`;
      }
      if (typeof image === 'string') {
        if (!image || image === 'null' || image === 'undefined') return defaultImage;
        return image.startsWith('http') || image.startsWith('/') 
          ? image 
          : `/images/${image}`;
      }
      return defaultImage;
    });
  }
  
  // Si c'est un objet direct
  if (typeof images === 'object') {
    const url = images.url || images.public_id || images.path || '';
    if (!url || url === 'null') return [defaultImage];
    const finalUrl = url.startsWith('http') || url.startsWith('/') 
      ? url 
      : `/images/${url}`;
    return [finalUrl];
  }
  
  return [defaultImage];
};
