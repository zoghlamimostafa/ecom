import axios from "axios";
import { getConfig } from "../../utils/axiosConfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  try {
    console.log('Tentative de récupération des produits depuis:', `${base_url}product/`);
    const response = await axios.get(`${base_url}product/`);
    console.log('Réponse reçue:', response.data);
    
    // Extraire les produits - peut être dans response.data.products ou directement response.data
    let productsData = response.data;
    if (response.data && response.data.products) {
      productsData = response.data.products;
    }
    
    // Vérifier que productsData est un tableau
    if (!Array.isArray(productsData)) {
      console.error('❌ Les données des produits ne sont pas un tableau:', productsData);
      throw new Error(`Format de réponse invalide. Reçu: ${typeof productsData}`);
    }
    
    // Normaliser les données des produits
    const normalizedProducts = productsData.map(product => {
      const normalizedProduct = { ...product };
      
      // Normaliser les images
      if (product.images) {
        try {
          if (typeof product.images === 'string') {
            normalizedProduct.images = JSON.parse(product.images);
          }
          if (!Array.isArray(normalizedProduct.images)) {
            normalizedProduct.images = [];
          }
        } catch (e) {
          console.warn(`Erreur parsing images pour produit ${product.title}:`, e);
          normalizedProduct.images = [];
        }
      } else {
        normalizedProduct.images = [];
      }
      
      // Normaliser les couleurs
      if (product.color) {
        try {
          if (typeof product.color === 'string') {
            normalizedProduct.color = JSON.parse(product.color);
          }
          if (!Array.isArray(normalizedProduct.color)) {
            normalizedProduct.color = typeof product.color === 'string' ? [product.color] : [];
          }
        } catch (e) {
          console.warn(`Erreur parsing couleurs pour produit ${product.title}:`, e);
          normalizedProduct.color = [];
        }
      } else {
        normalizedProduct.color = [];
      }
      
      return normalizedProduct;
    });
    
    console.log('Produits normalisés:', normalizedProducts.length);
    return normalizedProducts;
  } catch (error) {
    console.error('Erreur détaillée lors du chargement des produits:', error);
    
    if (error.response) {
      // Erreur de réponse du serveur
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      throw new Error(`Erreur serveur ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Erreur de réseau
      console.error('Pas de réponse du serveur. Vérifiez que le backend fonctionne sur http://127.0.0.1:4000');
      throw new Error('Le serveur backend ne répond pas. Vérifiez qu\'il est bien démarré sur le port 4000.');
    } else {
      // Autre erreur
      console.error('Erreur de configuration:', error.message);
      throw new Error(`Erreur inattendue: ${error.message}`);
    }
  }
};

const createProduct = async (product) => {
  try {
    console.log("📦 Creating product with data:", product);
    console.log("🔗 API URL:", `${base_url}product/`);
    
    // Valider les données avant envoi
    if (!product.title) throw new Error("Le titre est requis");
    if (!product.description) throw new Error("La description est requise");
    if (!product.price || product.price <= 0) throw new Error("Le prix doit être positif");
    if (!product.brand) throw new Error("La marque est requise");
    if (!product.category) throw new Error("La catégorie est requise");
    if (!product.quantity || product.quantity <= 0) throw new Error("La quantité doit être positive");
    
    // Nettoyer les données
    const cleanProduct = {
      ...product,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      color: product.color || [],
      images: product.images || []
    };
    
    console.log("🧹 Données nettoyées:", cleanProduct);
    
    const response = await axios.post(`${base_url}product/`, cleanProduct, getConfig());
    console.log("✅ Product created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating product:", error);
    
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status:", error.response.status);
      
      // Messages d'erreur plus spécifiques
      if (error.response.status === 400) {
        const errorMsg = error.response.data?.message || "Données invalides";
        throw new Error(`Erreur de validation: ${errorMsg}`);
      } else if (error.response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      } else if (error.response.status === 500) {
        throw new Error("Erreur serveur. Contactez l'administrateur.");
      }
      
      // Retourner l'erreur complète pour le debugging
      throw new Error(error.response.data?.message || `Erreur HTTP ${error.response.status}`);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
    }
    
    throw new Error(error.message || "Erreur inconnue lors de la création");
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${base_url}product/${productId}`, getConfig());
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression du produit";
    throw new Error(errorMessage);
  }
};

const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${base_url}product/${productId}`, getConfig());
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la récupération du produit";
    throw new Error(errorMessage);
  }
};

const updateProduct = async ({ id, productData }) => {
  try {
    const response = await axios.put(`${base_url}product/${id}`, productData, getConfig());
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la mise à jour du produit";
    throw new Error(errorMessage);
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
