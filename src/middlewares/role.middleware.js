const { verifyToken } = require('../utils/jwt.utils');

const checkRole = (roles) => {
  return (req, res, next) => {
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

    if (!roles.includes(decoded.role)) {
      return res.status(403).send({
        message: 'Access forbidden: insufficient permissions!',
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  };
};

module.exports = checkRole;
