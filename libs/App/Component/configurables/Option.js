const Joi = require('joi');
const Configurable = require('../Configurable');
const fields = require('../fields');

class Option extends Configurable {
  constructor(initObject) {
    super();

    const schema = Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: fields.schema,
      placeholder: Joi.string().optional(),
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

module.exports = Option;
