import jwt from "jsonwebtoken";

const MDP_JWT = process.env.MDP_JWT || "dev_secret"; // "dev_secret" est temporaire a enlever pour la prod
export function authenticateTokenOptional(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return next();
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, MDP_JWT);
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }

  next();
}
