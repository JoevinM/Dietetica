const BaseRepository = require("./BaseRepository");

class AppointmentRepository extends BaseRepository {
  constructor() {
    super();
  }
}

module.exports = new AppointmentRepository();
