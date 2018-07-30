/*
 * Route: /apps/:appId/messages/:appMessageId?
 */

const AppMessageModel = rootRequire('/models/AppMessage');
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
router.get('/', (request, response, next) => {
  const { appId, appMessageId } = request.params;

  let options = {
    where: { appId },
    include: [
      {
        model: AppSourceContentModel,
        attributes: {
          exclude: [ 'data' ],
        },
      },
    ],
  };

  if (appMessageId) {
    options.where.id = appMessageId;

    AppMessageModel.find(options).then(appMessage => {
      if (!appMessage) {
        throw new Error('The app message does not exist.');
      }

      response.success(appMessage);
    }).catch(next);
  } else {
    options.limit = 25;

    AppMessageModel.findAll(options).then(appMessages => {
      response.success(appMessages);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', appDeviceAuthorize);
router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { appDevice } = request;
  const { appSourceContentId, name, message } = request.body;

  const chain = (appSourceContentId) ? AppSourceContentModel.count({
    where: {
      id: appSourceContentId,
      appId,
    },
  }).then(exists => {
    if (!exists) {
      throw new Error('The app source content does not exist');
    }
  }) : Promise.resolve();

  chain.then(() => {
    return AppMessageModel.create({
      appId,
      appDeviceId: appDevice.id,
      appSourceContentId,
      name,
      message,
    });
  }).then(appMessage => {
    // websocket emit

    response.success(appMessage);
  }).catch(next);
});

/*
 * WEBSOCKET
 */

/*
 * Export
 */

module.exports = router;
