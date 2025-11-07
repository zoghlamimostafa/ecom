import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { getConfig } from "../../utils/axiosConfig";

const getProductCategories = async () => {
  const response = await axios.get(`${base_url}category/`);
  
  // Extraire les catégories de la réponse structurée
  if (response.data.success && response.data.categories) {
    return response.data.categories;
  }
  
  // Fallback si la structure est différente
  return response.data;
};

const createCategory = async (category) => {
  const config = getConfig(); // Get fresh token
  const response = await axios.post(`${base_url}category/`, category, config);
  return response.data;
};

const getProductCategory = async (id) => {
  const config = getConfig(); // Get fresh token
  const response = await axios.get(`${base_url}category/${id}`, config);
  
  // Extraire la catégorie de la réponse structurée
  if (response.data.success && response.data.category) {
    return response.data.category;
  }
  
  // Fallback si la structure est différente
  return response.data;
};

const deleteProductCategory = async (id) => {
  const config = getConfig(); // Get fresh token
  const response = await axios.delete(`${base_url}category/${id}`, config);
  return response.data;
};

const updateProductCategory = async (category) => {
  console.log(category);
  const config = getConfig(); // Get fresh token
  const response = await axios.put(
    `${base_url}category/${category.id}`,
    { title: category.pCatData.title },
    config
  );
  return response.data;
};
const pCategoryService = {
  getProductCategories,
  createCategory,
  getProductCategory,
  deleteProductCategory,
  updateProductCategory,
};

export default pCategoryService;