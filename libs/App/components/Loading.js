const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class Loading extends Component {
  constructor() {
    super({
      name: 'Loading',
      displayName: 'Loading',
      description: 'The loading screen of the application.',
    });

    this.gif = new Option({
      name: 'gif',
      displayName: 'Gif',
      description: 'The gif that shows as the full screen background of the loading screen.',
      field: Configurable.FIELDS.GIF(),
      defaultValue: 'http://www.giphy.com/some.gif',
    });

    this.showActivityIndicator = new Option({
      name: 'showActivityIndicator',
      displayName: 'Show Activity Indicator',
      description: 'Toggles whether or not to show the activity indicator on the loading screen.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    });

  }
}

module.exports = Loading;
