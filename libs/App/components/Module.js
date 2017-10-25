const Joi = require('joi');
const Component = require('../Component');
const Navigator = require('./Navigator');
const Tab = require('./Tab');
const ConfigurableGrouping = require('./ConfigurableGrouping');

class Module extends Component {
  static get moduleName() {
    throw new Error('Class must extend Module and override: static get moduleName()');
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
      moduleUrl: Joi.string().uri().required(),
      injectedJavaScript: Joi.string().optional(),
    }));

    this.navigator = new Navigator();

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

  findDataSource(name) {
    // TODO: Recurse the configurableGroupings and find the data source.
    //return this.dataSources.find(dataSource => dataSource.name === name);
  }

  exportPackagedConfig() {
    return {
      name: this.name,
      navigator: this.navigator.exportPackagedConfig(),
      tab: this.tab.exportPackagedConfig(),
      moduleUrl: this.moduleUrl,
      injectedJavaScript: this.injectedJavaScript,
    };
  }
}

module.exports = Module;
