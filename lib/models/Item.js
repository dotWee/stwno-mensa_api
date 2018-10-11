/**
 * @typedef Item
 * @property {string} name
 * @property {string} date
 * @property {string} day
 * @property {string} category
 * @property {Array.<string>} labels
 * @property {Array.<string>} ingredients
 * @property {object} price
 */
exports.Item = class {
  constructor(name, date, day, category, labels, ingredients, price) {
    this.name = name;
    this.date = date;
    this.day = day;
    this.category = category;
    this.labels = labels;
    this.ingredients = ingredients;
    this.price = price;
  }
};
