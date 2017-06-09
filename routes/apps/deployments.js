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
  const appId = request.app.id;
  const DEPLOYMENT_TYPE_HARD = 'hard';
  const DEPLOYMENT_TYPE_SOFT = 'soft';

  let snapshot = null;
  let appDeployment = null;

  request.app.generateSnapshot().then(generatedSnapshot => {
    snapshot = generatedSnapshot;

    return AppDeploymentModel.find({
      where: { appId },
      order: [['createdAt', 'DESC']],
    });
  }).then(newestAppDeployment => {
    if (!newestAppDeployment || newestAppDeployment.shouldHardDeploy(snapshot)) {
      return DEPLOYMENT_TYPE_HARD;
    }

    if (newestAppDeployment.shouldSoftDeploy(snapshot)) {
      return DEPLOYMENT_TYPE_SOFT;
    }

    return false;
  }).then(deploymentType => {
    if (!deploymentType) {
      throw new Error('No changes have been made since your most recent deployment.');
    }

    return database.transaction(transaction => {
      AppDeploymentModel.create({
        appId,
        deploymentType,
        snapshot,
      }, { transaction }).then(appDeploymentInstance => {
        appDeployment = appDeploymentInstance;
        appDeployment.deploy();
      });
    });
  }).then(() => {
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
