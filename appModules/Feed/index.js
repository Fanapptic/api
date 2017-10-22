/*
 * Module: Feed
 */

const { Module, ConfigurableGrouping } = rootRequire('/libs/App/components');
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
    });

    /*
     * Feed Sources
     */

    const feedSourcesGrouping = new ConfigurableGrouping({
      name: 'feedSources',
      displayName: 'Feed Source',
      description: 'Something about how these are the feed sources you connect.',
    });

    feedSourcesGrouping.addConfigurable(new dataSources.Facebook());
    feedSourcesGrouping.addConfigurable(new dataSources.Instagram());
    feedSourcesGrouping.addConfigurable(new dataSources.YouTube());

    this.addConfigurableGrouping(feedSourcesGrouping);

    /*
    /*
     * Data Sources


    this.addDataSource(new dataSources.Facebook());
    this.addDataSource(new dataSources.Instagram());
    this.addDataSource(new dataSources.YouTube());

    /*
     * Options


    this.addOption(new options.FeedStyle());

    /*
     * Styles


    this.addStyle(new styles.Font());*/
  }
}

module.exports = Feed;
