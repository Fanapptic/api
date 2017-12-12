const fs = require('fs');
const path = require('path');
const Joi = require('joi');

let fields = {
  schema: Joi.object().keys({
    name: Joi.string().required(),
    options: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required(),
      tooltip: Joi.string().optional(),
    })).optional(),
    attributes: Joi.object().optional(),
    validate: Joi.func().required(),
  }).required(),
};

fs.readdirSync(__dirname).filter(directoryItem => {
  return path.extname(directoryItem) === '.js' && directoryItem !== 'index.js';
}).forEach(fieldFile => {
  fields[path.basename(fieldFile, '.js').toUpperCase()] = require('./' + fieldFile);
});

module.exports = fields;
