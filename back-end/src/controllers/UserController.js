import authenticateToken from '../middlewares/Auth.js';
import userRepository from '../repositories/UserRepository.js';
import bcrypt from "bcryptjs";

class UserController {

  async getAll(req, res, next) {
    try {
      const users = await userRepository.findAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(String(id));

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur not found' });
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

	async create(req, res, next) {
  	try {
    	const { password, ...rest } = req.body;

    	const hashedPassword = await bcrypt.hash(password, 10);

    	const user = await userRepository.create({
      	...rest,
      	password: hashedPassword
    	});

    	res.status(201).json(user);

  	} catch (err) {
    	next(err);
  	}
	}

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.update(String(id), req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userRepository.delete(String(id));
			res.status(200).json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
