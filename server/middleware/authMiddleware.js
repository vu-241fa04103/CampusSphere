const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'campussphere_default_secret');
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authorization token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: No authorization token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to role(s) [${roles.join(', ')}]`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
