class BaseModel {
  constructor(userId) {
    this.id = uuidv4();
    this.userId = userId;
    this.createdAt = new Date();
  }
}

module.exports = BaseModel;