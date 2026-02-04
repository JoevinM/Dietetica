const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {
  constructor({ id, email, password, firstName, lastName, status }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = status;
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  getToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET);
  }
}

module.exports = User;
