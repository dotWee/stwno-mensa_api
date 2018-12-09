const ingredients = require('../consts/Ingredients.json');
const Provider = require('./Provider');

function parseIngredients(name) {
  const ingredientsArr = [];
  const rawIngredients = name.match(/(?=\().+?(?:\))/);
  if (rawIngredients && rawIngredients[0]) {
    // for each ingredient key
    rawIngredients[0].replace(/[{()}]/g, '').split(',').forEach((key) => {
      ingredientsArr.push(ingredients.find(ingredient => ingredient.key === key));
    });
  }
  return ingredientsArr;
}

function parseItemFromEntry(item) {
  return {
    name: item.name.replace(/(?=\().+?(?:\))/g, '').trim(),
    date: item.datum,
    day: Provider.resolveDay(item.tag),
    category: item.warengruppe,
    labels: item.kennz.split(','),
    ingredients: parseIngredients(item.name),
    price: {
      students: item.stud,
      employees: item.bed,
      guests: item.gast,
    },
  };
}
exports.parseItemFromEntry = parseItemFromEntry;
