const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option, Style } = require('../configurables');

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

    this.headerTintColor = new Option({
      name: 'headerTintColor',
      displayName: 'Header Tint Color',
      description: 'The text color of the title and buttons.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#000',
    });

    this.headerStyle = [
      new Style({
        name: 'backgroundColor',
        displayName: 'Background Color',
        description: 'The background color of the header.',
        field: Configurable.FIELDS.COLOR(),
        cssSelector: '*',
        cssProperty: 'backgroundColor',
        defaultValue: 'rgba(0, 0, 0, 0)',
      }),
    ];
  }
}

module.exports = NavigationOptions;
