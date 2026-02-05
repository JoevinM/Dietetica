const userRepository = require("../repositories/UserRepository");

class UserController {

  getAll(req, res) {
    const users = userRepository.findAll();
    res.json(users);
  }

  getById(req, res) {
    const { id } = req.params;

    const user = userRepository.findById(Number(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  }

  create(req, res) {
    const user = userRepository.create({
      id: Date.now(),
      ...req.body
    });

    res.status(201).json(user);
  }

  update(req, res) {
    const { id } = req.params;

    const updatedUser = userRepository.update(
      Number(id),
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  }

  delete(req, res) {
    const { id } = req.params;

    const deletedUser = userRepository.delete(Number(id));

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  }
}

module.exports = new UserController();
