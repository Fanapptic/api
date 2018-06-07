/*
 * Route: /oauth/twitter/authorizations
 */

const requestPromise = require('request-promise');
const twitterConfig = rootRequire('/config/sources/twitter');
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
    url: twitterConfig.requestTokensUrl,
    oauth: {
      callback: redirectUrl,
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
    },
  }).then(authorizeQuerystring => {
    response.success({
      url: `${twitterConfig.authorizeUrl}?${authorizeQuerystring}`,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
