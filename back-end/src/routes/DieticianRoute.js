import express from "express";
import dieticianController from "../controllers/DieticianController.js";

const router = express.Router();

router.get("/", dieticianController.getAll);
router.get("/:id", dieticianController.getById);
router.post("/", dieticianController.create);
router.patch("/:id", dieticianController.update);
router.delete("/:id", dieticianController.deleteDietician);

export default router;
