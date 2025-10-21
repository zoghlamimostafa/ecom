/**
 * Utilitaire pour gérer l'affichage des images de produits
 */

/**
 * Extrait l'URL de la première image valide d'un produit
 * @param {*} images - Peut être un string JSON, un array, un objet ou null
 * @returns {string|null} - URL de l'image ou null
 */
export const getProductImageUrl = (images) => {
  console.log('🖼️ getProductImageUrl - Input:', images, 'Type:', typeof images);
  
  if (!images) {
    console.log('⚠️ Pas d\'images');
    return null;
  }

  try {
    let imageData = images;
    
    // Si c'est un string JSON, parser
    if (typeof imageData === 'string') {
      const trimmed = imageData.trim();
      if (trimmed && trimmed !== 'null' && trimmed !== 'undefined') {
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            imageData = JSON.parse(trimmed);
          } catch (parseError) {
            console.warn('⚠️ Échec du parsing JSON:', parseError);
            // Si ça ressemble à une URL, l'utiliser directement
            if (trimmed.startsWith('http')) {
              return trimmed;
            }
            return null;
          }
        } else if (trimmed.startsWith('http')) {
          // C'est une URL simple
          return trimmed;
        }
      } else {
        return null;
      }
    }

    // Si c'est un array
    if (Array.isArray(imageData)) {
      for (const img of imageData) {
        if (typeof img === 'string' && img.trim()) {
          // Accepter les URLs http/https ET les chemins relatifs /images/...
          const trimmedImg = img.trim();
          if (trimmedImg.startsWith('http') || trimmedImg.startsWith('/')) {
            console.log('✅ Image trouvée (array string):', trimmedImg);
            return trimmedImg;
          }
        }
        if (img && typeof img === 'object' && img.url) {
          console.log('✅ Image trouvée (array object):', img.url);
          return img.url;
        }
      }
      console.log('⚠️ Aucune image valide dans le tableau');
      return null;
    }

    // Si c'est un objet avec url
    if (typeof imageData === 'object' && imageData.url) {
      console.log('✅ Image trouvée (object):', imageData.url);
      return imageData.url;
    }

    console.log('⚠️ Format d\'image non reconnu');
    return null;
  } catch (error) {
    console.error('❌ Erreur dans getProductImageUrl:', error);
    return null;
  }
};

/**
 * Extrait toutes les URLs d'images valides d'un produit
 * @param {*} images - Peut être un string JSON, un array, un objet ou null
 * @returns {string[]} - Array d'URLs d'images
 */
export const getAllProductImageUrls = (images) => {
  console.log('🖼️ getAllProductImageUrls - Input:', images);
  
  if (!images) {
    return [];
  }

  try {
    let imageData = images;
    
    // Si c'est un string JSON, parser
    if (typeof imageData === 'string') {
      const trimmed = imageData.trim();
      if (trimmed && trimmed !== 'null' && trimmed !== 'undefined') {
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            imageData = JSON.parse(trimmed);
          } catch (parseError) {
            console.warn('⚠️ Échec du parsing JSON:', parseError);
            if (trimmed.startsWith('http')) {
              return [trimmed];
            }
            return [];
          }
        } else if (trimmed.startsWith('http')) {
          return [trimmed];
        }
      } else {
        return [];
      }
    }

    // Si c'est un array
    if (Array.isArray(imageData)) {
      const urls = [];
      for (const img of imageData) {
        if (typeof img === 'string' && img.trim()) {
          const trimmedImg = img.trim();
          // Accepter les URLs http/https ET les chemins relatifs /images/...
          if (trimmedImg.startsWith('http') || trimmedImg.startsWith('/')) {
            urls.push(trimmedImg);
          }
        } else if (img && typeof img === 'object' && img.url) {
          urls.push(img.url);
        }
      }
      console.log(`✅ ${urls.length} images trouvées`);
      return urls;
    }

    // Si c'est un objet avec url
    if (typeof imageData === 'object' && imageData.url) {
      return [imageData.url];
    }

    return [];
  } catch (error) {
    console.error('❌ Erreur dans getAllProductImageUrls:', error);
    return [];
  }
};
