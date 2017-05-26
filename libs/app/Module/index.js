const Joi = require('joi');
const configurables = require('./configurables');
const fields = require('./fields');

class Module {
  static get moduleName() {
    throw new Error('Class extending Module must override: static get moduleName()');
  }

  static get CONFIGURABLES() {
    return configurables;
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
      navigator: Joi.object().type(configurables.Navigator).required(),
      tab: Joi.object().type(configurables.Tab).required(),
    });

    Joi.assert(initObject, schema);

    Object.assign(this, initObject);

    // Configurable Arrays
    this.dataSources = [];
    this.options = [];
    this.styles = [];
  }

  addDataSource(Class) {
    if (!(Class.prototype instanceof configurables.DataSource)) {
      throw new Error('Invalid data source class provided.');
    }

    this.dataSources.push(new Class());
  }

  addOption(Class) {
    if (!(Class.prototype instanceof configurables.Option)) {
      throw new Error('Invalid option class provided.');
    }

    this.options.push(new Class());
  }

  addStyle(Class) {
    if (!(Class.prototype instanceof configurables.Style)) {
      throw new Error('Invalid style class provided.');
    }

    this.styles.push(new Class());
  }

  exportConfig() {
    return {
      navigator: this.navigator.exportValue(),
      tab: this.tab.exportValue(),
      dataSources: this._export(this.dataSources),
      options: this._export(this.options),
      styles: this._export(this.styles),
    };
  }

  importConfig(config = {}) {
    const { navigator, tab, dataSources, options, styles } = config;

    this.navigator.importValueAndValidate(navigator);
    this.tab.importValueAndValidate(tab);
    this._import(this.dataSources, dataSources);
    this._import(this.options, options);
    this._import(this.styles, styles);
  }

  _export(targetConfigurableArray) {
    return targetConfigurableArray.reduce((exportObject, configurable) => {
      exportObject[configurable.internalName] = configurable.exportValue();

      return exportObject;
    }, {});
  }

  _import(targetConfigurableArray, data = {}) {
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
