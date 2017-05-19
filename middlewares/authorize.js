const url = require('url');

const User = rootRequire('/models/User');
const authorizeConfig = rootRequire('/config/authorize');

module.exports = (request, response, next) => {
  const parsedUrl = url.parse(request.url).pathname;
  const ignoreRouteMethods = authorizeConfig.ignoreRoutes[parsedUrl];

  if (ignoreRouteMethods === '*') {
    return next();
  }

  if (Array.isArray(ignoreRouteMethods) && ignoreRouteMethods.includes(request.method)) {
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