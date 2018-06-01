/*
 * Route: /apps/:appId/sources/:appSourceId?
 */

const AppSourceModel = rootRequire('/models/AppSource');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorizeOwnership);
router.get('/', (request, response, next) => {
  const { appId, appSourceId } = request.params;

  if (appSourceId) {
    AppSourceModel.find({ where: { id: appSourceId, appId } }).then(appSource => {
      if (!appSource) {
        throw new Error('The app source does not exist.');
      }

      response.success(appSource);
    }).catch(next);
  } else {
    AppSourceModel.findAll({ where: { appId } }).then(appSources => {
      response.success(appSources);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', appAuthorizeOwnership);
router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { type, avatarUrl, accountId, accountName, accountUrl, accessToken, accessTokenSecret, refreshToken } = request.body;

  database.transaction(transaction => {
    return AppSourceModel.create({
      appId,
      type,
      avatarUrl,
      accountId,
      accountName,
      accountUrl,
      accessToken,
      accessTokenSecret,
      refreshToken,
    }, { transaction }).then(appSource => {
      response.success(appSource);
    });
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', appAuthorizeOwnership);
router.delete('/', (request, response, next) => {
  const { appId, appSourceId } = request.params;

  database.transaction(transaction => {
    return AppSourceModel.find({
      where: {
        id: appSourceId,
        appId,
      },
    }, { transaction }).then(appSource => {
      if (!appSource) {
        throw new Error('The app source does not exist.');
      }

      return appSource.destroy();
    }).then(() => {
      response.success();
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
