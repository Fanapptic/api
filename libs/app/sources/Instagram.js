const requestPromise = require('request-promise');

const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const Source = require('../Source');
const instagramConfig = rootRequire('/config/sources/instagram');

// need to get more than first 100 posts.
module.exports = class extends Source {
  connect() {
    return requestPromise.get({
      url: `${instagramConfig.postsUrl}?` +
           `access_token=${this.appSource.accessToken}` +
           '&count=100',
      json: true,
    }).then(posts => {
      AppSourceContentModel.bulkCreate(posts.data.map(post => {
        return {
          appId: this.appSource.appId,
          appSourceId: this.appSource.id,
          data: post,
          publishedAt: new Date(post.created_time * 1000),
        };
      }));
    });
  }

  static handleWebhookRequest(request) {

  }
};

/*
 * Helpers
 */
