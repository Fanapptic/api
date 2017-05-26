const Joi = require('joi');
const Configurable = require('../../Component/Configurable');

const schema = Joi.object({
  backgroundGradient: Joi.array().items().optional(),
  navigationOptions: Joi.object({
    title: Joi.string().required(),
    headerTintColor: Joi.string().required(),
    headerStyle: Joi.object().optional(),
  }).required(),
});

class Navigator extends Configurable {
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

module.exports = Navigator;
