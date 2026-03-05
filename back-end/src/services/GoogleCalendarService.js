import 'dotenv/config';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Fichier de sauvegarde des tokens OAuth — survit aux redémarrages
const TOKENS_FILE_PATH = path.join(process.cwd(), '.google-tokens.json');

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

    // Charge les tokens sauvegardés au démarrage du serveur
    this.loadSavedTokens();
  }

  /**
   * Charge les tokens depuis le fichier local.
   * Appelé automatiquement au démarrage — plus besoin de refaire l'OAuth après redémarrage.
   */
  loadSavedTokens() {
    try {
      if (fs.existsSync(TOKENS_FILE_PATH)) {
        const savedTokens = JSON.parse(fs.readFileSync(TOKENS_FILE_PATH, 'utf8'));
        this.oAuth2Client.setCredentials(savedTokens);;
      } else {
        console.log('⚠️  Aucun token Google Calendar trouvé — flow OAuth requis.');
      }
    } catch (err) {
      console.warn('⚠️  Impossible de charger les tokens Google Calendar :', err.message);
    }
  }

  /**
   * Sauvegarde les tokens en mémoire ET dans un fichier local.
   * Appelé après le callback OAuth — une seule fois suffit.
   * @param {object} tokens - Tokens retournés par Google
   */
  async setCredentials(tokens) {
    this.oAuth2Client.setCredentials(tokens);

    try {
      fs.writeFileSync(TOKENS_FILE_PATH, JSON.stringify(tokens, null, 2));
      console.log('✅ Tokens Google Calendar sauvegardés');
    } catch (err) {
      console.warn('⚠️  Impossible de sauvegarder les tokens :', err.message);
    }
  }

  /**
   * Génère l'URL d'authentification Google OAuth2
   * @returns {string} URL Google
   */
  getAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly'
      ],
      prompt: 'consent', // force Google à renvoyer le refresh_token à chaque fois
    });
  }

  /**
   * Liste les prochains events du calendrier
   * @returns {Array} Liste des events Google Calendar
   */
  async listEvents() {
    const res = await this.calendar.events.list({
      calendarId: process.env.CALENDAR_ID || 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items;
  }

  /**
   * Crée un event dans Google Calendar
   * @param {object} event - Données de l'event (summary, start, end, etc.)
   * @returns {object} Event créé par Google
   */
  async createEvent(event) {
    const res = await this.calendar.events.insert({
      calendarId: process.env.CALENDAR_ID || 'primary',
      resource: event,
    });
    return res.data;
  }

  /**
   * Supprime un event de Google Calendar
   * @param {string} eventId - ID de l'event Google
   */
  async deleteEvent(eventId) {
    return await this.calendar.events.delete({
      calendarId: process.env.CALENDAR_ID || 'primary',
      eventId
    });
  }
}

export default new GoogleCalendarService();
