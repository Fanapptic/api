/*
 * AppModuleProvider Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/modules/:appModuleId/providers/:appModuleProviderId/*
 */

const AppModuleProviderModel = rootRequire('/models/AppModuleProvider');

module.exports = (request, response, next) => {
  const { appModuleId, appModuleProviderId } = request.params;

  AppModuleProviderModel.find({
    where: {
      id: appModuleProviderId,
      appModuleId,
    },
  }).then(appModuleProvider => {
    if (!appModuleProvider) {
      return response.respond(403, 'The provider accessed is not owned by this module.');
    }

    request.appModuleProvider = appModuleProvider;

    next();
  });
};
