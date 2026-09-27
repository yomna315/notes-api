class DBService {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findOne(filter = {}, projection = null) {
    return this.model.findOne(filter, projection);
  }

  findById(id, projection = null) {
    return this.model.findById(id, projection);
  }

  find(filter = {}, projection = null) {
    return this.model.find(filter, projection);
  }

  updateOne(filter, data, options = { new: true }) {
    return this.model.findOneAndUpdate(filter, data, options);
  }

  updateMany(filter, data) {
    return this.model.updateMany(filter, data);
  }

  deleteOne(filter) {
    return this.model.findOneAndDelete(filter);
  }

  deleteMany(filter) {
    return this.model.deleteMany(filter);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

export default DBService;
