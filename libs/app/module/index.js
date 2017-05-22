const Joi = require('joi');
const configurables = require('./configurables');
const fields = require('./fields');

class Module {
  static get moduleName() {
    throw new Error('Class extending Module must override: static get moduleName()');
  }

  static get FIELDS() {
    return fields;
  }

  constructor(initObject) {
    const schema = Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      moduleUrl: Joi.string().uri().required(),
      injectedJavaScript: Joi.string().optional(),
      navigatorConfig: Joi.object().required(),
      tabConfig: Joi.object().required(),
    });

    const validationResult = Joi.validate(initObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

    Object.assign(this, initObject);

    this.configurableDataSources = [];
    this.configurableOptions = [];
    this.configurableStyles = [];
  }

  addConfigurableDataSource(Class) {
    if (!(Class.prototype instanceof configurables.DataSource)) {
      throw new Error('Invalid data source class provided.');
    }

    this.configurableDataSources.push(new Class());
  }

  addConfigurableOption(Class) {
    if (!(Class.prototype instanceof configurables.Option)) {
      throw new Error('Invalid option class provided.');
    }

    this.configurableOptions.push(new Class());
  }

  addConfigurableStyle(Class) {
    if (!(Class.prototype instanceof configurables.Style)) {
      throw new Error('Invalid style class provided.');
    }

    this.configurableStyles.push(new Class());
  }

  exportConfig() {
    return {
      dataSources: this._export(this.configurableDataSources),
      options: this._export(this.configurableOptions),
      styles: this._export(this.configurableStyles),
    };
  }

  importConfig(config) {
    const { dataSources, options, styles } = config;

    this._import(this.configurableDataSources, dataSources);
    this._import(this.configurableOptions, options);
    this._import(this.configurableStyles, styles);
  }

  _export(targetConfigurableArray) {
    return targetConfigurableArray.reduce((exportObject, configurable) => {
      exportObject[configurable.internalName] = configurable.exportValue();

      return exportObject;
    }, {});
  }

  _import(targetConfigurableArray, data) {
    Object.keys(data).forEach(dataKey => {
      const dataValue = data[dataKey];

      let configurable = targetConfigurableArray.find(configurable => {
        return configurable.internalName === dataKey;
      });

      if (!configurable) {
        return;
      }

      if (!configurable.importValueAndValidate(dataValue)) {
        throw new Error(`${dataKey} has an invalid value.`);
      }
    });
  }
}

module.exports = Module;
