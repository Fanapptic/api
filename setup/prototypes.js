express.response.respond = function(httpCode, data) {
  this.status(httpCode).set('Connection', 'close').json(data);
};

express.response.success = function(data) {
  this.respond(200, data);
};

express.response.error = function(data) {
  this.respond(400, data);
};
