const BaseModel = require("./BaseModel");

class MealFollowing extends BaseModel {
  constructor(userId, description, totalCalory) {
    super(userId);
    this.description = description; // string
    this.totalCalory = totalCalory; // string ou number (à décider plus tard)
  }
}

module.exports = MealFollowing;
