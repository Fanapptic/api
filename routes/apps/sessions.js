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
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', (request, response, next) => {
  const { appId, appSessionId } = request.params;
  const { appUserId } = request.body;

  AppSessionModel.find({ where: { id: appSessionId, appId, appUserId } }).then(appSession => {
    if (!appSession) {
      throw new Error('app session patch error');
    }

    appSession.duration = 1; // TODO: calculate this, maybe refactor this.

    return appSession.save();
  }).then((appSession) => {
    response.success(appSession);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
