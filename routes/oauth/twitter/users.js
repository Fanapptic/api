/*
 * Route: /oauth/twitter/users
 */

const querystring = require('querystring');
const requestPromise = require('request-promise');
const oauthConfig = rootRequire('/config/oauth');
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
    url: oauthConfig.twitter.accessTokenUrl,
    oauth: {
      token,
      verifier,
      token_secret: tokenSecret,
      consumer_key: oauthConfig.twitter.apiKey,
      consumer_secret: oauthConfig.twitter.apiSecret,
    },
  }).then(result => {
    result = querystring.parse(result);

    accessToken = result.oauth_token;
    accessTokenSecret = result.oauth_token_secret;

    return requestPromise.get({
      url: oauthConfig.twitter.verifyUrl,
      oauth: {
        token: result.oauth_token,
        token_secret: result.oauth_token_secret,
        consumer_key: oauthConfig.twitter.apiKey,
        consumer_secret: oauthConfig.twitter.apiSecret,
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
