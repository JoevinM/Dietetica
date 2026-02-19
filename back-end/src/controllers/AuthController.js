import AuthServices from "../services/AuthServices.js";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const token = await AuthServices.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}
