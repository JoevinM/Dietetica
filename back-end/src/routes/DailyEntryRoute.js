import express from 'express';
import dailyEntryController from '../controllers/DailyEntryController.js';
import authenticateToken from '../middlewares/Auth.js';

const router = express.Router();

router.get('/', authenticateToken, dailyEntryController.getAll);
router.get('/:id', authenticateToken, dailyEntryController.getById);
router.get('/user/:userId', authenticateToken, dailyEntryController.getByUserId);
router.post('/', authenticateToken, dailyEntryController.create);
router.delete('/:id', authenticateToken, dailyEntryController.deleteEntry);

export default router;
