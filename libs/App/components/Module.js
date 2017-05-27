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
    super(initObject, Joi.object({
      moduleUrl: Joi.string().uri().required(),
      injectedJavaScript: Joi.string().optional(),
      navigator: Joi.object().type(Navigator).required(),
      tab: Joi.object().type(Tab).required(),
    }));

    this.dataSources = [];
    this.options = [];
    this.styles = [];
  }

  addDataSource(Class) {
    if (!(Class.prototype instanceof DataSource)) {
      throw new Error('A DataSource class must be provided.');
    }

    this.dataSources.push(new Class());
  }

  addOption(Class) {
    if (!(Class.prototype instanceof configurables.Option)) {
      throw new Error('A Option class must be provided.');
    }

    this.options.push(new Class());
  }

  addStyle(Class) {
    if (!(Class.prototype instanceof configurables.Style)) {
      throw new Error('A Style class must be provided.');
    }

    this.styles.push(new Class());
  }
}

module.exports = Module;
