const Component = require('../Component');
const Configurable = require('../Configurable');

class ConfigurableGrouping extends Component {
  constructor(initObject) {
    super(initObject);

    this.configurables = [];
  }

  addConfigurable(configurable) {
    if (!(configurable instanceof Configurable)) {
      throw new Error('A configurable instance must be provided.');
    }

    this.configurables.push(configurable);
  }
}

module.exports = ConfigurableGrouping;
