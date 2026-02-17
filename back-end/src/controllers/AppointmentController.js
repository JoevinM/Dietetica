import appointmentRepository from "../repositories/AppointmentRepository.js";

class AppointmentController {

  async getAll(req, res, next) {
    try {
      const appointments = await appointmentRepository.findAll();
      res.json(appointments);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await appointmentRepository.findById(String(id));

      if (!appointment) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
      }

      res.json(appointment);
    } catch (err) {
      next(err);
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const appointments = await appointmentRepository.findByUserId(String(userId));

      res.json(appointments);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
  try {
    const appointment = await appointmentRepository.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await appointmentRepository.update(String(id), req.body);

      res.json(appointment);
    } catch (err) {
      next(err);
    }
  }

  async deleteAppointment(req, res, next) {
  try {
    await appointmentRepository.cancelAppointment(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
}

export default new AppointmentController();
