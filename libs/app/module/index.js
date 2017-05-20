const Joi = require('joi');
const ConfigurableDataSource = require('./ConfigurableDataSource');
const ConfigurableOption = require('./ConfigurableOption');
const ConfigurableStyle = require('./ConfigurableStyle');
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

  addConfigurableDataSource(dataSourceObject) {
    this.configurableDataSources.push(
      new ConfigurableDataSource(dataSourceObject)
    );
  }

  addConfigurableOption(optionObject) {
    this.configurableOptions.push(
      new ConfigurableOption(optionObject)
    );
  }

  addConfigurableStyle(styleObject) {
    this.configurableStyles.push(
      new ConfigurableStyle(styleObject)
    );
  }

  exportOptions() {
    return this._export(this.configurableOptions);
  }

  exportStyles() {
    return this._export(this.configurableStyles);
  }

  exportJSON() {
    return JSON.stringify(this);
  }

  importOptions(exportedOptions) {
    this._import(this.configurableOptions, exportedOptions);
  }

  importStyles(exportedStyles) {
    this._import(this.configurableStyles, exportedStyles);
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

      let option = this.configurableOptions.find(option => {
        return exportedDataKey === option.internalName;
      });

      if (!option || option.defaultValue === exportedDataValue) {
        return;
      }

      // handle validation here?

      option._value = exportedDataValue;
    });
  }
}

module.exports = Module;
