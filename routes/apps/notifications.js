/*
 * Route: /apps/:appId/notifications/:appNotificationId?
 */

const AppNotificationModel = rootRequire('/models/AppNotification');
const AppDeviceModel = rootRequire('/models/AppDevice');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appDeviceAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appNotificationId } = request.params;
  const { appDevice } = request;

  if (appNotificationId) {
    AppNotificationModel.find({
      where: {
        id: appNotificationId,
        appId,
        appDeviceId: appDevice.id,
      },
    }).then(appNotification => {
      if (!appNotification) {
        throw new Error('The app notification does not exist.');
      }

      response.success(appNotification);
    }).catch(next);
  } else {
    AppNotificationModel.findAll({
      where: {
        appId,
        appDeviceId: appDevice.id,
      },
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
  const { url, message } = request.body;

  AppDeviceModel.findAll({ where: { appId } }).then(appDevices => {
    let bulkNotifications = [];

    appDevices.forEach(appDevice => {
      bulkNotifications.push({
        appId,
        appDeviceId: appDevice.id,
        url,
        message,
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

router.patch('/', appDeviceAuthorize);
router.patch('/', (request, response, next) => {
  const { appId, appNotificationId } = request.params;
  const { appDevice } = request;
  const { read } = request.body;

  let where = { id: appNotificationId, appId };

  where.appDeviceId = appDevice.id;

  AppNotificationModel.find({
    where: {
      id: appNotificationId,
      appId,
      appDeviceId: appDevice.id,
    },
  }).then(appNotification => {
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
