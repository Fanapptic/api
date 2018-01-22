/*
 * Route: /apps/:appId/modules/:appModuleId/api/:appModuleName
 */

const appModuleAuthorize = rootRequire('/middlewares/apps/modules/authorize');
const appModules = rootRequire('/appModules');

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

appModules.apiRouters.forEach(apiRouter => {
  router.use(apiRouter);
});

/*
 * Export
 */

module.exports = router;
