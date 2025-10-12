// generateResetToken.js

const jwt = require('jsonwebtoken');

const generateResetToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiration = '10m'; // Assurez-vous que cette valeur est correcte

  const token = jwt.sign({ userId }, secret, { expiresIn: expiration });
  return token;
};

module.exports = generateResetToken;
