const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    console.log("\n========== DEBUT UPLOAD ==========");
    console.log("📸 Upload images - Files reçus:", req.files?.length || 0);
    console.log("📸 User:", req.user?.email || "Non authentifié");
    
    if (!req.files || req.files.length === 0) {
      console.log("❌ Aucun fichier reçu dans req.files");
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const urls = [];
    const files = req.files;
    
    console.log("📸 Traitement de", files.length, "fichier(s):");
    
    for (const file of files) {
      const { filename, path: filePath, originalname, size } = file;
      console.log("\n--- Fichier:", originalname || filename);
      console.log("    Filename:", filename);
      console.log("    Path:", filePath);
      console.log("    Size:", (size / 1024).toFixed(2), "KB");
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        console.error("❌ Le fichier n'existe pas:", filePath);
        continue;
      }
      
      // URL DYNAMIQUE: Utilise BASE_URL de .env ou détecte automatiquement
      const imageName = String(filename);  // Force string
      
      // Déterminer l'URL de base (depuis .env ou depuis la requête)
      let baseUrl = process.env.BASE_URL;
      
      if (!baseUrl) {
        // Si BASE_URL n'est pas défini, construire depuis la requête
        const protocol = req.protocol; // http ou https
        const host = req.get('host'); // IP:port ou domaine:port
        baseUrl = `${protocol}://${host}`;
      }
      
      const imageUrl = baseUrl + "/images/" + imageName;  // Concaténation simple
      const imageId = imageName.replace('.jpeg', '').replace('.jpg', '').replace('.png', '');
      
      console.log("✅ Base URL:", baseUrl);
      console.log("✅ Image name:", imageName);
      console.log("✅ URL générée:", imageUrl);
      console.log("✅ Public ID:", imageId);
      
      // Objet ULTRA-SIMPLE - seulement 2 champs
      const imageObject = {};
      imageObject.url = imageUrl;
      imageObject.public_id = imageId;
      
      console.log("✅ Objet créé:", JSON.stringify(imageObject));
      
      urls.push(imageObject);
    }
    
    console.log("\n🎉 Upload terminé:", urls.length, "images uploadées");
    console.log("📦 Response complète:", JSON.stringify(urls, null, 2));
    console.log("========== FIN UPLOAD ==========\n");
    
    // IMPORTANT: Retourner directement le tableau
    res.status(200).json(urls);
    
  } catch (error) {
    console.error("\n❌❌❌ ERREUR UPLOAD GLOBALE ❌❌❌");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("========== FIN UPLOAD (ERREUR) ==========\n");
    
    res.status(500).json({ 
      message: "Erreur lors de l'upload", 
      error: error.message 
    });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // id contient le nom du fichier (public_id)
    const imagePath = path.join(__dirname, '../public/images', `${id}.jpeg`);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("🗑️ Image supprimée:", id);
      res.json({ message: "Image supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Image non trouvée" });
    }
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};