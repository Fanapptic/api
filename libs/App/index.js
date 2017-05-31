const Component = require('./Component');
const { StatusBar, TabBar, Module } = require('./components');

class App extends Component {
  constructor() {
    super({
      name: 'app',
      displayName: 'App',
      description: 'Your application',
    });

    this.statusBar = new StatusBar();
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
    let result = super.export();

    return result;
  }

  exportPackagedConfig() {
    return {
      statusBar: this.statusBar.exportPackagedConfig(),
      tabBar: this.tabBar.exportPackagedConfig(),
      modules: this.modules.map(module => module.exportPackagedConfig()),
    };
  }
}

module.exports = App;
