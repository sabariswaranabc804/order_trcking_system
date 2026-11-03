const { verifyToken } = require('../utils/jwt-utils');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.ots_auth_token;
   // console.log(req.cookies);
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = decoded; // This will contain the decrypted user data
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;