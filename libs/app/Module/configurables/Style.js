const Joi = require('joi');
const fields = require('../fields');

module.exports = class {
  constructor(initObject) {
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
      value: null,
    });

    const validationResult = Joi.validate(initObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

    Object.assign(this, initObject);
  }

  exportValue() {
    return this.value;
  }

  importValueAndValidate(value) {
    this.value = value;

    return this.field.validate(this.value);
  }
};
