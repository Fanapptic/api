const requestPromise = require('request-promise');

const Source = require('../Source');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const twitterConfig = rootRequire('/config/sources/twitter');

// need to get more than first 200 tweets.
module.exports = class extends Source {
  connect() {
    return requestPromise.get({
      url: `${twitterConfig.tweetsUrl}?` +
           'include_rts=true' +
           '&trim_user=true' +
           '&count=200',
      oauth: {
        token: this.appSource.accessToken,
        token_secret: this.appSource.accessTokenSecret,
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
      },
      json: true,
    }).then(tweets => {
      AppSourceContentModel.bulkCreate(tweets.map(tweet => {
        return {
          appId: this.appSource.appId,
          appSourceId: this.appSource.id,
          data: tweet,
          publishedAt: new Date(tweet.created_at),
        };
      }));



      // queue for polling new tweets? - no available api for subbing to new tweets.
    });
  }

  static handleWebhookRequest(request) {

  }
};

/*
 * Helpers
 */
