/*
 * Route: /apps/:appId/notifications/:appNotificationId?
 */

const AppNotificationModel = rootRequire('/models/AppNotification');
const AppDeviceModel = rootRequire('/models/AppDevice');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
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

  if (appDevice.id) {
    where.appDeviceId = appDevice.id;
  }

  if (networkUser.id) {
    where.networkUserId = networkUser.id;
  }

  if (!where.appDeviceId && !where.networkUserId) {
    return response.respond(403, 'An app device or network user must be provided to retrieve notifications for.');
  }

  console.log(where);

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
 * POST
 */

router.post('/', userAuthorize);
router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const notification = {
    appId,
    modulePath: request.body.modulePath,
    externalUrl: request.body.externalUrl,
    parameters: request.body.parameters,
    preview: request.body.preview,
    content: request.body.content,
  };

  AppDeviceModel.findAll({
    where: { appId },
    include: {
      model: AppDeviceSessionModel,
      where: {
        networkUserId: { $ne: null },
      },
      required: false,
    },
  }).then(appDevices => {
    let appDeviceNotifications = {};
    let networkUserNotifications = {};

    appDevices.forEach(appDevice => {
      appDeviceNotifications[appDevice.id] = Object.assign({
        appDeviceId: appDevice.id,
      }, notification);

      if (appDevice.appDeviceSessions) {
        appDevice.appDeviceSessions.forEach(appDeviceSession => {
          networkUserNotifications[appDeviceSession.networkUserId] = Object.assign({
            networkUserId: appDeviceSession.networkUserId,
          }, notification);
        });
      }
    });

    appDeviceNotifications = Object.values(appDeviceNotifications);
    networkUserNotifications = Object.values(networkUserNotifications);

    const bulkNotifications = appDeviceNotifications.concat(networkUserNotifications);

    return AppNotificationModel.bulkCreate(bulkNotifications);
  }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', appDeviceAuthorizeOptional);
router.patch('/', networkUserAuthorizeOptional);
router.patch('/', (request, response, next) => {
  const { appId, appNotificationId } = request.params;
  const { appDevice, networkUser } = request;
  const { read } = request.body;

  let where = { id: appNotificationId, appId };

  if (appDevice.id) {
    where.appDeviceId = appDevice.id;
  }

  if (networkUser.id) {
    where.networkUserId = networkUser.id;
  }

  if (!where.appDeviceId && !where.networkUserId) {
    return response.respond(403, 'An app device or network user must be provided to modify notifications for.');
  }

  AppNotificationModel.find({ where }).then(appNotification => {
    if (!appNotification) {
      throw new Error('The app notification does not exist.');
    }

    appNotification.read = read || appNotification.read;

    return appNotification.save();
  }).then(appNotification => {
    response.success(appNotification);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
