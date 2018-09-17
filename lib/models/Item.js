/**
 * @typedef Item
 * @property {string} name
 * @property {string} date
 * @property {string} day
 * @property {string} category
 * @property {Array.<string>} labels
 * @property {Array.<string>} details
 * @property {object} price
 */
exports.Item = class {
  constructor(name, date, day, category, labels, details, price) {
    this.name = name;
    this.date = date;
    this.day = day;
    this.cateogry = category;
    this.labels = labels;
    this.details = details;
    this.price = price;
  }
};
