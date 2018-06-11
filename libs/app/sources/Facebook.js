const requestPromise = require('request-promise');

const Source = require('../Source');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const facebookConfig = rootRequire('/config/sources/facebook');

// need to get more than first 100 posts.
module.exports = class extends Source {
  connect() {
    return requestPromise.post({
      url: `${facebookConfig.baseUrl}/${this.appSource.accountId}/subscribed_apps?` +
           `access_token=${this.appSource.accessToken}`,
      json: true,
    }).then(() => {
      return requestPromise.get({
        url: `${facebookConfig.baseUrl}/${this.appSource.accountId}/posts?` +
             `access_token=${this.appSource.accessToken}` +
             '&fields=id,source,message,link,created_time' +
             '&limit=100',
        json: true,
      });
    }).then(posts => {
      let attachmentRequests = [];
      let bulkData = [];

      posts.data.forEach(post => {
        attachmentRequests.push(requestPromise.get({
          url: `${facebookConfig.baseUrl}/${post.id}/attachments?` +
               `access_token=${this.appSource.accessToken}`,
          json: true,
        }).then(postAttachments => {
          const { data } = postAttachments;

          post.attachments = (data && data.length) ? data : [
            { description: post.message },
          ];

          bulkData.push({
            appId: this.appSource.appId,
            appSourceId: this.appSource.id,
            data: post,
            publishedAt: post.created_time,
          });
        }));
      });

      Promise.all(attachmentRequests).then(() => {
        AppSourceContentModel.bulkCreate(bulkData);
      });
    });
  }

  static handleWebhookRequest(request) {

  }
};
