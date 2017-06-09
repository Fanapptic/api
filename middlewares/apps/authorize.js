/*
 * App Ownership Authorization For Matching Routes
 * Must be mounted after authorize.
 * Possible Route Usage: /apps/:appId/*
 */

const AppModel = rootRequire('/models/App');

module.exports = (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  AppModel.find({
    where: {
      id: appId,
      userId,
    },
  }).then(app => {
    if (!app) {
      return response.respond(403, 'Insufficient app permissions.');
    }

    request.app = app;

    next();
  });
};
