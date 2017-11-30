/*
 * Module: Shopify
 */

const { Module } = rootRequire('/libs/App/components');

class Shopify extends Module {
  static get moduleName() {
    return 'shopify';
  }

  constructor() {
    super({
      name: Shopify.moduleName,
      displayName: 'Shopify',
      description: 'Sell product and merchandise by integrating with your Shopify account.',
      brandingColor: '#609042',
      defaultIcon: {
        name: 'ion-bag',
        set: 'ion',
      },
      moduleUrl: 'https://www.fiftythree.com/pencil',
    });
  }
}

module.exports = Shopify;
