const requestPromise = require('request-promise');

const AppModuleProviderDataModel = rootRequire('/models/AppModuleProviderData');
const { DataSource } = rootRequire('/libs/App/configurables');
const facebookConfig = rootRequire('/config/dataSources/facebook');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'facebook',
      displayName: 'Facebook',
      description: 'Connect Facebook page content.',
      platform: 'facebook',
    });
  }

  connect(appModuleProvider) {
    // TODO: page posts url doesn't return much data? may have to request posts
    // individually after pulling the list?
    return requestPromise.get({
      url: `${facebookConfig.pagePostsUrl.replace('{page-id}', appModuleProvider.accountId)}?` +
           `access_token=${appModuleProvider.accessToken}` +
           '&limit=100',
      json: true,
    }).then(posts => {
      AppModuleProviderDataModel.bulkCreate(posts.data.map(post => {
        return {
          appModuleProviderId: appModuleProvider.id,
          data: post,
        };
      }));

      // double check if connected page automatically sends updates via pubsubhubub
      // subscription or if we need to make an additional request to enable it
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
