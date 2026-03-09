import express from 'express';
const router = express.Router();
import GoogleController from '../controllers/GoogleCalendarController.js';

// Route to get google url auth
router.get('/auth-url', GoogleController.getAuth);
// Callback OAuth
router.get("/auth/google/callback", GoogleController.getCallBack);
// Endpoint to create appointment
router.post('/', GoogleController.Create);
// Endpoint to list appointment
router.get('/', GoogleController.List);
// Endpoint to delete an appointment by its Google Calendar event ID
router.delete('/:eventId', GoogleController.Delete);

export default router;
