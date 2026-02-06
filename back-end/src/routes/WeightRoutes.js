const express = require("express");
const router = express.Router();
const weightController = require("../controllers/WeightController");

router.get("/", weightController.getAll);
router.get("/:id", weightController.getById);
router.get("/user/:userId", weightController.getByUser);
router.post("/", weightController.create);
router.put("/:id", weightController.update);
router.delete("/:id", weightController.delete);

module.exports = router;
