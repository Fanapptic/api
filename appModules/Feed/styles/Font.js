const Module = rootRequire('/libs/app/Module');

module.exports = class extends Module.CONFIGURABLES.Style {
  constructor() {
    super({
      internalName: 'font',
      displayName: 'Font',
      description: 'The font of the feed items.',
      field: Module.FIELDS.FONT(),
      cssSelector: '.grid-item',
      cssProperty: 'font',
      defaultValue: 'Arial',
    });
  }
};
