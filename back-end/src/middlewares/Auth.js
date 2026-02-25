import jwt from "jsonwebtoken";

const MDP_JWT = process.env.MDP_JWT || "dev_secret"; // secret identique partout

export default function authenticateToken(req, res, next) {
  const token = req.cookies.token; // prendre le token depuis le cookie

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const decoded = jwt.verify(token, MDP_JWT);
    req.user = decoded; // contient id + role
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};
