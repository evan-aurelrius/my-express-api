const { verifyToken } = require('../utils/jwt.utils');

module.exports = (req, res, next) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send({
      message: 'Unauthorized!',
    });
  }

  req.userId = decoded.id;
  next();
};
