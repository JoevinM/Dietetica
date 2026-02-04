const BaseModel = require("./BaseModel");

class Newsletter extends BaseModel {
  constructor(userId, content) {
    super(userId);
    this.content = content; // string
  }
}

module.exports = Newsletter;
