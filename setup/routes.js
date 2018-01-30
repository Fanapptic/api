const appsRouter = rootRequire('/routes/apps');
const appAnalyticsRouter = rootRequire('/routes/apps/analytics');
const appChecklistsRouter = rootRequire('/routes/apps/checklists');
const appDeploymentsRouter = rootRequire('/routes/apps/deployments');
const appDeploymentStepsRouter = rootRequire('/routes/apps/deployments/steps');
const appModulesRouter = rootRequire('/routes/apps/modules');
const appModuleApiRouter = rootRequire('/routes/apps/modules/api');
const appModuleDataRouter = rootRequire('/routes/apps/modules/data');
const appModuleProvidersRouter = rootRequire('/routes/apps/modules/providers');
const appModuleProviderWebhooksRouter = rootRequire('/routes/apps/modules/providers/webhooks');
const appRevenuesRouter = rootRequire('/routes/apps/revenues');
const appSessionsRouter = rootRequire('/routes/apps/sessions');
const appDevicesRouter = rootRequire('/routes/apps/devices');
const articlesRouter = rootRequire('/routes/articles');
const networkUsersRouter = rootRequire('/routes/network/users');
const healthRouter = rootRequire('/routes/health');
const modulesRouter = rootRequire('/routes/modules');
const oauthTwitterAuthorizationsRouter = rootRequire('/routes/oauth/twitter/authorizations');
const oauthTwitterUsersRouter = rootRequire('/routes/oauth/twitter/users');
const oauthShopifyUsersRouter = rootRequire('/routes/oauth/shopify/users');
const oauthYouTubeUsersRouter = rootRequire('/routes/oauth/youtube/users');
const usersRouter = rootRequire('/routes/users');
const userAgreementsRouter = rootRequire('/routes/users/agreements');
const userAgreementWebhooksRouter = rootRequire('/routes/users/agreements/webhooks');

module.exports = app => {
  app.use('/apps/:appId?', appsRouter);
  app.use('/apps/:appId/analytics', appAnalyticsRouter);
  app.use('/apps/:appId/checklists', appChecklistsRouter);
  app.use('/apps/:appId/deployments/:appDeploymentId?', appDeploymentsRouter);
  app.use('/apps/:appId/deployments/:appDeploymentId/steps/:appDeploymentStepId?', appDeploymentStepsRouter);
  app.use('/apps/:appId/modules/:appModuleId?', appModulesRouter);
  app.use('/apps/:appId/modules/:appModuleId/api/:appModuleName?', appModuleApiRouter);
  app.use('/apps/:appId/modules/:appModuleId/data/:appModuleDataId?', appModuleDataRouter);
  app.use('/apps/:appId/modules/:appModuleId/providers/:appModuleProviderId?', appModuleProvidersRouter);
  app.use('/apps/:appId/modules/:appModuleId/providers/:appModuleProviderId/webhooks', appModuleProviderWebhooksRouter);
  app.use('/apps/:appId/revenues/:appRevenueId?', appRevenuesRouter);
  app.use('/apps/:appId/sessions/:appSessionId?', appSessionsRouter);
  app.use('/apps/:appId/devices/:appDeviceId?', appDevicesRouter);
  app.use('/articles/:articleId?', articlesRouter);
  app.use('/networks/fanapptic/users/:networkUserId?', networkUsersRouter);
  app.use('/health', healthRouter);
  app.use('/modules/:name?', modulesRouter);
  app.use('/oauth/twitter/authorizations', oauthTwitterAuthorizationsRouter);
  app.use('/oauth/twitter/users', oauthTwitterUsersRouter);
  app.use('/oauth/shopify/users', oauthShopifyUsersRouter);
  app.use('/oauth/youtube/users', oauthYouTubeUsersRouter);
  app.use('/users', usersRouter);
  app.use('/users/:userId/agreements/:userAgreementId?', userAgreementsRouter);
  app.use('/users/:userId/agreements/:userAgreementId/webhooks', userAgreementWebhooksRouter);

  app.use((error, request, response, next) => { // 4 params required to handle error.
    if (process.env.CONSOLE_LOG_REQUEST_ERRORS === 'true') {
      console.log('===========================');
      console.log(request.method, request.path);
      console.log('===========================');
      console.log(error);
      for (let i = 0; i < 10; i++) {
        console.log('');
      }
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

    // TODO: Handle JOI errors

    // Handle Generic Errors
    response.error(error.message);
  });

  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
