/*
 * AppModule Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/modules/:appModuleId/*
 */

const AppModuleModel = rootRequire('/models/AppModule');

module.exports = (request, response, next) => {
  const { appId, appModuleId } = request.params;

  AppModuleModel.find({
    where: {
      id: appModuleId,
      appId,
    },
  }).then(appModule => {
    if (!appModule) {
      return response.respond(403, 'The module accessed is not owned by this app.');
    }

    request.appModule = appModule;

    next();
  });
};
