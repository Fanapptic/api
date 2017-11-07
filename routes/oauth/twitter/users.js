/*
 * Route: /oauth/twitter/users
 */

const oauth = require('oauth');
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
  const { token, verifier } = request.body;

  if (!token || !verifier) {
    throw new Error('An oauth token and verifier must be provided.');
  }

  const twitterOauth = new oauth.OAuth(
    oauthConfig.twitter.requestUrl,
    oauthConfig.twitter.accessUrl,
    oauthConfig.twitter.apiKey,
    oauthConfig.twitter.apiSecret,
    oauthConfig.twitter.version,
    null,
    oauthConfig.twitter.signatureMethod
  );

  twitterOauth.getOAuthAccessToken(token, null, verifier, (error, accessToken, accessTokenSecret) => {
    if (error) {
      return next(new Error(error.data));
    }

    twitterOauth.get(oauthConfig.twitter.userUrl, accessToken, accessTokenSecret, (error, user) => {
      if (error) {
        return next (new Error(error.data));
      }

      user = JSON.parse(user);

      response.success({
        id: user.id,
        name: user.screen_name,
        avatarUrl: user.profile_image_url_https,
        accountUrl: 'https://www.twitter.com/' + user.screen_name,
        accessToken,
        accessTokenSecret,
      });
    });
  });
});

/*
 * Export
 */

module.exports = router;
