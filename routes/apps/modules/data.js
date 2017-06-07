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
      if (!appModuleData) {
        throw new Error('The app module data does not exist.');
      }

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
  const { source, key } = request.query;

  if (appModule.key !== key) {
    response.response(403, 'Insufficient app module data permissions.');
  }

  const module = appModules.initModule(appModule.moduleName, appModule.moduleConfig);
  const dataSource = module.findDataSource(source);

  if (!dataSource) {
    throw new Error('Unsupported data source.');
  }

  dataSource.handleReceivedData(request, response, next);
});

 /*
  * Export
  */

module.exports = router;
