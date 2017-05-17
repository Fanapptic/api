/*
 * Route: /modules/:moduleId*?
 */

const Module = rootRequire('/models/Module');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response, next) => {
  const { moduleId } = request.params;

  if (moduleId) {
    Module.findById(moduleId).then(module => {
      response.success(module);
    }).catch(next);
  } else {
    Module.findAll().then(modules => {
      response.success(modules);
    }).catch(next);
  }
});

/*
 * Export
 */

module.exports = router;
