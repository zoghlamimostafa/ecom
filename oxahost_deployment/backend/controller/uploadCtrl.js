const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const uploadImages = asyncHandler(async (req, res) => {
  try {
    console.log("📸 Upload images - Files reçus:", req.files?.length || 0);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const uploader = (path) => cloudinaryUploadImg(path);
    const urls = [];
    const files = req.files;
    
    for (const file of files) {
      const { path } = file;
      console.log("📤 Upload vers Cloudinary:", path);
      
      try {
        const newpath = await uploader(path);
        console.log("✅ Upload réussi:", newpath.url);
        urls.push(newpath);
        
        // Supprimer le fichier temporaire avec gestion d'erreur
        try {
          fs.unlinkSync(path);
        } catch (unlinkError) {
          console.warn("Warning: Could not delete temporary file:", path, unlinkError.message);
        }
      } catch (uploadError) {
        console.error("❌ Erreur upload Cloudinary pour", path, ":", uploadError);
        // Continue avec les autres fichiers
      }
    }
    
    if (urls.length === 0) {
      return res.status(500).json({ message: "Aucune image n'a pu être uploadée" });
    }
    
    const images = urls.map((file) => {
      return file;
    });
    
    console.log("🎉 Upload terminé:", images.length, "images");
    res.json(images);
    
  } catch (error) {
    console.error("❌ Erreur upload globale:", error);
    res.status(500).json({ 
      message: "Erreur lors de l'upload", 
      error: error.message 
    });
  }
});
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};