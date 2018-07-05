const requestPromise = require('request-promise');

const Source = require('../Source');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const serverConfig = rootRequire('/config/server');
const youtubeConfig = rootRequire('/config/sources/youtube');

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
             'part=statistics' +
             '&mine=true',
        headers: {
          Authorization: `Bearer ${this.appSource.accessToken}`,
        },
        json: true,
      });
    }).then(channels => {
      const transaction = (this.sequelizeOptions) ? this.sequelizeOptions.transaction : null;

      this.appSource.totalFans = channels.items[0].statistics.subscriberCount;

      return this.appSource.save({ transaction });
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

      const paginate = pageToken => {
        let url = `${youtubeConfig.playlistItemsUrl}?` +
                  `playlistId=${uploadsPlaylistId}` +
                  '&part=snippet,status' +
                  '&maxResults=50';

        if (pageToken) {
          url += `&pageToken=${pageToken}`;
        }

        requestPromise.get({
          url,
          headers: {
            Authorization: `Bearer ${this.appSource.accessToken}`,
          },
          json: true,
        }).then(playlistItems => {
          playlistItems.items.forEach(playlistItem => {
            const data = this.playlistItemToAppSourceContent(playlistItem);

            if (playlistItem.status.privacyStatus !== 'public') {
              return;
            }

            AppSourceContentModel.create(data).catch(e => {
              console.log(e.message);
              console.log(JSON.stringify(playlistItem));
            });
          });

          if (playlistItems.nextPageToken) {
            paginate(playlistItems.nextPageToken);
          }
        });
      };

      paginate();
    });
  }

  static handleWebhookRequest(request) {

  }

  /*
   * Helpers
   */

  playlistItemToAppSourceContent(playlistItem) {
    return {
      appId: this.appSource.appId,
      appSourceId: this.appSource.id,
      iframe: {
        url: `https://www.youtube.com/embed/${playlistItem.snippet.resourceId.videoId}`,
      },
      title: playlistItem.snippet.title,
      description: playlistItem.snippet.description,
      data: playlistItem,
      publishedAt: playlistItem.snippet.publishedAt,
    };
  }
};
