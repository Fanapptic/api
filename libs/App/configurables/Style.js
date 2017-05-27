const Joi = require('joi');
const Configurable = require('../Configurable');

class Style extends Configurable {
  constructor(initObject) {
    super(initObject, Joi.object({
      cssSelector: Joi.string().required(),
      cssProperty: Joi.string().required(),
    }));
  }
}

module.exports = Style;
