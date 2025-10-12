import axios from "axios";
import { getConfig } from "../../utils/axiosConfig";
import { base_url } from "../../utils/baseUrl";

const uploadImg = async (data) => {
  try {
    console.log("📸 UploadService: Début upload", data);
    console.log("📸 Type de data:", typeof data, Array.isArray(data));
    console.log("📸 Nombre de fichiers:", data?.length);
    
    // Vérifier que data est un array de fichiers
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Aucun fichier à uploader");
    }
    
    // Créer FormData pour l'upload
    const formData = new FormData();
    
    // Ajouter les fichiers au FormData avec logs détaillés
    data.forEach((file, index) => {
      console.log(`📸 Fichier ${index}:`, {
        name: file.name,
        size: file.size,
        type: file.type
      });
      formData.append('images', file);
    });
    
    // Configuration spéciale pour l'upload avec authentification
    const config = getConfig();
    console.log("📸 Config auth:", config?.headers?.Authorization ? "Token présent" : "Pas de token");
    
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 secondes pour l'upload
    };
    
    console.log("📸 Envoi requête vers:", `${base_url}upload/`);
    
    const response = await axios.post(`${base_url}upload/`, formData, uploadConfig);
    console.log("✅ Upload réussi:", response.data);
    console.log("✅ Status:", response.status);
    console.log("✅ Nombre d'images uploadées:", response.data?.length);
    
    return response.data;
  } catch (error) {
    console.error("❌ Erreur upload détaillée:", error);
    
    if (error.response) {
      console.error("❌ Status:", error.response.status);
      console.error("❌ Data:", error.response.data);
      console.error("❌ Headers:", error.response.headers);
      
      // Messages d'erreur spécifiques
      if (error.response.status === 401) {
        throw new Error("Non autorisé - Veuillez vous reconnecter");
      } else if (error.response.status === 413) {
        throw new Error("Fichier trop volumineux");
      } else if (error.response.status === 415) {
        throw new Error("Type de fichier non supporté");
      } else {
        throw new Error(error.response.data?.message || `Erreur serveur: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("❌ Pas de réponse du serveur:", error.request);
      throw new Error("Impossible de joindre le serveur - Vérifiez votre connexion");
    } else {
      console.error("❌ Erreur configuration:", error.message);
      throw new Error(error.message);
    }
  }
};

const deleteImg = async (id) => {
  try {
    const response = await axios.delete(
      `${base_url}upload/delete-img/${id}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erreur suppression image:", error);
    throw error;
  }
};

const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;