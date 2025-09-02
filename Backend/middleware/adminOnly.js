function adminOnly(req, res, next) {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: "Access forbidden: Admins only" });
  }
  next();
}

module.exports = adminOnly;