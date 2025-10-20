const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(__dirname, "../public/images/");
    console.log("📁 Multer destination:", destPath);
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniquesuffix + ".jpeg";
    console.log("📝 Multer filename:", filename);
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  console.log("🔍 Multer filter - File:", file.originalname, "Type:", file.mimetype);
  
  // Validation stricte: seulement images
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    console.log("✅ Type MIME accepté:", file.mimetype);
    cb(null, true);
  } else {
    console.log("❌ Type MIME rejeté:", file.mimetype);
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}. Formats acceptés: JPEG, PNG, GIF, WebP`), false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB par fichier
    files: 10 // Maximum 10 fichiers
  },
});

const productImgResize = async (req, res, next) => {
  console.log("\n========== MIDDLEWARE RESIZE ==========");
  console.log("📸 Files reçus pour resize:", req.files?.length || 0);
  
  if (!req.files || req.files.length === 0) {
    console.log("⚠️ Aucun fichier à redimensionner");
    return next();
  }
  
  try {
    console.log("🔧 Début du redimensionnement de", req.files.length, "fichier(s)");
    
    await Promise.all(
      req.files.map(async (file, index) => {
        try {
          console.log(`\n--- Resize fichier ${index + 1}/${req.files.length}`);
          console.log("    Original filename:", file.filename);
          console.log("    Original path:", file.path);
          console.log("    Original size:", (file.size / 1024).toFixed(2), "KB");
          
          // Vérifier que le fichier existe avant de le redimensionner
          if (!fs.existsSync(file.path)) {
            console.warn("⚠️ Fichier introuvable, skip resize:", file.path);
            return; // Skip ce fichier mais continue avec les autres
          }
          
          // Créer un nom de fichier unique pour la sortie
          const outputFileName = `resized-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.filename}`;
          const outputPath = path.join(__dirname, "../public/images/", outputFileName);
          
          console.log("    Output filename:", outputFileName);
          console.log("    Output path:", outputPath);
          
          // Vérifier l'intégrité du fichier avant le traitement
          const fileBuffer = fs.readFileSync(file.path);
          console.log("    Buffer size:", (fileBuffer.length / 1024).toFixed(2), "KB");
          
          // Traiter avec Sharp en utilisant le buffer au lieu du path
          await sharp(fileBuffer, { failOnError: false })
            .resize(300, 300, { fit: 'cover', withoutEnlargement: false })
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(outputPath);
          
          console.log("✅ Redimensionnement terminé");
          
          // Vérifier que le fichier redimensionné existe
          if (fs.existsSync(outputPath)) {
            const outputStats = fs.statSync(outputPath);
            console.log("    Taille finale:", (outputStats.size / 1024).toFixed(2), "KB");
            
            // Supprimer le fichier original avec gestion d'erreur
            try {
              fs.unlinkSync(file.path);
              console.log("🗑️ Fichier original supprimé");
            } catch (unlinkError) {
              console.warn("⚠️ Impossible de supprimer le fichier temporaire:", file.path);
            }
            
            // Mettre à jour le path pour pointer vers le fichier redimensionné
            file.path = outputPath;
            file.filename = outputFileName;
            
            console.log("✅ Fichier mis à jour dans req.files");
          } else {
            console.warn("⚠️ Fichier redimensionné non créé, garder l'original");
          }
        } catch (fileError) {
          console.warn(`⚠️ Erreur resize fichier ${file.filename}, keep original:`, fileError.message);
          // Continue avec l'original si le resize échoue
        }
      })
    );
    
    console.log("\n✅ Traitement terminé");
    console.log("========== FIN MIDDLEWARE RESIZE ==========\n");
    next();
  } catch (error) {
    console.error("\n❌ ERREUR GLOBALE RESIZE:", error.message);
    console.error("========== FIN MIDDLEWARE RESIZE (ERREUR) ==========\n");
    // Ne pas bloquer, continuer avec les fichiers originaux
    next();
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