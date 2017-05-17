const url = require('url');

const User = rootRequire('/models/User');
const authorizeConfig = rootRequire('/config/authorize');

module.exports = (request, response, next) => {
  const parsedUrl = url.parse(request.url).pathname;
  const ignoreRequestMethod = authorizeConfig.ignoreRoutes[parsedUrl];

  if (ignoreRequestMethod === '*' || ignoreRequestMethod.includes(request.method)) {
    return next();
  }

  const accessToken = request.get('X-Access-Token');

  User.findOne({ where: { accessToken } }).then(user => {
    if (!user) {
      return response.respond(401, 'Invalid access token.');
    }

    request.user = user;
    next();
  });
};
