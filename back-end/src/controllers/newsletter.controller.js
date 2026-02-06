const app = require("../app");
const newsletterRepository = require("../repositories/NewsletterRepository");

class NewsletterController {

  getAll(req, res) {
    res.json(newsletterRepository.findAll());
  }

  getById(req, res) {
    const newsletter = newsletterRepository.findById(Number(req.params.id));
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json(newsletter);
  }

  create(req, res) {
    const newsletter = newsletterRepository.create({
      id: Date.now(),
      content: req.body.content
    });

    res.status(201).json(newsletter);
  }

  update(req, res) {
    const updated = newsletterRepository.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    res.json(updated);
  }

  delete(req, res) {
    const deleted = newsletterRepository.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    res.status(204).send();
  }
}

module.exports = new NewsletterController();
