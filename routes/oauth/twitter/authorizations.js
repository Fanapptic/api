/*
 * Route: /oauth/twitter/authorizations
 */

const oauth = require('oauth');
const oauthConfig = rootRequire('/config/oauth');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', (request, response, next) => {
  const { redirectUrl } = request.query;

  if (!redirectUrl) {
    throw new Error('redirectUrl must be provided.');
  }

  const twitterOauth = new oauth.OAuth(
    oauthConfig.twitter.requestUrl,
    oauthConfig.twitter.accessUrl,
    oauthConfig.twitter.apiKey,
    oauthConfig.twitter.apiSecret,
    oauthConfig.twitter.version,
    redirectUrl,
    oauthConfig.twitter.signatureMethod
  );

  twitterOauth.getOAuthRequestToken((error, requestToken) => {
    if (error) {
      return next(new Error(error.data));
    }

    response.success({
      url: `${oauthConfig.twitter.authorizeUrl}?oauth_token=${requestToken}`,
    });
  });
});

/*
 * Export
 */

module.exports = router;
