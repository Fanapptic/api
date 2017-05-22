const Module = rootRequire('/libs/app/Module');
const Style = rootRequire('/libs/app/Module/configurables/Style');

module.exports = class extends Style {
  constructor() {
    super({
      internalName: 'font',
      displayName: 'Font',
      description: 'The font of the feed items.',
      field: Module.FIELDS.FONT,
      cssSelector: '.grid-item',
      cssProperty: 'font',
      defaultValue: 'Arial',
    });
  }
};
