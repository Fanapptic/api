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

    this.backgroundGradient = new Option({
      name: 'backgroundGradient',
      displayName: 'Background Gradient',
      description: 'The background gradient of module content.',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#000000,#FFFFFF',
    });

    this.textColor = new Option({
      name: 'textColor',
      displayName: 'Text Color',
      description: 'The color of module text.',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#999333',
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
