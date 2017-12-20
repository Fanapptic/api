const requestPromise = require('request-promise');

const AppModuleDataModel = rootRequire('/models/AppModuleData');
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
    return requestPromise.get({
      url: `${facebookConfig.baseUrl}/${appModuleProvider.accountId}/posts?` +
           `access_token=${appModuleProvider.accessToken}` +
           '&fields=id,source,created_time' +
           '&limit=100',
      json: true,
    }).then(posts => {
      let attachmentRequests = [];
      let bulkData = [];

      posts.data.forEach(post => {
        attachmentRequests.push(requestPromise.get({
          url: `${facebookConfig.baseUrl}/${post.id}/attachments?` +
               `access_token=${appModuleProvider.accessToken}`,
          json: true,
        }).then(postAttachments => {
          post.attachments = postAttachments.data;

          bulkData.push({
            appModuleId: appModuleProvider.appModuleId,
            appModuleProviderId: appModuleProvider.id,
            data: post,
            publishedAt: post.created_time,
          });
        }));
      });

      Promise.all(attachmentRequests).then(() => {
        AppModuleDataModel.bulkCreate(bulkData);
      });
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
