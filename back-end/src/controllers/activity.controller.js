const app = require("../app");
const activityRepository = require("../repositories/MealRepository");

class ActivityController {

  getAll(req, res) {
    res.json(activityRepository.findAll());
  }

  getById(req, res) {
    const activity = activityRepository.findById(Number(req.params.id));
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  }

  create(req, res) {
    const activity = activityRepository.create({
      id: Date.now(),
      userId: req.body.userId,
      date: req.body.date,
      foods: req.body.foods || []
    });

    res.status(201).json(activity);
  }

  update(req, res) {
    const updated = activityRepository.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(updated);
  }

  delete(req, res) {
    const deleted = activityRepository.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(204).send();
  }
}

module.exports = new ActivityController();
