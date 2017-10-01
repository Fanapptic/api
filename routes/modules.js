/*
 * Route: /modules/:moduleName?
 */

const appModules = rootRequire('/appModules');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', (request, response) => {
  const { moduleName } = request.params;

  if (moduleName) {
    response.success(appModules.initModule(moduleName));
  } else {
    let modulesArray = [];

    Object.keys(appModules.moduleClasses).forEach(moduleName => {
      modulesArray.push(appModules.initModule(moduleName));
    });

    response.success(modulesArray);
  }
});

/*
 * Export
 */

module.exports = router;
