// imageController.js - Contrôleur pour détecter les visages et afficher les détails de l'image

const faceapi = require('face-api.js');
const Image = require('../models/image'); // Import du modèle d'image

const detectFaceAndAttributes = async (req, res) => {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');

    console.log('Modèles chargés avec succès.');

    // Charger l'image depuis la base de données MongoDB
    const image = await Image.findById(req.params.id);
    console.log('Image chargée avec succès.');

    // Convertir les données de l'image en image buffer
    const buffer = Buffer.from(image.data.buffer);
    const img = await faceapi.bufferToImage(buffer);
    console.log('Image convertie avec succès.');

    // Détecter les visages avec leurs points de repère
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks();
    console.log('Détection des visages effectuée avec succès.');

    res.json({
      success: true,
      faceCount: detections.length,
      imageName: image.name,
      imageSize: image.data.length,
      facePointers: detections.map(face => face.box) // Récupérer les points des visages détectés
    });
  } catch (error) {
    console.error('Erreur lors de la détection du visage :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la détection du visage' });
  }
};

module.exports = { detectFaceAndAttributes };
