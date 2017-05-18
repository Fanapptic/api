/*
 * Route: /apps/:appId/modules/:appModuleId*?
 */

const App = rootRequire('/models/App');
const AppModule = rootRequire('/models/AppModule');
const appConfig = rootRequire('/config/app');
const appModules = rootRequire('/appModules');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId, appModuleId } = request.params;

  App.userHasPermission(appId, userId).then(() => {
    if (appModuleId) {
      return AppModule.find({ where: { id: appModuleId, appId } });
    } else {
      return AppModule.findAll({ where: { appId } });
    }
  }).then(result => {
    console.log(result);

    response.success(result);
  }).catch(next);
});

/*
 * POST
 */

router.post('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;
  const { moduleId, config, options, styles, position } = request.body;

  if (!moduleId) {
    return next(new Error('You must provide a module id.'));
  }

  App.userHasPermission(appId, userId).then(() => {
    return Module.findById(moduleId);
  }).then((module) => {
    if (!module) {
      throw new Error('The module id provided is invalid.');
    }

    return AppModule.findAndCountAll({ where: { appId } });
  }).then(totalActiveAppModules => {
    if (totalActiveAppModules === appConfig.activeModuleLimit) {
      throw new Error(`Your application already has a maximum of ${appConfig.activeModuleLimit} active modules.`);
    }

    return AppModule.create({ appId, moduleId, config, options, styles, position });
  }).then(appModule => {
    response.success(appModule);
  }).catch(next);
});

/*
 * PUT
 */

router.put('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId, appModuleId } = request.params;

  App.userHasPermission(appId, userId).then(() => {
    return AppModule.find({ where: { id: appModuleId, appId } });
  }).then(appModule => {
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

router.delete('/', (request, response, next) => {
  const userId = request.user.id;
  const { appId, appModuleId } = request.params;

  App.userHasPermission(appId, userId).then(() => {
    return AppModule.destroy({ where: { id: appModuleId, appId } });
  }).then(() => {
    response.success();
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
