/*
 * Internal Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const serverConfig = rootRequire('/config/server');

module.exports = (request, response, next) => {
  const { internalToken } = request.query;

  if (serverConfig.internalToken !== internalToken) {
    return response.respond(401, 'Invalid internal token.');
  }

  next();
};
