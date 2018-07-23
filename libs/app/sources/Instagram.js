const requestPromise = require('request-promise');
const aws = require('aws-sdk');
const uuidV1 = require('uuid/v1');
const path = require('path');

const AppModel = rootRequire('/models/App');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const Source = require('../Source');
const awsConfig = rootRequire('/config/aws');
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
          const batchPromises = [];

          posts.data.forEach(post => {
            batchPromises.push(
              postToAppSourceContent(this.appSource, post).then(data => {
                AppSourceContentModel.create(data);
              }).catch(e => {
                console.log('Instagram conversion error');
                console.log(e.message);
                console.log(JSON.stringify(post));
              })
            );
          });

          Promise.all(batchPromises).then(() => {
            if (posts.pagination && posts.pagination.next_max_id) {
              paginate(posts.pagination.next_max_id);
            }
          });
        });
      };

      paginate();
    });
  }

  static handleWebhookRequest(request) {
    // we poll here instead for now and use lambda to trigger this on a 60 second interval.
    AppSourceModel.findAll({ where: { type: 'instagram' } }).then(appSources => {
      appSources.forEach(appSource => {
        let app = null;

        AppModel.find({ where: { id: appSource.appId } }).then(_app => {
          app = _app;

          requestPromise.get({
            url: `${instagramConfig.postsUrl}?` +
                 `access_token=${appSource.accessToken}` +
                 '&count=50',
            json: true,
          }).then(posts => {
            const traversePosts = index => {
              if (!posts.data) {
                console.log('no posts!!');
                console.log(posts);

                return;
              }

              const post = posts.data[index];

              AppSourceContentModel.count({ where: { 'data.id': post.id } }).then(exists => {
                if (exists) {
                  return;
                }

                postToAppSourceContent(appSource, post).then(data => {
                  return AppSourceContentModel.create(data);
                }).then(appSourceContent => {
                  let url = (appSourceContent.image) ? appSourceContent.image.url : null;
                      url = (appSourceContent.video) ? appSourceContent.video.url : null;

                  if (!url) {
                    return;
                  }

                  app.sendGlobalNotification(
                    url,
                    `${appSource.accountName} posted new content!`,
                    post.caption.text
                  );
                });

                traversePosts(index + 1);
              });
            };

            traversePosts(0);
          }).catch(e => {
            console.log('Error for instagram polling on app source:');
            console.log(`ID: ${appSource.id} | Name ${appSource.accountName} | ${appSource.accessToken}`);
            console.log(e.message);
          });
        });
      });
    });
  }
};

/*
 * Helpers
 */

function postToAppSourceContent(appSource, post) {
  let image = null;
  let video = null;
  let collection = null;

  return Promise.resolve().then(() => {
    if (post.type === 'image') {
      return buildImageFromPost(post).then(_image => {
        image = _image;
      });
    }

    if (post.type === 'video') {
      return buildVideoFromPost(post).then(_video => {
        video = _video;
      });
    }

    if (post.type === 'carousel') {
      return buildCollectionFromPost(post).then(_collection => {
        collection = _collection;
      });
    }

    throw new Error('Invalid content type');
  }).then(() => {
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
  });
}

function buildImageFromPost(post) {
  return uploadFromUrlToS3(post.images.standard_resolution.url).then(imageUrl => {
    return {
      url: imageUrl,
      width: post.images.standard_resolution.width,
      height: post.images.standard_resolution.height,
    };
  });
}

function buildVideoFromPost(post) {
  let videoUrl = null;

  return uploadFromUrlToS3(post.videos.standard_resolution.url).then(_videoUrl => {
    videoUrl = _videoUrl;

    if (post.images) {
      return uploadFromUrlToS3(post.images.standard_resolution.url);
    }
  }).then(thumbnailUrl => {
    return {
      url: videoUrl,
      thumbnailUrl: (thumbnailUrl) ? thumbnailUrl : null,
      width: post.videos.standard_resolution.width,
      height: post.videos.standard_resolution.height,
    };
  });
}

function buildCollectionFromPost(post) {
  let collection = [];
  let promises = [];

  post.carousel_media.forEach(media => {
    if (media.type === 'image') {
      promises.push(
        buildImageFromPost(media).then(image => {
          image.type = 'image';
          image.thumbnailUrl = image.url;

          collection.push(image);
        })
      );
    }

    if (media.type === 'video') {
      promises.push(
        buildVideoFromPost(media).then(video => {
          video.type = 'video';

          collection.push(video);
        })
      );
    }
  });

  return Promise.all(promises).then(() => collection);
}

function uploadFromUrlToS3(url) {
  const s3 = new aws.S3();

  return requestPromise.get({
    url,
    encoding: null,
  }).then(buffer => {
    return s3.upload({
      ACL: 'public-read',
      Body: buffer,
      Bucket: awsConfig.s3AppsContentBucket,
      Key: `${uuidV1()}${path.extname(url)}`,
    }).promise();
  }).then(result => {
    return result.Location;
  });
}
