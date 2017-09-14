const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class Content extends Component {
  constructor() {
    super({
      name: 'content',
      displayName: 'Content',
      description: 'The content configuration of the application.',
    });

    this.textColor = new Option({
      name: 'textColor',
      displayName: 'Text Color',
      description: 'The color of module text.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#999333',
    });

    this.fontFamily = new Option({
      name: 'fontFamily',
      displayName: 'Font Family',
      description: 'The font family used by the application.',
      field: Configurable.FIELDS.FONT(),
      defaultValue: 'Arial',
    });

    this.fontSize = new Option({
      name: 'fontSize',
      displayName: 'Font Size',
      description: 'The font size of module text.',
      field: Configurable.FIELDS.PIXEL(),
      defaultValue: '12px',
    });
  }
}

module.exports = Content;
