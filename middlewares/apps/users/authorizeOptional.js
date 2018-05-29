/*
 * Optional App User Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const AppUserModel = rootRequire('/models/AppUser');

module.exports = (request, response, next) => {
  const accessToken = request.get('X-Network-User-Access-Token');

  AppUserModel.find({ where: { accessToken } }).then(appUser => {
    request.appUser = appUser || {};
    next();
  });
};
