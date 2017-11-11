/*
 * Route: /oauth/youtube/users
 */

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
  const { code, redirectUrl } = request.body;
  let accessToken, refreshToken = null;

  if (!code) {
    throw new Error('An auth code must be provided.');
  }

  requestPromise.post({
    url: oauthConfig.youtube.accessTokenUrl,
    form: {
      code,
      client_id: oauthConfig.youtube.clientId,
      client_secret: oauthConfig.youtube.clientSecret,
      redirect_uri: redirectUrl,
      grant_type: 'authorization_code',
    },
    json: true,
  }).then(result => {
    accessToken = result.access_token;
    refreshToken = result.refresh_token;

    return requestPromise.get({
      url: oauthConfig.youtube.userUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }).then(result => {
    result = JSON.parse(result).items[0];

    response.success({
      id: result.id,
      name: result.snippet.title,
      avatarUrl: result.snippet.thumbnails.high.url,
      accountUrl: 'https://www.youtube.com/channel/' + result.id,
      accessToken,
      refreshToken,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
