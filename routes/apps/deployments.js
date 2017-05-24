/*
 * Route: /apps/:appId/deployments/:appDeploymentId?
 */

const AppDeployment = rootRequire('/models/AppDeployment');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appDeploymentId } = request.params;

  if (appDeploymentId) {
    AppDeployment.find({ where: { id: appDeploymentId, appId } }).then(appDeployment => {
      response.success(appDeployment);
    }).catch(next);
  } else {
    AppDeployment.findAll({ where: { appId } }).then(appDeployments => {
      response.success(appDeployments);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  // TODO: Write this logic for deployments, submitting queue data, etc.
});

/*
 * DELETE
 */

router.delete('/', appAuthorize);
router.delete('/', (request, response, next) => {
 // TODO: Write the pending deployment rollback logic.
});

/*
 * Export
 */

module.exports = router;
