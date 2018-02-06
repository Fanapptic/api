/*
 * Module: Shopify
 */

const { Module, ConfigurableGrouping } = rootRequire('/libs/App/components');
const Configurable = rootRequire('/libs/App/Configurable');
const { Option } = rootRequire('/libs/App/configurables');
const dataSources = require('./dataSources');

class Shopify extends Module {
  static get name() {
    return 'shopify';
  }

  constructor() {
    super({
      name: Shopify.name,
      displayName: 'Shopify',
      description: 'Sell product and merchandise by integrating with your Shopify account.',
      brandingColor: '#609042',
      defaultIcon: 'entypo-shop',
      url: `${process.env.APP_MODULES_BASE_URL}/shopify/`,
    });

    /*
     * Shopify Sources
     */

    const shopifySourcesGrouping = new ConfigurableGrouping({
      name: 'shopifySources',
      displayName: 'Shopify Source',
      description: 'Your Shopify tab will contain shoppable products from the Shopify account you connect.',
    });

    shopifySourcesGrouping.addConfigurable(new dataSources.Shopify());

    this.addConfigurableGrouping(shopifySourcesGrouping);

    /*
     * Look & Feed
     */

    const lookAndFeelGrouping = new ConfigurableGrouping({
      name: 'lookAndFeel',
      displayName: 'Look & Feel',
      description: 'Tweak the visual aesthetics and layout of your shopify to better suit the overall design of your app.',
    });

    lookAndFeelGrouping.addConfigurable(new Option({
      name: 'listMode',
      displayName: 'List Mode',
      description: 'Remove the padding around each product so they span the full width of the screen. Rounded borders are also removed.',
      field: Configurable.FIELDS.SWITCH(),
      defaultValue: false,
    }));

    this.addConfigurableGrouping(lookAndFeelGrouping);
  }
}

module.exports = Shopify;
