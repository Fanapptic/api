/*
 * Route: /apps/:appId/devices/:appDeviceId/sessions/:appDeviceSessionId?
 */

const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');
const appUserAuthorizeOptional = rootRequire('/middlewares/apps/users/authorizeOptional');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', appDeviceAuthorize);
router.post('/', appUserAuthorizeOptional);
router.post('/', (request, response, next) => {
  const { appDevice, appUser } = request;
  const { location } = request.body;

  let appDeviceSession = null;

  return AppDeviceSessionModel.create({
    appDeviceId: appDevice.id,
    appUserId: appUser.id,
    location,
  }).then(_appDeviceSession => {
    appDeviceSession = _appDeviceSession;

    return appDevice.syncToSession(appDeviceSession);
  }).then(() => {
    response.success(appDeviceSession);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', appDeviceAuthorize);
router.patch('/', appUserAuthorizeOptional);
router.patch('/', (request, response, next) => {
  const { appDevice } = request;
  const { appDeviceSessionId } = request.params;

  let appDeviceSession = null;

  AppDeviceSessionModel.find({
    where: {
      id: appDeviceSessionId,
      appDeviceId: appDevice.id,
    },
  }).then(_appDeviceSession => {
    appDeviceSession = _appDeviceSession;

    if (!appDeviceSession) {
      throw new Error('The app device session does not exist.');
    }

    if (appDeviceSession.endedAt) {
      throw new Error('The ended app device session cannot be modified.');
    }

    appDeviceSession.appUserId = request.appUser.id || null;
    appDeviceSession.location = request.body.location || appDeviceSession.location;
    appDeviceSession.endedAt = (request.body.ended) ? new Date() : appDeviceSession.endedAt;

    return appDeviceSession.save();
  }).then(() => {
    return request.appDevice.syncToSession(appDeviceSession);
  }).then(() => {
    response.success(appDeviceSession);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
