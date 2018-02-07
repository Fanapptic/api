/*
 * Route: /modules/:name?
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
  const { name } = request.params;

  if (name) {
    response.success(appModules.initModule(name));
  } else {
    let modulesArray = [];

    appModules.moduleNames.forEach(moduleName => {
      modulesArray.push(appModules.initModule(moduleName));
    });

    response.success(modulesArray);
  }
});

/*
 * Export
 */

module.exports = router;
