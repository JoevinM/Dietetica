const BaseRepository = require("./BaseRepository");

class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  findByEmail(email) {
    return this.items.find(u => u.email === email);
  }
}

module.exports = new UserRepository();
