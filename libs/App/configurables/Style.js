const Joi = require('joi');
const Configurable = require('../Configurable');

class Style extends Configurable {
  constructor(initObject) {
    initObject.type = 'style';

    super(initObject, Joi.object({
      cssSelector: Joi.string().required(),
      cssProperty: Joi.string().required(),
    }));
  }
}

module.exports = Style;
