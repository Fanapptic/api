const requestPromise = require('request-promise');

const AppModuleProviderModel = rootRequire('/models/AppModuleProvider');
const AppModuleDataModel = rootRequire('/models/AppModuleData');
const { DataSource } = rootRequire('/libs/App/configurables');
const facebookConfig = rootRequire('/config/dataSources/facebook');

// This code can be refactored and cleaned up.
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
    return requestPromise.post({
      url: `${facebookConfig.baseUrl}/${appModuleProvider.accountId}/subscribed_apps?` +
           `access_token=${appModuleProvider.accessToken}`,
      json: true,
    }).then(() => {
      return requestPromise.get({
        url: `${facebookConfig.baseUrl}/${appModuleProvider.accountId}/posts?` +
             `access_token=${appModuleProvider.accessToken}` +
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
               `access_token=${appModuleProvider.accessToken}`,
          json: true,
        }).then(postAttachments => {
          const { data } = postAttachments;

          post.attachments = (data && data.length) ? data : [
            { description: post.message },
          ];

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

      AppModuleProviderModel.findAll({
        where: {
          dataSource: 'facebook',
          accountId: entry.id,
        },
      }).then(appModuleProviders => {
        appModuleProviders.forEach(appModuleProvider => {
          applicableChanges.forEach(applicableChange => {
            const { verb, sender_id } = applicableChange.value;
            const chain = (verb !== 'add') ? AppModuleDataModel.destroy({
              appModuleId: appModuleProvider.appModuleId,
              where: {
                'data.id': applicableChange.value.post_id,
              },
            }) : Promise.resolve();

            if (verb !== 'add' && verb !== 'edited' || sender_id !== appModuleProvider.accountId) {
              return;
            }

            let post = null;

            chain.then(() => {
              return requestPromise.get({
                url: `${facebookConfig.baseUrl}/${applicableChange.value.post_id}?` +
                     `access_token=${appModuleProvider.accessToken}` +
                     '&fields=id,source,message,link,created_time',
                json: true,
              });
            }).then(_post => {
              post = _post;

              return requestPromise.get({
                url: `${facebookConfig.baseUrl}/${post.id}/attachments?` +
                     `access_token=${appModuleProvider.accessToken}`,
                json: true,
              });
            }).then(postAttachments => {
              const { data } = postAttachments;

              post.attachments = (data && data.length) ? data : [
                { description: post.message },
              ];

              AppModuleDataModel.create({
                appModuleId: appModuleProvider.appModuleId,
                appModuleProviderId: appModuleProvider.id,
                data: post,
                publishedAt: post.created_time,
              });
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
};
