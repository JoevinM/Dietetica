// back-end/src/repositories/NewsletterRepository.js

import BaseRepository from './BaseRepository.js';

class NewsletterRepository extends BaseRepository {
  constructor() {
    super('newsletter');
  }

  async findByDieticianId(dietician_id) {
    return await this.findMany(
      { dietician_id },
      { orderBy: { created_at: 'desc' } }
    );
  }

  async findRecent(limit = 10) {
    return await this.findAll({
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        dietician: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });
  }
}

export default new NewsletterRepository();