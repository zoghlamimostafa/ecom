import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api', // Updated to match backend port
});

// Ajouter un interceptor pour inclure le jeton d'accès dans les en-têtes de chaque requête
axiosInstance.interceptors.request.use((config) => {
  // Try customer object first (new format)
  let token = "";
  const customer = localStorage.getItem('customer');
  if (customer) {
    try {
      const parsedCustomer = JSON.parse(customer);
      token = parsedCustomer.token || "";
    } catch (e) {
      console.error("Error parsing customer from localStorage:", e);
    }
  }
  
  // Fallback to old accessToken format
  if (!token) {
    token = localStorage.getItem('accessToken') || "";
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default axiosInstance;
