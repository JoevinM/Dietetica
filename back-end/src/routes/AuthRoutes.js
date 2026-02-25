import express from "express";
import { login, me, logout } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/login", login);     // login et mise en cookie httpOnly
router.get("/me", me);            // renvoie l'utilisateur connecté
router.post("/logout", logout);   // supprime le cookie

export default router;
