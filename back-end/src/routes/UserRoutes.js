import express from 'express';
import userController from '../controllers/UserController.js';
import authenticateToken from '../middlewares/Auth.js';
import { adminOnly } from '../middlewares/AdminOnly.js';
const router = express.Router();

router.get('/', authenticateToken, adminOnly, userController.getAll);
router.get('/:id', authenticateToken, adminOnly, userController.getById);
router.post('/', userController.create); // enlever la possibilité de s'elever admin
router.patch('/:id', authenticateToken, userController.update); // enlever la possibilité de s'elever admin
router.delete('/:id', authenticateToken, adminOnly, userController.delete);


export default router;
