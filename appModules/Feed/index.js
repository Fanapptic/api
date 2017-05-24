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
    });

    /*
     * Default Navigator
     */

    this.navigator.importValueAndValidate({
      navigationOptions: {
        title: 'Feed',
        headerTintColor: '#000',
      },
    });

    /*
     * Default Tab
     */

    this.tab.importValueAndValidate({
      title: 'Feed',
      icon: {
        set: 'ion-icons',
        name: 'feed',
      },
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

const test = new Feed();

module.exports = Feed;
