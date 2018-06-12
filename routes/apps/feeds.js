/*
 * Route /apps/:appId/feed
 */

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
  const { app } = request;

  /*
   * This should only return results for a given device
   * that have no yet been seen by the device based on
   * the content viewed in AppFeedActivity entries.
   */

  AppSourceContentModel.findAll({
    where: {
      appId: app.id,
    },
    attributes: {
      exclude: [ 'data' ],
    },
    limit: 20,
    order: database.random(),
  }).then(appSourceContents => {
    response.success(appSourceContents);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
