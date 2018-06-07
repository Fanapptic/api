/*
 * Route: /oauth/youtube/users
 */

const requestPromise = require('request-promise');
const youtubeConfig = rootRequire('/config/sources/youtube');
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
    url: youtubeConfig.accessTokensUrl,
    form: {
      code,
      client_id: youtubeConfig.clientId,
      client_secret: youtubeConfig.clientSecret,
      redirect_uri: redirectUrl,
      grant_type: 'authorization_code',
    },
    json: true,
  }).then(tokens => {
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;

    return requestPromise.get({
      url: `${youtubeConfig.channelsUrl}?` +
           'part=snippet' +
           '&mine=true',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
    });
  }).then(channels => {
    const channel = channels.items[0];

    response.success({
      id: channel.id,
      name: channel.snippet.title,
      avatarUrl: channel.snippet.thumbnails.high.url,
      accountUrl: 'https://www.youtube.com/channel/' + channel.id,
      accessToken,
      refreshToken,
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
