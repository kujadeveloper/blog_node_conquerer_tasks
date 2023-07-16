const jwt = require('../utils/jwt');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token is missing' });
  }
  console.log(req.userId)
  try {
    const decodedToken = jwt.verifyToken(token);
    req.userId = decodedToken.userId;
    req.lastLoginDate = decodedToken.lastLoginDate;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid token' });
  }
};
