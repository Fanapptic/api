module.exports = app => {
  // Route Definitions
  

  // Handle Various Errors
  app.use((error, request, response, next) => { // 4 params request to handle error.
    // Log Request Errors
    if (process.env.CONSOLE_LOG_REQUEST_ERRORS === 'true') {
      console.log('===========================');
      console.log(request.method, request.path);
      console.log('===========================');
      console.log(error);
      for (let i = 0; i < 10; i++) {
        console.log('');
      }
    }

    // Handle Sequelize Error Response
    if (error instanceof Sequelize.ValidationError) {
      const errors = error.errors.map(validationErrorItem => {
        return {
          field: validationErrorItem.path,
          message: validationErrorItem.message,
        };
      });

      return response.error(errors);
    }

    // Handle Generic Errors
    response.error(error.message);
  });

  // Handle Invalid Routes
  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
