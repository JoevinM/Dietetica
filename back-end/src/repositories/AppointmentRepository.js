import BaseRepository from './BaseRepository.js';
import GoogleCalendarService from '../services/GoogleCalendarService.js';

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

  async createAppointment({ userId, dieticianId, startTime, endTime, description }) {

    // Create Google Calendar event
    const event = await GoogleCalendarService.createEvent({
      summary: `Appointment with user ${userId}`,
      description,
      start: new Date(startTime).toISOString(),
      end: new Date(endTime).toISOString(),
    });

    // Save locally
    return await this.create({
      user_id: userId,
      dietician_id: dieticianId,
      start_time: startTime,
      end_time: endTime,
      external_id: event.id
    });
  }

  async cancelAppointment(id) {
    const appointment = await this.findOne({ id });

    if (appointment.external_id) {
      await GoogleCalendarService.deleteEvent(appointment.external_id);
    }

    return this.delete({ id });
  }

}

export default new AppointmentRepository();
