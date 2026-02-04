const BaseModel = require("./BaseModel");

class WeightFollowing extends BaseModel {
  constructor(userId, weight) {
    super(userId);
    this.weight = weight;
  }
}

module.exports = WeightFollowing;
