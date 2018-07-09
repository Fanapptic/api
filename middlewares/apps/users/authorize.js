/*
 * App User Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const AppUserModel = rootRequire('/models/AppUser');

module.exports = (request, response, next) => {
  const accessToken = request.get('X-App-User-Access-Token');

  AppUserModel.find({ where: { accessToken } }).then(appUser => {
    if (!appUser) {
      return response.respond(401, 'Invalid access token.');
    }

    request.appUser = appUser;
    next();
  });
};
