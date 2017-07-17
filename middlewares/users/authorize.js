/*
 * User Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const UserModel = rootRequire('/models/User');

module.exports = (request, response, next) => {
  const accessToken = request.get('X-Access-Token');

  UserModel.findOne({ where: { accessToken } }).then(user => {
    if (!user) {
      return response.respond(401, 'Invalid access token.');
    }

    request.user = user;
    next();
  });
};
