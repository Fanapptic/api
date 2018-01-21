const requestPromise = require('request-promise');

const AppModuleDataModel = rootRequire('/models/AppModuleData');
const { DataSource } = rootRequire('/libs/App/configurables');
const shopifyConfig = rootRequire('/config/dataSources/shopify');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'shopify',
      displayName: 'Shopify',
      description: 'Connect Shopify store.',
      platform: 'shopify',
    });
  }

  connect(appModuleProvider) {
    return requestPromise.get({
      url: shopifyConfig.productsUrl.replace('{shop}', appModuleProvider.accountUrl),
      headers: {
        'X-Shopify-Access-Token': appModuleProvider.accessToken,
      },
      json: true,
    }).then(result => {
      const productListings = result.product_listings;

      AppModuleDataModel.bulkCreate(productListings.map(productListing => {
        return {
          appModuleId: appModuleProvider.appModuleId,
          appModuleProviderId: appModuleProvider.id,
          data: productListing,
          publishedAt: new Date(productListing.published_at),
        };
      }));
    });
  }

  disconnect(appModuleProvider) {
    return AppModuleDataModel.destroy({
      where: {
        appModuleProviderId: appModuleProvider.id,
      },
    });
  }

  handleWebhookRequest(request) {
    //console.log(request.body);
  }
};
