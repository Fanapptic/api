/*
 * Route: /apps/:appId/sources/:appSourceId/contents/:appSourceContentId/likes
 */

const AppSourceContentLikeModel = rootRequire('/models/AppSourceContentLike');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', appDeviceAuthorize);
router.post('/', (request, response, next) => {
  const { appId, appSourceId, appSourceContentId } = request.params;
  const { appDevice } = request;

  AppSourceContentModel.count({
    where: {
      id: appSourceContentId,
      appId,
      appSourceId,
    },
  }).then(exists => {
    if (!exists) {
      throw new Error('The app source content does not exist.');
    }

    return AppSourceContentLikeModel.create({
      appId,
      appDeviceId: appDevice.id,
      appSourceContentId,
    });
  }).then(appSourceContentLike => {
    response.success(appSourceContentLike);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
