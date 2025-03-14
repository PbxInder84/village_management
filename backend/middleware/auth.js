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
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    // Check if user has admin role
    if (req.user.role === 'admin') {
      return next(); // Admin can access everything
    }
    
    // For non-admin users, check if they have the required role
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied: User role ${req.user.role} not in allowed roles: ${roles.join(', ')}`);
      return res.status(403).json({ 
        msg: `Role ${req.user.role} is not authorized to access this resource` 
      });
    }
    
    next();
  };
}; 