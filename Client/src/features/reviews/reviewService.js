import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const getAllReviews = async () => {
  const response = await axios.get(`${base_url}product/reviews/all`);
  return response.data.reviews;
};

const reviewService = {
  getAllReviews,
};

export default reviewService;
