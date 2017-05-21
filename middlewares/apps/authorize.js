/*
 * App Ownership Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/*
 */

const App = rootRequire('/models/App');

module.exports = (request, response, next) => {
  const userId = request.user.id;
  const { appId } = request.params;

  App.find({
    where: {
      id: appId,
      userId,
    },
    limit: 1,
  }).then(app => {
    if (!app) {
      return response.respond(401, 'Insufficient application permissions.');
    }

    request.app = app;

    next();
  });
};
