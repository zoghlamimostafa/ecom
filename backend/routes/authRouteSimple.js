const express = require("express");
const { createUser, createAdmin, loginAdmin, loginUser } = require("../controller/userCtrl");
const router = express.Router();

// ===== ROUTES DE TEST SIMPLIFIÉES =====

// Route pour créer un utilisateur normal
router.post("/register", createUser);

// Route pour créer un admin 
router.post("/admin-register", createAdmin);

// Route pour login admin
router.post("/admin-login", loginAdmin);

// Route pour login utilisateur
router.post("/login", loginUser);

// Route de test
router.get("/test", (req, res) => {
  res.json({ 
    message: "Routes auth simplifiées fonctionnelles",
    routes: [
      "POST /api/user/register",
      "POST /api/user/admin-register", 
      "POST /api/user/admin-login",
      "POST /api/user/login"
    ]
  });
});

module.exports = router;