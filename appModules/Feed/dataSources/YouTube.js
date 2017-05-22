const Module = rootRequire('/libs/app/Module');
const configurables = rootRequire('/libs/app/Module/configurables');
const { DataSource, Option } = configurables;

module.exports = class extends DataSource {
  constructor() {
    super({
      internalName: 'youtube',
      displayName: 'YouTube',
      description: 'Display YouTube video feed content.',
      options: [
        new Option({
          internalName: 'channel',
          displayName: 'Channel',
          description: 'Your YouTube channel',
          field: Module.FIELDS.SELECT,
        }),
      ],
    });
  }
};
