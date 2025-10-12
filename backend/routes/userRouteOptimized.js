const express = require("express");
const router = express.Router();

// Middlewares
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { adminOptimizationMiddleware, performanceLoggerMiddleware } = require("../middleware/adminOptimization");
const cacheMiddleware = require("../middleware/cacheMiddleware");

// Controllers optimisés
const {
  getAllUsersOptimized,
  getUserByIdOptimized,
  createUserOptimized,
  updateUserOptimized,
  deleteUserOptimized,
  toggleUserBlockStatus,
  bulkUserOperations,
  getUserStats
} = require("../controller/userCtrlOptimized");

// Controllers legacy (pour compatibilité)
const {
  createUser,
  loginUserCtrl,
  loginAdmin,
  logout,
  forgotPasswordToken,
  updatedUser,
  blockUser,
  unblockUser,
  deleteaUser,
  getallUser
} = require("../controller/userCtrl");

// Appliquer le middleware de performance
router.use(performanceLoggerMiddleware);

// Routes d'authentification (pas de middleware admin requis)
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/forgot-password", forgotPasswordToken);
router.get("/logout", logout);

// Routes utilisateur authentifié
router.put("/profile", authMiddleware, updatedUser);

// ===== ROUTES ADMIN OPTIMISÉES =====

// Appliquer les middlewares admin pour toutes les routes admin
router.use('/admin/*', authMiddleware, isAdmin, adminOptimizationMiddleware);

// 1. Gestion des utilisateurs - CRUD optimisé
router.get("/admin/users", cacheMiddleware(60), getAllUsersOptimized);
router.get("/admin/users/stats", cacheMiddleware(300), getUserStats);
router.get("/admin/users/:id", cacheMiddleware(180), getUserByIdOptimized);
router.post("/admin/users", createUserOptimized);
router.put("/admin/users/:id", updateUserOptimized);
router.delete("/admin/users/:id", deleteUserOptimized);

// 2. Gestion du statut des utilisateurs
router.put("/admin/users/:id/block", toggleUserBlockStatus);

// 3. Opérations en lot optimisées
router.post("/admin/users/bulk", bulkUserOperations);

// ===== ROUTES LEGACY (pour compatibilité) =====
// Ces routes sont gardées pour ne pas casser l'existant

// Routes legacy pour les utilisateurs (sans optimisations)
router.get("/all-users", authMiddleware, isAdmin, cacheMiddleware(120), getallUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/delete-user/:id", authMiddleware, isAdmin, deleteaUser);

// ===== DOCUMENTATION DES NOUVELLES ROUTES =====

/* 
NOUVELLES ROUTES OPTIMISÉES :

1. GET /api/user/admin/users
   - Récupère tous les utilisateurs avec pagination
   - Paramètres : page, limit, search, status
   - Cache : 60 secondes
   
2. GET /api/user/admin/users/stats
   - Statistiques des utilisateurs
   - Cache : 300 secondes
   
3. GET /api/user/admin/users/:id
   - Détails d'un utilisateur avec ses statistiques
   - Cache : 180 secondes
   
4. POST /api/user/admin/users
   - Créer un nouvel utilisateur
   - Body : { email, firstname, lastname, mobile, role }
   
5. PUT /api/user/admin/users/:id
   - Mettre à jour un utilisateur
   - Body : { firstname, lastname, mobile, address, isBlocked }
   
6. DELETE /api/user/admin/users/:id
   - Supprimer un utilisateur (avec vérifications)
   
7. PUT /api/user/admin/users/:id/block
   - Bloquer/débloquer un utilisateur
   - Body : { blocked: true/false }
   
8. POST /api/user/admin/users/bulk
   - Opérations en lot sur plusieurs utilisateurs
   - Body : { userIds: [], operation: 'block'|'unblock'|'delete' }

AMÉLIORATIONS :
- Pagination forcée (max 100 éléments)
- Recherche optimisée
- Cache intelligent
- Logging des performances
- Validation des données
- Protection contre la suppression des admins
- Vérification des commandes avant suppression
*/

module.exports = router;