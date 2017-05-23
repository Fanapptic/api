const Joi = require('joi');
const fields = require('../fields');

module.exports = class {
  constructor(initObject) {
    const schema = Joi.object({
      internalName: Joi.string().required(),
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

    const validationResult = Joi.validate(initObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

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
};
