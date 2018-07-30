/*
 * App Source Authorization For Matching Routes
 * Must be mounted after apps authorize.
 * Possible Route Usage: /apps/:appId/sources/:appSourceId/*
 */

const AppSourceModel = rootRequire('/models/AppSource');

module.exports = (request, response, next) => {
  const { app } = request;
  const { appSourceId } = request.params;

  AppSourceModel.find({ where: { id: appSourceId, appId: app.id } }).then(appSource => {
    if (!appSource) {
      return response.respond(401, 'Insufficient app source permissions.');
    }

    request.appSource = appSource;

    next();
  });
};
