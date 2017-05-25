/*
 * Route: /apps/:appId/modules/:appModuleId?
 */

const AppModule = rootRequire('/models/AppModule');
const appConfig = rootRequire('/config/app');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appModules = rootRequire('/appModules');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;

  if (appModuleId) {
    return AppModule.find({ where: { id: appModuleId, appId } }).then(appModule => {
      response.success(appModule);
    }).catch(next);
  } else {
    return AppModule.findAll({ where: { appId } }).then(appModules => {
      response.success(appModules);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  // TODO: Revisit and review this code.
  const { appId } = request.params;
  const { moduleName, moduleConfig, position } = request.body;

  AppModule.count({ where: { appId } }).then(appModulesCount => {
    if (appModulesCount >= appConfig.moduleLimit) {
      throw new Error(`Your application already has a maximum of ${appConfig.activeModuleLimit} active modules.`);
    }

    return AppModule.create({ appId, moduleName, moduleConfig, position });
  }).then(appModule => {
    response.success(appModule);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', appAuthorize);
router.patch('/', (request, response, next) => {
  // TODO: Revisit and review this code.
  const { appId, appModuleId } = request.params;
  const { moduleConfig, position } = request.body;

  AppModule.find({ where: { id: appModuleId, appId } }).then(appModule => {
    if (!appModule) {
      throw new Error('patch app module error');
    }

    appModule.moduleConfig = moduleConfig || appModule.moduleConfig;
    appModule.position = position || appModule.position;

    return appModule.save();
  }).then(appModule => {
    response.success(appModule);
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', appAuthorize);
router.delete('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;

  AppModule.destroy({ where: { id: appModuleId, appId } }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
