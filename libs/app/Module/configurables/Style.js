const Joi = require('joi');
const Configurable = require('./Configurable');
const fields = require('../fields');

class Style extends Configurable {
  constructor(initObject) {
    super();

    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: fields.schema,
      cssSelector: Joi.string().required(),
      cssProperty: Joi.string().required(),
      defaultValue: [
        Joi.string().optional(),
        Joi.number().optional(),
        Joi.boolean().optional(),
      ],
    });

    Joi.assert(initObject, schema);

    initObject.value = null;

    Object.assign(this, initObject);
  }

  exportValue() {
    return this.value;
  }

  importValueAndValidate(value) {
    this.value = value;

    return this.field.validate(this.value);
  }
}

module.exports = Style;
