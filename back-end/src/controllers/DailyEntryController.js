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
      const entry = await dailyEntryRepository.findById(String(id));

      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }

      res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const entries = await dailyEntryRepository.findByUserId(String(userId));

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
      const entry = await dailyEntryRepository.update(String(id), req.body);
      res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  async deleteEntry(req, res, next) {
    try {
      const { id } = req.params;
      await dailyEntryRepository.delete(String(id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new DailyEntryController();
