const appsRouter = rootRequire('/routes/apps');
const appAnalyticsRouter = rootRequire('/routes/apps/analytics');
const appChecklistsRouter = rootRequire('/routes/apps/checklists');
const appDeploymentsRouter = rootRequire('/routes/apps/deployments');
const appDeploymentStepsRouter = rootRequire('/routes/apps/deployments/steps');
const appFieldsRouter = rootRequire('/routes/apps/fields');
const appModulesRouter = rootRequire('/routes/apps/modules');
const appModulesDataRouter = rootRequire('/routes/apps/modules/data');
const appModulesFieldsRouter = rootRequire('/routes/apps/modules/fields');
const appRevenuesRouter = rootRequire('/routes/apps/revenues');
const appSessionsRouter = rootRequire('/routes/apps/sessions');
const appUsersRouter = rootRequire('/routes/apps/users');
const articlesRouter = rootRequire('/routes/articles');
const healthRouter = rootRequire('/routes/health');
const modulesRouter = rootRequire('/routes/modules');
const oauthTwitterAuthorizationsRouter = rootRequire('/routes/oauth/twitter/authorizations');
const oauthTwitterTokensRouter = rootRequire('/routes/oauth/twitter/tokens');
const usersRouter = rootRequire('/routes/users');

module.exports = app => {
  app.use('/apps/:appId?', appsRouter);
  app.use('/apps/:appId/analytics', appAnalyticsRouter);
  app.use('/apps/:appId/checklists', appChecklistsRouter);
  app.use('/apps/:appId/deployments/:appDeploymentId?', appDeploymentsRouter);
  app.use('/apps/:appId/deployments/:appDeploymentId/steps/:appDeploymentStepId?', appDeploymentStepsRouter);
  app.use('/apps/:appId/fields', appFieldsRouter);
  app.use('/apps/:appId/modules/:appModuleId?', appModulesRouter);
  app.use('/apps/:appId/modules/:appModuleId/data/:appModuleDataId?', appModulesDataRouter);
  app.use('/apps/:appId/modules/:appModuleId/fields', appModulesFieldsRouter);
  app.use('/apps/:appId/revenues/:appRevenueId?', appRevenuesRouter);
  app.use('/apps/:appId/sessions/:appSessionId?', appSessionsRouter);
  app.use('/apps/:appId/users/:appUserId?', appUsersRouter);
  app.use('/articles/:articleId?', articlesRouter);
  app.use('/health', healthRouter);
  app.use('/modules/:moduleName?', modulesRouter);
  app.use('/oauth/twitter/authorizations', oauthTwitterAuthorizationsRouter);
  app.use('/oauth/twitter/tokens', oauthTwitterTokensRouter);
  app.use('/users', usersRouter);

  app.use((error, request, response, next) => { // 4 params required to handle error.
    console.log('===========================');
    console.log(request.method, request.path);
    console.log('===========================');
    console.log(error);
    for (let i = 0; i < 10; i++) {
      console.log('');
    }

    // Handle Sequelize Errors
    if (error instanceof Sequelize.ValidationError) {
      const errors = error.errors.map(validationErrorItem => {
        return {
          field: validationErrorItem.path,
          message: validationErrorItem.message,
        };
      });

      return response.error(errors);
    }

    // Handle JOI errors
    if (0) {
      // TODO:
    }

    // Handle Generic Errors
    response.error(error.message);
  });

  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
