const Configurable = rootRequire('/libs/App/Configurable');
const { Option } = rootRequire('/libs/App/configurables');

module.exports = class extends Option {
  constructor() {
    super({
      name: 'feedStyle',
      displayName: 'Feed Style',
      description: 'Modifies the display style of the feed.',
      field: Configurable.FIELDS.SELECT({
        options: [
          {
            name: 'Collection',
            value: 'collection',
            tooltip: 'Displays content in a 3x3 tile layout.',
          },
          {
            name: 'List',
            value: 'list',
            tooltip: 'Displays content in a list layout.',
          },
          {
            name: 'Column',
            value: 'column',
            tooltip: 'Displays content in a column layout.',
          },
        ],
      }),
      defaultValue: 'collection',
    });
  }
};
