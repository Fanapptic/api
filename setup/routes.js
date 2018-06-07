const appsRouter = rootRequire('/routes/apps');
const appAnalyticsRouter = rootRequire('/routes/apps/analytics');
const appDevicesRouter = rootRequire('/routes/apps/devices');
const appDeviceSessionsRouter = rootRequire('/routes/apps/devices/sessions');
const appFeedsRouter = rootRequire('/routes/apps/feeds');
const appFeedActivitesRouter = rootRequire('/routes/apps/feeds/activities');
const appNotificationsRouter = rootRequire('/routes/apps/notifications');
const appSourcesRouter = rootRequire('/routes/apps/sources');
const appUsersRouter = rootRequire('/routes/apps/users');
const healthRouter = rootRequire('/routes/health');
const usersRouter = rootRequire('/routes/users');

module.exports = app => {
  // Route Definitions
  app.use('/apps/:appId?', appsRouter);
  app.use('/apps/:appId/analytics', appAnalyticsRouter);
  app.use('/apps/:appId/devices/:appDeviceId?', appDevicesRouter);
  app.use('/apps/:appId/devices/:appDeviceId/sessions/:appDeviceSessionId?', appDeviceSessionsRouter);
  app.use('/apps/:appId/feeds', appFeedsRouter);
  app.use('/apps/:appId/feeds/:appFeedId/activities/:appFeedActivityId?', appFeedActivitesRouter);
  app.use('/apps/:appId/notifications/:appNotificationId?', appNotificationsRouter);
  app.use('/apps/:appId/sources/:appSourceId?', appSourcesRouter);
  app.use('/apps/:appId/users/:appUserId?', appUsersRouter);
  app.use('/health', healthRouter);
  app.use('/users', usersRouter);

  // Handle Various Errors
  app.use((error, request, response, next) => { // 4 params request to handle error.
    // Log Request Errors
    if (process.env.CONSOLE_LOG_REQUEST_ERRORS === 'true') {
      console.log('===========================');
      console.log(request.method, request.path);
      console.log('===========================');
      console.log(error);
      for (let i = 0; i < 10; i++) {
        console.log('');
      }
    }

    // Handle Sequelize Error Response
    if (error instanceof Sequelize.ValidationError) {
      const errors = error.errors.map(validationErrorItem => {
        return {
          field: validationErrorItem.path,
          message: validationErrorItem.message,
        };
      });

      return response.error(errors);
    }

    // Handle Generic Errors
    response.error(error.message);
  });

  // Handle Invalid Routes
  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
