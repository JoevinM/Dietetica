import GoogleCalendarService from '../services/GoogleCalendarService.js';

class GoogleController {

  async getAuth(req, res, next) {
    try {
      const url = GoogleCalendarService.getAuthUrl();
      res.json({ url });
    } catch (err) {
      next(err);
    }
  };

  // Callback OAuth
  async getCallBack(req, res, next) {
    const code = req.query.code;
    if (!code) return next(Object.assign(new Error("Missing OAuth2 code."), { statusCode: 400 }));

    try {
      const tokens = await new Promise((resolve, reject) =>
        GoogleCalendarService.oAuth2Client.getToken(code, (err, t) => (err ? reject(err) : resolve(t)))
      );

      await GoogleCalendarService.setCredentials(tokens);

      res.json({ success: true, message: "Google Calendar connecté !" });
    } catch (err) {
      next(err);
    }
  };

  // Endpoint to create appointment
  async Create(req, res, next) {
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
      next(err);
    }
  };

  // Endpoint to list appointment
  async List(req, res, next) {
    try {
      const events = await GoogleCalendarService.listEvents();
      res.json(events);
    } catch (err) {
      next(err);
    }
  };

  // Endpoint to delete an appointment by its Google Calendar event ID
  async Delete(req, res, next) {
    const { eventId } = req.params;

    try {
      await GoogleCalendarService.deleteEvent(eventId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

export default new GoogleController;
