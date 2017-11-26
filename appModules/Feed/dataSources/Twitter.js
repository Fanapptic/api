const requestPromise = require('request-promise');

const AppModuleDataModel = rootRequire('/models/AppModuleData');
const { DataSource } = rootRequire('/libs/App/configurables');
const twitterConfig = rootRequire('/config/dataSources/twitter');

module.exports = class extends DataSource {
  constructor() {
    super({
      name: 'twitter',
      displayName: 'Twitter',
      description: 'Display Twitter feed content.',
      platform: 'twitter',
    });
  }

  connect(appModuleProvider) {
    return requestPromise.get({
      url: `${twitterConfig.tweetsUrl}?` +
           'include_rts=true' +
           '&trim_user=true' +
           '&count=200',
      oauth: {
        token: appModuleProvider.accessToken,
        token_secret: appModuleProvider.accessTokenSecret,
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
      },
      json: true,
    }).then(tweets => {
      AppModuleDataModel.bulkCreate(tweets.map(tweet => {
        return {
          appModuleId: appModuleProvider.appModuleId,
          appModuleProviderId: appModuleProvider.id,
          data: tweet,
          publishedAt: new Date(tweet.created_at),
        };
      }));

      // queue for polling new tweets? - no available api for subbing to new tweets.
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
    console.log(request.body);
  }
};
