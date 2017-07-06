/*
 * AppDeployment Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/deployments/:appDeploymentId/*
 */

const AppDeploymentModel = rootRequire('/models/AppDeployment');

module.exports = (request, response, next) => {
  const { appId, appDeploymentId } = request.params;

  AppDeploymentModel.find({
    where: {
      id: appDeploymentId,
      appId,
    },
  }).then(appDeployment => {
    if (!appDeployment) {
      return response.respond(403, 'The deployment accessed is not owned by this app.');
    }

    request.appDeployment = appDeployment;

    next();
  });
};
