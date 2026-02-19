import express from 'express';
import userController from '../controllers/UserController.js';
import { validate } from "../middlewares/UserValidation.js";
import { createUserSchema } from "../schemas/UserSchema.js";

const router = express.Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', validate(createUserSchema), userController.create);
router.patch('/:id', userController.update);
router.delete('/:id', userController.deleteUser);

export default router;
