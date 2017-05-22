/*
 * Module: Feed
 */

const Module = rootRequire('/libs/app/Module');
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
      navigatorConfig: {}, // Extend a default navigator config
      tabConfig: {}, // Extend a default tabConfig
    });

    /*
     * Data Sources
     */

    this.addConfigurableDataSource(dataSources.Facebook);
    this.addConfigurableDataSource(dataSources.Instagram);
    this.addConfigurableDataSource(dataSources.YouTube);

    /*
     * Options
     */

    this.addConfigurableOption(options.FeedStyle);

    /*
     * Styles
     */

    this.addConfigurableStyle(styles.Font);
  }
}

const test = new Feed();

module.exports = Feed;
