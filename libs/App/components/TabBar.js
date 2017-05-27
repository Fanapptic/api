const Component = require('../Component');
const Configurable = require('../Configurable');
const TabBarOptions = require('./TabBarOptions');
const { Option } = require('../configurables');

class TabBar extends Component {
  constructor() {
    super({
      name: 'tabBar',
      displayName: 'Tab Bar',
      description: 'The tab bar of the application.',
    });

    this.swipeEnabled = new Option({
      name: 'swipeEnabled',
      displayName: 'Swipe Enabled',
      description: 'Enables tabs to be swithed by swiping left or right.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: false,
    });

    this.animationEnabled = new Option({
      name: 'animationEnabled',
      displayName: 'Animation Enabled',
      description: 'Enables a smooth transition when changing between tabs.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    });

    this.backgroundGradient = new Option({
      name: 'backgroundGradient',
      displayName: 'Background Gradient',
      description: 'The background gradient of the tab bar.',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#000000,#FFFFFF',
    });

    this.tabBarOptions = new TabBarOptions();
  }
}

module.exports = TabBar;
