/*
 * App Authorization For Matching Routes
 * Possible Route Usage: /apps/:appId/*
 */

const AppModel = rootRequire('/models/App');

module.exports = (request, response, next) => {
  const { appId } = request.params;
  const accessToken = request.get('X-App-Access-Token');

  AppModel.find({ where: { id: appId, accessToken } }).then(app => {
    if (!app) {
      return response.respond(401, 'Invalid access token.');
    }

    request.app = app;

    next();
  });
};
