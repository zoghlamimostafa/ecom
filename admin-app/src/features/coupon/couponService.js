import axios from "axios";
import { getConfig } from "../../utils/axiosConfig";
import { base_url } from "../../utils/baseUrl";
const getCoupons = async () => {
  const response = await axios.get(`${base_url}coupon/`, getConfig());
  console.log('📦 Coupons reçus du backend:', response.data);
  return response.data.coupons || response.data;
};

const createCoupons = async (coupon) => {
  console.log('📤 Envoi du coupon:', coupon);
  const response = await axios.post(`${base_url}coupon/`, coupon, getConfig());
  console.log('✅ Réponse création coupon:', response.data);
  return response.data.coupon || response.data;
};
const updateCoupon = async (coupon) => {
  const response = await axios.put(
    `${base_url}coupon/${coupon.id}`,
    {
      name: coupon.couponData.name,
      expiry: coupon.couponData.expiry,
      discount: coupon.couponData.discount,
    },
    getConfig()
  );

  return response.data;
};
const getCoupon = async (id) => {
  const response = await axios.get(`${base_url}coupon/${id}`, getConfig());
  console.log('📦 Coupon reçu:', response.data);
  return response.data.coupon || response.data;
};

const deleteCoupon = async (id) => {
  const response = await axios.delete(`${base_url}coupon/${id}`, getConfig());

  return response.data;
};
const couponService = {
  getCoupons,
  createCoupons,
  deleteCoupon,
  getCoupon,
  updateCoupon,
};

export default couponService;