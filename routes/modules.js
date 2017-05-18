/*
 * Route: /modules/:moduleName*?
 */

const appModules = rootRequire('/appModules');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const { moduleName } = request.params;

  if (moduleName) {
    const ModuleClass = appModules[moduleName];

    response.success(new ModuleClass());
  } else {
    let modulesArray = [];

    Object.keys(appModules).forEach(appModuleKey => {
      modulesArray.push(new appModules[appModuleKey]);
    });

    response.success(modulesArray);
  }
});

/*
 * Export
 */

module.exports = router;
