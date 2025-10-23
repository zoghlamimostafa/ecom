const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./config');

const generateToken = (id) => {
  console.log('🔑 Génération token pour ID:', id, 'avec secret length:', JWT_SECRET.length);
  // Augmenter la durée d'expiration à 30 jours pour le développement
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
  console.log('✅ Token généré avec expiration 30 jours');
  return token;
};

module.exports = { generateToken };