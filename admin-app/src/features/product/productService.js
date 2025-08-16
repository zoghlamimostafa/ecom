import axios from "axios";
import { getConfig } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  try {
    const response = await axios.get(`${base_url}product/`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const createProduct = async (product) => {
  try {
    const response = await axios.post(`${base_url}product/`, product, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${base_url}product/${productId}`, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${base_url}product/${productId}`, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const updateProduct = async ({ id, productData }) => {
  try {
    const response = await axios.put(`${base_url}product/${id}`, productData, getConfig());
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const productService = {
  getProducts,
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
};

export default productService;
