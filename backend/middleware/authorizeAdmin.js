// backend/middleware/authorizeAdmin.js
module.exports = function authorizeAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only.' });
  }
  next();
};
