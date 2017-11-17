const requestPromise = require('request-promise');

const AppModuleProviderDataModel = rootRequire('/models/AppModuleProviderData');
const { DataSource } = rootRequire('/libs/App/configurables');
const instagramConfig = rootRequire('/config/dataSources/instagram');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'instagram',
      displayName: 'Instagram',
      description: 'Display Instagram profile content.',
      platform: 'instagram',
    });
  }

  connect(appModuleProvider) {
    return requestPromise.get({
      url: `${instagramConfig.postsUrl}?access_token=${appModuleProvider.accessToken}`,
      json: true,
    }).then(posts => {
      let bulkData = [];

      posts.data.forEach(post => {
        bulkData.push({
          appModuleProviderId: appModuleProvider.id,
          data: post, // we need to determine a standard data structure later...
        });
      });

      AppModuleProviderDataModel.bulkCreate(bulkData);

      // new posts are automatically sent via pubsubhubbub to webhook endpoint.
    });
  }

  disconnect(appModuleProvider) {
    return AppModuleProviderDataModel.destroy({
      where: {
        appModuleProviderId: appModuleProvider.id,
      },
    });
  }

  handleWebhookRequest(request) {
    console.log(request.body);
  }
};
