/*
 * Admin Authorization For Matching Routes
 * Must be mounted after users authorize.
 * Possible Route Usage: /*
 */

module.exports = (request, response, next) => {
  if (!request.user.admin) {
    return response.respond(403, 'Insufficient admin permissions.');
  }

  next();
};
