export function adminOnly(req, res, next) {
  if (!req.user || req.user.admin !== true) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
}
