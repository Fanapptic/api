/*
 * Module: Feed
 */

const Module = rootRequire('./libs/app/module');

class Feed extends Module {
  static get moduleName() {
    return 'feed';
  }

  constructor() {
    super({
      name: Feed.moduleName,
      displayName: 'Feed',
      description: 'Display an aggregate feed of your content from multiple sources.',
      moduleUrl: 'https://fanapptic.s3.aws.amazon.com/feed',
      //injectedJavaScript: '',
      navigatorConfig: {}, // Extend a default navigator config
      tabConfig: {}, // Extend a default tabConfig
    });

    /*
     * Data Sources
     */

    this.addConfigurableDataSource({
      internalName: 'youtube',
      displayName: 'YouTube',
      description: 'Some description of pulling in YT vids',
      // somehow make this pluggable where we can define the connection functionality
      // the disconnection functionality, and how it interacts with the appModuleData
      // table...
    });

    /*
     * Options
     */

    this.addConfigurableOption({
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

    /*
     * Styles
     */

    this.addConfigurableStyle({
      internalName: 'font',
      displayName: 'Font',
      description: 'The font of the feed items.',
      field: Module.FIELDS.FONT,
      cssSelector: '.grid-item',
      cssProperty: 'font',
      defaultValue: 'Arial',
    });
  }
}

module.exports = Feed;
