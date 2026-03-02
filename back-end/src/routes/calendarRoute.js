import { google } from 'googleapis';

import express from 'express';
const router = express.Router();
import GoogleCalendarService from '../services/GoogleCalendarService.js';

// Route to get google url auth
router.get('/auth-url', (req, res) => {
  const url = GoogleCalendarService.getAuthUrl();
  res.json({ url });
});

// Callback OAuth
router.get("/auth/google/callback", async (req, res, next) => {
  const code = req.query.code;
  if (!code) return next(Object.assign(new Error("Missing OAuth2 code."), { statusCode: 400 }));

  try {
    const tokens = await new Promise((resolve, reject) =>
      GoogleCalendarService.oAuth2Client.getToken(code, (err, t) => (err ? reject(err) : resolve(t)))
    );

    await GoogleCalendarService.setCredentials(tokens);

    res.json({ success: true, message: "Google Calendar connecté !" });
  } catch (err) {
    next(Object.assign(err, { statusCode: 500, message: "Erreur récupération tokens Google OAuth2." }));
  }
});

// Endpoint to create appointment
router.post('/calendar', async (req, res) => {
  const { summary, description, start, end, attendeeEmail } = req.body;

  try {
    const event = {
      summary,
      description,
      start: { dateTime: start },
      end: { dateTime: end },
      ...(attendeeEmail && attendeeEmail.trim() !== "" && {
        attendees: [{ email: attendeeEmail }]
      }),
    };

    const result = await GoogleCalendarService.createEvent(event);
    res.json(result);
  } catch (err) {
    console.error('Erreur Google Calendar complète :', err.message);
    console.error('Détails :', err.errors || err.response?.data);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to list appointment
router.get('/calendar', async (req, res) => {
  try {
    const events = await GoogleCalendarService.listEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
