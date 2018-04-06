const Component = require('../Component');
const Configurable = require('../Configurable');
const { Style } = require('../configurables');

class Global extends Component {
  constructor() {
    super({
      name: 'content',
      displayName: 'Content',
      description: 'The content configuration of the application.',
    });

    this.fontFamily = new Style({
      name: 'fontFamily',
      displayName: 'Font Family',
      description: 'The font family used by the application.',
      cssSelector: 'html,body',
      cssProperty: 'font-family',
      field: Configurable.FIELDS.FONT(),
      defaultValue: 'Helvetica',
    });
  }
}

module.exports = Global;
