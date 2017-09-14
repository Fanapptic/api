const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class Header extends Component {
  constructor() {
    super({
      name: 'header',
      displayName: 'Header',
      description: 'The header configuration of the application.',
    });

    this.backgroundGradient = new Option({
      name: 'backgroundGradient',
      displayName: 'Background Gradient',
      description: 'The background gradient of the tab bar.',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#000000,#FFFFFF',
    });

    this.tintColor = new Option({
      name: 'tintColor',
      displayName: 'Tint Color',
      description: 'The color of the header items.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#999333',
    });
  }
}

module.exports = Header;
