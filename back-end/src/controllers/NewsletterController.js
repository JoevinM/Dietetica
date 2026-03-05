import newsletterRepository from '../repositories/NewsletterRepository.js';

class NewsletterController {

  async getAll(req, res, next) {
    try {
      const newsletters = await newsletterRepository.findAll();
      res.json(newsletters);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const newsletter = await newsletterRepository.findById(String(id));

      if (!newsletter) {
        return res.status(404).json({ message: 'Newsletter not found' });
      }

      res.json(newsletter);
    } catch (err) {
      next(err);
    }
  }

  async getByDietician(req, res, next) {
    try {
      const { dieticianId } = req.params;

      const newsletters = await newsletterRepository.findMany(
        { dietician_id: String(dieticianId) }
      );

      res.json(newsletters);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const newsletter = await newsletterRepository.create(req.body);
      res.status(201).json(newsletter);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const newsletter = await newsletterRepository.update(
        String(id),
        req.body
      );

      res.json(newsletter);
    } catch (err) {
      next(err);
    }
  }

  async deleteNewsletter(req, res, next) {
    try {
      const { id } = req.params;

      await newsletterRepository.delete(String(id));

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new NewsletterController();
