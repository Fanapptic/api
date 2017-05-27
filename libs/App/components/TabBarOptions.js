const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option, Style } = require('../configurables');

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
      defaultValue: '#999333',
    });

    this.inactiveTintColor = new Option({
      name: 'inactiveTintColor',
      displayName: 'Inactive Tint Color',
      description: 'The color of the inactive tab items.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#CCCCCC',
    });

    this.showLabel = new Option({
      name: 'showLabel',
      displayName: 'Show Label',
      description: 'Toggles whether or not the labels under each tab icon show.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    });

    this.style = [
      new Style({
        name: 'backgroundColor',
        displayName: 'Background Color',
        description: 'The background color of the tab bar.',
        field: Configurable.FIELDS.COLOR(),
        cssSelector: '*',
        cssProperty: 'backgroundColor',
        defaultValue: 'rgba(0, 0, 0, 0)',
      }),
    ];
  }
}

module.exports = TabBarOptions;
