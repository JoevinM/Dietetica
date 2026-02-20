import express from "express";
import dieticianController from "../controllers/DieticianController.js";
import { dieticianOnly, adminOnly } from "../middlewares/Roles.js";
import dieticianSelfOrAdmin from "../middlewares/Checker.js";
import authenticateToken from "../middlewares/Auth.js";
import { authenticateTokenOptional } from "../middlewares/TokenOptionnal.js";
const router = express.Router();

router.get("/", authenticateToken, adminOnly, dieticianController.getAll);
router.get("/:id", authenticateToken, adminOnly, dieticianController.getById);
router.post("/", authenticateTokenOptional, adminOnly, dieticianController.create);
router.patch("/:id", authenticateToken, dieticianSelfOrAdmin, dieticianController.update); // enlever la possibilité de s'elever admin et de modifier les autres dietician
router.delete("/:id", authenticateToken, adminOnly, dieticianController.deleteDietician);

export default router;
