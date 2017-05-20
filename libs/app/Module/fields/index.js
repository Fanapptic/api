const fs = require('fs');
const path = require('path');
const Joi = require('joi');

let fields = {
  list: [],
  schema: Joi.object().keys({
    name: Joi.string().required(),
    validate: Joi.func().required(),
  }).required(),
};

fs.readdirSync(__dirname).filter(directoryItem => {
  return path.extname(directoryItem) === '.js' && directoryItem !== 'index.js';
}).forEach(fieldFile => {
  const field = require('./' + fieldFile);

  fields.list.push(field);
  fields[field.name.toUpperCase()] = field;
});

module.exports = fields;
