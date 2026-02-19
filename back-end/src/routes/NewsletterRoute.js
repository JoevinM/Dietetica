import express from "express";
import newsletterController from "../controllers/NewsletterController.js";
import authenticateToken from "../middlewares/Auth.js";
import { dieticianOnly } from "../middlewares/Roles.js";
const router = express.Router();

router.get("/", newsletterController.getAll);
router.get("/dietician/:dieticianId", newsletterController.getByDietician);
router.get("/:id", newsletterController.getById);
router.post("/", authenticateToken, dieticianOnly, newsletterController.create);
router.put("/:id", authenticateToken, dieticianOnly, newsletterController.update); // Interdire la modification des newsletters d'un autre dieteticien
router.delete("/:id", authenticateToken, dieticianOnly, newsletterController.deleteNewsletter); // Interdire la suppression des newsletters d'un autre dieteticien

export default router;
