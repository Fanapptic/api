const Configurable = rootRequire('/libs/App/Configurable');
const { DataSource } = rootRequire('/libs/App/components');
const { Option } = rootRequire('/libs/App/configurables');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'youtube',
      displayName: 'YouTube',
      description: 'Display YouTube video feed content.',
      options: [
        new Option({
          name: 'channel',
          displayName: 'Channel',
          description: 'Your YouTube channel',
          field: Configurable.FIELDS.SELECT({
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
