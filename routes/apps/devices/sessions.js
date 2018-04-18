/*
 * Route: /apps/:appId/devices/:appDeviceId/sessions/:appDeviceSessionId?
 */

const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');
const networkUserAuthorizeOptional = rootRequire('/middlewares/networks/users/authorizeOptional');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', appDeviceAuthorize);
router.post('/', networkUserAuthorizeOptional);
router.post('/', (request, response, next) => {
  return AppDeviceSessionModel.create({
    appDeviceId: request.appDevice.id,
    networkUserId: request.networkUser.id,
    location: request.body.location,
  }).then(appDeviceSession => {
    response.success(appDeviceSession);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', appDeviceAuthorize);
router.patch('/', networkUserAuthorizeOptional);
router.patch('/', (request, response, next) => {
  const appDeviceId = request.appDevice.id;
  const { appDeviceSessionId } = request.params;

  AppDeviceSessionModel.find({ where: { id: appDeviceSessionId, appDeviceId } }).then(appDeviceSession => {
    if (!appDeviceSession) {
      throw new Error('The app device session does not exist.');
    }

    if (appDeviceSession.endedAt) {
      throw new Error('The ended app device session cannot be modified.');
    }

    appDeviceSession.networkUserId = request.networkUser.id || null;
    appDeviceSession.location = request.body.location || appDeviceSession.location;
    appDeviceSession.endedAt = (request.body.ended) ? new Date() : appDeviceSession.endedAt;

    return appDeviceSession.save();
  }).then(appDeviceSession => {
    response.success(appDeviceSession);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
