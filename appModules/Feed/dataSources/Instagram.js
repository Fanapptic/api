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
      url: `${instagramConfig.postsUrl}?` +
           `access_token=${appModuleProvider.accessToken}` +
           '&count=100',
      json: true,
    }).then(posts => {
      AppModuleProviderDataModel.bulkCreate(posts.data.map(post => {
        return {
          appModuleProviderId: appModuleProvider.id,
          data: post,
          publishedAt: new Date(post.created_time * 1000),
        };
      }));

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
