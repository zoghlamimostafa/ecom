import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getCategories = async () => {
  const response = await axios.get(`${base_url}category/`);
  // L'API retourne { success, categories, pagination }
  // On retourne juste les catégories
  return response.data.categories || response.data;
};

const getCategoriesTree = async () => {
  const response = await axios.get(`${base_url}category/tree`);
  return response.data;
};

const getCategory = async (id) => {
  const response = await axios.get(`${base_url}category/${id}`);
  return response.data;
};

const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`${base_url}category/slug/${slug}`);
  return response.data;
};

const categoryService = {
  getCategories,
  getCategoriesTree,
  getCategory,
  getCategoryBySlug,
};

export default categoryService;
