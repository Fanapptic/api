/*
 * Module: Feed
 */

const { Module, Navigator, Tab } = rootRequire('/libs/App/components');
const dataSources = require('./dataSources');
const options = require('./options');
const styles = require('./styles');

class Feed extends Module {
  static get moduleName() {
    return 'feed';
  }

  constructor() {
    super({
      name: Feed.moduleName,
      displayName: 'Feed',
      description: 'Display an aggregate feed of your content from multiple sources.',
      defaultIcon: {
        name: 'ion-ios-list-outline',
        set: 'ion',
      },
      moduleUrl: 'https://www.getbootstrap.com/',
      injectedJavaScript: '$("button").click()',
      navigator: new Navigator(),
      tab: new Tab(),
    });

    /*
     * Data Sources
     */

    this.addDataSource(new dataSources.Facebook());
    this.addDataSource(new dataSources.Instagram());
    this.addDataSource(new dataSources.YouTube());

    /*
     * Options
     */

    this.addOption(new options.FeedStyle());

    /*
     * Styles
     */

    this.addStyle(new styles.Font());
  }
}

module.exports = Feed;
