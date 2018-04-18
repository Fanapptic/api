/*
 * Route: /apps/:appId/notifications/:appNotificationId?
 */

const AppNotificationModel = rootRequire('/models/AppNotification');
const AppDeviceModel = rootRequire('/models/AppDevice');
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

  if (networkUser.id) {
    where.networkUserId = networkUser.id;
  } else if (appDevice.id) {
    where.appDeviceId = appDevice.id;
  }

  if (!where.appDeviceId && !where.networkUserId) {
    return response.respond(403, 'An app device or network user must be provided to retrieve notifications for.');
  }

  if (appNotificationId) {
    AppNotificationModel.find({ where }).then(appNotification => {
      if (!appNotification) {
        throw new Error('The app module does not exist.');
      }

      response.success(appNotification);
    }).catch(next);
  } else {
    AppNotificationModel.findAll({
      where,
      order: [['id', 'DESC']],
    }).then(appNotifications => {
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

  AppDeviceModel.findAll({ where: { appId } }).then(appDevices => {
    let bulkNotifications = [];

    appDevices.forEach(appDevice => {
      bulkNotifications.push({
        appId,
        appDeviceId: (!appDevice.networkUserId) ? appDevice.id : null,
        networkUserId: (appDevice.networkUserId) ? appDevice.networkUserId : null,
        moduleRelativeUrl: request.body.moduleRelativeUrl,
        externalUrl: request.body.externalUrl,
        parameters: request.body.parameters,
        previewImageUrl: request.body.previewImageUrl,
        content: request.body.content,
      });
    });

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

  if (networkUser.id) {
    where.networkUserId = networkUser.id;
  } else if (appDevice.id) {
    where.appDeviceId = appDevice.id;
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
