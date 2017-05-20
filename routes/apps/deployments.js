/*
 * Route: /apps/:appId/deployments/:appDeploymentId?
 */

const App = rootRequire('/models/App');
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
    AppDeployment.find({ where: { id: appDeploymentId, appId } }).then(result => {
      response.success(result);
    }).catch(next);
  } else {
    AppDeployment.findAll({ where: { appId } }).then(result => {
      response.success(result);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  // TODO: Write the deployment logic.
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
