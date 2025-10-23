const { Coupon } = require('../models');
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    console.error('Error getting coupons:', error);
    res.status(500).json({ message: error.message });
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Coupon.update(req.body, { 
      where: { id: id }
    });
    const updatecoupon = await Coupon.findByPk(id);
    res.json(updatecoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletecoupon = await Coupon.destroy({ where: { id: id } });
    res.json(deletecoupon);
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getAcoupon = await Coupon.findByPk(id);
    res.json(getAcoupon);
  } catch (error) {
    console.error('Error getting coupon:', error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
};