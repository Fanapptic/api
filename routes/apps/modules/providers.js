/*
 * Route: /apps/:appId/modules/:appModuleId/providers/:appModuleProviderId?
 */

const AppModuleProviderModel = rootRequire('/models/AppModuleProvider');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appModuleAuthorize = rootRequire('/middlewares/apps/modules/authorize');
const appModules = rootRequire('/appModules');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appModuleAuthorize);
router.get('/', (request, response, next) => {
  const { appModuleId, appModuleProviderId } = request.params;

  if (appModuleProviderId) {
    AppModuleProviderModel.find({ where: { id: appModuleProviderId, appModuleId } }).then(appModuleProvider => {
      if (!appModuleProvider) {
        throw new Error('The app module provider does not exists.');
      }

      response.success(appModuleProvider);
    }).catch(next);
  } else {
    AppModuleProviderModel.findAll({ where: { appModuleId } }).then(appModuleProviders => {
      response.success(appModuleProviders);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', appAuthorize);
router.post('/', appModuleAuthorize);
router.post('/', (request, response, next) => {
  appModules; // do stuff with this to validate the provider authorization for the module
});

/*
 * Export
 */

module.exports = router;
