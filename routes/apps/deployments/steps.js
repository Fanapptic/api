/*
 * Route: /apps/:appId/deployments/:appDeploymentId/steps/:appDeploymentStepId?
 */

const AppDeploymentStepModel = rootRequire('/models/AppDeploymentStep');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');
const appDeploymentAuthorize = rootRequire('/middlewares/apps/deployments/authorize');
const internalAuthorize = rootRequire('/middlewares/internal/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', appAuthorize);
router.get('/', appDeploymentAuthorize);
router.get('/', (request, response, next) => {
  const { appDeploymentId, appDeploymentStepId } = request.params;

  if (appDeploymentStepId) {
    AppDeploymentStepModel.find({ where: { id: appDeploymentStepId, appDeploymentId } }).then(appDeploymentStep => {
      if (!appDeploymentStep) {
        throw new Error('The app deployment step does not exists.');
      }

      response.success(appDeploymentStep);
    }).catch(next);
  } else {
    AppDeploymentStepModel.findAll({ where: { appDeploymentId } }).then(appDeploymentSteps => {
      response.success(appDeploymentSteps);
    }).catch(next);
  }
});

/*
 * POST
 */

router.post('/', internalAuthorize);
router.post('/', (request, response, next) => {
  const { appDeploymentId } = request.params;
  const { platform, name, message, success } = request.body;

  AppDeploymentStepModel.create({
    appDeploymentId,
    platform,
    name,
    message,
    success,
  }).then(appDeploymentStep => {
    response.success(appDeploymentStep);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
