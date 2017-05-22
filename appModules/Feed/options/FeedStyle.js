const Module = rootRequire('/libs/app/Module');
const Option = rootRequire('/libs/app/Module/configurables/Option');

module.exports = class extends Option {
  constructor() {
    super({
      internalName: 'feedStyle',
      displayName: 'Feed Style',
      description: 'Modifies the display style of the feed.',
      field: Module.FIELDS.SELECT,
      fieldOptions: [
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
      defaultValue: 'collection',
    });
  }
};
