const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImage");
const router = express.Router();

// Middleware de logging pour debug
router.use((req, res, next) => {
  console.log("\n🔵 Requête Upload Route:", req.method, req.path);
  console.log("🔵 Headers:", {
    'content-type': req.headers['content-type'],
    'authorization': req.headers.authorization ? 'Token présent' : 'Pas de token'
  });
  next();
});

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 50),
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;