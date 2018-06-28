const requestPromise = require('request-promise');

const Source = require('../Source');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
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
        posts.data.forEach(post => {
          requestPromise.get({
            url: `${facebookConfig.baseUrl}/${post.id}/attachments?` +
                 `access_token=${this.appSource.accessToken}`,
            json: true,
          }).then(postAttachments => {
            post.attachments = (postAttachments) ? postAttachments.data : null;

            const data = this.postToAppSourceContent(post);

            if (!data) {
              return;
            }

            // could bulk create, but we lose individual create validations.
            AppSourceContentModel.create(data).catch(e => {
              console.log(e.message);
              console.log(JSON.stringify(post));
            });
          });
        });

        if (posts.paging && posts.paging.next) {
          requestPromise.get({
            url: posts.paging.next,
            json: true,
          }).then(paginate);
        }
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

              const data = this.postToAppSourceContent(post);

              if (!data) {
                return;
              }

              AppSourceContentModel.create(data);
            }).then(() => {
              if (verb === 'add') {
                // send global notification?
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

  /*
   * Helpers
   */

  postToAppSourceContent(post) {
    let image = null;
    let video = null;
    let link = null;
    let collection = null;

    if (post.attachments && post.attachments.length) {
      const attachment = post.attachments[0];

      if (attachment.type === 'photo') {
        image = this.buildImageFromPost(post);
      }

      if (attachment.type === 'video_inline' && post.source) {
        video = this.buildVideoFromPost(post);
      }

      if (attachment.type === 'share' || (attachment.type === 'video_inline' && !post.source && post.link)) {
        link = this.buildLinkFromPost(post);
      }

      if (attachment.type === 'album') {
        this.buildCollectionFromPost(post);
      }

      if (!image && !video && !link && !collection) {
        return false;
      }
    }

    return {
      appId: this.appSource.appId,
      appSourceId: this.appSource.id,
      image,
      video,
      link,
      collection,
      description: post.message,
      data: post,
      publishedAt: post.created_time,
    };
  }

  buildImageFromPost(post) {
    return {
      url: post.attachments[0].media.image.src,
      width: post.attachments[0].media.image.width,
      height: post.attachments[0].media.image.height,
    };
  }

  buildVideoFromPost(post) {
    return {
      url: post.source,
      thumbnailUrl: post.attachments[0].media.image.src,
      width: post.attachments[0].media.image.width,
      height: post.attachments[0].media.image.height,
    };
  }

  buildLinkFromPost(post) {
    const attachmentMedia = post.attachments[0].media;

    return {
      title: post.attachments[0].title,
      description: post.attachments[0].description,
      url: post.link || post.attachments[0].url,
      thumbnailUrl: (attachmentMedia) ? attachmentMedia.image.src : null,
      width: (attachmentMedia) ? attachmentMedia.image.width : null,
      height: (attachmentMedia) ? attachmentMedia.image.height : null,
    };
  }

  buildCollectionFromPost(post) {
    let collection = [];

    post.attachments[0].subattachments.data.forEach(subattachment => {
      if (subattachment.type === 'photo') {
        collection.push({
          type: 'image',
          url: subattachment.media.image.src,
          thumbnailUrl: subattachment.media.image.src,
          width: subattachment.media.image.width,
          height: subattachment.media.image.height,
          title: subattachment.title,
        });
      }

      if (subattachment.type === 'video') {
        collection.push({
          type: 'link',
          url: subattachment.url,
          thumbnailUrl: subattachment.media.image.src,
          width: subattachment.media.image.width,
          height: subattachment.media.image.height,
        });
      }
    });

    return collection;
  }
};
