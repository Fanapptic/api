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

    this.background = new Option({
      name: 'background',
      displayName: 'Background',
      description: 'The background of the tab bar.',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#FAFAFA,#FAFAFA',
    });

    this.tintColor = new Option({
      name: 'tintColor',
      displayName: 'Tint Color',
      description: 'The color of the header items.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#272727',
    });
  }
}

module.exports = Header;
