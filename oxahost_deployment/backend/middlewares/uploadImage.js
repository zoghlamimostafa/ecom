const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  
  try {
    await Promise.all(
      req.files.map(async (file) => {
        // Créer un nom de fichier unique pour la sortie
        const outputFileName = `resized-${Date.now()}-${file.filename}`;
        const outputPath = path.join(__dirname, "../public/images/", outputFileName);
        
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(outputPath);
        
        // Supprimer le fichier original avec gestion d'erreur
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.warn("Warning: Could not delete temporary file:", file.path, unlinkError.message);
        }
        
        // Mettre à jour le path pour pointer vers le fichier redimensionné
        file.path = outputPath;
        file.filename = outputFileName;
      })
    );
    next();
  } catch (error) {
    console.error("❌ Image resize error:", error);
    res.status(500).json({ message: "Erreur lors du redimensionnement des images", error: error.message });
  }
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      // Créer un nom de fichier unique pour la sortie
      const outputFileName = `resized-blog-${Date.now()}-${file.filename}`;
      const outputPath = path.join(__dirname, "../public/images/", outputFileName);
      
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      
      // Supprimer le fichier original avec gestion d'erreur
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        console.warn("Warning: Could not delete temporary file:", file.path, unlinkError.message);
        // Continue without stopping the process
      }
      
      // Mettre à jour le filename pour pointer vers le fichier redimensionné
      file.filename = outputFileName;
    })
  );
  next();
};
module.exports = { uploadPhoto, productImgResize, blogImgResize };