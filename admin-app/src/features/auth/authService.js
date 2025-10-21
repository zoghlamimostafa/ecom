import axios from "axios";
import { getConfig } from "../../utils/axiosConfig";
import { base_url } from "../../utils/baseUrl";
const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};
const getOrders = async () => {
  try {
    const response = await axios.get(`${base_url}user/getallorders`, getConfig());
    
    console.log('📦 Admin - Réponse getAllOrders:', response.data);
    
    // Le backend retourne { success: true, count: X, orders: [...] }
    if (response.data && Array.isArray(response.data.orders)) {
      console.log('✅ Admin - Commandes trouvées:', response.data.count);
      return response.data.orders;
    } else if (response.data && Array.isArray(response.data.data)) {
      // Fallback pour ancien format
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('⚠️ Admin - Structure de données inattendue:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Admin - Erreur récupération commandes:', error);
    throw error;
  }
};
const getOrder = async (id) => {
  const response = await axios.post(
    `${base_url}user/getorderbyuser/${id}`,
    "",
    getConfig()
  );

  return response.data;
};
// Function to send forgot password token
// Function to send forgot password token
const forgotPasswordToken = async (email) => {
    const response = await axios.post(`${base_url}api/user/forgot-password-token`, { email }, getConfig());
    return response.data;
  };
  

// Function to reset user password
const resetPassword = async (password, token) => {
  const response = await axios.post(`${base_url}user/reset-password/${token}`, { password }, getConfig());
  return response.data;
};

// Function to update order status
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${base_url}user/update-order/${orderId}`, { status }, getConfig());
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Function to delete order
const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${base_url}user/delete-order/${orderId}`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

const authService = {
  login,
  getOrders,
  getOrder,
  forgotPasswordToken,
  resetPassword,
  updateOrderStatus,
  deleteOrder
};

export default authService;