/*
 * Route: /oauth/youtube/users
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
  const { code, redirectUrl } = request.body;

  if (!code) {
    throw new Error('An auth code must be provided.');
  }

  const youtubeOauth = new oauth.OAuth2(
    oauthConfig.youtube.clientId,
    oauthConfig.youtube.clientSecret,
    oauthConfig.youtube.apiUrl,
    null,
    oauthConfig.youtube.accessTokenPath,
    null
  );

  const params = {
    grant_type: 'authorization_code',
    redirect_uri: redirectUrl,
  };

  youtubeOauth.getOAuthAccessToken(code, params, (error, accessToken, refreshToken) => {
    if (error) {
      return next(new Error(error.data));
    }

    youtubeOauth.get(oauthConfig.youtube.usersUrl, accessToken, (error, users) => {
      if (error) {
        return next(new Error(error.data));
      }

      users = JSON.parse(users);

      const user = users.items[0];

      response.success({
        id: user.id,
        name: user.snippet.title,
        avatarUrl: user.snippet.thumbnails.high.url,
        accountUrl: 'https://www.youtube.com/channel/' + user.id,
        accessToken,
        refreshToken,
      });
    });
  });
});

/*
 * Export
 */

module.exports = router;
