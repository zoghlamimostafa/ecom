const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controller/paymentController'); // Vérifiez que c'est le bon chemin

// Définir la route POST pour créer un paiement
router.post('/create-payment-intent', createPaymentIntent);
router.post('/process', createPaymentIntent); // Add the /process route that frontend is calling

module.exports = router;
