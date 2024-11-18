const adminMiddleware = (req, res, next) => {
    if (req.session.isAdmin) {
      return next();
    }
    res.status(403).json({ message: 'Access denied. Admins only.' });
  };
  
  module.exports = adminMiddleware;
  