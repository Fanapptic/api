const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class NavigationOptions extends Component {
  constructor() {
    super({
      name: 'navigationOptions',
      displayName: 'Naviation Options',
      description: 'The navigation options of the current module.',
    });

    this.title = new Option({
      name: 'title',
      displayName: 'Title',
      description: 'The title of the header.',
      field: Configurable.FIELDS.TEXT(),
      defaultValue: 'Module',
    });
  }
}

module.exports = NavigationOptions;
