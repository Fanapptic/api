/*
 * Network User Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');

module.exports = (request, response, next) => {
  const accessToken = request.get('X-Access-Token');

  NetworkUserModel.find({ where: { accessToken } }).then(networkUser => {
    if (!networkUser) {
      return response.respond(401, 'Invalid access token.');
    }

    request.networkUser = networkUser;
    next();
  });
};
