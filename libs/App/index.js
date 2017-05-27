const Joi = require('joi');
const Component = require('./Component');
const Configurable = require('./Configurable');
const { Option } = require('./configurables');
const { Module, Navigator, Tab } = require('./components');

const navigator = new Navigator({
  name: 'test navigator',
  description: 'test navigator',
  displayName: 'test navigator',
  navigationOptions: new Component({
    name: 'test navigation options',
    description: 'test navigation options',
    displayName: 'Navigation Options',
    options: [
      new Option({
        name: 'Title',
        displayName: 'Title field display name',
        description: 'Title field description',
        field: Configurable.FIELDS.TEXT(),
      }, Joi.any()),
    ],
  }, Joi.object({ options: Joi.array().optional() })),
});

const tab = new Tab({
  name: 'test tab',
  description: 'test tab',
  displayName: 'test tab',
  title: new Option({
    name: 'Title',
    displayName: 'Title field display name',
    description: 'Title field description',
    field: Configurable.FIELDS.TEXT(),
  }, Joi.any()),
  icon: new Option({
    name :'Icon',
    displayName: 'Icon',
    description: 'Something',
    field: Configurable.FIELDS.ICON(),
  }, Joi.any()),
});

navigator.import({
  title: 'braydon',
});

const test = new Module({
  name: 'Test',
  displayName: 'test',
  description: 'testing',
  moduleUrl: 'http://www.google.com',
  navigator,
  tab,
});

class theclass extends Option {
  constructor() {
    super({
      name :'icon',
      displayName: 'Icon',
      description: 'Something',
      field: Configurable.FIELDS.ICON(),
    }, Joi.any());
  }
}

test.addOption(theclass);
test.export();
//console.log(test.export());
