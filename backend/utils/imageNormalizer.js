/**
 * Normalise le champ images pour garantir un format cohérent
 * Entrée : string JSON, array, object, ou null
 * Sortie : array d'objets {url: string, public_id?: string}
 */
const normalizeImages = (images) => {
  // Si null ou undefined, retourner tableau vide
  if (!images) return [];
  
  // Si c'est une string JSON, parser
  if (typeof images === 'string') {
    // Nettoyer la string
    const trimmed = images.trim();
    
    // Ignorer les valeurs vides ou "null"
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
      return [];
    }
    
    // Si ça commence par [ ou {, c'est probablement du JSON
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        images = JSON.parse(trimmed);
        // Continue le traitement avec la valeur parsée
      } catch (e) {
        console.error('❌ Erreur parsing JSON images:', e.message);
        console.error('   Valeur:', trimmed.substring(0, 100));
        return [];
      }
    } else {
      // C'est une URL simple
      return [{ url: trimmed }];
    }
  }
  
  // Si c'est un tableau
  if (Array.isArray(images)) {
    return images.map(img => {
      if (typeof img === 'string') {
        return { url: img };
      }
      if (img && typeof img === 'object') {
        return {
          url: img.url || img.path || img.public_id || '',
          public_id: img.public_id || undefined
        };
      }
      return null;
    }).filter(img => img && img.url);
  }
  
  // Si c'est un objet unique
  if (typeof images === 'object') {
    const url = images.url || images.path || images.public_id || '';
    if (url) {
      return [{
        url: url,
        public_id: images.public_id || undefined
      }];
    }
  }
  
  return [];
};

/**
 * Normalise un objet produit complet
 */
const normalizeProductData = (product) => {
  const data = product.toJSON ? product.toJSON() : product;
  
  // Normaliser les images
  data.images = normalizeImages(data.images);
  
  // Normaliser les couleurs si c'est une string JSON
  if (data.color && typeof data.color === 'string') {
    try {
      data.color = JSON.parse(data.color);
    } catch (e) {
      data.color = [];
    }
  }
  if (!Array.isArray(data.color)) {
    data.color = [];
  }
  
  // Normaliser les tags si c'est une string JSON
  if (data.tags && typeof data.tags === 'string') {
    try {
      data.tags = JSON.parse(data.tags);
    } catch (e) {
      data.tags = [];
    }
  }
  if (!Array.isArray(data.tags)) {
    data.tags = data.tags ? [data.tags] : [];
  }
  
  return data;
};

module.exports = {
  normalizeImages,
  normalizeProductData
};
