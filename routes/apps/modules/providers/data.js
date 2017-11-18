/*
 * Route: /apps/:appId/modules/:appModuleId/providers/:appModuleProviderId/data/:appModuleProviderDataId?
 */

const AppModuleProviderDataModel = rootRequire('/models/AppModuleProviderData');
const appModuleAuthorize = rootRequire('/middlewares/apps/modules/authorize');
const appModuleProviderAuthorize = rootRequire('/middlewares/apps/modules/providers/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appModuleAuthorize);
router.get('/', appModuleProviderAuthorize);
router.get('/', (request, response, next) => {
  const { appModuleProviderId, appModuleProviderDataId } = request.params;

  if (appModuleProviderDataId) {
    AppModuleProviderDataModel.find({ where: { id: appModuleProviderDataId, appModuleProviderId } }).then(appModuleProviderData => {
      if (!appModuleProviderData) {
        throw new Error('The app module provider data does not exist.');
      }

      response.success(appModuleProviderData);
    }).catch(next);
  } else {
    AppModuleProviderDataModel.findAll({ where: { appModuleProviderId } }).then(appModuleProviderData => {
      response.success(appModuleProviderData);
    }).catch(next);
  }
});

/*
 * Export
 */

module.exports = router;