const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activity.controller");

router.get("/", activityController.getAll);
router.get("/:id", activityController.getById);
router.get("/user/:userId", activityController.getByUser);
router.post("/", activityController.create);
router.put("/:id", activityController.update);
router.delete("/:id", activityController.delete);

module.exports = router;
