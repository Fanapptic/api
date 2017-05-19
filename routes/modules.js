/*
 * Route: /modules/:moduleName?
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
    const ModuleClass = appModules.getModuleClass(moduleName);

    if (!ModuleClass) {
      return next(new Error(`The module "${moduleName}" does not exist.`));
    }

    response.success(new ModuleClass());
  } else {
    let modulesArray = [];

    Object.keys(appModules.moduleClasses).forEach(moduleName => {
      modulesArray.push(new appModules.moduleClasses[moduleName]);
    });

    response.success(modulesArray);
  }
});

/*
 * Export
 */

module.exports = router;
