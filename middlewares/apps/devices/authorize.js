/*
 * App Device Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const AppDeviceModel = rootRequire('/models/AppDevice');

module.exports = (request, response, next) => {
  const accessToken = request.get('X-App-Device-Access-Token');

  AppDeviceModel.find({ where: { accessToken } }).then(appDevice => {
    if (!appDevice) {
      return response.respond(401, 'Invalid access token.');
    }

    request.appDevice = appDevice;
    next();
  });
};
