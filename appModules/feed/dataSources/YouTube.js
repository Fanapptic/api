const requestPromise = require('request-promise');

const AppModuleProviderModel = rootRequire('/models/AppModuleProvider');
const AppModuleDataModel = rootRequire('/models/AppModuleData');
const { DataSource } = rootRequire('/libs/App/configurables');
const serverConfig = rootRequire('/config/server');
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
    return requestPromise.post({
      url: 'https://pubsubhubbub.appspot.com/subscribe',
      form: {
        'hub.callback': `${process.env.API_BASE_URL}/apps/*/modules/*/providers/*/webhooks?webhookToken=${serverConfig.webhookToken}&dataSource=youtube`,
        'hub.topic': `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${appModuleProvider.accountId}`,
        'hub.mode': 'subscribe',
        'hub.verify': 'async',
        'hub.verify_token': 'noop',
      },
    }).then(() => {
      return requestPromise.get({
        url: `${youtubeConfig.channelsUrl}?` +
             'part=contentDetails' +
             '&mine=true',
        headers: {
          Authorization: `Bearer ${appModuleProvider.accessToken}`,
        },
        json: true,
      });
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
    if (!request.body.feed || !request.body.feed.entry) {
      return;
    }

    // todo: send global notificaitons for new content! :D

    request.body.feed.entry.forEach(entry => {
      const channelId = entry['yt:channelid'][0];
      const videoId = entry['yt:videoid'][0];

      let video = null;

      return requestPromise.get({
        url: `${youtubeConfig.videosUrl}?` +
             `id=${videoId}` +
             '&part=snippet' +
             `&key=${youtubeConfig.apiKey}`,
        json: true,
      }).then(videoList => {
        video = videoList.items[0];

        return AppModuleDataModel.destroy({
          where: {
            $or: [
              { 'data.snippet.resourceId.videoId': videoId },
              { 'data.id': videoId },
            ],
          },
        });
      }).then(() => {
        // can tell if it's new by whether or not a previous entry was destroyed.
        return AppModuleProviderModel.findAll({
          where: {
            dataSource: 'youtube',
            accountId: channelId,
          },
        });
      }).then(appModuleProviders => {
        appModuleProviders.forEach(appModuleProvider => {
          AppModuleDataModel.create({
            appModuleId: appModuleProvider.appModuleId,
            appModuleProviderId: appModuleProvider.id,
            data: video,
            publishedAt: video.snippet.publishedAt,
          });
        });
      });
    });
  }
};
