const Module = rootRequire('/libs/app/Module');

module.exports = class extends Module.CONFIGURABLES.DataSource {
  constructor() {
    super({
      internalName: 'youtube',
      displayName: 'YouTube',
      description: 'Display YouTube video feed content.',
      options: [
        new Module.CONFIGURABLES.Option({
          internalName: 'channel',
          displayName: 'Channel',
          description: 'Your YouTube channel',
          field: Module.FIELDS.SELECT({
            options: [
              {
                name: 'Default',
                value: 'solomondron',
                tooltip: 'meh',
              },
            ],
          }),
        }),
      ],
    });
  }
};
