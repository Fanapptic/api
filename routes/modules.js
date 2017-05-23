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

router.get('/', (request, response) => {
  const { moduleName } = request.params;

  if (moduleName) {
    response.success(appModules.initModule(moduleName));
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
