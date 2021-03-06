/*
 * Route: /apps/:appId/devices/:appDeviceId?
 */

const AppDeviceModel = rootRequire('/models/AppDevice');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appAuthorizeOwnership = rootRequire('/middlewares/apps/authorizeOwnership');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorizeOwnership);
router.get('/', (request, response, next) => {
  const { appId, appDeviceId } = request.params;

  if (appDeviceId) {
    AppDeviceModel.find({ where: { id: appDeviceId, appId } }).then(appDevice => {
      if (!appDevice) {
        throw new Error('The app device does not exist.');
      }

      response.success(appDevice);
    }).catch(next);
  } else {
    AppDeviceModel.findAll({ where: { appId } }).then(appDevices => {
      response.success(appDevices);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { apnsToken, gcmRegistrationId, deviceDetails, platform } = request.body;

  AppDeviceModel.create({ appId, apnsToken, gcmRegistrationId, deviceDetails, platform }).then(appDevice => {
    response.success(appDevice);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', appDeviceAuthorize);
router.patch('/', (request, response, next) => {
  const { appDevice } = request;

  appDevice.apnsToken = request.body.apnsToken || appDevice.apnsToken;
  appDevice.gcmRegistrationId = request.body.gcmRegistrationId || appDevice.gcmRegistrationId;

  appDevice.save().then(() => {
    response.success(appDevice);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
