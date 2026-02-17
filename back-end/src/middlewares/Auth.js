import jwt from "jsonwebtoken";

const MDP_JWT = process.env.MDP_JWT || "dev_secret"; // "dev_secret" est temporaire a dégager pour la prod

export default function authenticateToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, MDP_JWT);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};
