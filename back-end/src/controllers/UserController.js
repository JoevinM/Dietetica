const app = require("../app");
const userRepository = require("../repositories/UserRepository");

class UserController {

  getAll(req, res) {
    res.json(userRepository.findAll());
  }

  getById(req, res) {
    const user = userRepository.findById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }

  create(req, res) {
    const user = userRepository.create({
      id: Date.now(),
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      status: req.body.status
    });

    res.status(201).json(user);
  }

  update(req, res) {
    const updated = userRepository.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  }

  delete(req, res) {
    const deleted = userRepository.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  }
}

module.exports = new UserController();
