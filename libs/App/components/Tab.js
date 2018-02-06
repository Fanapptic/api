const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class Tab extends Component {
  constructor() {
    super({
      name: 'tab',
      displayName: 'Tab',
      description: 'The tab of the module.',
    });

    this.title = new Option({
      name: 'title',
      displayName: 'Title',
      description: 'The title shown under the tab icon.',
      field: Configurable.FIELDS.TEXT(),
      defaultValue: 'Tab Title',
    });

    this.icon = new Option({
      name: 'icon',
      displayName: 'Icon',
      description: 'The icon shown for the tab.',
      field: Configurable.FIELDS.ICON(),
      defaultValue: 'ion-help',
    });
  }
}

module.exports = Tab;
