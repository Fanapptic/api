/*
 * Module: Feed
 */

const { Module, ConfigurableGrouping } = rootRequire('/libs/App/components');
const Configurable = rootRequire('/libs/App/Configurable');
const { Option, Style } = rootRequire('/libs/App/configurables');
const dataSources = require('./dataSources');

class Feed extends Module {
  static get name() {
    return 'feed';
  }

  constructor() {
    super({
      name: Feed.name,
      displayName: 'Social Feed',
      description: 'Consolidate all of your social media accounts into a single feed.',
      defaultIcon: {
        name: 'ion-ios-list-outline',
        set: 'ion',
      },
      brandingColor: '#387AA6',
      moduleUrl: 'http://localhost:8484/feed/',
      injectedJavaScript: '$("button").click()',
    });

    /*
     * Feed Sources
     */

    const feedSourcesGrouping = new ConfigurableGrouping({
      name: 'feedSources',
      displayName: 'Feed Source',
      description: 'Your feed consists of content produced by one or more of your social media accounts. You can easily connect and disconnect them below.',
    });

    feedSourcesGrouping.addConfigurable(new dataSources.Facebook());
    feedSourcesGrouping.addConfigurable(new dataSources.Instagram());
    feedSourcesGrouping.addConfigurable(new dataSources.Twitter());
    feedSourcesGrouping.addConfigurable(new dataSources.YouTube());

    this.addConfigurableGrouping(feedSourcesGrouping);

    /*
     * Favoriting
     */

    const favoritingGrouping = new ConfigurableGrouping({
      name: 'favoriting',
      displayName: 'Favoriting',
      description: 'Favoriting is a simple feature that will help keep your users in your app by allowing them to bookmark all their favorite posts they’ve seen from you.',
    });

    favoritingGrouping.addConfigurable(new Option({
      name: 'allowFavoriting',
      displayName: 'Allow Favoriting',
      description: 'Something about favoriting.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    favoritingGrouping.addConfigurable(new Option({
      name: 'favoritingIcon',
      displayName: 'Favoriting Icon',
      description: 'SOme description about the icon?',
      field: Configurable.FIELDS.ICON(),
      defaultValue: 'ion-heart',
    }));

    favoritingGrouping.addConfigurable(new Style({
      name: 'favoritedIconFillColor',
      displayName: 'Favorited Icon Fill Color',
      description: 'Something about the fill color here',
      cssSelector: '.some-select',
      cssProperty: 'color',
      field: Configurable.FIELDS.COLOR(),
      defaultValue: '#000000',
    }));

    favoritingGrouping.addConfigurable(new Option({
      name: 'favoritesPageTitle',
      displayName: 'Favorites Page Title',
      description: 'something about the favorites page title',
      field: Configurable.FIELDS.TEXT(),
      defaultValue: 'Favorites',
    }));

    this.addConfigurableGrouping(favoritingGrouping);

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
