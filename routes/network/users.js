/*
 * Route: /networks/fanapptic/users
 */

const requestPromise = require('request-promise');

const NetworkUserModel = rootRequire('/models/NetworkUser');
const networkUserAuthorize = rootRequire('/middlewares/networks/users/authorize');
const facebookConfig = rootRequire('/config/dataSources/facebook');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', networkUserAuthorize);
router.get('/', (request, response) => {
  response.success(request.networkUser);
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { facebookAccessToken } = request.body;
  let facebookUser = null;

  requestPromise.get({ // Should we get a long lived access token?
    url: `${facebookConfig.baseUrl}/me/permissions?` +
         `access_token=${facebookAccessToken}`,
    json: true,
  }).then(permissions => {
    permissions.data.forEach(permission => {
      if (permission.status !== 'granted') {
        throw new Error(`You must accept the ${permission.permission} permission to log in.`);
      }
    });

    return requestPromise.get({
      url: `${facebookConfig.baseUrl}/me?` +
           `access_token=${facebookAccessToken}` +
           '&fields=id,link,email,first_name,last_name,age_range,gender,locale',
      json: true,
    });
  }).then(_facebookUser => {
    facebookUser = _facebookUser;

    return NetworkUserModel.upsert({
      facebookId: facebookUser.id,
      facebookAccessToken: facebookAccessToken,
      facebookAccountLink: facebookUser.link,
      email: facebookUser.email,
      firstName: facebookUser.first_name,
      lastName: facebookUser.last_name,
      ageRange: facebookUser.age_range,
      gender: facebookUser.gender,
      locale: facebookUser.locale,
      picture: `${facebookConfig.baseUrl}/${facebookUser.id}/picture`,
    });
  }).then(() => {
    return NetworkUserModel.find({ where: { facebookId: facebookUser.id } });
  }).then(networkUser => {
    networkUser.includeAccessTokens = true;
    response.success(networkUser);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
