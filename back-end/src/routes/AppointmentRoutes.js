const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/AppointmentController");

router.get("/", appointmentController.getAll);
router.get("/:id", appointmentController.getById);
router.get("/user/:userId", appointmentController.getByUser);
router.post("/", appointmentController.create);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.delete);

module.exports = router;
