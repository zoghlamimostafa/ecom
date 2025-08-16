// routes/imageRoutes.js - Routes pour les images

const express = require('express');
const router = express.Router();
const { detectFaceAndAttributes } = require('../controller/imageController');

// Route pour la détection de visage (POST)
router.post('/detect-face/:id', detectFaceAndAttributes);

module.exports = router;
