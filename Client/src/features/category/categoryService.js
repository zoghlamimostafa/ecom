import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getCategories = async () => {
  const response = await axios.get(`${base_url}category/`);
  return response.data;
};

const getCategory = async (id) => {
  const response = await axios.get(`${base_url}category/${id}`);
  return response.data;
};

const categoryService = {
  getCategories,
  getCategory,
};

export default categoryService;
