/*
 * Route: /apps/:appId/modules/:appModuleId/data/:appModuleDataId?
 */

const AppModuleDataModel = rootRequire('/models/AppModuleData');
const authorize = rootRequire('/middlewares/authorize');
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
    AppModuleDataModel.find({ where: { id: appModuleDataId, appModuleId } }).then(appModuleData => {
      response.success(appModuleData);
    }).catch(next);
  } else {
    AppModuleDataModel.findAll({ where: { appModuleId } }).then(appModuleDatas => {
      response.success(appModuleDatas);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', authorize);
router.post('/', appAuthorize);
router.post('/', appModuleAuthorize);
router.post('/', (request, response, next) => {
  const { appModule } = request;
  const { dataSourceName } = request.query;

  const module = appModules.initModule(appModule.name);

  const dataSource = module.configurableDataSources.find(dataSource => {
    return dataSource.name === dataSourceName;
  });

  if (!dataSource) {
    throw new Error(`This module does not have a data source of "${dataSourceName}".`);
  }

  // refactor configurableDataSource to dataSource?
});

 /*
  * Export
  */

module.exports = router;
