const Joi = require('joi');
const fields = require('./fields');

class Configurable {
  static get FIELDS() {
    return fields;
  }

  constructor(initObject, overrideSchema) {
    if (new.target === Configurable) {
      throw new TypeError('Cannot construct Configurable instances directly.');
    }

    let schema = Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: fields.schema,
      defaultValue: [
        Joi.string().optional(),
        Joi.number().optional(),
        Joi.boolean().optional(),
        Joi.object().optional(),
      ],
    });

    if (overrideSchema) {
      schema = schema.concat(overrideSchema);
    }

    Joi.assert(initObject, schema);

    Object.assign(this, initObject, { value: null });
  }

  export() {
    return this.value || this.defaultValue;
  }

  exportPackagedConfig() {
    return this.export();
  }

  import(data) {
    this.field.validate(data);
    this.value = data;
  }
}

module.exports = Configurable;
