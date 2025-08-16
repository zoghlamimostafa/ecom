// image.js - Modèle pour les images

const mongoose = require('mongoose');

// Définition du schéma d'image
const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  }
});

// Création du modèle d'image à partir du schéma
const Image = mongoose.model('Image', imageSchema);

// Export du modèle d'image
module.exports = Image;
