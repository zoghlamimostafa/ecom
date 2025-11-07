const { Coupon } = require('../models');
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json({
      success: true,
      message: "Coupon créé avec succès",
      coupon: newCoupon
    });
  } catch (error) {
    console.error('❌ Error creating coupon:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    // Si c'est une requête publique (route /active), ne retourner que les coupons actifs et valides
    const isPublicRequest = req.path.includes('/active');
    
    let whereClause = {};
    if (isPublicRequest) {
      const now = new Date();
      whereClause = {
        isActive: true,
        expiry: {
          [require('sequelize').Op.gte]: now
        }
      };
    }
    
    const coupons = await Coupon.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: coupons.length,
      coupons: coupons
    });
  } catch (error) {
    console.error('❌ Error getting coupons:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon non trouvé"
      });
    }
    
    await Coupon.update(req.body, { 
      where: { id: id }
    });
    const updatecoupon = await Coupon.findByPk(id);
    res.json({
      success: true,
      message: "Coupon mis à jour avec succès",
      coupon: updatecoupon
    });
  } catch (error) {
    console.error('❌ Error updating coupon:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon non trouvé"
      });
    }
    
    await Coupon.destroy({ where: { id: id } });
    res.json({
      success: true,
      message: "Coupon supprimé avec succès"
    });
  } catch (error) {
    console.error('❌ Error deleting coupon:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon non trouvé"
      });
    }
    res.json({
      success: true,
      coupon: coupon
    });
  } catch (error) {
    console.error('❌ Error getting coupon:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Valider et appliquer un coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { couponName, cartTotal } = req.body;
  
  console.log('🎫 Tentative d\'application du coupon:', couponName);
  
  try {
    if (!couponName) {
      return res.status(400).json({
        success: false,
        message: "Nom du coupon requis"
      });
    }
    
    if (!cartTotal || cartTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Montant du panier invalide"
      });
    }

    // Chercher le coupon par nom (case insensitive)
    const coupon = await Coupon.findOne({ 
      where: { 
        name: couponName.toUpperCase() 
      } 
    });

    if (!coupon) {
      console.log('❌ Coupon non trouvé:', couponName);
      return res.status(404).json({
        success: false,
        message: "Code promo invalide"
      });
    }

    // Vérifier si le coupon est actif
    if (!coupon.isActive) {
      console.log('❌ Coupon inactif:', couponName);
      return res.status(400).json({
        success: false,
        message: "Ce code promo n'est plus actif"
      });
    }

    // Vérifier la date d'expiration
    const now = new Date();
    const expiryDate = new Date(coupon.expiry);
    if (expiryDate < now) {
      console.log('❌ Coupon expiré:', couponName, '- Date expiration:', expiryDate);
      return res.status(400).json({
        success: false,
        message: "Ce code promo a expiré"
      });
    }

    // Vérifier la limite d'utilisation
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      console.log('❌ Limite d\'utilisation atteinte:', couponName);
      return res.status(400).json({
        success: false,
        message: "Ce code promo a atteint sa limite d'utilisation"
      });
    }

    // Calculer le montant de la réduction
    const discount = parseFloat(coupon.discount);
    const discountAmount = (cartTotal * discount) / 100;
    const totalAfterDiscount = cartTotal - discountAmount;

    console.log('✅ Coupon valide:', {
      name: coupon.name,
      discount: discount + '%',
      cartTotal,
      discountAmount: discountAmount.toFixed(2),
      totalAfterDiscount: totalAfterDiscount.toFixed(2)
    });

    res.json({
      success: true,
      message: `Code promo appliqué ! -${discount}%`,
      coupon: {
        id: coupon.id,
        name: coupon.name,
        discount: discount,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        totalAfterDiscount: parseFloat(totalAfterDiscount.toFixed(2))
      }
    });

  } catch (error) {
    console.error('❌ Error applying coupon:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de l'application du coupon",
      error: error.message 
    });
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  applyCoupon,
};