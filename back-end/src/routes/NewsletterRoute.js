import express from "express";
import newsletterController from "../controllers/NewsletterController.js";

const router = express.Router();

router.get("/", newsletterController.getAll);
router.get("/dietician/:dieticianId", newsletterController.getByDietician);
router.get("/:id", newsletterController.getById);
router.post("/", newsletterController.create);
router.put("/:id", newsletterController.update);
router.delete("/:id", newsletterController.deleteNewsletter);

export default router;
