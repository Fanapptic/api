/*
 * Route: /apps/:appId/modules/:appModuleId?
 */

const Module = rootRequire('/libs/App/components/Module');
const AppModuleModel = rootRequire('/models/AppModule');
const appConfig = rootRequire('/config/app');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;

  if (appModuleId) {
    return AppModuleModel.find({ where: { id: appModuleId, appId } }).then(appModule => {
      if (!appModule) {
        throw new Error('The app module does not exist.');
      }

      response.success(appModule);
    }).catch(next);
  } else {
    return AppModuleModel.findAll({
      where: { appId },
      order: [['position', 'ASC']],
    }).then(appModules => {
      response.success(appModules);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', userAuthorize);
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

router.patch('/', userAuthorize);
router.patch('/', appAuthorize);
router.patch('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;
  const { moduleConfig, position } = request.body;

  AppModuleModel.find({ where: { id: appModuleId, appId } }).then(appModule => {
    if (!appModule) {
      throw new Error('The app module does not exist.');
    }

    appModule.position = position || appModule.position;

    if (moduleConfig) {
      appModule.moduleConfig = Module.mergeImportable(appModule.moduleConfig, moduleConfig);
    }

    return appModule.save();
  }).then(appModule => {
    response.success(appModule);
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', appAuthorize);
router.delete('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;

  AppModuleModel.destroy({ where: { id: appModuleId, appId } }).then(affectedRows => {
    if (!affectedRows) {
      throw new Error('The app module does not exist.');
    }

    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
