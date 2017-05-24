const Joi = require('joi');
const Configurable = require('./Configurable');

module.exports = class extends Configurable {
  constructor() {
    super();

    this.backgroundGradient = {
      colors: [],
    };

    this.navigationOptions = {
      title: '',
      headerTintColor: '',
      headerStyle: { },
    };
  }

  exportValue() {
    return this;
  }

  importValueAndValidate(value) {
    const schema = Joi.object({
      backgroundGradient: Joi.array().items().optional(),
      navigationOptions: Joi.object({
        title: Joi.string().required(),
        headerTintColor: Joi.string().required(),
        headerStyle: Joi.object().optional(),
      }).required(),
    });

    Joi.assert(value, schema);

    Object.assign(this, value);

    return true;
  }
};
