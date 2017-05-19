module.exports = (app) => {
  app.use('/apps/:appId?', rootRequire('/routes/apps'));
  app.use('/apps/:appId/modules/:appModuleId?', rootRequire('/routes/apps/modules'));
  app.use('/apps/:appId/sessions/:appSessionId?', rootRequire('/routes/apps/users'));
  app.use('/apps/:appId/users/:appUserId?', rootRequire('/routes/apps/users'));

  app.use('/health', rootRequire('/routes/health'));

  app.use('/modules/:moduleName?', rootRequire('/routes/modules'));

  app.use('/users', rootRequire('/routes/users'));

  app.use((error, request, response, next) => { // 4 params required to handle error.
    //console.log(error);
    response.error(error.message);
  });

  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
