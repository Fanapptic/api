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
  const { appModule } = request;
  const { appModuleId } = request.params;
  const { dataSource, avatarUrl, accountId, accountName, accountUrl, accessToken, accessTokenSecret, refreshToken } = request.body;

  const module = appModules.initModule(appModule.moduleName, appModule.moduleConfig);
  const dataSourceInstance = module.getDataSource(dataSource);

  let appModuleProvider = null;

  if (!dataSource) {
    throw new Error('Unsupported data source.');
  }

  database.transaction(transaction => {
    return AppModuleProviderModel.create({
      appModuleId,
      dataSource,
      avatarUrl,
      accountId,
      accountName,
      accountUrl,
      accessToken,
      accessTokenSecret,
      refreshToken,
    }, { transaction }).then(appModuleProviderInstance => {
      appModuleProvider = appModuleProviderInstance;

      return dataSourceInstance.connect(appModuleProvider);
    }).then(() => {
      response.success(appModuleProvider);
    });
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', appAuthorize);
router.delete('/', appModuleAuthorize);
router.delete('/', (request, response, next) => {
  const { appModule } = request;
  const { appModuleId, appModuleProviderId } = request.params;

  const module = appModules.initModule(appModule.moduleName, appModule.moduleConfig);

  let appModuleProvider = null;

  database.transaction(transaction => {
    return AppModuleProviderModel.find({
      where: {
        id: appModuleProviderId,
        appModuleId,
      },
    }, { transaction }).then(appModuleProviderInstance => {
      if (!appModuleProviderInstance) {
        throw new Error('The app module provider does not exist.');
      }

      appModuleProvider = appModuleProviderInstance;

      return appModuleProvider.destroy();
    }).then(() => {
      return module.getDataSource(appModuleProvider.dataSource).disconnect(appModuleProvider);
    }).then(() => {
      response.success();
    });
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
