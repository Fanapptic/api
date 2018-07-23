/*
 * Route /apps/:appId/feed
 */

const AppSourceModel = rootRequire('/models/AppSource');
const AppSourceContentModel = rootRequire('/models/AppSourceContent');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeviceAuthorizeOptional = rootRequire('/middlewares/apps/devices/authorizeOptional');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', appDeviceAuthorizeOptional);
router.get('/', (request, response, next) => {
  const { appSourceContentId } = request.query;
  const { app, appDevice } = request;

  let options = {
    where: { appId: app.id },
    include: [
      {
        model: AppSourceModel,
        attributes: [ 'avatarUrl', 'accountName' ],
      },
    ],
    attributes: {
      exclude: [ 'data' ],
    },
    limit: 10,
    order: [
      database.literal('RAND()'),
    ],
  };

  if (appDevice.id && !appSourceContentId) {
    options.attributes.include = [[database.literal(
      '(SELECT COUNT(*) ' +
      'FROM appFeedActivities ' +
      'WHERE appFeedActivities.appSourceContentId = appSourceContent.id ' +
      `AND appFeedActivities.appDeviceId = ${appDevice.id})`
    ), 'viewCount']];

    options.order = [
      [database.literal('viewCount'), 'ASC'],
      database.literal('RAND()'),
    ];
  }

  if (appSourceContentId) {
    options.where.id = appSourceContentId;

    AppSourceContentModel.find(options).then(appSourceContent => {
      if (!appSourceContent) {
        throw new Error('The app source content does not exist.');
      }

      response.success(appSourceContent);
    }).catch(next);
  } else {
    AppSourceContentModel.findAll(options).then(appSourceContents => {
      response.success(appSourceContents);
    }).catch(next);
  }
});

/*
 * Export
 */

module.exports = router;
