express.response.respond = function(httpCode, data) {
  this.status(httpCode).set('Connection', 'close').json(data);
};

express.response.respondRaw = function(httpCode, data) {
  this.status(httpCode).set('Connection', 'close').send(data);
};

express.response.success = function(data) {
  const status = (data) ? 200 : 204;

  this.respond(status, data);
};

express.response.error = function(data) {
  this.respond(400, data);
};
