import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly'
  ];
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

async function setCredentials(tokens) {
  oAuth2Client.setCredentials(tokens);
}

async function listEvents() {
  const res = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
}

async function createEvent(event) {
  const res = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    resource: event,
  });
  return res.data;
}

async function deleteEvent(eventId) {
  return await calendar.events.delete({
    calendarId: process.env.CALENDAR_ID,
    eventId,
  });
}

export { getAuthUrl, setCredentials, listEvents, createEvent, deleteEvent };
