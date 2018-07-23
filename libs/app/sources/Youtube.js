const requestPromise = require('request-promise');

const Source = require('../Source');
const AppModel = rootRequire('/models/App');
const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const serverConfig = rootRequire('/config/server');
const youtubeConfig = rootRequire('/config/sources/youtube');

module.exports = class extends Source {
  connect() {
    return requestPromise.post({
      url: 'https://pubsubhubbub.appspot.com/subscribe',
      form: {
        'hub.callback': `${process.env.API_BASE_URL}/apps/*/sources/*/webhooks?webhookToken=${serverConfig.webhookToken}&type=youtube`,
        'hub.topic': `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${this.appSource.accountId}`,
        'hub.mode': 'subscribe',
        'hub.verify': 'async',
        'hub.verify_token': 'noop',
        'hub.lease_seconds': '864000', // TODO: we may need to refresh this every 10 days?
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
            const data = playlistItemToAppSourceContent(this.appSource, playlistItem);

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
    if (!request.body.feed || !request.body.feed.entry) {
      return;
    }

    request.body.feed.entry.forEach(entry => {
      const channelId = entry['yt:channelid'][0];
      const videoId = entry['yt:videoid'][0];

      let video = null;
      let isNew = false;

      requestPromise.get({
        url: `${youtubeConfig.videosUrl}?` +
             `id=${videoId}` +
             '&part=snippet,status' +
             `&key=${youtubeConfig.apiKey}`,
        json: true,
      }).then(videoList => {
        video = videoList.items[0];

        return AppSourceContentModel.destroy({
          where: {
            $or: [
              { 'data.snippet.resourceId.videoId': videoId },
              { 'data.id': videoId },
            ],
          },
        });
      }).then(affectedRows => {
        isNew = (!affectedRows) ? true : false;

        return AppSourceModel.findAll({
          where: {
            type: 'youtube',
            accountId: channelId,
          },
        });
      }).then(appSources => {
        if (video.status.privacyStatus !== 'public') {
          return;
        }

        video.snippet.resourceId = {
          videoId,
        };

        appSources.forEach(appSource => {
          const data = playlistItemToAppSourceContent(appSource, video);

          AppSourceContentModel.create(data).then(appSourceContent => {
            if (isNew) {
              AppModel.find({ where: { id: appSource.appId } }).then(app => {
                app.sendGlobalNotification(
                  appSourceContent.id,
                  null,
                  `${appSource.accountName} posted new content!`,
                  appSourceContent.description
                );
              });
            }
          });
        });
      });
    });
  }
};

/*
 * Helpers
 */

function playlistItemToAppSourceContent(appSource, playlistItem) {
  return {
    appId: appSource.appId,
    appSourceId: appSource.id,
    iframe: {
      url: `https://www.youtube.com/embed/${playlistItem.snippet.resourceId.videoId}`,
    },
    title: playlistItem.snippet.title,
    description: playlistItem.snippet.description,
    data: playlistItem,
    publishedAt: playlistItem.snippet.publishedAt,
  };
}
