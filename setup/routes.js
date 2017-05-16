module.exports = (app) => {
  app.use('/users', rootRequire('/routes/users'));

  app.use((error, request, response, next) => { // 4 params required to handle error.
    response.error(error.message);
  });

  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
