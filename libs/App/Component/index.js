const configurables = require('./configurables');
const fields = require('./fields');

class Component {
  static get CONFIGURABLES() {
    return configurables;
  }

  static get FIELDS() {
    return fields;
  }

  constructor() {
    if (new.target === Component) {
      throw new TypeError('Cannot construct Component instances directly.');
    }

    this.options = [];
    this.styles = [];
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
      options: this._exportConfigurableArray(this.options),
      styles: this._exportConfigurableArray(this.styles),
    };
  }

  importConfig(config = {}) {
    const { options, styles } = config;

    this._importConfigurableArray(this.options, options);
    this._importConfigurableArray(this.styles, styles);
  }

  _exportConfigurableArray(targetConfigurableArray) {
    return targetConfigurableArray.reduce((exportObject, configurable) => {
      exportObject[configurable.name] = configurable.exportValue();

      return exportObject;
    }, {});
  }

  _importConfigurableArray(targetConfigurableArray, data = {}) {
    Object.keys(data).forEach(dataKey => {
      const dataValue = data[dataKey];

      let configurable = targetConfigurableArray.find(configurable => {
        return configurable.name === dataKey;
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

module.exports = Component;
