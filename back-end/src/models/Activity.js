const BaseModel = require("./BaseModel");

class Activity extends BaseModel {
  constructor(userId, description) {
    super(userId);
    this.description = description; // string
  }
}

module.exports = Activity;
