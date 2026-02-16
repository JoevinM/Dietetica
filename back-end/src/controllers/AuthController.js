import authService from "../services/AuthServices.js";

export async function login(req, res) {
  try {
    const token = await authService.login(
      req.body.email,
      req.body.password
    );

    res.json({ token });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}
