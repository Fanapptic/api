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
      moduleUrl: 'https://fanapptic.s3.aws.amazon.com/feed',
      //injectedJavaScript: '',
      navigator: new Navigator(),
      tab: new Tab(),
    });

    /*
     * Data Sources
     */

    this.addDataSource(dataSources.Facebook);
    this.addDataSource(dataSources.Instagram);
    this.addDataSource(dataSources.YouTube);

    /*
     * Options
     */

    this.addOption(options.FeedStyle);

    /*
     * Styles
     */

    this.addStyle(styles.Font);
  }
}

module.exports = Feed;
