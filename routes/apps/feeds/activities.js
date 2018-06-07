/*
 * Router /apps/:appId/feeds/:appFeedId/activities/:appFeedActivityId?
 */

const AppFeedActivityModel = rootRequire('/models/AppFeedActivity');
const AppDeviceSessionModel = rootRequire('/models/AppDeviceSession');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');
const appUserAuthorizeOptional = rootRequire('/middlewares/apps/users/authorizeOptional');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', appDeviceAuthorize);
router.post('/', appUserAuthorizeOptional);
router.post('/', (request, response, next) => {
  const { app, appDevice, appUser } = request;
  const { appDeviceSessionId, appSourceContentId, type } = request.body;

  AppDeviceSessionModel.count({
    where: {
      id: appDeviceSessionId,
      appDeviceId: appDevice.id,
    },
  }).then(exists => {
    if (!exists) {
      throw new Error('appDeviceSessionId is not owned by app device.');
    }

    return AppSourceContentModel.count({
      where: {
        id: appSourceContentId,
        appId: app.id,
      },
    });
  }).then(exists => {
    if (!exists) {
      throw new Error('appSourceContentId is not owned by app.');
    }

    return AppFeedActivityModel.create({
      appId: app.id,
      appDeviceId: appDevice.id,
      appUserId: appUser.id,
      appDeviceSessionId,
      appSourceContentId,
      type,
    });
  }).then(appFeedActivity => {
    response.success(appFeedActivity);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
