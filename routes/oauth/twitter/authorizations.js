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
router.get('/', (request, response) => {
  const redirectUrl = request.query.redirectUrl;

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
      throw new Error(error);
    }

    response.success({
      url: `https://twitter.com/oauth/authorize?oauth_token=${requestToken}`,
    });
  });
});

/*
 * Export
 */

module.exports = router;
