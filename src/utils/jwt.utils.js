const jwt = require('jsonwebtoken');

const secretKey = 'evan1234';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: '24h', // Token expiration time
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
