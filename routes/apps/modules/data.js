/*
 * Route: /apps/:appId/modules/:appModuleId/data/:appModuleDataId?
 */

const AppModuleDataModel = rootRequire('/models/AppModuleData');
const appModuleAuthorize = rootRequire('/middlewares/apps/modules/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appModuleAuthorize);
router.get('/', (request, response, next) => {
  const { appModuleId, appModuleDataId } = request.params;
  const { providerId, maxPublishedAt } = request.query;
  let where = { appModuleId };

  if (providerId) {
    where.appModuleProviderId = providerId;
  }

  if (maxPublishedAt) {
    where.publishedAt = { $lt: new Date(maxPublishedAt) };
  }

  if (appModuleDataId) {
    where.id = appModuleDataId;

    AppModuleDataModel.find({ where }).then(appModuleData => {
      if (!appModuleData) {
        throw new Error('The app module provider data does not exist.');
      }

      response.success(appModuleData);
    }).catch(next);
  } else {
    AppModuleDataModel.findAll({
      where,
      order: [['publishedAt', 'DESC']],
      limit: 20,
    }).then(appModuleData => {
      response.success(appModuleData);
    }).catch(next);
  }
});

/*
 * Export
 */

module.exports = router;
