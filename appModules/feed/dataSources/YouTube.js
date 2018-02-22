const requestPromise = require('request-promise');

const AppModuleDataModel = rootRequire('/models/AppModuleData');
const { DataSource } = rootRequire('/libs/App/configurables');
const youtubeConfig = rootRequire('/config/dataSources/youtube');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'youtube',
      displayName: 'YouTube',
      description: 'Display YouTube video feed content.',
      platform: 'youtube',
    });
  }

  connect(appModuleProvider) {
    return requestPromise.get({
      url: `${youtubeConfig.channelsUrl}?` +
           'part=contentDetails' +
           '&mine=true',
      headers: {
        Authorization: `Bearer ${appModuleProvider.accessToken}`,
      },
      json: true,
    }).then(channels => {
      const uploadsPlaylistId = channels.items[0].contentDetails.relatedPlaylists.uploads;

      return requestPromise.get({
        url: `${youtubeConfig.playlistItemsUrl}?` +
             `playlistId=${uploadsPlaylistId}` +
             '&part=snippet' +
             '&maxResults=50',
        headers: {
          Authorization: `Bearer ${appModuleProvider.accessToken}`,
        },
        json: true,
      });
    }).then(playlistItems => {
      AppModuleDataModel.bulkCreate(playlistItems.items.map(playlistItem => {
        return {
          appModuleId: appModuleProvider.appModuleId,
          appModuleProviderId: appModuleProvider.id,
          data: playlistItem,
          publishedAt: playlistItem.snippet.publishedAt,
        };
      }));
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
