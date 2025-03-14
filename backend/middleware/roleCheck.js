const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    
    const hasRole = roles.find(role => req.user.role === role);
    if (!hasRole) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    next();
  };
};

module.exports = roleCheck; 