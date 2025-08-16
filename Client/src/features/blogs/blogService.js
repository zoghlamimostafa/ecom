import axios from "axios";
import { base_url } from "../../utils/baseUrl";  // Assurez-vous que cette URL est correcte
import { config } from "../../utils/axiosconfig"; // Assurez-vous que vous avez un fichier de config valide pour axios

// Fonction pour récupérer tous les blogs avec gestion du cache
const getBlogs = async (userData) => {
  try {
    const response = await axios.get(`${base_url}blog`, { ...config });
    
    if (response.status === 200 && response.data) {
      return response.data; // Retourne les blogs si la requête est réussie
    } else {
      throw new Error("Erreur lors de la récupération des blogs");
    }
  } catch (error) {
    console.error("Erreur de récupération des blogs:", error);
    throw error; // Lève l'erreur pour être capturée ailleurs
  }
};

// Fonction pour récupérer un seul blog par ID avec gestion du cache
const getBlog = async (id) => {
  try {
    const response = await axios.get(`${base_url}blog/${id}`, { ...config });
    
    if (response.status === 200 && response.data) {
      return response.data; // Retourne le blog spécifique si la requête est réussie
    } else {
      throw new Error("Erreur lors de la récupération du blog");
    }
  } catch (error) {
    console.error("Erreur de récupération du blog:", error);
    throw error; // Lève l'erreur pour être capturée ailleurs
  }
};

// Service regroupant les fonctions
const blogService = {
  getBlogs,
  getBlog,
};

export default blogService;
