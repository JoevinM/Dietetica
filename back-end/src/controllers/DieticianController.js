import dieticianRepository from '../repositories/DieticianRepository.js';

class DieticianController {

  async getAll(req, res, next) {
    try {
      const dieticians = await dieticianRepository.findAll();
      res.json(dieticians);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const dietician = await dieticianRepository.findById(String(id));

      if (!dietician) {
        return res.status(404).json({ message: 'Diététicien not found' });
      }

      res.json(dietician);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const dietician = await dieticianRepository.create(req.body);
      res.status(201).json(dietician);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const dietician = await dieticianRepository.update(String(id), req.body);
      res.json(dietician);
    } catch (err) {
      next(err);
    }
  }

  async deleteDietician(req, res, next) {
    try {
      const { id } = req.params;
      await dieticianRepository.delete(String(id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new DieticianController();
