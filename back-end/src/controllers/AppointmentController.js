import appointmentRepository from "../repositories/AppointmentRepository.js";

class AppointmentController {

  async getAll(req, res, next) {
    try {
      const { dietician_id, date } = req.query;

      // Si des filtres sont fournis, on filtre par diététicien et/ou date
      if (dietician_id || date) {
        const where = {};

        if (dietician_id) {
          where.dietician_id = dietician_id;
        }

        if (date) {
          // Filtre sur toute la journée (minuit → minuit)
          const startOfDay = new Date(`${date}T00:00:00.000Z`);
          const endOfDay = new Date(`${date}T23:59:59.999Z`);
          where.start_time = {
            gte: startOfDay,
            lte: endOfDay,
          };
        }

        const appointments = await appointmentRepository.findMany(where);
        return res.json(appointments);
      }

      // Sans filtre : retourne tout
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
        return res.status(404).json({ message: "appointment not found" });
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
      const { dieticianId, startTime, endTime, googleEventId } = req.body;

      // L'userId vient du token JWT — jamais du body (sécurité)
      const userId = req.user.id;

      // Vérifie si ce créneau est déjà réservé pour ce diététicien
      const existingAppointment = await appointmentRepository.findOne({
        dietician_id: dieticianId,
        start_time: new Date(startTime),
      });

      if (existingAppointment) {
        return res.status(409).json({ message: "Ce créneau est déjà réservé." });
      }

      // Sauvegarde en base avec le google_event_id pour le lien avec Google Calendar
      const appointment = await appointmentRepository.create({
        user_id: userId,
        dietician_id: dieticianId,
        date: new Date(startTime),
        start_time: new Date(startTime),
        end_time: new Date(endTime),
        google_event_id: googleEventId || null,
        status: "confirmed",
      });

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
