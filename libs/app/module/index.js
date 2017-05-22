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

  importConfig(exportedConfig) {
    const { dataSources, options, styles } = exportedConfig;

    this._import(this.configurableDataSources, dataSources);
    this._import(this.configurableOptions, options);
    this._import(this.configurableStyles, styles);
  }

  _export(targetConfigurableArray) {
    return targetConfigurableArray.reduce((exportObject, arrayItem) => {
      exportObject[arrayItem.internalName] = arrayItem._value || arrayItem.defaultValue;

      return exportObject;
    }, {});
  }

  _import(targetConfigurableArray, exportedData) {
    Object.keys(exportedData).forEach(exportedDataKey => {
      const exportedDataValue = exportedData[exportedDataKey];

      let configurable = targetConfigurableArray.find(configurable => {
        return exportedDataKey === configurable.internalName;
      });

      if (!configurable) {
        return;
      }

      configurable._value = exportedDataValue;

      // TODO: Refactor this forEach logic and validation to be more clear?
      if (!configurable.validate()) {
        throw new Error(`${exportedDataKey} has an invalid value.`);
      }
    });
  }
}

module.exports = Module;
