import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { getAuthConfig } from "../../utils/axiosconfig";

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
      return response.data;
    }
};

const getSingleProduct = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`);
  if (response.data) {
    return response.data;
  }
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


const productService = {

    getProducts,
    addToWishlist,
    getSingleProduct,
    rateProduct};

export default productService;
