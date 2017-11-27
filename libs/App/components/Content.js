const Component = require('../Component');
const Configurable = require('../Configurable');
const { Style } = require('../configurables');

class Content extends Component {
  constructor() {
    super({
      name: 'content',
      displayName: 'Content',
      description: 'The content configuration of the application.',
    });

    this.backgroundGradient = new Style({
      name: 'backgroundGradient',
      displayName: 'Background Gradient',
      description: 'The background gradient of module content.',
      cssSelector: 'html,body',
      cssProperty: 'background',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#000000,#FFFFFF',
    });

    this.textColor = new Style({
      name: 'textColor',
      displayName: 'Text Color',
      description: 'The color of module text.',
      cssSelector: 'p',
      cssProperty: 'color',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#999333',
    });

    this.fontSize = new Style({
      name: 'fontSize',
      displayName: 'Font Size',
      description: 'The font size of module text.',
      cssSelector: 'html,body',
      cssProperty: 'font-size',
      field: Configurable.FIELDS.PIXEL(),
      defaultValue: '12px',
    });
  }
}

module.exports = Content;
