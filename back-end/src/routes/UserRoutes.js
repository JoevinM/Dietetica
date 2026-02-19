import express from 'express';
import userController from '../controllers/UserController.js';
import authenticateToken from '../middlewares/Auth.js';
import { adminOnly } from '../middlewares/Roles.js';
import { dieticianOnly } from '../middlewares/Roles.js';
import { createUserSchema } from "../schemas/UserSchema.js";
import { validate } from "../middlewares/UserValidation.js";


const router = express.Router();

router.get('/', authenticateToken, dieticianOnly, userController.getAll);
router.get('/:id',authenticateToken, dieticianOnly, userController.getById);
router.post('/', validate(createUserSchema), userController.create);
router.patch('/:id', authenticateToken, userController.update); // Interdir de modifier les autres user
router.delete('/:id', authenticateToken, adminOnly, userController.deleteUser);

export default router;
