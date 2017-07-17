/*
 * Route: /apps/:appId/deployments/:appDeploymentId?
 */

const AppDeploymentModel = rootRequire('/models/AppDeployment');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const appAuthorize = rootRequire('/middlewares/apps/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
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

router.post('/', userAuthorize);
router.post('/', appAuthorize);
router.post('/', (request, response, next) => {
  const { app } = request;

  return app.deploy().then(appDeployment => {
    response.success(appDeployment);
  }).catch(next);
});

/*
 * PATCH
 */

router.patch('/', userAuthorize);
router.patch('/', appAuthorize);
router.patch('/', (request, response, next) => {
  const { appId, appDeploymentId } = request.params;
  const { status } = request.body;

  AppDeploymentModel.find({ where: { id: appDeploymentId, appId } }).then(appDeployment => {
    if (!appDeployment) {
      throw new Error('The app deployment does not exist.');
    }

    appDeployment.status = status || appDeployment.status;

    return appDeployment.save();
  }).then(appDeployment => {
    response.success(appDeployment);
  }).catch(next);
});

/*
 * Export
 */

module.exports = router;
