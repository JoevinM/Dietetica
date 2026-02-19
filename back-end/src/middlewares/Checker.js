export default function dieticianSelfOrAdmin(req, res, next) {
  const userId = req.user.id;       // retrieved from the token
  const targetId = req.params.id;   // Dietitian ID to be modified

	// If the user is not an admin and tries to modify another account
  if (req.user.role !== "admin" && userId !== targetId) {
    return res.status(403).json({ message: "Accès refusé : impossible de modifier un autre diététicien." });
  }

  next();
}
