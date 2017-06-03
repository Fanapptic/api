const Component = require('../Component');
const Configurable = require('../Configurable');
const { Option } = require('../configurables');

class StatusBar extends Component {
  constructor() {
    super({
      name: 'statusBar',
      displayName: 'Status Bar',
      description: 'The status bar of the application.',
    });

    this.barStyle = new Option({
      name: 'barStyle',
      displayName: 'Bar Style',
      description: 'The display style of the top status bar',
      field: Configurable.FIELDS.SELECT({
        options: [
          {
            name: 'Default',
            value: 'default',
            tooltip: 'Default style bar on both iOS and Android.',
          },
          {
            name: 'Light',
            value: 'light-content',
            tooltip: 'Light colored status bar text.',
          },
          {
            name: 'Dark',
            value: 'dark-content',
            tooltip: 'Dark colored status bar text.',
          },
        ],
      }),
      defaultValue: 'default',
    });

    this.hidden = new Option({
      name: 'hidden',
      displayName: 'Hidden',
      description: 'Hides the top status bar.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: false,
    });
  }
}

module.exports = StatusBar;
