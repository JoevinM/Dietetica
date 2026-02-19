import dieticianRepository from '../repositories/DieticianRepository.js';
import bcrypt from "bcryptjs";

class DieticianController {

  async getAll(req, res, next) {
    try {
      const dieticians = await dieticianRepository.findAll();
      res.json(dieticians);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const dietician = await dieticianRepository.findById(String(id));

      if (!dietician) {
        return res.status(404).json({ message: 'Diététicien not found' });
      }

      res.json(dietician);
    } catch (err) {
      next(err);
    }
  }

	async create(req, res, next) {
		try {
			const { password, ...rest } = req.body;
			const hashedPassword = await bcrypt.hash(password, 10);


			// Checks if an admin already exists via the repository
			const adminExists = await dieticianRepository.findFirst({ admin: true });

			// First automatic admin if no existing admin
			const isAdmin = adminExists ? rest.admin || false : true;

			// Created via the repository to ensure that admin is taken into account
			const dietician = await dieticianRepository.create({
				...rest,
				password: hashedPassword,
				admin: isAdmin,
			});

			res.status(201).json(dietician);

		} catch (err) {
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;

			// Copy of data to be updated
			const updateData = { ...req.body };

			// If the user **is not an admin**, the admin field is removed to prevent privilege escalation			if (req.user.role !== "admin") {
				delete updateData.admin;


			// Database update
			const dietician = await dieticianRepository.update(String(id), updateData);
			res.json(dietician);

		} catch (err) {
			next(err);
		}
	}

	async deleteDietician(req, res, next) {
		try {
			const { id } = req.params;

			// Checks that the user is an admin
			if (req.user.role !== "admin") {
				return res.status(403).json({ message: "Accès refusé : seul un admin peut supprimer un diététicien." });
			}
			// Database deletion
			await dieticianRepository.delete(String(id));
			res.status(204).send();

		} catch (err) {
			next(err);
		}
	}
}

export default new DieticianController();
