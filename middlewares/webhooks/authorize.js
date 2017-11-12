/*
 * Webhook Authorization For Matching Routes
 * Possible Route Usage: /*
 */

const serverConfig = rootRequire('/config/server');

module.exports = (request, response, next) => {
  const { webhookToken } = request.query;

  if (serverConfig.webhookToken !== webhookToken) {
    return response.respond(401, 'Invalid webhook token.');
  }

  next();
};
