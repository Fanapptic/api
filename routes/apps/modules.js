/*
 * Route: /apps/:appId/modules/:appModuleId?
 */

const AppModuleModel = rootRequire('/models/AppModule');
const appConfig = rootRequire('/config/app');
const authorize = rootRequire('/middlewares/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', authorize);
router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;

  if (appModuleId) {
    return AppModuleModel.find({ where: { id: appModuleId, appId } }).then(appModule => {
      response.success(appModule);
    }).catch(next);
  } else {
    return AppModuleModel.findAll({ where: { appId } }).then(appModules => {
      response.success(appModules);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', authorize);
router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  const { appId } = request.params;
  const { moduleName, moduleConfig, position } = request.body;

  AppModuleModel.count({ where: { appId } }).then(appModulesCount => {
    if (appModulesCount >= appConfig.moduleLimit) {
      throw new Error(`Your application already has a maximum of ${appConfig.activeModuleLimit} active modules.`);
    }

    return AppModuleModel.create({ appId, moduleName, moduleConfig, position });
  }).then(appModule => {
    response.success(appModule);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', authorize);
router.patch('/', appAuthorize);
router.patch('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;
  const { moduleConfig, position } = request.body;

  AppModuleModel.find({ where: { id: appModuleId, appId } }).then(appModule => {
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

  AppModuleModel.destroy({ where: { id: appModuleId, appId } }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
