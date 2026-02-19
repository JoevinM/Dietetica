// back-end/src/repositories/DieticianRepository.js

import BaseRepository from './BaseRepository.js';

class DieticianRepository extends BaseRepository {
  constructor() {
    super('dietician', {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      bio: true,
      created_at: true,
			admin : true,
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

	async findFirst(where) {
  return await this.model.findFirst({ where });
	}

  async findByIdWithClients(id) {
    return await this.model.findUnique({
      where: { id },
      include: {
        users: {
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            created_at: true
          }
        },
        appointments: {
          where: {
            date: {
              gte: new Date()
            }
          },
          orderBy: { date: 'asc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  async findClients(dietician_id) {
    return await this.model.findUnique({
      where: { id: dietician_id },
      select: {
        users: {
          orderBy: { created_at: 'desc' }
        }
      }
    });
  }

  excludePassword(dietician) {
    if (!dietician) return null;
    const { password, ...dieticianWithoutPassword } = dietician;
    return dieticianWithoutPassword;
  }
}

export default new DieticianRepository();
