/*
 * Route: /apps/:appId/sessions/:appSessionId?
 */

const AppModel = rootRequire('/models/App');
const AppSessionModel = rootRequire('/models/AppSession');
const AppUserModel = rootRequire('/models/AppUser');
const authorize = rootRequire('/middlewares/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', authorize);
router.get('/', appAuthorize);
router.get('/', (request,  response, next) => {
  const { appId, appSessionId } = request.params;

  if (appSessionId) {
    AppSessionModel.find({ where: { id: appSessionId, appId } }).then(appSession => {
      if (!appSession) {
        throw new Error('The app session does not exist.');
      }

      response.success(appSession);
    }).catch(next);
  } else {
    AppSessionModel.findAll({ where: { appId } }).then(appSessions => {
      response.success(appSessions);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { appUserId } = request.body;

  AppUserModel.find({ where: { id: appUserId, appId } }).then(appUser => {
    if (!appUser) {
      throw new Error('The user provided does not belong to the application provided.');
    }

    return AppSessionModel.create({ appId, appUserId });
  }).then(appSession => {
    response.success(appSession);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', (request, response, next) => {
  const { appId, appSessionId } = request.params;

  AppSessionModel.find({ where: { id: appSessionId, appId } }).then(appSession => {
    if (!appSession || appSession.endedAt) {
      throw new Error('The app session is invalid.');
    }

    appSession.endedAt = new Date();

    return appSession.save();
  }).then(appSession => {
    response.success(appSession);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
