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
  const { appId } = request.params;
  const { moduleName, config, options, styles, position } = request.body;

  if (!moduleName) {
    return next(new Error('You must provide a module name.'));
  }

  if (!appModules.getModuleClass(moduleName)) {
    return next(new Error('The module name provided is invaid.'));
  }

  AppModule.count({ where: { appId } }).then(appModulesCount => {
    if (appModulesCount >= appConfig.moduleLimit) {
      throw new Error(`Your application already has a maximum of ${appConfig.activeModuleLimit} active modules.`);
    }

    /*
     * What needs to happen here?
     *
     * Trigger any module data source setups?
     *
     */

    return AppModule.create({ appId, moduleName, config, options, styles, position });
  }).then(appModule => {
    response.success(appModule);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', appAuthorize);
router.patch('/', (request, response, next) => {
  const { appId, appModuleId } = request.params;

  AppModule.find({ where: { id: appModuleId, appId } }).then(appModule => {
    if (!appModule) {
      throw new Error('patch app module error');
    }

    // TODO: Validated configs in the model, handle position.
    appModule.config = 1 || appModule.config;
    appModule.options = 1 || appModule.config;
    appModule.styles = 1 || appModule.config;
    appModule.position = 1 || appModule.position;

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
