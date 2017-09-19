const Component = require('./Component');
const { Global, Loading, StatusBar, Header, Content, TabBar, Module } = require('./components');

class App extends Component {
  static mergeConfigs(targetConfig, sourceConfig) {
    const recurse = (target, source) => {
      Object.keys(source).forEach(key => {
        if (target[key] && typeof source[key] === 'object') {
          return recurse(target[key], source[key]);
        }

        target[key] = source[key];
      });

      return target;
    };

    return recurse(targetConfig, sourceConfig);
  }

  constructor() {
    super({
      name: 'app',
      displayName: 'App',
      description: 'Your application',
    });

    this.global = new Global();
    this.loading = new Loading();
    this.statusBar = new StatusBar();
    this.header = new Header();
    this.content = new Content();
    this.tabBar = new TabBar();
    this.modules = [];
  }

  addModule(module) {
    if (!(module instanceof Module)) {
      throw new Error('A Module instance must be provided.');
    }

    this.modules.push(module);
  }

  export() {
    let target = Object.assign({}, this);
    delete target.modules;

    let result = super.export(target);

    return result;
  }

  exportLaunchConfig() {
    return {
      loading: this.loading,
    };
  }

  exportPackagedConfig() {
    return {
      global: this.global.exportPackagedConfig(),
      statusBar: this.statusBar.exportPackagedConfig(),
      header: this.header.exportPackagedConfig(),
      content: this.content.exportPackagedConfig(),
      tabBar: this.tabBar.exportPackagedConfig(),
      modules: this.modules.map(module => module.exportPackagedConfig()),
    };
  }
}

module.exports = App;
