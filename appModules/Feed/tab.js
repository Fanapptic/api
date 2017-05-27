const Configurable = rootRequire('/libs/App/Configurable');
const { Option } = rootRequire('/libs/App/configurables');
const { Tab } = rootRequire('/libs/App/components');

module.exports = new Tab({
  name: 'tab',
  displayName: 'Tab',
  description: 'The tab stuff',
  title: new Option({
    name: 'title',
    displayName: 'Tab title',
    description: 'The tab title.',
    field: Configurable.FIELDS.TEXT(),
  }),
  icon: new Option({
    name: 'icon',
    displayName: 'Tab icon',
    description: 'The tab icon.',
    field: Configurable.FIELDS.ICON(),
  }),
});
