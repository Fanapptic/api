const requestPromise = require('request-promise');

const Source = require('../Source');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const serverConfig = rootRequire('/config/server');
const youtubeConfig = rootRequire('/config/sources/youtube');

// need to get more than first 50 videos
module.exports = class extends Source {
  connect() {
    return requestPromise.post({
      url: 'https://pubsubhubbub.appspot.com/subscribe',
      form: {
        'hub.callback': `${process.env.API_BASE_URL}/apps/*/modules/*/providers/*/webhooks?webhookToken=${serverConfig.webhookToken}&dataSource=youtube`,
        'hub.topic': `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${this.appSource.accountId}`,
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
          Authorization: `Bearer ${this.appSource.accessToken}`,
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
          Authorization: `Bearer ${this.appSource.accessToken}`,
        },
        json: true,
      });
    }).then(playlistItems => {
      AppSourceContentModel.bulkCreate(playlistItems.items.map(playlistItem => {
        return {
          appId: this.appSource.appId,
          appSourceId: this.appSource.id,
          data: playlistItem,
          publishedAt: playlistItem.snippet.publishedAt,
        };
      }));
    });
  }

  static handleWebhookRequest(request) {

  }
};
