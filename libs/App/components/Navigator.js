const Component = require('../Component');
const NavigationOptions = require('./NavigationOptions');

class Navigator extends Component {
  constructor() {
    super({
      name: 'navigator',
      displayName: 'Navigator',
      description: 'The top header of the module.',
    });

    this.navigationOptions = new NavigationOptions();
  }
}

module.exports = Navigator;
