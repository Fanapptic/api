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
      posts.data.forEach(post => {
        const data = postToAppSourceContent(this.appSource, post);

        if (post.type !== 'image') { // temp
          return;
        }

        AppSourceContentModel.create(data).catch(e => {
          console.log(e.message);
          console.log(JSON.stringify(post));
        });
      });
    });
  }

  static handleWebhookRequest(request) {

  }
};

/*
 * Helpers
 */

function postToAppSourceContent(appSource, post) {
  return {
    appId: appSource.appId,
    appSourceId: appSource.id,
    image: {
      url: post.images.standard_resolution.url,
      width: post.images.standard_resolution.width,
      height: post.images.standard_resolution.height,
    },
    description: (post.caption) ? post.caption.text : null,
    data: post,
    publishedAt: post.created_time,
  };
}
