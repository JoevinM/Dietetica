import oAuth2Client from '../config/google/calendarClient';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const getAuthUrl = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(url);
};

const googleCallback = async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Ici tu peux sauvegarder tokens.access_token dans la DB pour l'utilisateur
  res.send('Connexion réussie, tu peux maintenant créer un rendez-vous.');
};

module.exports = { getAuthUrl, googleCallback };
