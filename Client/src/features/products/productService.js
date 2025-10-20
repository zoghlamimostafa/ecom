import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { getAuthConfig } from "../../utils/axiosconfig";

// Fonction utilitaire pour normaliser les données produit
const normalizeProductData = (product) => {
  const normalized = { ...product };
  
  // Normaliser les images
  if (typeof normalized.images === 'string' && normalized.images !== 'null') {
    try {
      normalized.images = JSON.parse(normalized.images);
    } catch (e) {
      console.warn('Erreur parsing images pour le produit:', normalized.title, e);
      normalized.images = [];
    }
  }
  
  if (!Array.isArray(normalized.images)) {
    normalized.images = [];
  }
  
  // Normaliser les couleurs
  if (typeof normalized.color === 'string' && normalized.color !== 'null') {
    try {
      normalized.color = JSON.parse(normalized.color);
    } catch (e) {
      console.warn('Erreur parsing couleurs pour le produit:', normalized.title, e);
      normalized.color = [];
    }
  }
  
  if (!Array.isArray(normalized.color)) {
    normalized.color = [];
  }
  
  return normalized;
};

const getProducts = async (filters = {}) => {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.brand) {
      queryParams.append('brand', filters.brand);
    }
    if (filters.category) {
      queryParams.append('category', filters.category);
    }
    if (filters.tags) {
      queryParams.append('tags', filters.tags);
    }
    if (filters.minPrice && filters.minPrice > 0) {
      queryParams.append('price[gte]', filters.minPrice);
    }
    if (filters.maxPrice && filters.maxPrice < 10000) {
      queryParams.append('price[lte]', filters.maxPrice);
    }
    if (filters.sort) {
      let sortValue = '';
      switch (filters.sort) {
        case 'price-ascending':
          sortValue = 'price';
          break;
        case 'price-descending':
          sortValue = '-price';
          break;
        case 'title-ascending':
          sortValue = 'title';
          break;
        case 'title-descending':
          sortValue = '-title';
          break;
        case 'created-ascending':
          sortValue = 'createdAt';
          break;
        case 'created-descending':
          sortValue = '-createdAt';
          break;
        default:
          sortValue = '-createdAt';
      }
      queryParams.append('sort', sortValue);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${base_url}product?${queryString}` : `${base_url}product`;
    
    const response = await axios.get(url);
    if (response.data) {
      // Extraire les produits - peut être dans response.data.products ou directement response.data
      let productsData = response.data;
      if (response.data.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      }
      
      // Normaliser tous les produits avant de les retourner
      if (Array.isArray(productsData)) {
        return productsData.map(normalizeProductData);
      }
      
      console.warn('⚠️ Format de données inattendu:', response.data);
      return [];
    }
    return [];
};

const getSingleProduct = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`);
  console.log('📦 getSingleProduct response:', response.data);
  
  if (response.data) {
    // Le backend retourne {success: true, product: {...}}
    const productData = response.data.product || response.data;
    console.log('📦 Product data extracted:', productData);
    
    // Normaliser le produit unique avant de le retourner
    return normalizeProductData(productData);
  }
  return null;
}




const rateProduct = async (data) => {
  const response = await axios.put(`${base_url}product/rating`,data,getAuthConfig());
  if (response.data) {
    return response.data;
  }
};




const addToWishlist = async (prodId) => {
  const response = await axios.put(`${base_url}product/wishlist`,{prodId},getAuthConfig());
  if (response.data) {
    return response.data;
  }
};

const getWishlist = async () => {
  const response = await axios.get(`${base_url}user/wishlist`, getAuthConfig());
  if (response.data) {
    return response.data;
  }
};


const productService = {
    getProducts,
    addToWishlist,
    getWishlist,
    getSingleProduct,
    rateProduct
};

export default productService;
