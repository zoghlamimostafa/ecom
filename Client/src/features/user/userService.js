import axios from "axios";
import { base_url } from "../../utils/baseUrl";

// Fonction pour récupérer le token actuel depuis le localStorage
const getAuthConfig = () => {
  // Try to get customer object first (new format)
  const customer = localStorage.getItem("customer");
  let token = "";
  
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
    token = localStorage.getItem("accessToken") || "";
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};

// Function to refresh token
const refreshToken = async () => {
  try {
    const response = await axios.post(`${base_url}token/refresh`, {}, getAuthConfig());
    
    if (response.data && response.data.token) {
      // Update token in localStorage
      const customer = localStorage.getItem("customer");
      if (customer) {
        const customerData = JSON.parse(customer);
        customerData.token = response.data.token;
        localStorage.setItem("customer", JSON.stringify(customerData));
      }
      
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear invalid token data
    localStorage.removeItem("customer");
    // Redirect to login page
    window.location.href = "/login";
    return null;
  }
};

// Enhanced axios request function with automatic token refresh
const makeAuthenticatedRequest = async (requestFn, retryCount = 0) => {
  try {
    return await requestFn();
  } catch (error) {
    // If it's a 401 error and we haven't already retried
    if (error.response && error.response.status === 401 && retryCount === 0) {
      console.log("Token expired, attempting refresh...");
      
      const newToken = await refreshToken();
      if (newToken) {
        console.log("Token refreshed successfully, retrying request...");
        // Retry the original request with the new token
        return await makeAuthenticatedRequest(requestFn, retryCount + 1);
      }
    }
    
    // If refresh failed or it's not a 401 error, throw the original error
    throw error;
  }
};

// Configuration Axios statique pour les requêtes sans authentification
export const config = {
  headers: {
    Accept: "application/json",
  },
};

// Fonction pour enregistrer un utilisateur
const register = async (userData) => {
  try {
    // Validation des données avant envoi
    console.log('📝 userService.register - Données reçues:', userData);
    
    if (!userData || typeof userData !== 'object') {
      throw new Error('Données utilisateur invalides');
    }
    
    const { firstname, lastname, email, mobile, password } = userData;
    
    // Vérification que tous les champs obligatoires sont présents et non vides
    if (!firstname || firstname.trim() === '') {
      throw new Error('Le prénom est obligatoire');
    }
    if (!lastname || lastname.trim() === '') {
      throw new Error('Le nom est obligatoire');
    }
    if (!email || email.trim() === '') {
      throw new Error('L\'email est obligatoire');
    }
    if (!password || password.trim() === '') {
      throw new Error('Le mot de passe est obligatoire');
    }
    if (!mobile || mobile.trim() === '') {
      throw new Error('Le numéro de téléphone est obligatoire');
    }
    
    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format d\'email invalide');
    }
    
    // Validation longueur mot de passe
    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    console.log('✅ userService.register - Validation réussie, envoi des données');
    
    const response = await axios.post(`${base_url}user/register`, userData);
    if (response.data) {
      console.log('✅ userService.register - Réponse reçue:', response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.error('❌ userService.register - Erreur:', error);
    handleAxiosError(error, "Échec de l'inscription");
  }
};

// Fonction pour la connexion
const login = async (userData) => {
  try {
    const response = await axios.post(`${base_url}user/login`, userData);
    if (response.data) {
      localStorage.setItem("customer", JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    handleAxiosError(error, "Échec de la connexion");
  }
};

// Récupérer la wishlist de l'utilisateur
const getUserWishlist = async () => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.get(`${base_url}user/wishlist`, getAuthConfig());
    return response.data;
  });
};

// Ajouter/supprimer un produit de la wishlist
const toggleWishlist = async (prodId) => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.put(`${base_url}product/wishlist`, { prodId }, getAuthConfig());
    return response.data;
  });
};

