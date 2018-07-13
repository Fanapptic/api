/*
 * Content Type header fix for AWS SNS requests
 * Poissble Route Usage: /*
 */

module.exports = (request, response, next) => {
  if (request.headers['x-amz-sns-message-type']) {
    request.headers['content-type'] = 'application/json;charset=UTF-8';
  }

  next();
};
