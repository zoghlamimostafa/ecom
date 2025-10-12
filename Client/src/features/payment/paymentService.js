// services/paymentService.js
import axios from 'axios';
import { base_url } from '../../utils/baseUrl';
import { getAuthConfig } from '../../utils/axiosconfig';

const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${base_url}process`,
      paymentData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error('Échec du traitement du paiement');
  }
};

const paymentService = {
  processPayment,
};

export default paymentService;
