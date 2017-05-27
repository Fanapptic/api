const Configurable = rootRequire('/libs/App/Configurable');
const { Style } = rootRequire('/libs/App/configurables');

module.exports = class extends Style {
  constructor() {
    super({
      name: 'font',
      displayName: 'Font',
      description: 'The font of the feed items.',
      field: Configurable.FIELDS.FONT(),
      cssSelector: '.grid-item',
      cssProperty: 'font',
      defaultValue: 'Arial',
    });
  }
};
