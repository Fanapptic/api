const Joi = require('joi');
const Component = require('../Component');
const configurables = require('./configurables');

class Module extends Component {
  static get moduleName() {
    throw new Error('Class extending Module must override: static get moduleName()');
  }

  static get CONFIGURABLES() {
    return Object.assign(configurables, Component.CONFIGURABLES);
  }

  constructor(initObject) {
    super();

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

    this.dataSources = [];
  }

  addDataSource(Class) {
    if (!(Class.prototype instanceof configurables.DataSource)) {
      throw new Error('Invalid data source class provided.');
    }

    this.dataSources.push(new Class());
  }

  exportConfig() {
    return Object.assign({
      navigator: this.navigator.exportValue(),
      tab: this.tab.exportValue(),
      dataSources: this._exportConfigurableArray(this.dataSources),
    }, super.exportConfig());
  }

  importConfig(config = {}) {
    super.importConfig(config);

    const { navigator, tab, dataSources } = config;

    this.navigator.importValueAndValidate(navigator);
    this.tab.importValueAndValidate(tab);
    this._importConfigurableArray(this.dataSources, dataSources);
  }
}

module.exports = Module;
