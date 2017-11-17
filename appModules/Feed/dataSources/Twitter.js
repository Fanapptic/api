const requestPromise = require('request-promise');

const AppModuleProviderDataModel = rootRequire('/models/AppModuleProviderData');
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
      AppModuleProviderDataModel.bulkCreate(tweets.map(tweet => {
        return {
          appModuleProviderId: appModuleProvider.id,
          data: tweet,
        };
      }));

      // queue for polling new tweets? - no available api for subbing to new tweets.
    });
  }

  disconnect(appModuleProvider) {
    return AppModuleProviderDataModel.destroy({
      where: {
        appModuleProviderId: appModuleProvider.id,
      },
    });
  }

  handleWebhookRequest(request) {
    console.log(request.body);
  }
};
