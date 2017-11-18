/*
 * Route: /oauth/twitter/users
 */

const querystring = require('querystring');
const requestPromise = require('request-promise');
const twitterConfig = rootRequire('/config/dataSources/twitter');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', (request, response, next) => {
  const { token, tokenSecret, verifier } = request.body;
  let accessToken, accessTokenSecret = null;

  if (!token || !verifier) {
    throw new Error('An oauth token and verifier must be provided.');
  }

  requestPromise.post({
    url: twitterConfig.accessTokensUrl,
    oauth: {
      token,
      verifier,
      token_secret: tokenSecret,
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
    },
  }).then(user => {
    user = querystring.parse(user);

    accessToken = user.oauth_token;
    accessTokenSecret = user.oauth_token_secret;

    return requestPromise.get({
      url: twitterConfig.verifyUrl,
      oauth: {
        token: user.oauth_token,
        token_secret: user.oauth_token_secret,
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
      },
      json: true,
    });
  }).then(result => {
    response.success({
      id: result.id,
      name: result.screen_name,
      avatarUrl: result.profile_image_url_https,
      accountUrl: 'https://www.twitter.com/' + result.screen_name,
      accessToken,
      accessTokenSecret,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
