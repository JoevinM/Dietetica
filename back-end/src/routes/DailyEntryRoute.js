import express from 'express';
import dailyEntryController from '../controllers/DailyEntryController.js';

const router = express.Router();

router.get('/', dailyEntryController.getAll);
router.get('/:id', dailyEntryController.getById);
router.get('/user/:userId', dailyEntryController.getByUserId);
router.post('/', dailyEntryController.create);
router.delete('/:id', dailyEntryController.deleteEntry);

export default router;
