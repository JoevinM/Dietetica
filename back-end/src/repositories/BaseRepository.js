class BaseRepository {
  constructor() {
    this.items = [];
  }

  create(item) {
    this.items.push(item);
    return item;
  }

  findById(id) {
    return this.items.find(i => i.id === id);
  }

  findByUserId(userId) {
    return this.items.filter(i => i.userId === userId);
  }

  update(id, data) {
    const item = this.findById(id);
    if (!item) return null;

    Object.assign(item, data);
    return item;
  }

  delete(id) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  findAll() {
    return [...this.items];
  }
}

module.exports = BaseRepository;
