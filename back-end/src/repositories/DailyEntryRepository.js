// back-end/src/repositories/DailyEntryRepository.js

import BaseRepository from './BaseRepository.js';

class DailyEntryRepository extends BaseRepository {
  constructor() {
    super('dailyEntry');
  }

  async findByUserId(user_id) {
    return await this.findMany(
      { user_id },
      { orderBy: { date: 'desc' } }
    );
  }

  async findByUserIdAndDateRange(user_id, startDate, endDate) {
    return await this.findMany(
      {
        user_id,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      { orderBy: { date: 'asc' } }
    );
  }

  async findByUserAndDate(user_id, date) {
    return await this.findOne({
      user_id,
      date: new Date(date)
    });
  }

  async findLatestByUser(user_id) {
    return await this.findOne(
      { user_id },
      { orderBy: { date: 'desc' } }
    );
  }

  async upsertEntry(user_id, date, data) {
    return await this.upsert(
      {
        user_id_date: {
          user_id,
          date: new Date(date)
        }
      },
      {
        user_id,
        date: new Date(date),
        ...data
      },
      data
    );
  }

  // Statistiques de poids
  async getWeightStats(user_id, startDate, endDate) {
    const entries = await this.findByUserIdAndDateRange(user_id, startDate, endDate);
    const weightsOnly = entries.filter(e => e.weight !== null);
    if (weightsOnly.length === 0) {
      return {
        min_weight: null,
        max_weight: null,
        avg_weight: null,
        entries_count: 0
      };
    }
    const weights = weightsOnly.map(e => e.weight);
    return {
      min_weight: Math.min(...weights),
      max_weight: Math.max(...weights),
      avg_weight: parseFloat((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2)),
      entries_count: weightsOnly.length
    };
  }

  // Statistiques de calories
  async getCalorieStats(user_id, startDate, endDate) {
    const entries = await this.findByUserIdAndDateRange(user_id, startDate, endDate);
    const caloriesOnly = entries.filter(e => e.calories !== null);
    if (caloriesOnly.length === 0) {
      return { total_calories: 0, avg_calories: null, entries_count: 0 };
    }
    const total = caloriesOnly.reduce((sum, e) => sum + e.calories, 0);
    return { total_calories: total, avg_calories: Math.round(total / caloriesOnly.length), entries_count: caloriesOnly.length };
  }

  // Récupérer les activités
  async getActivities(user_id, startDate, endDate) {
    const entries = await this.findByUserIdAndDateRange(user_id, startDate, endDate);
    return entries
      .filter(e => e.activity !== null && e.activity !== '')
      .map(e => ({
        date: e.date,
        activity: e.activity,
        notes: e.notes
      }));
  }

  async deleteByUserId(user_id) {
    return await this.deleteMany({ user_id });
  }
}

export default new DailyEntryRepository();
