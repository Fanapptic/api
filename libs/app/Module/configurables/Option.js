const Joi = require('joi');
const fields = require('../fields');

module.exports = class {
  constructor(initObject) {
    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: fields.schema,
      fieldOptions: Joi.array().items(Joi.object()).optional(),
      placeholder: Joi.string().optional(),
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

  validate() {
    return this.field.validate(this.value);
  }
};
