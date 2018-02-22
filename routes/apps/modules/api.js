/*
 * Route: /apps/:appId/modules/:appModuleId/api/:appModuleName
 */

const fs = require('fs');
const path = require('path');

const appModules = rootRequire('/appModules');
const appModuleAuthorize = rootRequire('/middlewares/apps/modules/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET, POST, PATCH, DELETE - Request are routed to a module specific micro api.
 */

router.use(appModuleAuthorize);
router.use((request, response, next) => {
  if (request.appModule.name !== request.params.appModuleName) {
    return response.respond(403, 'The api accessed is not owned by this module.');
  }

  next();
});

appModules.moduleNames.forEach(moduleName => {
  const apiPath = path.join(rootPath, `/appModules/${moduleName}/api`);

  if (fs.existsSync(apiPath)) {
    console.log(`Requiring ${apiPath}`);
    router.use(require(apiPath));
  } else {
    console.log(`Did not find ${apiPath}?`);
  }
});

/*
 * Export
 */

module.exports = router;
