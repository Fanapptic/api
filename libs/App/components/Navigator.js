const Component = require('../Component');
const Configurable = require('../Configurable');
const NavigationOptions = require('./NavigationOptions');
const { Option } = require('../configurables');

class Navigator extends Component {
  constructor() {
    super({
      name: 'navigator',
      displayName: 'Navigator',
      description: 'The top header of the module.',
    });

    this.backgroundGradient = new Option({
      name: 'backgroundGradient',
      displayName: 'Background Gradient',
      description: 'The background gradient of the header.',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#000000,#FFFFFF',
    });

    this.navigationOptions = new NavigationOptions();
  }
}

module.exports = Navigator;
