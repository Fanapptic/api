const Configurable = rootRequire('/libs/App/Configurable');
const { Navigator, NavigationOptions } = rootRequire('/libs/App/components');
const { Option } = rootRequire('/libs/App/configurables');

module.exports = new Navigator({
  name: 'navigator',
  displayName: 'Navigator',
  description: 'The top header of the module.',
  navigationOptions: new NavigationOptions({
    name: 'someName',
    displayName: 'A Thing',
    description: 'The description',
    title: new Option({
      name: 'title',
      displayName: 'Title',
      description: 'The title shown in the header.',
      field: Configurable.FIELDS.TEXT(),
    }),
    headerTintColor: new Option({
      name: 'headerTintColor',
      displayName: 'Header Tint Color',
      description: 'The header\'s tint color.',
      field: Configurable.FIELDS.COLOR(),
    }),
  }),
});
