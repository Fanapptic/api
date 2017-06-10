/*
 * Route: /apps/:appId/deployments/:appDeploymentId?
 */

const AppDeploymentModel = rootRequire('/models/AppDeployment');
const authorize = rootRequire('/middlewares/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', authorize);
router.get('/', appAuthorize);
router.get('/', (request, response, next) => {
  const { appId, appDeploymentId } = request.params;

  if (appDeploymentId) {
    AppDeploymentModel.find({ where: { id: appDeploymentId, appId } }).then(appDeployment => {
      response.success(appDeployment);
    }).catch(next);
  } else {
    AppDeploymentModel.findAll({ where: { appId } }).then(appDeployments => {
      response.success(appDeployments);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', authorize);
router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  const { app } = request;
  const appId = app.id;

  AppDeploymentModel.find({
    where: { appId },
    order: [['createdAt', 'DESC']],
  }).then(previousDeployment => {
    return app.deploy(previousDeployment);
  }).then(appDeployment => {
    response.success(appDeployment);
  }).catch(next);
});

/*
 * DELETE
 */

router.delete('/', authorize);
router.delete('/', appAuthorize);
router.delete('/', (request, response, next) => {
 // TODO: Write the pending deployment rollback logic.
});

/*
 * Export
 */

module.exports = router;
