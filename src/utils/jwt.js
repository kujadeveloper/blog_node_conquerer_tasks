const jwt = require('jsonwebtoken');

const secretKey = '8494894562311564564128564'; // JWT için gizli anahtarınızı buraya ekleyin

exports.generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
