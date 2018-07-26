const requestPromise = require('request-promise');

const Source = require('../Source');
const AppModel = rootRequire('/models/App');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const awsHelpers = rootRequire('/libs/awsHelpers');
const facebookConfig = rootRequire('/config/sources/facebook');

module.exports = class extends Source {
  connect() {
    return requestPromise.post({
      url: `${facebookConfig.baseUrl}/${this.appSource.accountId}/subscribed_apps?` +
           `access_token=${this.appSource.accessToken}`,
      json: true,
    }).then(() => {
      return requestPromise.get({
        url: `${facebookConfig.baseUrl}/${this.appSource.accountId}?` +
             `access_token=${this.appSource.accessToken}` +
             '&fields=fan_count',
        json: true,
      });
    }).then(page => {
      const transaction = (this.sequelizeOptions) ? this.sequelizeOptions.transaction : null;

      this.appSource.totalFans = page.fan_count;

      return this.appSource.save({ transaction });
    }).then(() => {
      return requestPromise.get({
        url: `${facebookConfig.baseUrl}/${this.appSource.accountId}/posts?` +
             `access_token=${this.appSource.accessToken}` +
             '&fields=id,source,message,link,created_time' +
             '&limit=100',
        json: true,
      });
    }).then(posts => {
      const paginate = posts => {
        const batchPromises = [];

        posts.data.forEach(post => {
          batchPromises.push(
            requestPromise.get({
              url: `${facebookConfig.baseUrl}/${post.id}/attachments?` +
                   `access_token=${this.appSource.accessToken}`,
              json: true,
            }).then(postAttachments => {
              post.attachments = (postAttachments) ? postAttachments.data : null;

              return postToAppSourceContent(this.appSource, post);
            }).then(data => {
              AppSourceContentModel.create(data);
            }).catch(e => {
              console.log(e.message);
              console.log(JSON.stringify(post));
            })
          );
        });

        Promise.all(batchPromises).then(() => {
          if (posts.paging && posts.paging.next) {
            requestPromise.get({
              url: posts.paging.next,
              json: true,
            }).then(paginate);
          }
        });
      };

      paginate(posts);
    });
  }

  static handleWebhookRequest(request) {
    if (!request.body.entry) {
      return;
    }

    request.body.entry.forEach(entry => {
      let applicableChanges = [];

      entry.changes.forEach(change => {
        if (!change.value.parent_id && !change.value.reaction_type) {
          applicableChanges.push(change);
        }
      });

      if (!applicableChanges.length) {
        return;
      }

      AppSourceModel.findAll({
        where: {
          type: 'facebook',
          accountId: entry.id,
        },
      }).then(appSources => {
        appSources.forEach(appSource => {
          applicableChanges.forEach(applicableChange => {
            const { verb, sender_id } = applicableChange.value;
            const chain = (verb !== 'add') ? AppSourceContentModel.destroy({
              appId: appSource.appId,
              where: {
                'data.id': applicableChange.value.post_id,
              },
            }) : Promise.resolve();

            if (verb !== 'add' && verb !== 'edited' || sender_id !== appSource.accountId) {
              return;
            }

            let post = null;

            chain.then(() => {
              return requestPromise.get({
                url: `${facebookConfig.baseUrl}/${applicableChange.value.post_id}?` +
                     `access_token=${appSource.accessToken}` +
                     '&fields=id,source,message,source,link,created_time',
                json: true,
              });
            }).then(_post => {
              post = _post;

              return requestPromise.get({
                url: `${facebookConfig.baseUrl}/${post.id}/attachments?` +
                     `access_token=${appSource.accessToken}`,
                json: true,
              });
            }).then(postAttachments => {
              post.attachments = (postAttachments) ? postAttachments.data : null;

              return postToAppSourceContent(appSource, post);
            }).then(data => {
              return AppSourceContentModel.create(data);
            }).then(appSourceContent => {
              if (verb === 'add' && appSourceContent) {
                AppModel.find({ where: { id: appSource.appId } }).then(app => {
                  app.sendGlobalNotification(
                    appSourceContent.id,
                    null,
                    `${appSource.accountName} posted new content!`,
                    appSourceContent.description
                  );
                });
              }
            }).catch(error => {
              // this could be a place we check if we need to reauth the account?
              console.log(error);
            });
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
  let link = null;
  let collection = null;

  return Promise.resolve().then(() => {
    if (post.attachments && post.attachments.length) {
      const attachment = post.attachments[0];

      if (attachment.type === 'photo') {
        return buildImageFromPost(post).then(_image => {
          image = _image;
        });
      }

      if (attachment.type === 'video_inline' && post.source) {
        return buildVideoFromPost(post).then(_video => {
          video = _video;
        });
      }

      if (attachment.type === 'share' || (attachment.type === 'video_inline' && !post.source && post.link)) {
        return buildLinkFromPost(post).then(_link => {
          link = _link;
        });
      }

      if (attachment.type === 'album') {
        return buildCollectionFromPost(post).then(_collection => {
          collection = _collection;
        });
      }
    }
  }).then(() => {
    return {
      appId: appSource.appId,
      appSourceId: appSource.id,
      image,
      video,
      link,
      collection,
      description: post.message,
      data: post,
      publishedAt: post.created_time,
    };
  });
}

function buildImageFromPost(post) {
  return awsHelpers.uploadFromUrlToS3(post.attachments[0].media.image.src).then(imageUrl => {
    return {
      url: imageUrl,
      width: post.attachments[0].media.image.width,
      height: post.attachments[0].media.image.height,
    };
  });
}

function buildVideoFromPost(post) {
  let videoUrl = null;

  return awsHelpers.uploadFromUrlToS3(post.source).then(_videoUrl => {
    videoUrl = _videoUrl;

    if (post.attachments[0]) {
      return awsHelpers.uploadFromUrlToS3(post.attachments[0].media.image.src);
    }
  }).then(thumbnailUrl => {
    return {
      url: videoUrl,
      thumbnailUrl: (thumbnailUrl) ? thumbnailUrl : null,
      width: post.attachments[0].media.image.width,
      height: post.attachments[0].media.image.height,
    };
  });
}

function buildLinkFromPost(post) {
  const attachmentMedia = post.attachments[0].media;

  return Promise.resolve().then(() => {
    if (attachmentMedia) {
      return awsHelpers.uploadFromUrlToS3(attachmentMedia.image.src);
    }
  }).then(thumbnailUrl => {
    return {
      title: post.attachments[0].title,
      description: post.attachments[0].description,
      url: post.link || post.attachments[0].url,
      thumbnailUrl,
      width: (attachmentMedia) ? attachmentMedia.image.width : null,
      height: (attachmentMedia) ? attachmentMedia.image.height : null,
    };
  });
}

function buildCollectionFromPost(post) {
  let collection = [];
  let promises = [];

  post.attachments[0].subattachments.data.forEach(subattachment => {
    if (subattachment.type === 'photo') {
      promises.push(
        awsHelpers.uploadFromUrlToS3(subattachment.media.image.src).then(imageUrl => {
          collection.push({
            url: imageUrl,
            thumbnailUrl: imageUrl,
            width: subattachment.media.image.width,
            height: subattachment.media.image.height,
            type: 'image',
          });
        })
      );
    }

    if (subattachment.type === 'video') {
      promises.push(
        awsHelpers.uploadFromUrlToS3(subattachment.media.image.src).then(imageUrl => {
          collection.push({
            url: subattachment.url,
            thumbnailUrl: imageUrl,
            width: subattachment.media.image.width,
            height: subattachment.media.image.height,
            type: 'link',
          });
        })
      );
    }
  });

  return Promise.all(promises).then(() => collection);
}
