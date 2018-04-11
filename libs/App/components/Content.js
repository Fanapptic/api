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

    this.background = new Style({
      name: 'background',
      displayName: 'Background',
      description: 'The background of module content.',
      cssSelector: 'html,body',
      cssProperty: 'background',
      field: Configurable.FIELDS.GRADIENT(),
      defaultValue: '#F4F4F4,#F4F4F4',
    });

    this.textColor = new Style({
      name: 'textColor',
      displayName: 'Text Color',
      description: 'The color of module text.',
      cssSelector: 'p',
      cssProperty: 'color',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#252525',
    });
  }
}

module.exports = Content;
