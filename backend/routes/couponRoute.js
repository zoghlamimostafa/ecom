const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  applyCoupon,
} = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Routes publiques
router.get("/", getAllCoupons); // Route publique pour voir tous les coupons (pour test API)
router.get("/active", getAllCoupons); // Alias pour coupons actifs
router.post("/apply", authMiddleware, applyCoupon); // Appliquer un coupon (utilisateur connecté)

// Routes admin
router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/:id", authMiddleware, isAdmin, getCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;