/*
 * Route: /apps/:appId/modules/:appModuleId/data/:appModuleDataId?
 */

const AppModule = rootRequire('/models/AppModule');
const AppModuleData = rootRequire('/models/AppModuleData');
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
  const { appModuleId, appModuleDataId } = request.params;

  if (appModuleDataId) {
    AppModuleData.find({ where: { id: appModuleDataId, appModuleId } }).then(appModuleData => {
      response.success(appModuleData);
    }).catch(next);
  } else {
    AppModuleData.findAll({ where: { appModuleId } }).then(appModuleDatas => {
      response.success(appModuleDatas);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', appModuleAuthorize);
router.post('/', (request, response, next) => {
  const { appModule } = request;
  const { dataSourceName } = request.query;

  const ModuleClass = appModules.getModuleClass(appModule.moduleName);
  const module = new ModuleClass();

  const dataSource = module.configurableDataSources.find(dataSource => {
    return dataSource.internalName === dataSourceName;
  });

  if (!dataSource) {
    return next(new Error(`This module does not have a data source of "${dataSourceName}".`));
  }

  dataSource.
  // refactor configurableDataSource to dataSource?
});

 /*
  * Export
  */

module.exports = router;
