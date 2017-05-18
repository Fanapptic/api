const Joi = require('joi');

class Module {
  static get moduleName() {
    throw new Error('Class extending Module must override: static get moduleName()');
  }

  static get FIELDS() {
    return {
      TEXT: 'text',
      TEXTAREA: 'textarea',
      SELECT: 'select',
      SWITCH: 'switch',
      COLOR: 'color',
      GRADIENT: 'gradient',
      PIXELS: 'pixels',
      BORDER: 'border',
      FONT: 'font',
    };
  }

  static fieldsArray() {
    return Object.keys(Module.FIELDS).reduce((fields, fieldKey) => {
      return [...fields, Module.FIELDS[fieldKey]];
    }, []);
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
    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
    });

    const validationResult = Joi.validate(dataSourceObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

    this.configurableDataSources.push(dataSourceObject);
  }

  addConfigurableOption(optionObject) {
    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: Joi.string().valid(Module.fieldsArray()).required(),
      fieldOptions: Joi.array().items(Joi.object()).optional(),
      placeholder: Joi.string().optional(),
      defaultValue: [
        Joi.string().optional(),
        Joi.number().optional(),
        Joi.boolean().optional(),
      ],
    });

    const validationResult = Joi.validate(optionObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

    optionObject._value = null;

    this.configurableOptions.push(optionObject);
  }

  addConfigurableStyle(styleObject) {
    const schema = Joi.object({
      internalName: Joi.string().required(),
      displayName: Joi.string().required(),
      description: Joi.string().required(),
      field: Joi.string().valid(Module.fieldsArray()).required(),
      fieldOptions: Joi.array().items(Joi.object()).optional(),
      cssSelector: Joi.string().required(),
      cssProperty: Joi.string().required(),
      defaultValue: [
        Joi.string().optional(),
        Joi.number().optional(),
        Joi.boolean().optional(),
      ],
    });

    const validationResult = Joi.validate(styleObject, schema);

    if (validationResult.error) {
      throw validationResult.error;
    }

    styleObject._value = null;

    this.configurableStyles.push(styleObject);
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

      option._value = exportedDataValue;
    });
  }
}

module.exports = Module;
