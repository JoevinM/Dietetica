import userRepository from '../repositories/UserRepository.js';

class UserController {

  async getAll(req, res, next) {
    try {
      const users = await userRepository.findAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(String(id));

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur not found' });
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userRepository.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.update(String(id), req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userRepository.delete(String(id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
