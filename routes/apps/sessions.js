/*
 * Route: /apps/:appId/sessions/:appSessionId?
 */

const AppSessionModel = rootRequire('/models/AppSession');
const AppDeviceModel = rootRequire('/models/AppDevice');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
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
  const { appDeviceId } = request.body;

  AppDeviceModel.find({ where: { id: appDeviceId, appId } }).then(appDevice => {
    if (!appDevice) {
      throw new Error('The device provided does not belong to the application provided.'); // TODO: This is middleware-able..
    }

    return AppSessionModel.create({ appId, appDeviceId });
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
