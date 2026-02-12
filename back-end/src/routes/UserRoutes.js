import express from 'express';
import userController from '../controllers/UserController.js';

const router = express.Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.patch('/:id', userController.update);
router.delete('/:id', userController.deleteUser);

export default router;
