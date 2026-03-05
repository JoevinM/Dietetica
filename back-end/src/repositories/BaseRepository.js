// back-end/src/repositories/BaseRepository.js

import prisma from '../PrismaClient.js';

class BaseRepository {
  constructor(modelName, defaultSelect = null) {
    this.modelName = modelName;
    this.model = prisma[modelName];
    this.defaultSelect = defaultSelect;
    this.prisma = prisma;
  }

  async findAll(options = {}) {
    const query = { ...options };
    if (this.defaultSelect && !options.select && !options.include) {
      query.select = this.defaultSelect;
    }
    return await this.model.findMany(query);
  }

  async findById(id, options = {}) {
    const query = { where: { id }, ...options };
    if (this.defaultSelect && !options.select && !options.include) {
      query.select = this.defaultSelect;
    }
    return await this.model.findUnique(query);
  }

  async findOne(where, options = {}) {
    const query = { where, ...options };
    if (this.defaultSelect && !options.select && !options.include) {
      query.select = this.defaultSelect;
    }
    return await this.model.findFirst(query);
  }

  async findMany(where = {}, options = {}) {
    const query = { where, ...options };
    if (this.defaultSelect && !options.select && !options.include) {
      query.select = this.defaultSelect;
    }
    return await this.model.findMany(query);
  }

  async create(data, options = {}) {
    const query = { data, ...options };
    if (this.defaultSelect && !options.select && !options.include) {
      query.select = this.defaultSelect;
    }
    return await this.model.create(query);
  }

  async createMany(data) {
    return await this.model.createMany({ data, skipDuplicates: true });
  }

  async update(id, data, options = {}) {
    const query = { where: { id }, data, ...options };
    if (this.defaultSelect && !options.select && !options.include) {
      query.select = this.defaultSelect;
    }
    return await this.model.update(query);
  }

  async updateMany(where, data) {
    return await this.model.updateMany({ where, data });
  }

  async delete(id) {
    return await this.model.delete({ where: { id } });
  }

  async deleteMany(where) {
    return await this.model.deleteMany({ where });
  }

  async count(where = {}) {
    return await this.model.count({ where });
  }

  async exists(id) {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }

  async upsert(where, createData, updateData) {
    return await this.model.upsert({ where, create: createData, update: updateData });
  }

  async aggregate(options) {
    return await this.model.aggregate(options);
  }

  async groupBy(options) {
    return await this.model.groupBy(options);
  }

  getPrisma() {
    return this.prisma;
  }

  getModel() {
    return this.model;
  }
}

export default BaseRepository;
