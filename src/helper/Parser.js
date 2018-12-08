const ingredients = require('../consts/Ingredients.json');

function parseDay(tag) {
  let day;

  switch (tag.toLowerCase()) {
    case 'mo':
      day = 'monday';
      break;

    case 'di':
      day = 'tuesday';
      break;

    case 'mi':
      day = 'wednesday';
      break;

    case 'do':
      day = 'thursday';
      break;

    case 'fr':
      day = 'friday';
      break;

    case 'sa':
      day = 'saturday';
      break;

    case 'so':
      day = 'sunday';
      break;

    default:
      throw new Error('Could not parse day from value', tag);
  }

  return day;
}

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
    day: parseDay(item.tag),
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
