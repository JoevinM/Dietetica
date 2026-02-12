import dailyEntryRepository from '../repositories/DailyEntryRepository.js';

class DailyEntryController {

  async getAll(req, res, next) {
    try {
      const entries = await dailyEntryRepository.findAll();
      res.json(entries);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const entry = await dailyEntryRepository.findById(Number(id));

      if (!entry) {
        return res.status(404).json({ message: 'Entrée non trouvée' });
      }

      res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const entries = await dailyEntryRepository.findByUserId(Number(userId));

      res.json(entries);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const entry = await dailyEntryRepository.create(req.body);
      res.status(201).json(entry);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const entry = await dailyEntryRepository.update(Number(id), req.body);
      res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  async deleteEntry(req, res, next) {
    try {
      const { id } = req.params;
      await dailyEntryRepository.delete(Number(id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new DailyEntryController();
