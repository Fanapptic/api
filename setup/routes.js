const appsRouter = rootRequire('/routes/apps');
const appDeploymentsRouter = rootRequire('/routes/apps/deployments');
const appModulesRouter = rootRequire('/routes/apps/modules');
const appModulesDataRouter = rootRequire('/routes/apps/modules/data');
const appRevenuesRouter = rootRequire('/routes/apps/revenues');
const appSessionsRouter = rootRequire('/routes/apps/sessions');
const appUsersRouter = rootRequire('/routes/apps/users');
const healthRouter = rootRequire('/routes/health');
const modulesRouter = rootRequire('/routes/modules');
const usersRouter = rootRequire('/routes/users');

module.exports = (app) => {
  app.use('/apps/:appId?', appsRouter);
  app.use('/apps/:appId/deployments/:appDeploymentId?', appDeploymentsRouter);
  app.use('/apps/:appId/modules/:appModuleId?', appModulesRouter);
  app.use('/apps/:appId/modules/:appModuleId/data/:appModuleDataId?', appModulesDataRouter);
  app.use('/apps/:appId/revenues/:appRevenueId?', appRevenuesRouter);
  app.use('/apps/:appId/sessions/:appSessionId?', appSessionsRouter);
  app.use('/apps/:appId/users/:appUserId?', appUsersRouter);
  app.use('/health', healthRouter);
  app.use('/modules/:moduleName?', modulesRouter);
  app.use('/users', usersRouter);

  app.use((error, request, response, next) => { // 4 params required to handle error.
    /*console.log('===========================');
    console.log(request.method, request.path);
    console.log('===========================');
    console.log(error);
    for (let i = 0; i < 10; i++) {
      console.log('');
    }*/

    response.error(error.message);
  });

  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
