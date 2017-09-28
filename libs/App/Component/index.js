const Joi = require('joi');
const Configurable = require('../Configurable');

class Component {
  constructor(initObject = {}, overrideSchema = null) {
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

  export(target = this) {
    const excludeKeys = ['name', 'description', 'displayName'];

    const recurse = object => {
      return Object.keys(object).reduce((result, key) => {
        if (excludeKeys.includes(key)) {
          return result;
        }

        const value = object[key];

        if (Array.isArray(value) && value.length) {
          result[key] = recurse(value);
        } else if (value instanceof Component) {
          key = (Array.isArray(object)) ? value.name : key;
          result[key] = recurse(value);
        } else if (value instanceof Configurable) {
          result[value.name] = value.export();
        } else {
          result[key] = value;
        }

        return result;
      }, {});
    };

    return recurse(target);
  }

  exportPackagedConfig() {
    const recurse = object => {
      return Object.keys(object).reduce((result, key) => {
        const value = object[key];

        if (Array.isArray(value)) {
          result[key] = recurse(value);
        }

        if (value instanceof Component || value instanceof Configurable) {
          key = (Array.isArray(object)) ? value.name : key;
          result[key] = value.exportPackagedConfig();
        }

        return result;
      }, {});
    };

    return recurse(this);
  }

  import(data = {}) {
    const recurse = (object, data) => {
      Object.keys(object).forEach(key => {
        const objectValue = object[key];
        key = (Array.isArray(object)) ? objectValue.name : key;
        const dataValue = data[key];

        // TODO: commend conditional here is temp to test disconnect flow of dataSources.
        if (!objectValue || /*dataValue === null ||*/ dataValue === undefined) {
          return;
        }

        if (Array.isArray(objectValue) && objectValue.length) {
          recurse(objectValue, dataValue);
        }

        if (objectValue instanceof Component) {
          recurse(objectValue, dataValue);
        }

        if (objectValue instanceof Configurable) {
          objectValue.import(dataValue);
        }
      });
    };

    recurse(this, data);
  }
}

module.exports = Component;
