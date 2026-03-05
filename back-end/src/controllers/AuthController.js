import AuthServices from "../services/AuthServices.js";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // AuthServices.login doit renvoyer { user, token }
    const { user, token } = await AuthServices.login(email, password);

    // Mettre le token dans un cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 //1h
    });

    // Renvoie seulement le user
    res.json({ user });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

export async function me(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Non authentifié" });

  try {
    const user = await AuthServices.me(token); // décode token et retourne user
    res.json({ user }); // pour renvoyer un objet avec une clé user
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}

export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });
  res.json({ message: "Déconnecté" });
}
