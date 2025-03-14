const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  // Verify token
  try {
    console.log('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded token:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.roleCheck = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Role ${req.user.role} is not authorized to access this resource` 
      });
    }
    next();
  };
}; 