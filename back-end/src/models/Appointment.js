const BaseModel = require("./BaseModel");

class Appointment extends BaseModel {
  constructor(userId, date, startTime, endTime) {
    super(userId);
    this.date = date;         // int ou Date
    this.startTime = startTime; // int
    this.endTime = endTime;     // int
  }
}

module.exports = Appointment;
