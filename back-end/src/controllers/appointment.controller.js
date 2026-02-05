const app = require("../app");
const appointmentRepository = require("../repositories/meal.repository");

class AppointmentController {

  getAll(req, res) {
    res.json(appointmentRepository.findAll());
  }

  getById(req, res) {
    const appointment = appointmentRepository.findById(Number(req.params.id));
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  }

  create(req, res) {
    const appointment = appointmentRepository.create({
      id: Date.now(),
      userId: req.body.userId,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime
    });

    res.status(201).json(appointment);
  }

  update(req, res) {
    const updated = appointmentRepository.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updated);
  }

  delete(req, res) {
    const deleted = appointmentRepository.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(204).send();
  }
}

module.exports = new AppointmentController();
