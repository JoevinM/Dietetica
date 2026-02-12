import express from 'express';
import appointmentController from '../controllers/AppointmentController.js';

const router = express.Router();

router.get('/', appointmentController.getAll);
router.get('/user/:userId', appointmentController.getByUserId);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.deleteAppointment);

export default router;
