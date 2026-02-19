import { google } from 'googleapis';

class GoogleCalendarService {
  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.calendar = google.calendar({
      version: 'v3',
      auth: this.oAuth2Client
    });
  }

  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
  }

  async setCredentials(tokens) {
    this.oAuth2Client.setCredentials(tokens);
  }

  async listEvents() {
    const res = await this.calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items;
  }

  async createEvent(event) {
    const res = await this.calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
    });
    return res.data;
  }

  async deleteEvent(eventId) {
    return await this.calendar.events.delete({
      calendarId: process.env.CALENDAR_ID,
      eventId
    });
  }
}

export default new GoogleCalendarService();
