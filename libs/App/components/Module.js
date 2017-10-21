const Joi = require('joi');
const Component = require('../Component');
const DataSource = require('./DataSource');
const Navigator = require('./Navigator');
const Tab = require('./Tab');
const configurables = require('../configurables');

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
      navigator: Joi.object().type(Navigator).required(),
      tab: Joi.object().type(Tab).required(),
    }));

    this.dataSources = [];
    this.options = [];
    this.styles = [];
  }

  addDataSource(dataSource) {
    if (!(dataSource instanceof DataSource)) {
      throw new Error('A DataSource instance must be provided.');
    }

    this.dataSources.push(dataSource);
  }

  addOption(option) {
    if (!(option instanceof configurables.Option)) {
      throw new Error('A Option instance must be provided.');
    }

    this.options.push(option);
  }

  addStyle(style) {
    if (!(style instanceof configurables.Style)) {
      throw new Error('A Style instance must be provided.');
    }

    this.styles.push(style);
  }

  findDataSource(name) {
    return this.dataSources.find(dataSource => dataSource.name === name);
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
