const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class Global extends Component {
  constructor() {
    super({
      name: 'content',
      displayName: 'Content',
      description: 'The content configuration of the application.',
    });

    this.fontFamily = new Option({
      name: 'fontFamily',
      displayName: 'Font Family',
      description: 'The font family used by the application.',
      field: Configurable.FIELDS.FONT(),
      defaultValue: 'Arial',
    });
  }
}

module.exports = Global;
