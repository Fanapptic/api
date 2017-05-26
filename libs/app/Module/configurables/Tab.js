const Joi = require('joi');
const Configurable = require('../../Component/Configurable');

const schema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.object({
    set: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
});

class Tab extends Configurable {
  constructor(initObject) {
    super();

    Joi.assert(initObject, schema);

    Object.assign(this, initObject);
  }

  exportValue() {
    return this;
  }

  importValueAndValidate(value) {
    Joi.assert(value, schema);

    Object.assign(this, value);

    return true;
  }
}

module.exports = Tab;
