const jwt = require('../utils/jwt');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token is missing' });
  }

  try {
    const decodedToken = jwt.verifyToken(token);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid token' });
  }
};
