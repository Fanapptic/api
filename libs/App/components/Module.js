const Joi = require('joi');
const Component = require('../Component');
const Navigator = require('./Navigator');
const Tab = require('./Tab');
const ConfigurableGrouping = require('./ConfigurableGrouping');
const DataSource = require('../configurables/DataSource');

class Module extends Component {
  static get name() {
    throw new Error('Class must extend Module and override: static get name()');
  }

  constructor(initObject) {
    if (new.target === Component) {
      throw new TypeError('Cannot construct Module instances directly.');
    }

    super(initObject, Joi.object({
      defaultIcon: Joi.object({
        name: Joi.string(),
        set: Joi.string(),
      }).required(),
      brandingColor: Joi.string().required(),
      moduleUrl: Joi.string().uri().required(),
    }));

    this.navigator = new Navigator();
    this.navigator.navigationOptions.title.defaultValue = this.displayName;

    this.tab = new Tab();
    this.tab.title.defaultValue = this.displayName;
    this.tab.icon.defaultValue = this.defaultIcon;

    this.configurableGroupings = [];
  }

  addConfigurableGrouping(configurableGrouping) {
    if (!(configurableGrouping instanceof ConfigurableGrouping)) {
      throw new Error('A ConfigurableGrouping instance must be provided.');
    }

    this.configurableGroupings.push(configurableGrouping);
  }

  getDataSource(name) {
    return this.configurableGroupings.reduce((result, configurableGrouping) => {
      return result || configurableGrouping.configurables.find(configurable => {
        return (configurable instanceof DataSource && configurable.name === name);
      });
    }, undefined);
  }

  exportPackagedConfig() {
    let configurableGroupings = {};

    this.configurableGroupings.forEach(grouping => {
      configurableGroupings[grouping.name] = grouping.exportPackagedConfig();
    });

    return {
      name: this.name,
      navigator: this.navigator.exportPackagedConfig(),
      tab: this.tab.exportPackagedConfig(),
      configurableGroupings,
      moduleUrl: this.moduleUrl,
    };
  }
}

module.exports = Module;
