const Joi = require('joi');

class Component {
  constructor(initObject, overrideSchema) {
    if (new.target === Component) {
      throw new TypeError('Cannot construct Component instances directly.');
    }

    let schema = Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
    });

    if (overrideSchema) {
      schema = schema.concat(overrideSchema);
    }

    Joi.assert(initObject, schema);

    Object.assign(this, initObject);
  }

  export() {
    // TODO Write recursion
  }

  import(data = {}) {
    // TODO Write recursion.
  }
}

module.exports = Component;
