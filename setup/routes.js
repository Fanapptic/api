module.exports = (app) => {
  app.use('/users', rootRequire('/routes/users'));

  app.use((error, request, response, next) => { // 4 params required to handle error.
    response.easy(400, error.message);
  });

  app.use((request, response) => {
    response.easy(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
