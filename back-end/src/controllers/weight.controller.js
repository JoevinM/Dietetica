const weightRepository = require("../repositories/weight.repository");

class WeightController {

  getAll(req, res) {
    res.json(weightRepository.findAll());
  }

  getById(req, res) {
    const weight = weightRepository.findById(Number(req.params.id));
    if (!weight) {
      return res.status(404).json({ message: "Weight not found" });
    }
    res.json(weight);
  }

  create(req, res) {
    const weight = weightRepository.create({
      id: Date.now(),
      userId: req.body.userId,
      value: req.body.value,
      date: req.body.date
    });

    res.status(201).json(weight);
  }

  update(req, res) {
    const updated = weightRepository.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Weight not found" });
    }

    res.json(updated);
  }

  delete(req, res) {
    const deleted = weightRepository.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Weight not found" });
    }
    res.status(204).send();
  }

  getByUser(req, res) {
    res.json(
      weightRepository.findByUserId(Number(req.params.userId))
    );
  }
}

module.exports = new WeightController();
