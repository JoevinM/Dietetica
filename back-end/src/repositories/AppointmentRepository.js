// back-end/src/repositories/AppointmentRepository.js

import BaseRepository from './BaseRepository.js';

class AppointmentRepository extends BaseRepository {
  constructor() {
    super('appointment');
  }

  async findByUserId(user_id) {
    return await this.findMany(
      { user_id },
      { 
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
      }
    );
  }

  async findByDieticianId(dietician_id) {
    return await this.findMany(
      { dietician_id },
      { 
        orderBy: { date: 'asc' },
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
    );
  }

  async findUpcomingByUserId(user_id) {
    return await this.findMany(
      {
        user_id,
        date: {
          gte: new Date()
        }
      },
      { 
        orderBy: { date: 'asc' },
        include: {
          dietician: {
            select: {
              id: true,
              first_name: true,
              last_name: true
            }
          }
        }
      }
    );
  }

  async findUpcomingByDieticianId(dietician_id) {
    return await this.findMany(
      {
        dietician_id,
        date: {
          gte: new Date()
        }
      },
      { 
        orderBy: { date: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true
            }
          }
        }
      }
    );
  }

  async checkAvailability(dietician_id, date, start_time, end_time, excludeId = null) {
    const appointments = await this.findMany({ 
      dietician_id,
      date: new Date(date)
    });

    const relevantAppointments = excludeId 
      ? appointments.filter(apt => apt.id !== excludeId)
      : appointments;

    const hasConflict = relevantAppointments.some(apt => {
      const aptStart = new Date(apt.start_time);
      const aptEnd = new Date(apt.end_time);
      const newStart = new Date(start_time);
      const newEnd = new Date(end_time);

      return (
        (newStart >= aptStart && newStart < aptEnd) ||
        (newEnd > aptStart && newEnd <= aptEnd) ||
        (newStart <= aptStart && newEnd >= aptEnd)
      );
    });

    return !hasConflict;
  }
}

export default new AppointmentRepository();