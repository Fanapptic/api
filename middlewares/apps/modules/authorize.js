/*
 * AppModule Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/modules/:appModuleId/*
 */

const AppModule = rootRequire('/models/AppModule');

module.exports = (request, response, next) => {
  const { appId, appModuleId } = request.params;

  AppModule.find({
    where: {
      id: appModuleId,
      appId,
    },
    limit: 1,
  }).then(appModule => {
    if (!appModule) {
      return response.error(403, 'The module accessed is not owned by this app.');
    }

    request.appModule = appModule;

    next();
  });
};
