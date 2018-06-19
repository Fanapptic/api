/*
 * Route /apps/:appId/feed
 */

const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeviceAuthorize = rootRequire('/middlewares/apps/devices/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', appDeviceAuthorize);
router.get('/', (request, response, next) => {
  const { app, appDevice } = request;

  /*
   * This should only return results for a given device
   * that have no yet been seen by the device based on
   * the content viewed in AppFeedActivity entries.
   */

  AppSourceContentModel.findAll({
    where: { appId: app.id },
    include: [
      {
        model: AppSourceModel,
        attributes: [ 'avatarUrl', 'accountName' ],
      },
    ],
    attributes: {
      include: [[database.literal(
        '(SELECT COUNT(*) ' +
        'FROM appFeedActivities ' +
        'WHERE appFeedActivities.appSourceContentId = appSourceContent.id ' +
        `AND appFeedActivities.appDeviceId = ${appDevice.id})`
      ), 'viewCount']],
      exclude: [ 'data' ],
    },
    limit: 20,
    order: [
      [database.literal('viewCount'), 'ASC'],
      database.literal('RAND()'),
    ],
  }).then(appSourceContents => {
    response.success(appSourceContents);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
