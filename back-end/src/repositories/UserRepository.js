// back-end/src/repositories/UserRepository.js

import BaseRepository from './BaseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    // Champs par défaut (sans password)
    super('user', {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      height: true,
      birth_date: true,
      dietician_id: true,
      created_at: true
    });
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async findByEmailWithPassword(email) {
    return await this.model.findUnique({
      where: { email }
    });
  }

  async emailExists(email) {
    const count = await this.count({ email });
    return count > 0;
  }

  async findByDietician(dietician_id) {
    return await this.findMany(
      { dietician_id },
      { orderBy: { created_at: 'desc' } }
    );
  }

  async findByIdWithRelations(id) {
    return await this.model.findUnique({
      where: { id },
      include: {
        daily_entries: {
          orderBy: { date: 'desc' },
          take: 30 // Derniers 30 jours
        },
        appointments: {
          where: {
            date: {
              gte: new Date()
            }
          },
          orderBy: { date: 'asc' },
          include: {
            dietician: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true
              }
            }
          }
        },
        dietician: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            bio: true
          }
        }
      }
    });
  }

  async assignDietician(user_id, dietician_id) {
    return await this.update(user_id, {
      dietician_id
    });
  }

  async removeDietician(user_id) {
    return await this.update(user_id, {
      dietician_id: null
    });
  }

  excludePassword(user) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new UserRepository();
