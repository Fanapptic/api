/*
 * Optional Network User Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const NetworkUserModel = rootRequire('/models/NetworkUser');

module.exports = (request, response, next) => {
  const accessToken = request.get('X-Network-User-Access-Token');

  NetworkUserModel.find({ where: { accessToken } }).then(networkUser => {
    request.networkUser = networkUser || null;
    next();
  });
};
