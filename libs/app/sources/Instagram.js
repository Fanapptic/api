const requestPromise = require('request-promise');

const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const Source = require('../Source');
const instagramConfig = rootRequire('/config/sources/instagram');

// need to get more than first 100 posts.
module.exports = class extends Source {
  connect() {
    return requestPromise.get({
      url: `${instagramConfig.userUrl}?` +
           `access_token=${this.appSource.accessToken}`,
      json: true,
    }).then(user => {
      const transaction = (this.sequelizeOptions) ? this.sequelizeOptions.transaction : null;

      this.appSource.totalFans = user.data.counts.followed_by;

      return this.appSource.save({ transaction });
    }).then(() => {
      const paginate = nextMaxId => {
        let url = `${instagramConfig.postsUrl}?` +
                  `access_token=${this.appSource.accessToken}` +
                  '&count=100';

        if (nextMaxId) {
          url += `&max_id=${nextMaxId}`;
        }

        requestPromise.get({
          url,
          json: true,
        }).then(posts => {
          posts.data.forEach(post => {
            const data = postToAppSourceContent(this.appSource, post);

            AppSourceContentModel.create(data).catch(e => {
              console.log(e.message);
              console.log(JSON.stringify(post));
            });
          });

          if (posts.pagination && posts.pagination.next_max_id) {
            paginate(posts.pagination.next_max_id);
          }
        });
      };

      paginate();
    });
  }

  static handleWebhookRequest(request) {

  }
};

/*
 * Helpers
 */

function postToAppSourceContent(appSource, post) {
  let image = null;
  let video = null;
  let collection = null;

  if (post.type === 'image') {
    image = buildImageFromPost(post);
  }

  if (post.type === 'video') {
    video = buildVideoFromPost(post);
  }

  if (post.type === 'carousel') {
    collection = buildCollectionFromPost(post);
  }

  return {
    appId: appSource.appId,
    appSourceId: appSource.id,
    image,
    video,
    collection,
    description: (post.caption) ? post.caption.text : null,
    data: post,
    publishedAt: post.created_time,
  };
}

function buildImageFromPost(post) {
  return {
    url: post.images.standard_resolution.url,
    width: post.images.standard_resolution.width,
    height: post.images.standard_resolution.height,
  };
}

function buildVideoFromPost(post) {
  return {
    url: post.videos.standard_resolution.url,
    thumbnailUrl: (post.images) ? post.images.standard_resolution.url : null,
    width: post.videos.standard_resolution.width,
    height: post.videos.standard_resolution.height,
  };
}

function buildCollectionFromPost(post) {
  let collection = [];

  post.carousel_media.forEach(media => {
    if (media.type === 'image') {
      collection.push(Object.assign({}, buildImageFromPost(media), {
        type: 'image',
        thumbnailUrl: media.images.thumbnail.url,
      }));
    }

    if (media.type === 'video') {
      collection.push(Object.assign({}, buildVideoFromPost(media), {
        type: 'video',
      }));
    }
  });

  return collection;
}
