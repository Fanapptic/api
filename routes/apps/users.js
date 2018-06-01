/*
 * Route: /apps/:appId/users/:appUserId?
 */

const requestPromise = require('request-promise');

const AppUserModel = rootRequire('/models/AppUser');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appUserAuthorize = rootRequire('/middlewares/apps/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appUserAuthorize);
router.get('/', (request, response) => {
  response.success(request.appUser);
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { facebookAccessToken } = request.body;
  let facebookUser = null;

  requestPromise.get({ // Should we get a long lived access token?
    url: 'https://graph.facebook.com/v2.12/me/permissions?' +
         `access_token=${facebookAccessToken}`,
    json: true,
  }).then(permissions => {
    permissions.data.forEach(permission => {
      if (permission.status !== 'granted') {
        throw new Error(`You must accept the ${permission.permission} permission to log in.`);
      }
    });

    return requestPromise.get({
      url: 'https://graph.facebook.com/v2.12/me?' +
           `access_token=${facebookAccessToken}` +
           '&fields=id,link,email,first_name,last_name,age_range,gender,locale',
      json: true,
    });
  }).then(_facebookUser => {
    facebookUser = _facebookUser;

    return AppUserModel.upsert({
      appId,
      facebookId: facebookUser.id,
      facebookAccessToken: facebookAccessToken,
      facebookAccountLink: facebookUser.link,
      email: facebookUser.email,
      firstName: facebookUser.first_name,
      lastName: facebookUser.last_name,
      ageRange: facebookUser.age_range,
      gender: facebookUser.gender,
      locale: facebookUser.locale,
      avatarUrl: 'https://graph.facebook.com/v2.12/${facebookUser.id}/picture',
    });
  }).then(() => {
    return AppUserModel.find({ where: { appId, facebookId: facebookUser.id } });
  }).then(appUser => {
    response.success(appUser);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
