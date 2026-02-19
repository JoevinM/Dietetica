import { google } from 'googleapis';

import express from 'express';
const router = express.Router();
import { getAuthUrl, setCredentials, listEvents, createEvent } from '../services/GoogleCalendarService.js';

// Route pour récupérer l'URL d'auth Google
router.get('/auth-url', (req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

// Callback OAuth
router.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  res.send('Google Calendar connecté !');
});

// Endpoint pour créer un rendez-vous
router.post('/appointments', async (req, res) => {
  const { summary, description, start, end, attendeeEmail } = req.body;

  try {
    const event = {
      summary,
      description,
      start: { dateTime: start },
      end: { dateTime: end },
      attendees: [{ email: attendeeEmail }],
    };
    const result = await createEvent(event);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour lister les rendez-vous
router.get('/appointments', async (req, res) => {
  try {
    const events = await listEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
