import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

class GoogleCalendarService {
  constructor() {
    this.auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ["https://www.googleapis.com/auth/calendar"]
    );

    this.calendar = google.calendar({ version: "v3", auth: this.auth });
    this.calendarId = process.env.CALENDAR_ID;
  }

  async createEvent({ summary, description, startTime, endTime }) {
    const response = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: {
        summary,
        description,
        start: { dateTime: new Date(startTime).toISOString() },
        end: { dateTime: new Date(endTime).toISOString() }
      }
    });

    return response.data;
  }

  async deleteEvent(eventId) {
    return this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId
    });
  }

  async listEvents(timeMin, timeMax) {
    const response = await this.calendar.events.list({
      calendarId: this.calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime"
    });

    return response.data.items;
  }
}

export default new GoogleCalendarService();
