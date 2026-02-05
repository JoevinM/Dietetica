const mealRepository = require("../repositories/meal.repository");

class MealController {

  getAll(req, res) {
    res.json(mealRepository.findAll());
  }

  getById(req, res) {
    const meal = mealRepository.findById(Number(req.params.id));
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json(meal);
  }

  create(req, res) {
    const meal = mealRepository.create({
      id: Date.now(),
      userId: req.body.userId,
      date: req.body.date,
      foods: req.body.foods || []
    });

    res.status(201).json(meal);
  }

  update(req, res) {
    const updated = mealRepository.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.json(updated);
  }

  delete(req, res) {
    const deleted = mealRepository.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(204).send();
  }
}

module.exports = new MealController();
