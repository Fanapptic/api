/*
 * Route: /oauth/twitter/authorizations
 */

const requestPromise = require('request-promise');
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

  requestPromise.post({
    url: oauthConfig.twitter.requestTokenUrl,
    oauth: {
      callback: redirectUrl,
      consumer_key: oauthConfig.twitter.apiKey,
      consumer_secret: oauthConfig.twitter.apiSecret,
    },
  }).then(result => {
    response.success({
      url: `${oauthConfig.twitter.authorizeUrl}?${result}`,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
