/*
 * Route: /apps/:appId/notifications/:appNotificationId?
 */

const AppNotificationModel = rootRequire('/models/AppNotification');
const appDeviceAuthorizeOptional = rootRequire('/middlewares/apps/devices/authorizeOptional');
const networkUserAuthorizeOptional = rootRequire('/middlewares/networks/users/authorizeOptional');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appDeviceAuthorizeOptional);
router.get('/', networkUserAuthorizeOptional);
router.get('/', (request, response, next) => {
  const { appId, appNotificationId } = request.params;
  const { appDevice, networkUser } = request;

  let where = { appId };

  if (appDevice) {
    where.appDeviceId = appDevice.id;
  }

  if (networkUser) {
    where.networkUserId = networkUser.id;
  }

  if (!where.appDeviceId && !where.networkUserId) {
    throw new Error('');
  }

  if (appNotificationId) {
    AppNotificationModel.find({ where }).then(appNotification => {
      if (!appNotification) {
        throw new Error('The app module does not exist.');
      }

      response.success(appNotification);
    }).catch(next);
  } else {
    AppNotificationModel.findAll({ where }).then(appNotifications => {
      response.success(appNotifications);
    }).catch(next);
  }
});

/*
 * PATCH
 */

router.patch('/', appDeviceAuthorizeOptional);
router.patch('/', networkUserAuthorizeOptional);
router.patch('/', (request, response, next) => {
  const { appId, appNotificationId } = request.params;
  const { appDevice, networkUser } = request;

  if (!appDevice && !networkUser) {
    throw new Error('');
  }


});

/*
 * Export
 */

module.exports = router;


/*
 *
 * Network User
 * -
 *
 *
 *
 * Device Only
 * -
 *
 *
 *
 */
