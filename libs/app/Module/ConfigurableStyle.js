const Joi = require('joi');
const fields = require('./fields');

class ConfigurableStyle {
  constructor(initObject) {
    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: fields.schema,
      fieldOptions: Joi.array().items(Joi.object()).optional(),
      cssSelector: Joi.string().required(),
      cssProperty: Joi.string().required(),
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

    Object.assign(this, initObject);
  }
}



module.exports = ConfigurableStyle;
