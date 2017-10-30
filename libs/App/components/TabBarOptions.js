const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class TabBarOptions extends Component {
  constructor() {
    super({
      name: 'tabBarOptions',
      displayName: 'Tab Bar Options',
      description: 'The tab bar options of the application.',
    });

    this.activeTintColor = new Option({
      name: 'activeTintColor',
      displayName: 'Active Tint Color',
      description: 'The color of the currenctly selected tab item.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#252525',
    });

    this.inactiveTintColor = new Option({
      name: 'inactiveTintColor',
      displayName: 'Inactive Tint Color',
      description: 'The color of the inactive tab items.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#838383',
    });

    this.showLabel = new Option({
      name: 'showLabel',
      displayName: 'Show Label',
      description: 'Toggles whether or not the labels under each tab icon show.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    });
  }
}

module.exports = TabBarOptions;