// Fonction pour envoyer l'email de réinitialisation du mot de passe
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${base_url}user/forgot-password-token`, { email });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Échec de l'envoi du token de réinitialisation");
  }
};

// Fonction pour réinitialiser le mot de passe
const resetPassword = async (data) => {
  try {
    const response = await axios.put(`${base_url}user/reset-password/${data.token}`, { password: data.password });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Échec de la réinitialisation du mot de passe");
  }
};

// Fonction pour récupérer toutes les commandes de l'utilisateur connecté
const getOrders = async () => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.get(`${base_url}user/getmyorders`, getAuthConfig());
    return response.data;
  });
};

// Fonction pour récupérer une commande spécifique par ID
const getOrderById = async (orderId) => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.get(`${base_url}user/get-orders/${orderId}`, getAuthConfig());
    return response.data;
  });
};

// Fonction pour récupérer toutes les commandes (admin)
const getAllOrders = async () => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.get(`${base_url}user/getallorders`, getAuthConfig());
    return response.data;
  });
};

// Fonction pour créer une commande
const createOrder = async (orderData) => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.post(`${base_url}user/cart/create-order`, orderData, getAuthConfig());
    return response.data;
  });
};

// Fonction pour mettre à jour le statut d'une commande (admin)
const updateOrderStatus = async (orderId, status) => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.put(`${base_url}user/order/update-order/${orderId}`, { status }, getAuthConfig());
    return response.data;
  });
};

// Ajouter un produit au panier
const addToCart = async (cartData) => {
  return await makeAuthenticatedRequest(async () => {
    // Filter out null/undefined color before sending to backend
    const cleanedCartData = { ...cartData };
    if (cleanedCartData.color === null || cleanedCartData.color === undefined) {
      delete cleanedCartData.color;
    }
    
    const response = await axios.post(`${base_url}user/cart`, cleanedCartData, getAuthConfig());
    return response.data;
  });
};

// Récupérer le panier
const getCart = async () => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.get(`${base_url}user/cart`, getAuthConfig());
    return response.data;
  });
};

// Supprimer un produit du panier
const removeProductFromCart = async (id) => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.delete(`${base_url}user/delete-product-cart`, {
      data: { cartItemId: id },
      ...getAuthConfig(),
    });
    return response.data;
  });
};

// Mettre à jour la quantité d'un produit dans le panier
const updateProductFromCart = async (cartDetail) => {
  return await makeAuthenticatedRequest(async () => {
    const response = await axios.put(
      `${base_url}user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
      {},
      getAuthConfig()
    );
    return response.data;
  });
};

// Mettre à jour les informations de l'utilisateur
const updateUser = async (data) => {
  try {
    const response = await axios.put(`${base_url}user/edit-user`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Échec de la mise à jour de l'utilisateur");
  }
};

// Fonction de déconnexion
const logout = async () => {
  try {
    // Always remove localStorage first, even if API call fails
    localStorage.removeItem("customer");
    
    // Try to call backend logout endpoint
    try {
      await axios.get(`${base_url}user/logout`);
      return { success: true, message: "Déconnexion réussie" };
    } catch (apiError) {
      // Even if API call fails, logout is still successful since we cleared localStorage
      console.warn("Logout API call failed, but local logout successful:", apiError.message);
      return { success: true, message: "Déconnexion locale réussie" };
    }
  } catch (error) {
    // Fallback: ensure localStorage is cleared
    localStorage.removeItem("customer");
    console.error("Logout error:", error);
    return { success: true, message: "Déconnexion forcée" };
  }
};

// Fonction pour gérer les erreurs Axios
const handleAxiosError = (error, defaultMessage) => {
  if (error.response) {
    console.error("Erreur du serveur:", error.response.data);
    throw new Error(`${defaultMessage}: ${error.response.data.message}`);
  } else if (error.request) {
    console.error("Aucune réponse du serveur:", error.request);
    throw new Error(`${defaultMessage}: Aucune réponse du serveur`);
  } else {
    console.error("Erreur lors de la requête:", error.message);
    throw new Error(`${defaultMessage}: ${error.message}`);
  }
};

// Fonction pour enregistrer l'adresse de l'utilisateur
export const saveAddress = async (addressData) => {
  try {
    // Effectuer la requête POST pour enregistrer l'adresse
    const response = await axios.post(`${base_url}user/address`, { address: addressData }, getAuthConfig());
    return response.data;
  } catch (error) {
    // Gérer les erreurs de l'API
    console.error('Erreur lors de la mise à jour de l\'adresse:', error.response ? error.response.data : error.message);
    throw error;  // Propager l'erreur pour qu'elle soit gérée dans le composant appelant
  }
};


// Exportation des fonctions du service utilisateur
const userService = {
  register,
  saveAddress,
  login,
  getUserWishlist,
  toggleWishlist,
  forgotPassword,
  resetPassword,
  getOrders,
  getOrderById,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  updateUser,
  logout,
};

export default userService;
