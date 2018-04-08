/*
 * Module: Feed
 */

const { Module, ConfigurableGrouping } = rootRequire('/libs/App/components');
const Configurable = rootRequire('/libs/App/Configurable');
const { Option } = rootRequire('/libs/App/configurables');
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
      brandingColor: '#387AA6',
      defaultIcon: 'entypo-layers',
      url: `${process.env.APP_MODULES_BASE_URL}/feed/`,
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
     * Look & Feed
     */

    const lookAndFeelGrouping = new ConfigurableGrouping({
      name: 'lookAndFeel',
      displayName: 'Look & Feel',
      description: 'Tweak the visual aesthetics and layout of your feed to better suit the overall design of your app.',
    });

    lookAndFeelGrouping.addConfigurable(new Option({
      name: 'galleryMode',
      displayName: 'Gallery Mode',
      description: 'Change the layout of your feed to only show the photos and videos specific to each post.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: true,
    }));

    lookAndFeelGrouping.addConfigurable(new Option({
      name: 'listMode',
      displayName: 'List Mode',
      description: 'Remove the padding around each post so they span the full width of the screen. Rounded borders are also removed from posts.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: false,
    }));

    this.addConfigurableGrouping(lookAndFeelGrouping);
  }
}

module.exports = Feed;
