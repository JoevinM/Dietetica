const BaseRepository = require("./BaseRepository");

class NewsletterRepository extends BaseRepository {
  constructor() {
    super();
  }

  findAll() {
    return this.items;
  }
}

module.exports = new NewsletterRepository();
