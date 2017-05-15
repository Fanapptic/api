express.response.easy = function(httpCode, data) {
  this.status(httpCode).set('Connection', 'close').json(data);
};
