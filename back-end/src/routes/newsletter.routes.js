const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletter.controller");

router.get("/", newsletterController.getAll);
router.get("/:id", newsletterController.getById);
router.post("/", newsletterController.create);
router.put("/:id", newsletterController.update);
router.delete("/:id", newsletterController.delete);

module.exports = router;
