const { Coupon } = require('../models');
;
const asynHandler = require("express-async-handler");

const createCoupon = asynHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllCoupons = asynHandler(async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;try {
    await Coupon.update(req.body, { where: { id: id }, 
      new: true,
     });
    const updatecoupon = await Coupon.findByPk(id);
    res.json(updatecoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;try {
    const deletecoupon = await Coupon.destroy({ where: { id: id } });
    res.json(deletecoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const getCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;try {
    const getAcoupon = await Coupon.findByPk(id);
    res.json(getAcoupon);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
};