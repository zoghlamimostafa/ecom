const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./config');

const generateToken = (id) => {
  console.log('🔑 Génération token pour ID:', id, 'avec secret length:', JWT_SECRET.length);
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
  console.log('🔑 Token généré:', token.substring(0, 50) + '...');
  return token;
};

module.exports = { generateToken };